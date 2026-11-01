"use client";

import * as React from "react";
import {
  isSpeechRecognitionSupported,
  getSpeechRecognitionConstructor,
  mapSpeechRecognitionError,
  isSpeechSynthesisSupported,
  type SpeechLanguage,
  type ISpeechRecognition,
  type ISpeechRecognitionEvent,
  type ISpeechRecognitionErrorEvent,
} from "@/lib/speech-utils";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import type { ChatMessage } from "@/components/ai/chat-message-item";
import {
  extractConversationProducts,
  parseVoiceShoppingIntent,
} from "@/lib/conversational-shopping";

export type ConversationalAgentState =
  | "OFF"
  | "LISTENING"
  | "THINKING"
  | "SPEAKING"
  | "PAUSED"
  | "ERROR";

export interface UseConversationalAgentProps {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  language?: SpeechLanguage;
  onSendMessage: (text: string) => Promise<void> | void;
  onAddLocalAssistantMessage: (userOrAssistantText: string, assistantReply?: string) => void;
  onOpenCart?: () => void;
}

export interface UseConversationalAgentReturn {
  isSupported: boolean;
  isActive: boolean;
  state: ConversationalAgentState;
  liveTranscript: string;
  errorMessage: string | null;
  startVoiceConversation: () => void;
  stopVoiceConversation: () => void;
  toggleVoiceConversation: () => void;
  interruptSpeaking: () => void;
  clearError: () => void;
}

const ECHO_COOLDOWN_MS = 400; // Delay after assistant finishes speaking before turning mic back on
const FINAL_SILENCE_DEBOUNCE_MS = 600; // Pause after final result before submitting
const INTERIM_SILENCE_DEBOUNCE_MS = 1400; // Pause after interim result before auto-submitting
const SPEECH_END_DEBOUNCE_MS = 700; // Pause after onspeechend before auto-submitting
const SILENCE_RESTART_DELAY_MS = 300; // Delay before restarting recognition loop on silence/no-speech

export function useConversationalAgent({
  isOpen,
  messages,
  isLoading,
  language = "en-IN",
  onSendMessage,
  onAddLocalAssistantMessage,
  onOpenCart,
}: UseConversationalAgentProps): UseConversationalAgentReturn {
  const isSupported = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return isSpeechRecognitionSupported() && isSpeechSynthesisSupported();
  }, []);

  const [isVoiceActive, setIsVoiceActive] = React.useState(false);
  const [isThinking, setIsThinking] = React.useState(false);
  const [liveTranscript, setLiveTranscript] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // When assistant panel is closed, conversational mode is inactive
  const isActive = isOpen && isVoiceActive;

  // Speech synthesis integration
  const speechSynth = useSpeechSynthesis();

  // References to track callbacks and active instances
  const recognitionRef = React.useRef<ISpeechRecognition | null>(null);
  const echoCooldownTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceDebounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartListeningTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpokenMessageIdRef = React.useRef<string | null>(null);
  const isAwaitingSpeechRef = React.useRef<boolean>(false);
  const startListeningLoopRef = React.useRef<() => void>(() => {});
  const handleCustomerSpokenTurnRef = React.useRef<(text: string) => Promise<void> | void>(() => {});
  const prevSynthStateRef = React.useRef(speechSynth.state);

  // Utterance tracking across recognition events
  const accumulatedFinalRef = React.useRef<string>("");
  const latestInterimRef = React.useRef<string>("");
  const turnSubmittedRef = React.useRef<boolean>(false);
  const turnCounterRef = React.useRef<number>(0);
  const isUserInterruptedRef = React.useRef<boolean>(false);

  // Refs for state values inside async / recognition callbacks
  const isActiveRef = React.useRef(isActive);
  const isThinkingRef = React.useRef(isThinking || isLoading);
  const messagesRef = React.useRef(messages);
  const languageRef = React.useRef(language);
  const speechSynthStateRef = React.useRef(speechSynth.state);
  const speechSynthActiveIdRef = React.useRef(speechSynth.activeId);

  React.useEffect(() => {
    isActiveRef.current = isActive;
    isThinkingRef.current = isThinking || isLoading;
    messagesRef.current = messages;
    languageRef.current = language;
    speechSynthStateRef.current = speechSynth.state;
    speechSynthActiveIdRef.current = speechSynth.activeId;
  }, [isActive, isThinking, isLoading, messages, language, speechSynth.state, speechSynth.activeId]);

  // Derived state machine: fully responsive and immune to set-state-in-effect loops
  const agentState: ConversationalAgentState = React.useMemo(() => {
    if (!isActive) return "OFF";
    if (errorMessage) return "ERROR";
    if (speechSynth.state === "PLAYING") return "SPEAKING";
    if (speechSynth.state === "PAUSED") return "PAUSED";
    if (isThinking || isLoading) return "THINKING";
    if (speechSynth.activeId !== null && speechSynth.state !== "ERROR") return "SPEAKING";
    return "LISTENING";
  }, [isActive, errorMessage, speechSynth.state, speechSynth.activeId, isThinking, isLoading]);

  // Clean up timers
  const clearEchoTimer = React.useCallback(() => {
    if (echoCooldownTimerRef.current) {
      clearTimeout(echoCooldownTimerRef.current);
      echoCooldownTimerRef.current = null;
    }
  }, []);

  const clearSilenceDebounce = React.useCallback(() => {
    if (silenceDebounceTimerRef.current) {
      clearTimeout(silenceDebounceTimerRef.current);
      silenceDebounceTimerRef.current = null;
    }
  }, []);

  const clearRestartListeningTimer = React.useCallback(() => {
    if (restartListeningTimerRef.current) {
      clearTimeout(restartListeningTimerRef.current);
      restartListeningTimerRef.current = null;
    }
  }, []);

  // Terminate recognition safely
  const abortRecognition = React.useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }
  }, []);

  // Fully stop conversational mode
  const stopVoiceConversation = React.useCallback(() => {
    clearEchoTimer();
    clearSilenceDebounce();
    clearRestartListeningTimer();
    abortRecognition();
    speechSynth.stop();
    setIsVoiceActive(false);
    setIsThinking(false);
    isAwaitingSpeechRef.current = false;
    isUserInterruptedRef.current = false;
    setLiveTranscript("");
    setErrorMessage(null);
    accumulatedFinalRef.current = "";
    latestInterimRef.current = "";
    turnSubmittedRef.current = false;
  }, [clearEchoTimer, clearSilenceDebounce, clearRestartListeningTimer, abortRecognition, speechSynth]);

  // Interrupt assistant speech without exiting voice conversation mode
  const interruptSpeaking = React.useCallback(() => {
    isUserInterruptedRef.current = true;
    speechSynth.stop();
    isAwaitingSpeechRef.current = false;
    clearEchoTimer();
    clearSilenceDebounce();
    clearRestartListeningTimer();
    abortRecognition();

    if (process.env.NODE_ENV !== "production") {
      console.log(`[NEXORA Voice Turn #${turnCounterRef.current}] User speech interruption event triggered`);
    }

    // Restart listening loop immediately upon user interrupt
    startListeningLoopRef.current();
  }, [speechSynth, clearEchoTimer, clearSilenceDebounce, clearRestartListeningTimer, abortRecognition]);

  // Clear errors
  const clearError = React.useCallback(() => {
    setErrorMessage(null);
  }, []);

  // Safe submission of customer conversational turn
  const submitCustomerTurn = React.useCallback((source: string) => {
    if (turnSubmittedRef.current) return;
    if (
      !isActiveRef.current ||
      isThinkingRef.current ||
      isAwaitingSpeechRef.current ||
      speechSynth.state === "PLAYING"
    ) {
      return;
    }

    clearSilenceDebounce();
    const fullUtterance = (accumulatedFinalRef.current + " " + latestInterimRef.current).trim();
    if (!fullUtterance) return;

    turnCounterRef.current += 1;
    const currentTurnId = turnCounterRef.current;
    turnSubmittedRef.current = true;
    abortRecognition();

    if (process.env.NODE_ENV !== "production") {
      console.log(`[NEXORA Voice Turn #${currentTurnId}] Voice utterance submitted (${source}): length=${fullUtterance.length} chars`);
    }

    setLiveTranscript(fullUtterance);
    handleCustomerSpokenTurnRef.current(fullUtterance);
  }, [clearSilenceDebounce, abortRecognition, speechSynth.state]);

  // Initiates microphone capture for a customer conversational turn
  const startListeningLoop = React.useCallback(() => {
    if (!isSupported) return;

    // AUDIO FEEDBACK LOOP PREVENTION:
    // Never start listening while assistant is actively speaking, paused, thinking, or preparing to speak
    if (
      speechSynth.state === "PLAYING" ||
      speechSynth.state === "PAUSED" ||
      speechSynthStateRef.current === "PLAYING" ||
      speechSynthStateRef.current === "PAUSED" ||
      isThinkingRef.current ||
      isAwaitingSpeechRef.current
    ) {
      return;
    }

    clearEchoTimer();
    clearSilenceDebounce();
    clearRestartListeningTimer();
    abortRecognition();

    accumulatedFinalRef.current = "";
    latestInterimRef.current = "";
    turnSubmittedRef.current = false;
    setLiveTranscript("");

    try {
      const SpeechRec = getSpeechRecognitionConstructor();
      if (!SpeechRec) {
        setErrorMessage("Speech recognition not available.");
        return;
      }

      const rec = new SpeechRec();
      recognitionRef.current = rec;

      // continuous = true ensures Chromium does not unilaterally kill the mic on natural speech pauses
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = languageRef.current;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        if (process.env.NODE_ENV !== "production") {
          console.log("[NEXORA Voice] Recognition started");
        }
      };

      rec.onresult = (event: ISpeechRecognitionEvent) => {
        if (turnSubmittedRef.current) return;

        let turnFinal = "";
        let turnInterim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0]?.transcript || "";
          if (res.isFinal) {
            turnFinal += text;
          } else {
            turnInterim += text;
          }
        }

        if (turnFinal) {
          accumulatedFinalRef.current = (accumulatedFinalRef.current + " " + turnFinal).trim();
          latestInterimRef.current = "";
          if (process.env.NODE_ENV !== "production") {
            console.log("[NEXORA Voice] Final transcript received:", accumulatedFinalRef.current);
          }
        } else if (turnInterim) {
          latestInterimRef.current = turnInterim;
          if (process.env.NODE_ENV !== "production") {
            console.log("[NEXORA Voice] Interim transcript received:", turnInterim);
          }
        }

        const combined = (accumulatedFinalRef.current + " " + latestInterimRef.current).trim();
        setLiveTranscript(combined);

        clearSilenceDebounce();

        if (turnFinal) {
          // Final transcript slice received; wait for natural speech boundary before submitting
          silenceDebounceTimerRef.current = setTimeout(() => {
            submitCustomerTurn("final-debounce");
          }, FINAL_SILENCE_DEBOUNCE_MS);
        } else if (turnInterim) {
          // Interim results streaming; allow silence buffer before auto-finalizing
          silenceDebounceTimerRef.current = setTimeout(() => {
            submitCustomerTurn("interim-debounce");
          }, INTERIM_SILENCE_DEBOUNCE_MS);
        }
      };

      // Native browser speech pause detection (where supported)
      if ("onspeechend" in rec) {
        (rec as unknown as { onspeechend: () => void }).onspeechend = () => {
          if (turnSubmittedRef.current) return;
          const currentText = (accumulatedFinalRef.current + " " + latestInterimRef.current).trim();
          if (currentText.length > 0) {
            clearSilenceDebounce();
            silenceDebounceTimerRef.current = setTimeout(() => {
              submitCustomerTurn("speechend");
            }, SPEECH_END_DEBOUNCE_MS);
          }
        };
      }

      rec.onerror = (event: ISpeechRecognitionErrorEvent) => {
        if (event.error === "aborted") {
          return;
        }
        if (event.error === "no-speech") {
          // Silence event; rec.onend will trigger and cleanly handle restart if active
          return;
        }

        const friendlyMsg = mapSpeechRecognitionError(event.error);
        setErrorMessage(friendlyMsg);
      };

      rec.onend = () => {
        clearSilenceDebounce();

        // 1. Fallback submission: If the turn was not yet submitted but captured speech exists
        const unsubmitted = (accumulatedFinalRef.current + " " + latestInterimRef.current).trim();
        if (!turnSubmittedRef.current && unsubmitted.length > 0) {
          submitCustomerTurn("onend-fallback");
          return;
        }

        // 2. Active listening loop maintenance: If user was silent, restart recognition
        if (
          isActiveRef.current &&
          !isThinkingRef.current &&
          !isAwaitingSpeechRef.current &&
          speechSynthStateRef.current !== "PLAYING" &&
          speechSynthStateRef.current !== "PAUSED"
        ) {
          clearRestartListeningTimer();
          restartListeningTimerRef.current = setTimeout(() => {
            if (
              isActiveRef.current &&
              !isThinkingRef.current &&
              !isAwaitingSpeechRef.current &&
              speechSynthStateRef.current !== "PLAYING" &&
              speechSynthStateRef.current !== "PAUSED"
            ) {
              if (process.env.NODE_ENV !== "production") {
                console.log("[NEXORA Voice] Recognition restarted");
              }
              startListeningLoopRef.current();
            }
          }, SILENCE_RESTART_DELAY_MS);
        }
      };

      rec.start();
    } catch {
      setErrorMessage("Failed to start speech recognition.");
    }
  }, [
    isSupported,
    speechSynth.state,
    clearEchoTimer,
    clearSilenceDebounce,
    clearRestartListeningTimer,
    abortRecognition,
    submitCustomerTurn,
  ]);

  // Handles customer speech input, resolves intents, and dispatches responses
  const handleCustomerSpokenTurn = React.useCallback(
    async (speechText: string) => {
      const clean = speechText.trim();
      if (!clean) return;

      setIsThinking(true);
      if (process.env.NODE_ENV !== "production") {
        console.log("[NEXORA Voice] AI request started for utterance:", clean);
      }

      try {
        // Extract verified products discussed in recent conversation turns
        const contextProducts = extractConversationProducts(messagesRef.current);

        // Parse voice shopping intent
        const intent = parseVoiceShoppingIntent(clean, contextProducts, languageRef.current);

        // 1. OPEN CART INTENT
        if (intent.type === "OPEN_CART") {
          if (onOpenCart) {
            onOpenCart();
          }
          if (intent.localResponseText) {
            onAddLocalAssistantMessage(clean, intent.localResponseText);
          }
          return;
        }

        // 2. ADD TO BAG PREPARATION / LOCAL ACTIONS
        if (
          (intent.type === "ADD_TO_BAG_PREPARE" ||
            intent.type === "AMBIGUOUS_ADD_TO_BAG" ||
            intent.type === "PRICE_INQUIRY" ||
            intent.type === "VARIANT_INQUIRY") &&
          intent.localResponseText
        ) {
          onAddLocalAssistantMessage(clean, intent.localResponseText);
          return;
        }

        // 3. AI CHAT INTENT (Comparisons, general inquiries, recommendations)
        const promptToSend = intent.enrichedQuery || clean;
        await onSendMessage(promptToSend);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[NEXORA Voice] Error processing customer spoken turn:", err);
        }
        setErrorMessage("Sorry, I could not process your voice request. Please try speaking again.");
      } finally {
        setIsThinking(false);
        setLiveTranscript("");
      }
    },
    [onOpenCart, onAddLocalAssistantMessage, onSendMessage]
  );

  // Keep callback refs updated in effect to avoid ref access during render
  React.useEffect(() => {
    startListeningLoopRef.current = startListeningLoop;
    handleCustomerSpokenTurnRef.current = handleCustomerSpokenTurn;
  });

  // Activates conversational voice mode
  const startVoiceConversation = React.useCallback(() => {
    if (!isSupported) {
      setErrorMessage("Voice conversation requires Web Speech API support.");
      return;
    }

    // Ignore existing historical messages so the assistant does not speak old messages
    if (messages.length > 0) {
      lastSpokenMessageIdRef.current = messages[messages.length - 1].id;
    } else {
      lastSpokenMessageIdRef.current = null;
    }

    setIsVoiceActive(true);
    setErrorMessage(null);
    isAwaitingSpeechRef.current = false;
    startListeningLoop();
  }, [isSupported, messages, startListeningLoop]);

  const toggleVoiceConversation = React.useCallback(() => {
    if (isActive) {
      stopVoiceConversation();
    } else {
      startVoiceConversation();
    }
  }, [isActive, startVoiceConversation, stopVoiceConversation]);

  // Automatically read new assistant messages aloud when in Voice Conversation Mode
  React.useEffect(() => {
    if (!isActive) return;

    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];

      // If last message is from assistant and hasn't been spoken yet
      if (lastMsg.sender === "assistant" && lastMsg.id !== lastSpokenMessageIdRef.current) {
        lastSpokenMessageIdRef.current = lastMsg.id;

        // FEEDBACK LOOP PREVENTION:
        // Stop speech recognition immediately before speaking
        abortRecognition();
        clearEchoTimer();
        clearRestartListeningTimer();
        clearSilenceDebounce();

        isAwaitingSpeechRef.current = true;

        if (process.env.NODE_ENV !== "production") {
          console.log("[NEXORA Voice] Automatic speech playback initiated for message:", lastMsg.id);
        }

        speechSynth.speak(lastMsg.id, lastMsg.text, language);
      }
    }
  }, [
    messages,
    isActive,
    language,
    speechSynth,
    abortRecognition,
    clearEchoTimer,
    clearRestartListeningTimer,
    clearSilenceDebounce,
  ]);

  // Synchronize microphone listening with speech playback transitions
  React.useEffect(() => {
    const prevSynthState = prevSynthStateRef.current;
    prevSynthStateRef.current = speechSynth.state;

    if (!isActive) return;

    if (speechSynth.state === "PLAYING") {
      isAwaitingSpeechRef.current = false;
      // Strictly abort recognition while speech playback is active
      abortRecognition();
      clearEchoTimer();
      clearRestartListeningTimer();
      clearSilenceDebounce();
    } else if (prevSynthState === "PLAYING" && speechSynth.state === "IDLE") {
      isAwaitingSpeechRef.current = false;

      // If transition was caused by user interrupt, skip the echo cooldown timer
      // because interruptSpeaking() already cleanly restarted the listening loop immediately.
      if (isUserInterruptedRef.current) {
        isUserInterruptedRef.current = false;
        if (process.env.NODE_ENV !== "production") {
          console.log("[NEXORA Voice] Playback ended via user interrupt; skipping ghost echo cooldown timer");
        }
        return;
      }

      // Natural playback finished! Wait for echo cooldown, then resume listening
      clearEchoTimer();
      echoCooldownTimerRef.current = setTimeout(() => {
        if (
          isActiveRef.current &&
          !isThinkingRef.current &&
          !isAwaitingSpeechRef.current &&
          speechSynth.state !== "PLAYING"
        ) {
          if (process.env.NODE_ENV !== "production") {
            console.log("[NEXORA Voice] Recognition restarted after playback");
          }
          startListeningLoopRef.current();
        }
      }, ECHO_COOLDOWN_MS);
    } else if (speechSynth.state === "ERROR") {
      isAwaitingSpeechRef.current = false;
      if (process.env.NODE_ENV !== "production") {
        console.warn("[NEXORA Voice] Speech playback error or blocked; resuming listening");
      }
      clearEchoTimer();
      echoCooldownTimerRef.current = setTimeout(() => {
        if (isActiveRef.current && !isThinkingRef.current) {
          startListeningLoopRef.current();
        }
      }, ECHO_COOLDOWN_MS);
    }
  }, [
    speechSynth.state,
    isActive,
    abortRecognition,
    clearEchoTimer,
    clearRestartListeningTimer,
    clearSilenceDebounce,
  ]);

  // Clean up audio resources when panel closes
  React.useEffect(() => {
    if (!isOpen) {
      clearEchoTimer();
      clearSilenceDebounce();
      clearRestartListeningTimer();
      abortRecognition();
      speechSynth.stop();
      isAwaitingSpeechRef.current = false;
    }
  }, [isOpen, clearEchoTimer, clearSilenceDebounce, clearRestartListeningTimer, abortRecognition, speechSynth]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      clearEchoTimer();
      clearSilenceDebounce();
      clearRestartListeningTimer();
      abortRecognition();
    };
  }, [clearEchoTimer, clearSilenceDebounce, clearRestartListeningTimer, abortRecognition]);

  return {
    isSupported,
    isActive,
    state: agentState,
    liveTranscript,
    errorMessage,
    startVoiceConversation,
    stopVoiceConversation,
    toggleVoiceConversation,
    interruptSpeaking,
    clearError,
  };
}

"use client";

import * as React from "react";
import {
  isSpeechRecognitionSupported,
  getSpeechRecognitionConstructor,
  mapSpeechRecognitionError,
  MAX_CHAT_INPUT_LENGTH,
  type VoiceRecognitionState,
  type SpeechLanguage,
  type ISpeechRecognition,
  type ISpeechRecognitionEvent,
  type ISpeechRecognitionErrorEvent,
} from "@/lib/speech-utils";

interface UseSpeechRecognitionOptions {
  defaultLanguage?: SpeechLanguage;
  onTranscriptChange?: (text: string, isFinal: boolean) => void;
  onTranscriptFinal?: (finalText: string) => void;
  onError?: (error: string) => void;
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  state: VoiceRecognitionState;
  transcript: string;
  interimTranscript: string;
  errorMessage: string | null;
  language: SpeechLanguage;
  setLanguage: (lang: SpeechLanguage) => void;
  isOverLimit: boolean;
  startListening: (currentInputText?: string) => void;
  stopListening: () => void;
  cancelListening: () => void;
  clearError: () => void;
}

const SILENCE_TIMEOUT_MS = 8000;

export function useSpeechRecognition({
  defaultLanguage = "en-IN",
  onTranscriptChange,
  onTranscriptFinal,
  onError,
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const [isSupported] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return isSpeechRecognitionSupported();
  });
  const [state, setState] = React.useState<VoiceRecognitionState>(() => {
    if (typeof window === "undefined") return "IDLE";
    return isSpeechRecognitionSupported() ? "IDLE" : "UNSUPPORTED";
  });
  const [transcript, setTranscript] = React.useState("");
  const [interimTranscript, setInterimTranscript] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [language, setLanguageState] = React.useState<SpeechLanguage>(defaultLanguage);
  const [isOverLimit, setIsOverLimit] = React.useState(false);

  // References to preserve state across asynchronous recognition callbacks
  const recognitionRef = React.useRef<ISpeechRecognition | null>(null);
  const baseTextRef = React.useRef<string>("");
  const silenceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = React.useRef<VoiceRecognitionState>(state);
  const onTranscriptChangeRef = React.useRef(onTranscriptChange);
  const onTranscriptFinalRef = React.useRef(onTranscriptFinal);
  const onErrorRef = React.useRef(onError);

  // Synchronize refs inside useEffect to avoid accessing refs during render
  React.useEffect(() => {
    stateRef.current = state;
    onTranscriptChangeRef.current = onTranscriptChange;
    onTranscriptFinalRef.current = onTranscriptFinal;
    onErrorRef.current = onError;
  }, [state, onTranscriptChange, onTranscriptFinal, onError]);

  const resetSilenceTimer = React.useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current && stateRef.current === "LISTENING") {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    }, SILENCE_TIMEOUT_MS);
  }, []);

  const clearSilenceTimer = React.useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
        recognitionRef.current = null;
      }
    };
  }, [clearSilenceTimer]);

  const setLanguage = React.useCallback((lang: SpeechLanguage) => {
    setLanguageState(lang);
    if (recognitionRef.current && stateRef.current === "IDLE") {
      recognitionRef.current.lang = lang;
    }
  }, []);

  const startListening = React.useCallback(
    (currentInputText: string = "") => {
      if (!isSpeechRecognitionSupported()) {
        setState("UNSUPPORTED");
        const msg = "Voice recognition is not supported in this browser. Please type your message.";
        setErrorMessage(msg);
        onErrorRef.current?.(msg);
        return;
      }

      // Stop any existing instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }

      baseTextRef.current = currentInputText;
      setErrorMessage(null);
      setTranscript("");
      setInterimTranscript("");
      setIsOverLimit(currentInputText.length > MAX_CHAT_INPUT_LENGTH);
      setState("REQUESTING_PERMISSION");

      try {
        const SpeechRec = getSpeechRecognitionConstructor();
        if (!SpeechRec) {
          setState("UNSUPPORTED");
          return;
        }

        const recognition = new SpeechRec();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setState("LISTENING");
          resetSilenceTimer();
        };

        recognition.onresult = (event: ISpeechRecognitionEvent) => {
          resetSilenceTimer();
          let finalUtterance = "";
          let interimUtterance = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            const text = res[0]?.transcript || "";
            if (res.isFinal) {
              finalUtterance += text;
            } else {
              interimUtterance += text;
            }
          }

          // Build combined text with pre-existing base text
          const base = baseTextRef.current.trim();
          const activeSpeech = (finalUtterance + (interimUtterance ? " " + interimUtterance : "")).trim();
          let combined = base;
          if (activeSpeech) {
            combined = base ? `${base} ${activeSpeech}` : activeSpeech;
          }

          setTranscript(finalUtterance);
          setInterimTranscript(interimUtterance);

          const overLimit = combined.length > MAX_CHAT_INPUT_LENGTH;
          setIsOverLimit(overLimit);

          onTranscriptChangeRef.current?.(combined, Boolean(finalUtterance && !interimUtterance));
        };

        recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
          clearSilenceTimer();
          if (event.error === "aborted") {
            setState("IDLE");
            return;
          }

          const friendlyMsg = mapSpeechRecognitionError(event.error);
          setErrorMessage(friendlyMsg);
          setState("ERROR");
          onErrorRef.current?.(friendlyMsg);
        };

        recognition.onend = () => {
          clearSilenceTimer();
          if (stateRef.current === "LISTENING" || stateRef.current === "PROCESSING") {
            setState("TRANSCRIPT_READY");
            onTranscriptFinalRef.current?.(transcript);
          } else if (stateRef.current !== "ERROR" && stateRef.current !== "UNSUPPORTED") {
            setState("IDLE");
          }
        };

        recognition.start();
      } catch (err) {
        clearSilenceTimer();
        const msg = err instanceof Error ? err.message : "Failed to initiate voice recognition.";
        setErrorMessage(msg);
        setState("ERROR");
        onErrorRef.current?.(msg);
      }
    },
    [language, resetSilenceTimer, clearSilenceTimer, transcript]
  );

  const stopListening = React.useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current && stateRef.current === "LISTENING") {
      setState("PROCESSING");
      try {
        recognitionRef.current.stop();
      } catch {
        setState("IDLE");
      }
    }
  }, [clearSilenceTimer]);

  const cancelListening = React.useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
    }
    setInterimTranscript("");
    setTranscript("");
    // Restore base text if any
    onTranscriptChangeRef.current?.(baseTextRef.current, true);
    setState("IDLE");
    setErrorMessage(null);
  }, [clearSilenceTimer]);

  const clearError = React.useCallback(() => {
    setErrorMessage(null);
    if (state === "ERROR") {
      setState("IDLE");
    }
  }, [state]);

  return {
    isSupported,
    state,
    transcript,
    interimTranscript,
    errorMessage,
    language,
    setLanguage,
    isOverLimit,
    startListening,
    stopListening,
    cancelListening,
    clearError,
  };
}

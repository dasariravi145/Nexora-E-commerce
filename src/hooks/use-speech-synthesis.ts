"use client";

import * as React from "react";
import {
  isSpeechSynthesisSupported,
  sanitizeMarkdownForSpeech,
  findMatchingVoice,
  DEFAULT_VOICE_SETTINGS,
  TTS_STORAGE_KEY,
  type VoiceSettings,
  type VoiceSynthesisState,
  type SpeechLanguage,
} from "@/lib/speech-utils";

// Structured non-sensitive diagnostics for runtime debugging
function logVoiceDiagnostic(action: string, details?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    const timestamp = new Date().toISOString().slice(11, 23);
    const detailStr = details
      ? " " +
        Object.entries(details)
          .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`)
          .join(" ")
      : "";
    console.log(`[NEXORA Voice ${timestamp}] ${action}${detailStr}`);
  }
}

// Module-level tracking for global audio concurrency, generation guarding, and lifecycle ownership
let activeSpeakerOwnerId: string | null = null;
let activeSpeakingId: string | null = null;
let globalSynthState: VoiceSynthesisState = "IDLE";
let activeGenerationId = 0;
const activeListeners = new Set<(id: string | null, state: VoiceSynthesisState) => void>();

function notifyActiveSpeakerChange(id: string | null, state: VoiceSynthesisState = "IDLE") {
  activeSpeakingId = id;
  globalSynthState = state;
  activeListeners.forEach((listener) => listener(id, state));
}

// Module-level tracking for synchronized voice settings across components
let currentSettings: VoiceSettings = DEFAULT_VOICE_SETTINGS;
let isSettingsLoaded = false;
const settingsListeners = new Set<(settings: VoiceSettings) => void>();

function notifySettingsChange(newSettings: VoiceSettings) {
  currentSettings = newSettings;
  settingsListeners.forEach((listener) => listener(newSettings));
}

function loadInitialSettings(): VoiceSettings {
  if (typeof window === "undefined") return DEFAULT_VOICE_SETTINGS;
  try {
    const raw = localStorage.getItem(TTS_STORAGE_KEY);
    if (!raw) return DEFAULT_VOICE_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      voiceURI: typeof parsed.voiceURI === "string" ? parsed.voiceURI : null,
      rate:
        typeof parsed.rate === "number" && parsed.rate >= 0.5 && parsed.rate <= 2.0
          ? parsed.rate
          : 1.0,
      pitch:
        typeof parsed.pitch === "number" && parsed.pitch >= 0.5 && parsed.pitch <= 1.5
          ? parsed.pitch
          : 1.0,
      language: parsed.language === "te-IN" ? "te-IN" : "en-IN",
    };
  } catch {
    return DEFAULT_VOICE_SETTINGS;
  }
}

export interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  state: VoiceSynthesisState;
  activeId: string | null;
  voices: SpeechSynthesisVoice[];
  settings: VoiceSettings;
  updateSettings: (newSettings: Partial<VoiceSettings>) => void;
  resetSettings: () => void;
  previewVoice: (lang?: SpeechLanguage) => void;
  speak: (id: string, text: string, lang?: SpeechLanguage) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  cancelAll: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const instanceId = React.useId();

  const [isSupported] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return isSpeechSynthesisSupported();
  });
  const [state, setState] = React.useState<VoiceSynthesisState>(() => {
    if (typeof window === "undefined") return "IDLE";
    return isSpeechSynthesisSupported() ? globalSynthState : "UNSUPPORTED";
  });
  const [activeId, setActiveId] = React.useState<string | null>(activeSpeakingId);
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = React.useState<VoiceSettings>(() => currentSettings);

  // Keep track of active utterance ref
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Subscribe to module-level speaker and state change
  React.useEffect(() => {
    const handleSpeakerChange = (newActiveId: string | null, newState: VoiceSynthesisState) => {
      setActiveId(newActiveId);
      setState(newState);
    };

    activeListeners.add(handleSpeakerChange);
    return () => {
      activeListeners.delete(handleSpeakerChange);
    };
  }, []);

  // Subscribe to module-level settings change
  React.useEffect(() => {
    const handleSettingsChange = (newSettings: VoiceSettings) => {
      setSettings(newSettings);
    };

    settingsListeners.add(handleSettingsChange);
    return () => {
      settingsListeners.delete(handleSettingsChange);
    };
  }, []);

  // Hydrate settings from localStorage on client mount
  React.useEffect(() => {
    if (!isSettingsLoaded && typeof window !== "undefined") {
      isSettingsLoaded = true;
      const saved = loadInitialSettings();
      notifySettingsChange(saved);
    }
  }, []);

  // Load voices on mount if supported
  React.useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          setVoices(available);
        }
      } catch {
        // Ignore
      }
    };

    loadVoices();

    if ("onvoiceschanged" in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ("onvoiceschanged" in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Cleanup Chrome keep-alive timer
  const clearKeepAlive = React.useCallback(() => {
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  }, []);

  // Unmount cleanup: ONLY cancel speech if THIS instance is the active speech owner
  React.useEffect(() => {
    logVoiceDiagnostic("useSpeechSynthesis mounted", { instanceId });
    return () => {
      clearKeepAlive();
      if (activeSpeakerOwnerId === instanceId) {
        logVoiceDiagnostic("Active speech owner unmounted; cancelling speech", {
          instanceId,
          activeSpeakingId,
        });
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
          } catch {
            // Ignore
          }
        }
        activeSpeakerOwnerId = null;
        notifyActiveSpeakerChange(null, "IDLE");
      } else {
        logVoiceDiagnostic("Passive speech instance unmounted; active speech preserved", {
          instanceId,
          activeSpeakerOwnerId,
        });
      }
    };
  }, [clearKeepAlive, instanceId]);

  const stop = React.useCallback(() => {
    clearKeepAlive();
    logVoiceDiagnostic("speechSynth.stop() invoked", { instanceId, activeSpeakingId });
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          logVoiceDiagnostic("speechSynthesis.cancel() invoked from stop()", {
            reason: "explicit_stop",
            caller: "useSpeechSynthesis.stop",
            instanceId,
          });
          window.speechSynthesis.cancel();
        }
      } catch {
        // Ignore
      }
    }
    activeSpeakerOwnerId = null;
    notifyActiveSpeakerChange(null, "IDLE");
  }, [clearKeepAlive, instanceId]);

  const pause = React.useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.pause();
        notifyActiveSpeakerChange(activeSpeakingId, "PAUSED");
      } catch {
        // Ignore
      }
    }
  }, []);

  const resume = React.useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.resume();
        notifyActiveSpeakerChange(activeSpeakingId, "PLAYING");
      } catch {
        // Ignore
      }
    }
  }, []);

  const speak = React.useCallback(
    (id: string, text: string, lang?: SpeechLanguage) => {
      if (!isSpeechSynthesisSupported()) {
        setState("UNSUPPORTED");
        return;
      }

      // If this exact utterance is ALREADY active under this owner, avoid redundant duplicate calls
      if (
        activeSpeakerOwnerId === instanceId &&
        activeSpeakingId === id &&
        (globalSynthState === "PLAYING" || globalSynthState === "PAUSED")
      ) {
        logVoiceDiagnostic("speak() ignored - utterance already active", { id, instanceId });
        return;
      }

      const generation = ++activeGenerationId;
      activeSpeakerOwnerId = instanceId;
      activeSpeakingId = id;

      logVoiceDiagnostic("speak() initiated", { id, generation, instanceId });

      // Stop any existing speech playback from ANOTHER utterance
      clearKeepAlive();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            logVoiceDiagnostic("speechSynthesis.cancel() invoked to preempt previous speech", {
              reason: "preempt_previous_speech",
              caller: "useSpeechSynthesis.speak",
              id,
              instanceId,
            });
            window.speechSynthesis.cancel();
          }
        } catch {
          // Ignore
        }
      }

      // Auto-detect Telugu if contains Telugu Unicode block, else fallback to lang or settings
      const hasTelugu = /[\u0C00-\u0C7F]/.test(text);
      const resolvedLang: SpeechLanguage =
        lang || (hasTelugu ? "te-IN" : currentSettings.language) || "en-IN";

      const naturalText = sanitizeMarkdownForSpeech(text, resolvedLang);
      if (!naturalText) {
        activeSpeakerOwnerId = null;
        notifyActiveSpeakerChange(null, "IDLE");
        return;
      }

      try {
        const utterance = new window.SpeechSynthesisUtterance(naturalText);
        utteranceRef.current = utterance;

        // Configure voice and language with live voices fallback
        const availableVoices =
          voices.length > 0
            ? voices
            : typeof window !== "undefined" && "speechSynthesis" in window
            ? window.speechSynthesis.getVoices()
            : [];

        const matchedVoice = findMatchingVoice(
          availableVoices,
          resolvedLang,
          currentSettings.voiceURI
        );
        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang;
        } else {
          utterance.lang = resolvedLang === "te-IN" ? "te-IN" : "en-IN";
        }

        utterance.rate = currentSettings.rate;
        utterance.pitch = currentSettings.pitch;

        utterance.onstart = () => {
          if (generation !== activeGenerationId) {
            logVoiceDiagnostic("Stale utterance.onstart ignored", { id, generation, activeGenerationId });
            return;
          }
          logVoiceDiagnostic("utterance.onstart confirmed", { id, generation });
          notifyActiveSpeakerChange(id, "PLAYING");

          // Workaround for Chrome ~14-second silence freeze
          clearKeepAlive();
          keepAliveIntervalRef.current = setInterval(() => {
            if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            }
          }, 10000);
        };

        utterance.onpause = () => {
          if (generation !== activeGenerationId) return;
          logVoiceDiagnostic("utterance.onpause", { id, generation });
          notifyActiveSpeakerChange(id, "PAUSED");
        };

        utterance.onresume = () => {
          if (generation !== activeGenerationId) return;
          logVoiceDiagnostic("utterance.onresume", { id, generation });
          notifyActiveSpeakerChange(id, "PLAYING");
        };

        utterance.onend = () => {
          if (generation !== activeGenerationId) {
            logVoiceDiagnostic("Stale utterance.onend ignored", { id, generation, activeGenerationId });
            return;
          }
          logVoiceDiagnostic("utterance.onend completed", { id, generation });
          clearKeepAlive();
          activeSpeakerOwnerId = null;
          notifyActiveSpeakerChange(null, "IDLE");
        };

        utterance.onerror = (e) => {
          if (generation !== activeGenerationId) {
            logVoiceDiagnostic("Stale utterance.onerror ignored", { id, generation, activeGenerationId });
            return;
          }
          clearKeepAlive();
          logVoiceDiagnostic("utterance.onerror", { id, generation, error: e.error });
          activeSpeakerOwnerId = null;

          if (e.error === "interrupted" || e.error === "canceled") {
            notifyActiveSpeakerChange(null, "IDLE");
          } else {
            notifyActiveSpeakerChange(null, "ERROR");
          }
        };

        // Note: activeId is updated so listeners know this message is queued,
        // but state remains IDLE until utterance.onstart confirms audio playback.
        activeSpeakingId = id;
        setActiveId(id);

        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          if (window.speechSynthesis.paused) {
            logVoiceDiagnostic("speechSynthesis.resume() invoked before speak", { id });
            window.speechSynthesis.resume();
          }
          logVoiceDiagnostic("window.speechSynthesis.speak() dispatched", { id, generation });
          window.speechSynthesis.speak(utterance);
          // Chromium safety: calling resume unpauses queued async speech
          window.speechSynthesis.resume();
        }
      } catch (err) {
        logVoiceDiagnostic("Speech synthesis exception", { id, error: String(err) });
        clearKeepAlive();
        activeSpeakerOwnerId = null;
        notifyActiveSpeakerChange(null, "ERROR");
      }
    },
    [voices, clearKeepAlive, instanceId]
  );

  const updateSettings = React.useCallback((patch: Partial<VoiceSettings>) => {
    const updated: VoiceSettings = {
      ...currentSettings,
      ...patch,
    };
    if (typeof updated.rate === "number") {
      updated.rate = Math.max(0.75, Math.min(1.5, Math.round(updated.rate * 100) / 100));
    }
    if (typeof updated.pitch === "number") {
      updated.pitch = Math.max(0.8, Math.min(1.2, Math.round(updated.pitch * 100) / 100));
    }

    notifySettingsChange(updated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(TTS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }
  }, []);

  const resetSettings = React.useCallback(() => {
    notifySettingsChange(DEFAULT_VOICE_SETTINGS);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(TTS_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  }, []);

  const previewVoice = React.useCallback(
    (targetLang?: SpeechLanguage) => {
      const lang = targetLang || currentSettings.language || "en-IN";
      const sampleText =
        lang === "te-IN"
          ? "నెక్స్-ఓరా కి స్వాగతం. ప్రీమియం ఎలక్ట్రానిక్స్ మరియు ధ్వని స్పష్టతను అనుభవించండి."
          : "Welcome to NEXORA. Experience precision sound and verified specifications.";
      speak("preview-voice", sampleText, lang);
    },
    [speak]
  );

  const cancelAll = React.useCallback(() => {
    stop();
  }, [stop]);

  return {
    isSupported,
    state,
    activeId,
    voices,
    settings,
    updateSettings,
    resetSettings,
    previewVoice,
    speak,
    pause,
    resume,
    stop,
    cancelAll,
  };
}

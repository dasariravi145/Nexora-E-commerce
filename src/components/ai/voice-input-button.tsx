"use client";

import * as React from "react";
import {
  Mic,
  MicOff,
  Loader2,
  AlertCircle,
  X,
  Languages,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  useSpeechRecognition,
  type UseSpeechRecognitionReturn,
} from "@/hooks/use-speech-recognition";
import {
  SUPPORTED_VOICE_LANGUAGES,
} from "@/lib/speech-utils";

interface VoiceInputButtonProps {
  currentText: string;
  onTranscriptUpdate: (newText: string) => void;
  disabled?: boolean;
}

export function VoiceInputButton({
  currentText,
  onTranscriptUpdate,
  disabled = false,
}: VoiceInputButtonProps) {
  const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = React.useState(false);
  const languageMenuRef = React.useRef<HTMLDivElement | null>(null);

  const speechRec: UseSpeechRecognitionReturn = useSpeechRecognition({
    onTranscriptChange: (combined) => {
      onTranscriptUpdate(combined);
    },
    onTranscriptFinal: () => {
      // Transcript is ready in textarea for user review
    },
  });

  const {
    isSupported,
    state,
    errorMessage,
    language,
    setLanguage,
    isOverLimit,
    startListening,
    stopListening,
    cancelListening,
    clearError,
  } = speechRec;

  // Handle Escape key to cancel listening
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && (state === "LISTENING" || state === "REQUESTING_PERMISSION")) {
        e.preventDefault();
        cancelListening();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, cancelListening]);

  // Close menus on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(e.target as Node)
      ) {
        setShowLanguageMenu(false);
      }
    }
    if (showLanguageMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showLanguageMenu]);

  const handleMicClick = () => {
    if (!isSupported) return;

    if (state === "LISTENING") {
      stopListening();
    } else if (state === "REQUESTING_PERMISSION") {
      cancelListening();
    } else {
      startListening(currentText);
    }
  };

  const isListening = state === "LISTENING";
  const isRequesting = state === "REQUESTING_PERMISSION";
  const isProcessing = state === "PROCESSING";

  const currentLangMeta =
    SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === language) ||
    SUPPORTED_VOICE_LANGUAGES[0];

  // Screen reader status announcement
  const getScreenReaderAnnouncement = () => {
    if (isRequesting) return "Requesting microphone permission...";
    if (isListening) return `Listening for speech in ${currentLangMeta.label}. Speak now.`;
    if (isProcessing) return "Processing your speech...";
    if (state === "TRANSCRIPT_READY") return "Transcript ready in input box. Review and press Send.";
    if (errorMessage) return `Voice error: ${errorMessage}`;
    return "";
  };

  return (
    <div className="relative inline-flex items-center gap-1.5" ref={languageMenuRef}>
      {/* Screen-reader live region */}
      <div role="status" aria-live="assertive" className="sr-only">
        {getScreenReaderAnnouncement()}
      </div>

      {/* Language Selector Dropdown Toggle */}
      {isSupported && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLanguageMenu((prev) => !prev)}
            title="Select speech recognition language"
            aria-label={`Speech language: ${currentLangMeta.label}. Click to switch.`}
            aria-expanded={showLanguageMenu}
            disabled={disabled || isListening}
            className="inline-flex items-center gap-1 px-1.5 py-1 text-[11px] font-mono font-medium text-[#475569] hover:text-[#0F172A] hover:bg-slate-200/60 rounded-md transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563EB]"
          >
            <span>{currentLangMeta.flag}</span>
            <span className="uppercase text-[10px] font-bold">
              {language === "te-IN" ? "TE" : "EN"}
            </span>
          </button>

          {/* Language Menu Popover */}
          {showLanguageMenu && (
            <div
              className="absolute bottom-full mb-1.5 left-0 z-50 w-52 p-2 bg-white rounded-xl border border-[#E2E8F0] shadow-lg space-y-1 animate-in fade-in duration-150"
              role="menu"
              aria-orientation="vertical"
            >
              <div className="px-2 py-1 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-semibold text-[#64748B] flex items-center gap-1">
                  <Languages className="w-3 h-3 text-[#2563EB]" />
                  <span>Speech Language</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPrivacyNotice((prev) => !prev)}
                  className="text-[9px] text-[#2563EB] hover:underline"
                  title="View privacy disclosure"
                >
                  Privacy
                </button>
              </div>

              {SUPPORTED_VOICE_LANGUAGES.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setLanguage(opt.code);
                    setShowLanguageMenu(false);
                  }}
                  role="menuitem"
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    language === opt.code
                      ? "bg-[#EAF2FF] text-[#2563EB] font-semibold"
                      : "text-[#334155] hover:bg-slate-100 font-normal"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                    <span className="text-[10px] text-slate-400">({opt.nativeLabel})</span>
                  </div>
                  {language === opt.code && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                </button>
              ))}

              <p className="px-2 pt-1 text-[9px] text-[#94A3B8] leading-tight border-t border-slate-100">
                Note: Browser speech transcription accuracy may vary by operating system and language.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Main Microphone Button */}
      <button
        type="button"
        onClick={handleMicClick}
        disabled={disabled || !isSupported}
        aria-label={
          !isSupported
            ? "Voice input not supported in this browser"
            : isListening
            ? "Stop listening"
            : isRequesting
            ? "Requesting microphone permission"
            : "Start voice input"
        }
        aria-pressed={isListening}
        title={
          !isSupported
            ? "Voice input is not supported in this browser. Please type your message."
            : isListening
            ? "Stop voice recording (or press Escape to cancel)"
            : `Voice inquiry in ${currentLangMeta.label}`
        }
        className={`relative inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
          !isSupported
            ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
            : isListening
            ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 ring-2 ring-rose-400 ring-offset-1"
            : isRequesting
            ? "bg-amber-500 text-white animate-pulse"
            : isProcessing
            ? "bg-indigo-600 text-white"
            : "bg-[#09152B] hover:bg-slate-800 text-[#F2B95C] hover:text-white"
        }`}
      >
        {isRequesting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isProcessing ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5 animate-pulse motion-reduce:animate-none" />
            {/* Visualizer wave ping */}
            <span
              className="absolute -top-1 -right-1 flex h-2.5 w-2.5"
              aria-hidden="true"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
          </>
        ) : (
          <Mic className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Listening status badge with cancel option */}
      {isListening && (
        <div className="absolute right-full mr-2 bottom-0 z-40 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#09152B] text-white text-[11px] font-mono shadow-md whitespace-nowrap animate-in fade-in duration-150">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping motion-reduce:animate-none" />
          <span>Listening...</span>
          <button
            type="button"
            onClick={cancelListening}
            title="Cancel voice input (Esc)"
            aria-label="Cancel voice input"
            className="ml-1 p-0.5 text-slate-400 hover:text-white rounded-xs focus-visible:outline-none"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Error Notice Popover */}
      {errorMessage && (
        <div
          className="absolute bottom-full mb-2 right-0 z-50 w-64 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 shadow-xl text-xs space-y-1.5 animate-in fade-in duration-200"
          role="alert"
        >
          <div className="flex items-start justify-between gap-1">
            <div className="flex items-center gap-1.5 font-semibold text-rose-700">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Voice Notice</span>
            </div>
            <button
              type="button"
              onClick={clearError}
              aria-label="Dismiss error notice"
              className="text-rose-500 hover:text-rose-800 p-0.5 rounded-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-rose-800 leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Transcript Limit Warning */}
      {isOverLimit && (
        <div
          className="absolute bottom-full mb-2 right-0 z-50 w-64 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 shadow-md text-xs space-y-1"
          role="alert"
        >
          <p className="font-semibold text-amber-800 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Message Length Warning</span>
          </p>
          <p className="text-[11px] text-amber-700">
            Your message exceeds the 1,000 character limit. Please shorten before sending.
          </p>
        </div>
      )}

      {/* Privacy Disclosure Modal/Popover */}
      {showPrivacyNotice && (
        <div
          className="absolute bottom-full mb-2 left-0 z-50 w-72 p-3 bg-white rounded-xl border border-slate-200 shadow-xl text-xs space-y-2 animate-in fade-in duration-200"
          role="dialog"
          aria-label="Voice privacy notice"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#09152B] flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Voice Privacy Disclosure</span>
            </span>
            <button
              type="button"
              onClick={() => setShowPrivacyNotice(false)}
              className="text-slate-400 hover:text-slate-700 p-0.5"
              aria-label="Close privacy notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-[#475569] leading-relaxed">
            NEXORA uses browser-native speech APIs. Spoken audio is transcribed directly on your device or through your browser provider (e.g., Google in Chrome, Apple in Safari).
          </p>
          <ul className="text-[10px] text-[#64748B] space-y-0.5 list-disc pl-3">
            <li>NEXORA does not record, upload, or store raw audio files.</li>
            <li>Voice transcripts are only sent when you explicitly press Send.</li>
            <li>Zero automatic cart modifications from spoken commands.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

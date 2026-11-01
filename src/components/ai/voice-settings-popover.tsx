"use client";

import * as React from "react";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Play,
  Square,
  ShieldCheck,
  Volume2,
  Info,
} from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import {
  SUPPORTED_VOICE_LANGUAGES,
  getVoicesForLanguage,
  type SpeechLanguage,
} from "@/lib/speech-utils";

export function VoiceSettingsPopover() {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const {
    isSupported,
    state,
    activeId,
    voices,
    settings,
    updateSettings,
    resetSettings,
    previewVoice,
    stop,
  } = useSpeechSynthesis();

  // Active language in the settings dialog directly derived from settings
  const selectedLanguage: SpeechLanguage = settings.language || "en-IN";

  const isPreviewPlaying = activeId === "preview-voice" && state === "PLAYING";

  // Handle outside click to dismiss popover
  React.useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isSupported) {
    return null;
  }

  const matchingVoices = getVoicesForLanguage(voices, selectedLanguage);
  const hasMatchingRegionalVoices = matchingVoices.length > 0;

  const handleLanguageChange = (lang: SpeechLanguage) => {
    updateSettings({ language: lang });
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateSettings({ voiceURI: value === "" ? null : value });
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    if (!isNaN(rate)) {
      updateSettings({ rate });
    }
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pitch = parseFloat(e.target.value);
    if (!isNaN(pitch)) {
      updateSettings({ pitch });
    }
  };

  const handlePreviewToggle = () => {
    if (isPreviewPlaying) {
      stop();
    } else {
      previewVoice(selectedLanguage);
    }
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Voice & Speech Settings"
        aria-label="Configure voice speech synthesis settings"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2B95C] ${
          isOpen
            ? "bg-blue-600 text-white"
            : "text-slate-400 hover:text-white hover:bg-slate-800"
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Voice & Speech Synthesis Settings"
          aria-modal="false"
          className="absolute right-0 top-full mt-2 w-80 sm:w-88 rounded-2xl bg-[#09152B] border border-slate-700/80 text-white p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/40"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-400/30">
                <Volume2 className="w-3.5 h-3.5 text-[#F2B95C]" />
              </div>
              <h3 className="text-xs font-semibold tracking-tight text-white">
                Speech Quality & Voice
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close voice settings"
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3.5 space-y-3.5 text-xs">
            {/* 1. Language Switcher Tabs */}
            <div>
              <span className="block text-[11px] font-mono text-slate-300 mb-1.5 font-medium">
                Target Language
              </span>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
                {SUPPORTED_VOICE_LANGUAGES.map((langOpt) => {
                  const isSelected = selectedLanguage === langOpt.code;
                  return (
                    <button
                      key={langOpt.code}
                      type="button"
                      onClick={() => handleLanguageChange(langOpt.code)}
                      aria-pressed={isSelected}
                      className={`py-1.5 px-2 rounded-lg text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-blue-600 text-white font-medium shadow-xs"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span aria-hidden="true">{langOpt.flag}</span>
                        <span className="truncate">{langOpt.label.split(" ")[0]}</span>
                      </span>
                      <span className="text-[10px] font-mono opacity-80">
                        {langOpt.nativeLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Voice Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="nexora-voice-select"
                  className="text-[11px] font-mono text-slate-300 font-medium"
                >
                  Installed Browser Voice
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {hasMatchingRegionalVoices
                    ? `${matchingVoices.length} regional ${
                        matchingVoices.length === 1 ? "voice" : "voices"
                      }`
                    : "System fallback"}
                </span>
              </div>

              <select
                id="nexora-voice-select"
                value={settings.voiceURI || ""}
                onChange={handleVoiceChange}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#F2B95C] cursor-pointer"
              >
                <option value="">Auto-select best regional voice (Recommended)</option>
                {hasMatchingRegionalVoices ? (
                  <optgroup label="Regional Matches">
                    {matchingVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} {v.default ? "(System Default)" : ""}
                      </option>
                    ))}
                  </optgroup>
                ) : (
                  <optgroup label="Available Browser Voices (Fallback)">
                    {voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              {!hasMatchingRegionalVoices && voices.length > 0 && (
                <div className="mt-1.5 flex items-start gap-1.5 text-[10px] text-amber-300/90 bg-amber-950/40 p-2 rounded-lg border border-amber-800/50">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    No native {selectedLanguage === "te-IN" ? "Telugu" : "Indian English"}{" "}
                    voice found on this device. Browser will use system default voice.
                  </span>
                </div>
              )}
            </div>

            {/* 3. Speaking Rate Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="nexora-speech-rate"
                  className="text-[11px] font-mono text-slate-300 font-medium"
                >
                  Speaking Speed: {settings.rate.toFixed(2)}x
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {settings.rate < 0.95
                    ? "Deliberate"
                    : settings.rate > 1.05
                    ? "Brisk"
                    : "Natural"}
                </span>
              </div>
              <input
                id="nexora-speech-rate"
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={settings.rate}
                onChange={handleRateChange}
                aria-label="Speech rate slider"
                aria-valuemin={0.75}
                aria-valuemax={1.5}
                aria-valuenow={settings.rate}
                aria-valuetext={`${settings.rate.toFixed(2)} times normal speed`}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>0.75x</span>
                <span>1.0x (Default)</span>
                <span>1.5x</span>
              </div>
            </div>

            {/* 4. Pitch Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="nexora-speech-pitch"
                  className="text-[11px] font-mono text-slate-300 font-medium"
                >
                  Voice Pitch: {settings.pitch.toFixed(2)}
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {settings.pitch < 0.95
                    ? "Deeper"
                    : settings.pitch > 1.05
                    ? "Higher"
                    : "Balanced"}
                </span>
              </div>
              <input
                id="nexora-speech-pitch"
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={settings.pitch}
                onChange={handlePitchChange}
                aria-label="Voice pitch slider"
                aria-valuemin={0.8}
                aria-valuemax={1.2}
                aria-valuenow={settings.pitch}
                aria-valuetext={`Pitch factor ${settings.pitch.toFixed(2)}`}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>0.80</span>
                <span>1.00 (Default)</span>
                <span>1.20</span>
              </div>
            </div>

            {/* 5. Action Buttons (Preview & Reset) */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePreviewToggle}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 ${
                  isPreviewPlaying
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isPreviewPlaying ? (
                  <>
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop Preview</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Preview Voice</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetSettings}
                title="Reset speech settings to defaults"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Privacy & Safety Footnote */}
            <div className="pt-2 border-t border-slate-850 flex items-center gap-1 text-[9px] text-slate-400 leading-tight">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% on-device Web Speech API. No audio is recorded or uploaded.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

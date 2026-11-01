"use client";

import * as React from "react";
import { Volume2, Pause, Play, Square } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import type { SpeechLanguage } from "@/lib/speech-utils";

interface VoiceOutputButtonProps {
  messageId: string;
  text: string;
  language?: SpeechLanguage;
}

export function VoiceOutputButton({
  messageId,
  text,
  language = "en-IN",
}: VoiceOutputButtonProps) {
  const { isSupported, state, activeId, speak, pause, resume, stop } =
    useSpeechSynthesis();

  if (!isSupported) {
    return null;
  }

  const isCurrentActive = activeId === messageId;
  const isPlaying = isCurrentActive && state === "PLAYING";
  const isPaused = isCurrentActive && state === "PAUSED";

  const handlePlayToggle = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      speak(messageId, text, language);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stop();
  };

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={handlePlayToggle}
        title={
          isPlaying
            ? "Pause speech playback"
            : isPaused
            ? "Resume speech playback"
            : "Listen to this response"
        }
        aria-label={
          isPlaying
            ? "Pause speech playback"
            : isPaused
            ? "Resume speech playback"
            : "Listen to this response"
        }
        aria-pressed={isPlaying}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563EB] ${
          isPlaying
            ? "bg-[#2563EB] text-white font-semibold shadow-xs"
            : isPaused
            ? "bg-amber-100 text-amber-900 border border-amber-300 font-semibold"
            : "text-[#64748B] hover:text-[#09152B] hover:bg-slate-100"
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-2.5 h-2.5" />
            <span>Pause</span>
            {/* Animated audio wave indicator bars */}
            <span className="inline-flex items-center gap-0.5 ml-0.5" aria-hidden="true">
              <span className="w-0.5 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s] motion-reduce:animate-none" />
              <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s] motion-reduce:animate-none" />
              <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce motion-reduce:animate-none" />
            </span>
          </>
        ) : isPaused ? (
          <>
            <Play className="w-2.5 h-2.5" />
            <span>Resume</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3 h-3 text-[#2563EB]" />
            <span>Listen</span>
          </>
        )}
      </button>

      {/* Stop button when actively playing or paused */}
      {isCurrentActive && (isPlaying || isPaused) && (
        <button
          type="button"
          onClick={handleStop}
          title="Stop playback"
          aria-label="Stop speech playback"
          className="p-1 text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
        >
          <Square className="w-2.5 h-2.5 fill-current" />
        </button>
      )}
    </div>
  );
}

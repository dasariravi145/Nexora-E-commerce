"use client";

import { Sparkles } from "lucide-react";

interface AssistantTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

/**
 * Floating AI Assistant Trigger Button.
 * Styled in Midnight Navy (#09152B) and Champagne Gold (#F2B95C).
 * Fully accessible with reduced-motion support.
 */
export function AssistantTrigger({
  isOpen,
  onToggle,
  unreadCount = 0,
}: AssistantTriggerProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close NEXORA AI Assistant" : "Open NEXORA AI Assistant"}
      className="group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#09152B] hover:bg-[#0d1d3d] text-white border border-[#F2B95C]/40 hover:border-[#F2B95C] shadow-lg shadow-black/30 hover:shadow-[0_0_20px_rgba(242,185,92,0.25)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B95C] cursor-pointer"
    >
      {/* Ambient Pulsing Aura (disabled for reduced motion) */}
      <span
        className="absolute inset-0 rounded-full bg-[#F2B95C]/15 -z-10 group-hover:scale-110 motion-safe:animate-pulse motion-reduce:animate-none transition-transform duration-500"
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[#F2B95C] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
        </div>

        {/* Small gold status dot */}
        <span
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#F2B95C] ring-2 ring-[#09152B]"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col text-left">
        <span className="text-xs font-semibold tracking-wide text-white group-hover:text-[#F2B95C] transition-colors">
          AI Concierge
        </span>
        <span className="text-[10px] font-mono text-slate-300 -mt-0.5 hidden sm:inline">
          Catalogue Intel
        </span>
      </div>

      {unreadCount > 0 && (
        <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold font-mono">
          {unreadCount}
        </span>
      )}
    </button>
  );
}

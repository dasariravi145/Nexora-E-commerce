"use client";

import * as React from "react";
import {
  X,
  Sparkles,
  Send,
  RotateCcw,
  Loader2,
  Cpu,
  ShieldCheck,
  Scale,
  Headphones,
  Laptop,
  Radio,
  Square,
  Volume2,
  Mic,
  AlertCircle,
  Pause,
} from "lucide-react";
import { ChatMessageItem, type ChatMessage } from "./chat-message-item";
import { VoiceInputButton } from "./voice-input-button";
import { VoiceSettingsPopover } from "./voice-settings-popover";
import { useConversationalAgent } from "@/hooks/use-conversational-agent";

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onRetryLastMessage: () => void;
  onResetSession: () => void;
  onAddLocalAssistantMessage?: (userOrAssistantText: string, assistantReply?: string) => void;
  onOpenCart?: () => void;
}

const STARTER_PROMPTS = [
  {
    icon: Laptop,
    label: "Recommend a laptop under ₹80,000",
    description: "Evaluates available models against your budget ceiling.",
  },
  {
    icon: Scale,
    label: "Compare NEXORA smartphones",
    description: "Side-by-side analysis of Nova 1 Pro, Ultra, and Fold.",
  },
  {
    icon: Headphones,
    label: "Which headphones are best for travel?",
    description: "Analyzes noise cancellation, battery endurance, and isolation.",
  },
];

export function AssistantPanel({
  isOpen,
  onClose,
  messages,
  isLoading,
  onSendMessage,
  onRetryLastMessage,
  onResetSession,
  onAddLocalAssistantMessage,
  onOpenCart,
}: AssistantPanelProps) {
  const [inputText, setInputText] = React.useState("");
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  // Conversational Voice Shopping Agent
  const conversationalAgent = useConversationalAgent({
    isOpen,
    messages,
    isLoading,
    onSendMessage,
    onAddLocalAssistantMessage: onAddLocalAssistantMessage || onSendMessage,
    onOpenCart,
  });

  const prevMessagesLengthRef = React.useRef(messages.length);
  const wasOpenRef = React.useRef(isOpen);

  // Auto-focus input on desktop when opened with preventScroll to stop page jumps
  React.useEffect(() => {
    if (isOpen) {
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 640;
      if (isDesktop) {
        const timer = setTimeout(() => {
          inputRef.current?.focus({ preventScroll: true });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen]);

  // Escape key to close
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-scroll inside messages container without causing whole-page jumps
  React.useEffect(() => {
    if (!isOpen || !messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const isNewOpen = !wasOpenRef.current && isOpen;
    const hasNewMessage = messages.length > prevMessagesLengthRef.current;

    wasOpenRef.current = isOpen;
    prevMessagesLengthRef.current = messages.length;

    if (isNewOpen) {
      // Instant position at bottom on initial open
      container.scrollTop = container.scrollHeight;
    } else if (hasNewMessage || isLoading) {
      // Smooth internal scroll only when new messages or loading states arrive
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputText.trim();
    if (!clean || isLoading) return;

    onSendMessage(clean);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="nexora-ai-concierge-title"
      className="fixed inset-x-0 bottom-0 top-0 sm:top-auto sm:bottom-6 sm:right-6 sm:left-auto sm:w-[420px] sm:max-w-[calc(100vw-2rem)] sm:h-[min(640px,calc(100dvh-3rem))] sm:max-h-[calc(100dvh-3rem)] z-50 flex flex-col bg-[#F8FAFC] sm:rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 ring-1 ring-black/5 overscroll-contain h-[100dvh] max-h-[100dvh]"
    >
      {/* 1. Header Bar */}
      <header className="px-4 py-3.5 bg-[#09152B] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center border border-blue-400/30 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#F2B95C]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2
                id="nexora-ai-concierge-title"
                className="text-xs sm:text-sm font-semibold tracking-tight text-white"
              >
                NEXORA AI Concierge
              </h2>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-[#F2B95C]/20 text-[#F2B95C] border border-[#F2B95C]/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              <span>NEXORA Intelligence • Demo Advisory</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {conversationalAgent.isSupported && (
            <button
              type="button"
              onClick={conversationalAgent.toggleVoiceConversation}
              title={
                conversationalAgent.isActive
                  ? "Exit Voice Conversation Mode"
                  : "Start Hands-Free Voice Conversation Mode"
              }
              aria-label={
                conversationalAgent.isActive
                  ? "Exit Voice Conversation Mode"
                  : "Start Hands-Free Voice Conversation Mode"
              }
              aria-pressed={conversationalAgent.isActive}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 ${
                conversationalAgent.isActive
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs ring-1 ring-emerald-400/50"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${conversationalAgent.isActive ? "animate-pulse" : ""}`} />
              <span className="text-[10px] font-sans">
                {conversationalAgent.isActive ? "Live" : "Voice Mode"}
              </span>
            </button>
          )}

          <VoiceSettingsPopover />
          <button
            type="button"
            onClick={onResetSession}
            title="Start fresh conversation"
            aria-label="Start fresh conversation"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2B95C]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close AI Assistant"
            aria-label="Close AI Assistant"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Messages Stream */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 p-4 overflow-y-auto overscroll-contain space-y-3.5 focus:outline-none"
        tabIndex={-1}
        aria-live="polite"
        aria-atomic="false"
      >
        {/* Welcome State when conversation is empty */}
        {messages.length === 0 && (
          <div className="py-2 space-y-4 animate-in fade-in duration-300">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#09152B]">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <span>Verified Catalogue Intelligence</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Welcome to NEXORA. I am your concierge for our 30 precision electronics specimens. Ask me for technical specifications, device comparisons, or budget filtering.
              </p>
              <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Demonstration Storefront • INR Pricing Architecture</span>
              </div>
            </div>

            {conversationalAgent.isSupported && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/80 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-950">
                  <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  <span>Hands-Free Voice Shopping</span>
                </div>
                <p className="text-[11px] text-blue-900/80 leading-relaxed">
                  Tap <strong>Voice Mode</strong> in the header to talk naturally. Try saying: <em>&ldquo;Show me the best camera phone&rdquo;</em>, <em>&ldquo;Which one is cheaper?&rdquo;</em>, or <em>&ldquo;Add the second phone to my bag&rdquo;</em>.
                </p>
              </div>
            )}

            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#475569] px-1 mb-2">
                Suggested Inquiries:
              </p>
              <div className="space-y-1.5">
                {STARTER_PROMPTS.map((prompt, idx) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSendMessage(prompt.label)}
                      disabled={isLoading}
                      className="w-full p-2.5 rounded-xl bg-white hover:bg-[#EAF2FF] border border-[#E2E8F0] hover:border-[#2563EB]/40 text-left transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-[#EAF2FF] group-hover:bg-[#2563EB] text-[#2563EB] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#0F172A] group-hover:text-[#2563EB] truncate">
                            {prompt.label}
                          </p>
                          <p className="text-[11px] text-[#64748B] truncate">
                            {prompt.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg) => (
          <ChatMessageItem
            key={msg.id}
            message={msg}
            onRetry={onRetryLastMessage}
            onNavigate={onClose}
          />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 self-start p-3 rounded-2xl rounded-tl-xs bg-white border border-[#E2E8F0] shadow-xs text-xs text-[#475569] animate-in fade-in duration-200">
            <Loader2 className="w-3.5 h-3.5 text-[#2563EB] animate-spin" />
            <span className="font-mono text-xs">Analyzing catalogue specimens...</span>
          </div>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* 2.5 Live Voice Conversation Status Banner */}
      {conversationalAgent.isActive && (
        <div className="px-3.5 py-2.5 bg-[#09152B] border-t border-slate-800 text-white flex items-center justify-between gap-3 shrink-0 shadow-inner animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Dynamic Status Icon */}
            {conversationalAgent.state === "LISTENING" && (
              <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400/60 animate-ping absolute" />
                <Mic className="w-3.5 h-3.5 relative" />
              </div>
            )}
            {conversationalAgent.state === "THINKING" && (
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 shrink-0">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
            )}
            {conversationalAgent.state === "SPEAKING" && (
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F2B95C]/20 text-[#F2B95C] shrink-0">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              </div>
            )}
            {conversationalAgent.state === "PAUSED" && (
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-400 shrink-0">
                <Pause className="w-3.5 h-3.5" />
              </div>
            )}
            {conversationalAgent.state === "ERROR" && (
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 shrink-0">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-semibold tracking-wider uppercase text-slate-300">
                  {conversationalAgent.state === "LISTENING"
                    ? "Listening"
                    : conversationalAgent.state === "THINKING"
                    ? "Thinking"
                    : conversationalAgent.state === "SPEAKING"
                    ? "Speaking"
                    : conversationalAgent.state === "PAUSED"
                    ? "Paused"
                    : "Voice Alert"}
                </span>
                {conversationalAgent.state === "LISTENING" && (
                  <span className="text-[9px] text-emerald-400 font-mono">
                    • Speak naturally
                  </span>
                )}
              </div>

              {/* Dynamic Transcript / Guidance */}
              <p className="text-xs text-slate-200 truncate font-sans">
                {conversationalAgent.liveTranscript
                  ? `"${conversationalAgent.liveTranscript}"`
                  : conversationalAgent.state === "SPEAKING"
                  ? "Speaking assistant response..."
                  : conversationalAgent.state === "THINKING"
                  ? "Evaluating verified catalogue specs..."
                  : conversationalAgent.errorMessage || "Say: 'Show camera phones', 'Compare 1 and 2', 'Add 2nd to bag'"}
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {conversationalAgent.state === "SPEAKING" && (
              <button
                type="button"
                onClick={conversationalAgent.interruptSpeaking}
                title="Interrupt speech"
                aria-label="Interrupt assistant speech and start listening"
                className="px-2 py-1 text-[11px] font-medium bg-amber-500/20 hover:bg-amber-500/30 text-[#F2B95C] border border-amber-500/30 rounded-lg transition-colors flex items-center gap-1"
              >
                <Square className="w-2.5 h-2.5 fill-current" />
                <span>Interrupt</span>
              </button>
            )}

            <button
              type="button"
              onClick={conversationalAgent.stopVoiceConversation}
              title="Exit Voice Conversation Mode"
              aria-label="Exit Voice Conversation Mode"
              className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
            >
              Exit
            </button>
          </div>
        </div>
      )}

      {/* 3. Input & Footer Area */}
      <footer className="p-3 bg-white border-t border-[#E2E8F0] shrink-0">
        <form onSubmit={handleSubmit} className="space-y-1.5">
          <div className="relative rounded-xl border border-[#E2E8F0] focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20 bg-[#F8FAFC] transition-all">
            <textarea
              ref={inputRef}
              rows={2}
              maxLength={1000}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about hardware specs, comparisons, or recommendations..."
              aria-label="Type your message to the AI Assistant"
              disabled={isLoading}
              className="w-full resize-none bg-transparent p-2.5 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none disabled:opacity-50"
            />

            <div className="flex items-center justify-between px-2.5 pb-2">
              <span
                className={`text-[10px] font-mono ${
                  inputText.length > 1000 ? "text-amber-600 font-semibold" : "text-[#94A3B8]"
                }`}
              >
                {inputText.length > 0 ? `${inputText.length}/1000` : "Enter to send"}
              </span>

              <div className="flex items-center gap-1.5">
                <VoiceInputButton
                  currentText={inputText}
                  onTranscriptUpdate={setInputText}
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  aria-label="Send message"
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-300 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-center text-[#64748B]">
            Illustrative demo telemetry. No actual purchasing or real orders.
          </p>
        </form>
      </footer>
    </aside>
  );
}

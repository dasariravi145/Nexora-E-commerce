"use client";

import { Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { SafeMessageContent } from "./safe-message-content";
import { VoiceOutputButton } from "./voice-output-button";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isError?: boolean;
  canRetry?: boolean;
}

interface ChatMessageItemProps {
  message: ChatMessage;
  onRetry?: () => void;
  onNavigate?: () => void;
}

export function ChatMessageItem({
  message,
  onRetry,
  onNavigate,
}: ChatMessageItemProps) {
  const isUser = message.sender === "user";

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1 self-end max-w-[85%]">
        <div className="flex items-center gap-1.5 text-[10px] text-[#475569] font-mono pr-1">
          <span>You</span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>
        <div className="rounded-2xl rounded-tr-xs bg-[#2563EB] px-3.5 py-2.5 text-white shadow-xs">
          <SafeMessageContent content={message.text} isAssistant={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1.5 self-start max-w-[92%]">
      <div className="flex items-center justify-between w-full pr-1">
        <div className="flex items-center gap-1.5 text-[10px] text-[#475569] font-mono pl-1">
          <div className="w-3.5 h-3.5 rounded-full bg-[#09152B] flex items-center justify-center border border-slate-700">
            <Sparkles className="w-2 h-2 text-[#F2B95C]" />
          </div>
          <span className="font-semibold text-[#09152B]">NEXORA Concierge</span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {!message.isError && (
          <VoiceOutputButton messageId={message.id} text={message.text} />
        )}
      </div>

      <div
        className={`rounded-2xl rounded-tl-xs px-3.5 py-3 shadow-xs border ${
          message.isError
            ? "bg-rose-50/80 border-rose-200 text-rose-900"
            : "bg-white border-[#E2E8F0] text-[#0F172A]"
        }`}
      >
        {message.isError && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 mb-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Advisory Notice</span>
          </div>
        )}

        <SafeMessageContent
          content={message.text}
          isAssistant={true}
          onNavigate={onNavigate}
        />

        {message.canRetry && onRetry && (
          <div className="mt-2.5 pt-2 border-t border-rose-200/80 flex items-center justify-between">
            <span className="text-[11px] text-rose-700">Transmission interrupted.</span>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 hover:text-rose-900 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded-sm"
              aria-label="Retry sending previous message"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

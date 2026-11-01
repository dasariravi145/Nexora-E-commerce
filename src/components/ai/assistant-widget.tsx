"use client";

import * as React from "react";
import { AssistantTrigger } from "./assistant-trigger";
import { AssistantPanel } from "./assistant-panel";
import type { ChatMessage } from "./chat-message-item";
import type { AiChatResponseBody, AiChatErrorResponse } from "@/types";
import { useOptionalCart } from "@/context/cart-context";

const SESSION_STORAGE_KEY = "nexora_ai_session_id";

/**
 * Generates a cryptographically random session ID complying strictly with
 * the backend validation bounds: 1 to 100 characters matching /^[a-zA-Z0-9_-]+$/.
 */
function createSecureSessionId(): string {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return `sess_${window.crypto.randomUUID().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  }

  if (
    typeof window !== "undefined" &&
    window.crypto &&
    typeof window.crypto.getRandomValues === "function"
  ) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const hex = Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return `sess_${hex}`;
  }

  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
}

/**
 * Retrieves the persistent session ID for this browser tab, or initializes a new one.
 */
function getOrInitSessionId(): string {
  if (typeof window === "undefined") {
    return "sess_ssr_placeholder";
  }

  try {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing && /^[a-zA-Z0-9_-]{1,100}$/.test(existing)) {
      return existing;
    }
  } catch {
    // SessionStorage unavailable (e.g. strict private browsing mode)
  }

  const fresh = createSecureSessionId();
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, fresh);
  } catch {
    // Ignore storage quota or access errors
  }
  return fresh;
}

function cancelBrowserSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

/**
 * Format timestamp in local display format (e.g. "12:45 PM")
 */
function getFormattedTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * AI Assistant Widget Root Container.
 * Manages floating button, slide-over panel, session state, and same-origin API requests.
 */
export function AssistantWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [lastSentPrompt, setLastSentPrompt] = React.useState<string | null>(null);
  const [sessionId, setSessionId] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      return getOrInitSessionId();
    }
    return "";
  });

  const cart = useOptionalCart();
  const isDrawerOpen = cart?.isDrawerOpen ?? false;

  // When cart drawer opens, automatically minimize/close the AI concierge panel
  // so the cart drawer is fully unobstructed, without clearing chat messages or session
  const [prevDrawerOpen, setPrevDrawerOpen] = React.useState(isDrawerOpen);
  if (prevDrawerOpen !== isDrawerOpen) {
    setPrevDrawerOpen(isDrawerOpen);
    if (isDrawerOpen) {
      setIsOpen(false);
      cancelBrowserSpeech();
    }
  }

  // Cancel any active speech synthesis on unmount
  React.useEffect(() => {
    return () => {
      cancelBrowserSpeech();
    };
  }, []);

  const handleResetSession = () => {
    cancelBrowserSpeech();
    const fresh = createSecureSessionId();
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, fresh);
    } catch {
      // Ignore
    }
    setSessionId(fresh);
    setMessages([]);
    setLastSentPrompt(null);
  };

  const handleSendMessage = async (text: string) => {
    const cleanPrompt = text.trim();
    if (!cleanPrompt || isLoading) return;

    setLastSentPrompt(cleanPrompt);

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      sender: "user",
      text: cleanPrompt,
      timestamp: getFormattedTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const requestStartTime = Date.now();
    try {
      const activeSession = sessionId || getOrInitSessionId();
      if (!sessionId) {
        setSessionId(activeSession);
      }

      if (process.env.NODE_ENV !== "production") {
        console.log(`[NEXORA AI Request] Started: length=${cleanPrompt.length} chars`);
      }

      // 2. Transmit to server-only proxy (same-origin, never exposes n8n webhook)
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanPrompt,
          sessionId: activeSession,
        }),
      });

      const durationMs = Date.now() - requestStartTime;

      if (res.ok) {
        const data = (await res.json()) as AiChatResponseBody;
        if (process.env.NODE_ENV !== "production") {
          console.log(`[NEXORA AI Request] Finished: status=${res.status}, duration=${durationMs}ms`);
        }
        const assistantMsg: ChatMessage = {
          id: `ast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          sender: "assistant",
          text: data.reply,
          timestamp: getFormattedTime(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // Handle categorized error statuses
        let errorMessage = "The assistant service encountered an error. Please try again.";
        let canRetry = true;
        let errorCode: string | undefined;

        if (res.status === 404 || res.status === 405) {
          errorMessage = "The live n8n AI workflow is offline in this public static demonstration. You can still test client-side speech recognition, voice synthesis, and explore the 30 hardware specimens directly.";
          canRetry = false;
        } else if (res.status === 429) {
          errorMessage = "You have sent too many messages in a short time. Please wait a moment and try again.";
        } else if (res.status === 504) {
          errorMessage = "The AI assistant took too long to respond. Please try again.";
        } else {
          try {
            const errData = (await res.json()) as AiChatErrorResponse;
            errorCode = errData.code;
            if (res.status === 502 || res.status === 503) {
              errorMessage = errData.error || "The AI assistant service is temporarily unavailable. Please try again shortly.";
            } else if (res.status === 400 || res.status === 413) {
              errorMessage = errData.error || "Your message could not be processed. Please shorten your prompt and try again.";
              canRetry = false;
            } else if (errData.error) {
              errorMessage = errData.error;
            }
          } catch {
            if (res.status === 502 || res.status === 503) {
              errorMessage = "The AI assistant service is temporarily unavailable. Please try again shortly.";
            }
          }
        }

        if (process.env.NODE_ENV !== "production") {
          console.error(
            `[NEXORA AI Request] Failed: status=${res.status}, duration=${durationMs}ms, canRetry=${canRetry}, code=${errorCode || "UNKNOWN"}`
          );
        }

        const errorMsg: ChatMessage = {
          id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          sender: "assistant",
          text: errorMessage,
          timestamp: getFormattedTime(),
          isError: true,
          canRetry,
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: unknown) {
      const durationMs = Date.now() - requestStartTime;
      const abortReason = err instanceof Error ? err.name : "NetworkError";
      if (process.env.NODE_ENV !== "production") {
        console.error(
          `[NEXORA AI Request] Aborted/Network error: reason=${abortReason}, duration=${durationMs}ms, canRetry=true`
        );
      }
      // Network disconnect / client abort
      const networkErrorMsg: ChatMessage = {
        id: `net_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        sender: "assistant",
        text: "Unable to connect to the assistant service. Please check your connection and try again.",
        timestamp: getFormattedTime(),
        isError: true,
        canRetry: true,
      };
      setMessages((prev) => [...prev, networkErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLastMessage = () => {
    if (lastSentPrompt && !isLoading) {
      handleSendMessage(lastSentPrompt);
    }
  };

  const handleAddLocalAssistantMessage = (userOrAssistantText: string, assistantReply?: string) => {
    if (assistantReply !== undefined) {
      const userMsg: ChatMessage = {
        id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        sender: "user",
        text: userOrAssistantText,
        timestamp: getFormattedTime(),
      };
      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        sender: "assistant",
        text: assistantReply,
        timestamp: getFormattedTime(),
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
    } else {
      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        sender: "assistant",
        text: userOrAssistantText,
        timestamp: getFormattedTime(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }
  };

  const handleOpenCart = () => {
    if (cart) {
      cart.openDrawer();
    }
  };

  return (
    <>
      <AssistantTrigger
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
      />

      <AssistantPanel
        isOpen={isOpen}
        onClose={() => {
          cancelBrowserSpeech();
          setIsOpen(false);
        }}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onRetryLastMessage={handleRetryLastMessage}
        onResetSession={handleResetSession}
        onAddLocalAssistantMessage={handleAddLocalAssistantMessage}
        onOpenCart={handleOpenCart}
      />
    </>
  );
}

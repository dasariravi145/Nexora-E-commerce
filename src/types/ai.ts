/**
 * Centralized TypeScript Models for NEXORA AI Chat & Assistant Services.
 */

export interface AiChatRequestBody {
  message: string;
  sessionId: string;
}

export interface AiChatResponseBody {
  reply: string;
  sessionId: string;
}

export interface AiChatErrorResponse {
  error: string;
  code: string;
}

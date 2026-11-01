/**
 * NEXORA AI Concierge — Speech API Utilities & Feature Detection
 *
 * Provides browser capability guards, speech language definitions,
 * official brand pronunciation mapping, Markdown-to-speech cleaning pipelines,
 * voice selection resolution, and error code normalization for Web Speech STT and TTS standards.
 */

import { decodeHtmlEntities } from "@/components/ai/safe-message-content";

export type VoiceRecognitionState =
  | "UNSUPPORTED"
  | "IDLE"
  | "REQUESTING_PERMISSION"
  | "LISTENING"
  | "PROCESSING"
  | "TRANSCRIPT_READY"
  | "ERROR";

export type SpeechLanguage = "en-IN" | "te-IN";

export type VoiceSynthesisState =
  | "UNSUPPORTED"
  | "IDLE"
  | "PLAYING"
  | "PAUSED"
  | "ERROR";

export interface SupportedLanguageOption {
  code: SpeechLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
  bcp47: string;
  recognitionLang: string;
  voiceLangPrefixes: string[];
}

export const SUPPORTED_VOICE_LANGUAGES: SupportedLanguageOption[] = [
  {
    code: "en-IN",
    label: "English (India)",
    nativeLabel: "English",
    flag: "🇮🇳",
    bcp47: "en-IN",
    recognitionLang: "en-IN",
    voiceLangPrefixes: ["en-IN", "en-GB", "en-US", "en"],
  },
  {
    code: "te-IN",
    label: "Telugu (India)",
    nativeLabel: "తెలుగు",
    flag: "🇮🇳",
    bcp47: "te-IN",
    recognitionLang: "te-IN",
    voiceLangPrefixes: ["te-IN", "te"],
  },
];

export const MAX_CHAT_INPUT_LENGTH = 1000;

export const TTS_STORAGE_KEY = "nexora_voice_tts_settings";

export interface VoiceSettings {
  voiceURI: string | null;
  rate: number; // 0.75 to 1.5, default 1.0
  pitch: number; // 0.8 to 1.2, default 1.0
  language: SpeechLanguage;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  voiceURI: null,
  rate: 1.0,
  pitch: 1.0,
  language: "en-IN",
};

// Official Brand Pronunciation Mapping
export const BRAND_PRONUNCIATION = {
  canonicalSpelling: "NEXORA",
  englishPhonetic: "Nek-so-ra",
  teluguPhonetic: "నెక్సోరా",
};

// Type declarations for Web Speech Recognition API
export interface ISpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): { readonly transcript: string; readonly confidence: number };
  [index: number]: { readonly transcript: string; readonly confidence: number };
}

export interface ISpeechRecognitionResultList {
  readonly length: number;
  item(index: number): ISpeechRecognitionResult;
  [index: number]: ISpeechRecognitionResult;
}

export interface ISpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: ISpeechRecognitionResultList;
}

export interface ISpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message?: string;
}

export interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: ISpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: ISpeechRecognitionEvent) => void) | null;
  onspeechstart?: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onspeechend?: ((this: ISpeechRecognition, ev: Event) => void) | null;
}

type SpeechRecognitionConstructor = new () => ISpeechRecognition;

/**
 * Checks if the current browser environment provides Web Speech Recognition capabilities.
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return typeof win.SpeechRecognition === "function" || typeof win.webkitSpeechRecognition === "function";
}

/**
 * Returns the SpeechRecognition constructor if available in the current browser.
 */
export function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

/**
 * Checks if the current browser environment provides Web Speech Synthesis capabilities.
 */
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
}

/**
 * Normalizes speech recognition error codes into human-readable, actionable messages.
 */
export function mapSpeechRecognitionError(errorCode: string): string {
  switch (errorCode) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access was denied. Please allow microphone permissions in your browser settings to speak.";
    case "no-speech":
      return "No speech was detected. Please click the microphone and try speaking again.";
    case "audio-capture":
      return "No microphone was found or audio capture failed. Please check your audio input device.";
    case "network":
      return "A network error occurred during speech transcription. Please check your internet connection.";
    case "aborted":
      return "Voice input was cancelled.";
    default:
      return "Speech recognition encountered an unexpected error. Please try again or type your message.";
  }
}

/**
 * Applies the official brand pronunciation dictionary to speech text.
 * - Converts occurrences of NEXORA to "Neks-Ora" (English) or "నెక్స్-ఓరా" (Telugu).
 * - Matches whole words case-insensitively (e.g., NEXORA, Nexora, nexora).
 * - Avoids modifying substrings in unrelated words.
 * - This function is ONLY used when preparing spoken audio strings; visible UI text remains "NEXORA".
 */
export function applyBrandPronunciation(
  text: string,
  lang: SpeechLanguage = "en-IN"
): string {
  if (!text) return "";
  const phonetic =
    lang === "te-IN"
      ? BRAND_PRONUNCIATION.teluguPhonetic
      : BRAND_PRONUNCIATION.englishPhonetic;

  // Use word boundary to match exact whole-word occurrences of NEXORA case-insensitively
  let result = text.replace(/\bNEXORA\b/gi, phonetic);

  // If language is Telugu, also ensure hyphenated variations map to canonical "నెక్సోరా"
  if (lang === "te-IN") {
    result = result.replace(/నెక్స్-ఓరా/g, BRAND_PRONUNCIATION.teluguPhonetic);
  }

  return result;
}

/**
 * Cleans assistant Markdown text into natural, spoken English or Telugu for text-to-speech.
 * - Applies official brand pronunciation ("Neks-Ora" / "నెక్స్-ఓరా").
 * - Strips table formatting and reads table cell rows as descriptive statements.
 * - Strips markdown links, URLs, and image syntax while preserving product names and specs.
 * - Converts currency amounts to spoken words ("Rupees 1,29,999" or "1,29,999 రూపాయలు").
 * - Expands technical units (GB -> gigabytes, mAh -> milliamp hours, OLED -> O-L-E-D, W -> Watts, MP -> megapixels).
 * - Decodes safe HTML entities and adds natural punctuation pauses.
 */
export function sanitizeMarkdownForSpeech(
  markdown: string,
  lang: SpeechLanguage = "en-IN"
): string {
  if (!markdown) return "";

  // 1. Decode entities first (e.g. &#8377; -> ₹, &trade; -> ™)
  let text = decodeHtmlEntities(markdown);

  // 2. Remove code blocks ```...```
  text = text.replace(/```[\s\S]*?```/g, " ");

  // 3. Process Markdown comparison tables
  // Replace rows with natural comma-separated lists of values
  const lines = text.split("\n");
  const processedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      // Check if it's a separator line (e.g. |:---|:---| or |---|)
      if (/^\|[\s:\-|]+\|$/.test(trimmed)) {
        continue;
      }
      // Extract cell values
      const cells = trimmed
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
      if (cells.length > 0) {
        processedLines.push(cells.join(", ") + ".");
      }
    } else {
      processedLines.push(line);
    }
  }

  text = processedLines.join("\n");

  // 4. Convert markdown links [Label](url) -> Label
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 5. Remove bare URLs
  text = text.replace(/https?:\/\/\S+/g, " ");

  // 6. Remove headings hashes (#, ##, ###)
  text = text.replace(/^#{1,6}\s+/gm, "");

  // 7. Remove blockquotes (> )
  text = text.replace(/^>\s+/gm, "");

  // 8. Remove bold and italic markers (**bold**, *italic*, __bold__, _italic_)
  text = text.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1");

  // 9. Remove inline code backticks (`code`)
  text = text.replace(/`([^`]+)`/g, "$1");

  // 10. Replace list bullets (-, *, •, 1.) with clean punctuation
  text = text.replace(/^[\s*•-]+\s+/gm, "");
  text = text.replace(/^\d+[.)]\s+/gm, "");

  // 11. Normalize currency based on language
  if (lang === "te-IN") {
    text = text.replace(/₹\s*([0-9,]+)/g, "$1 రూపాయలు");
    text = text.replace(/\bINR\s*([0-9,]+)/gi, "$1 రూపాయలు");
    text = text.replace(/\bRs\.?\s*([0-9,]+)/gi, "$1 రూపాయలు");
  } else {
    text = text.replace(/₹\s*([0-9,]+)/g, "Rupees $1");
    text = text.replace(/\bINR\s*([0-9,]+)/gi, "Rupees $1");
    text = text.replace(/\bRs\.?\s*([0-9,]+)/gi, "Rupees $1");
  }

  // 12. Expand technical acronyms and units for clearer speech
  text = text.replace(/\b(\d+)\s*GB\b/gi, "$1 gigabytes");
  text = text.replace(/\b(\d+)\s*TB\b/gi, "$1 terabytes");
  text = text.replace(/\b(\d+)\s*mAh\b/gi, "$1 milliamp hours");
  text = text.replace(/\b(\d+)\s*W\b/g, "$1 Watts");
  text = text.replace(/\b(\d+)\s*MP\b/gi, "$1 megapixels");
  text = text.replace(/\b(\d+)\s*Hz\b/gi, "$1 Hertz");
  text = text.replace(/\b(\d+)\s*kHz\b/gi, "$1 kilohertz");
  text = text.replace(/\bOLED\b/g, "O-L-E-D");
  text = text.replace(/\bAMOLED\b/g, "Am-O-L-E-D");
  text = text.replace(/\bDAC\b/g, "D-A-C");
  text = text.replace(/\bANC\b/g, "A-N-C");
  text = text.replace(/\bHDR\b/g, "H-D-R");

  // 13. Apply official brand pronunciation
  text = applyBrandPronunciation(text, lang);

  // 14. Strip any remaining table dashes or horizontal rules
  text = text.replace(/-{3,}/g, " ");

  // 15. Collapse redundant whitespace and newlines
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Returns the subset of voices compatible with the requested language.
 */
export function getVoicesForLanguage(
  voices: SpeechSynthesisVoice[],
  lang: SpeechLanguage = "en-IN"
): SpeechSynthesisVoice[] {
  if (!voices || voices.length === 0) return [];
  const targetOption = SUPPORTED_VOICE_LANGUAGES.find((opt) => opt.code === lang);
  if (!targetOption) return voices;

  return voices.filter((v) =>
    targetOption.voiceLangPrefixes.some((prefix) =>
      v.lang.toLowerCase().startsWith(prefix.toLowerCase())
    )
  );
}

/**
 * Finds the best matching SpeechSynthesisVoice for the requested language.
 * If preferredVoiceURI is provided and is compatible with the language, honors that choice.
 */
export function findMatchingVoice(
  voices: SpeechSynthesisVoice[],
  lang: SpeechLanguage = "en-IN",
  preferredVoiceURI?: string | null
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const targetOption = SUPPORTED_VOICE_LANGUAGES.find((opt) => opt.code === lang);

  // 1. If customer explicitly selected a voiceURI, verify language compatibility or use exact match
  if (preferredVoiceURI) {
    const selected = voices.find((v) => v.voiceURI === preferredVoiceURI);
    if (selected) {
      if (
        !targetOption ||
        targetOption.voiceLangPrefixes.some((p) =>
          selected.lang.toLowerCase().startsWith(p.toLowerCase())
        )
      ) {
        return selected;
      }
    }
  }

  if (!targetOption) return voices[0] || null;

  // 2. Try exact match on bcp47 code (e.g. "en-IN" or "te-IN")
  const exactMatch = voices.find(
    (v) => v.lang.toLowerCase() === targetOption.bcp47.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  // 3. Try prefix matches in priority order
  for (const prefix of targetOption.voiceLangPrefixes) {
    const prefixMatch = voices.find((v) =>
      v.lang.toLowerCase().startsWith(prefix.toLowerCase())
    );
    if (prefixMatch) return prefixMatch;
  }

  // 4. Fallback to default voice or first available voice
  const defaultVoice = voices.find((v) => v.default);
  return defaultVoice || voices[0] || null;
}

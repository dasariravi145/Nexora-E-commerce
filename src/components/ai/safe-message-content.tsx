"use client";

import * as React from "react";
import Link from "next/link";
import { products, getProductBySlug } from "@/data/products";
import type { Product } from "@/types";
import { ProductRecommendationCard } from "./product-recommendation-card";

export interface SafeMessageContentProps {
  content: string;
  isAssistant?: boolean;
  onNavigate?: () => void;
}

/**
 * Decodes safe textual HTML entities (e.g. &#x44; -> 'D', &#8377; -> '₹', &trade; -> '™').
 * Does not enable HTML injection because output is rendered strictly via React JSX text nodes,
 * never through unsafe innerHTML properties.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text || !text.includes("&")) {
    return text;
  }

  // 1. Numeric decimal entities (e.g., &#65; -> 'A', &#8377; -> '₹')
  let decoded = text.replace(/&#([0-9]{1,7});/g, (match, dec) => {
    try {
      const codePoint = parseInt(dec, 10);
      if (codePoint >= 0 && codePoint <= 0x10ffff) {
        return String.fromCodePoint(codePoint);
      }
    } catch {
      // Fallback to match
    }
    return match;
  });

  // 2. Numeric hexadecimal entities (e.g., &#x44; -> 'D', &#x20B9; -> '₹')
  decoded = decoded.replace(/&#x([0-9a-fA-F]{1,6});/g, (match, hex) => {
    try {
      const codePoint = parseInt(hex, 16);
      if (codePoint >= 0 && codePoint <= 0x10ffff) {
        return String.fromCodePoint(codePoint);
      }
    } catch {
      // Fallback to match
    }
    return match;
  });

  // 3. Common safe named entities
  const NAMED_ENTITIES: Record<string, string> = {
    "&quot;": '"',
    "&apos;": "'",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
    "&ndash;": "–",
    "&mdash;": "—",
    "&hellip;": "…",
    "&bull;": "•",
    "&nbsp;": " ",
    "&pound;": "£",
    "&yen;": "¥",
    "&euro;": "€",
    "&inr;": "₹",
  };

  decoded = decoded.replace(
    /&(?:quot|apos|amp|lt|gt|copy|reg|trade|ndash|mdash|hellip|bull|nbsp|pound|yen|euro|inr);/gi,
    (match) => NAMED_ENTITIES[match.toLowerCase()] ?? match
  );

  return decoded;
}

/**
 * Normalizes common escaped Markdown produced by Gemini and LLMs
 * (e.g. \*Trade-off:\*, \*Aura Micro-Core\*, \### Heading, \| Table \|).
 * Protects escaped backslashes (\\) while stripping unnecessary escape slashes before markdown syntax characters.
 */
export function normalizeMarkdown(text: string): string {
  if (!text) return "";

  // Decode safe HTML entities first
  let normalized = decodeHtmlEntities(text);

  // Preserve double-backslashes (\\) via temporary token
  const ESCAPED_BACKSLASH_TOKEN = "___NEXORA_ESCAPED_BS___";
  normalized = normalized.replace(/\\\\/g, ESCAPED_BACKSLASH_TOKEN);

  // Unescape backslashes before common markdown syntax characters:
  // * _ # | [ ] ( ) + - . ! > ~ `
  normalized = normalized.replace(/\\([*#_`~|[\]()+\-.!>])/g, "$1");

  // Restore double-backslashes as single literal backslash
  normalized = normalized.replaceAll(ESCAPED_BACKSLASH_TOKEN, "\\");

  return normalized;
}

/**
 * Parses inline formatting safely into React nodes without unsafe HTML injection.
 * Supports bold, italic, bold-italic, inline code, and verified internal product links.
 */
export function parseInlineText(text: string, onNavigate?: () => void): React.ReactNode[] {
  if (!text) return [];

  // Match:
  // 1. Formatted links: ***[label](url)***, **[label](url)**, *[label](url)*
  // 2. Inline code: `code`
  // 3. Markdown links: [label](url)
  // 4. Bare /products/[slug] paths
  // 5. Bold + Italic: ***text***
  // 6. Bold: **text**
  // 7. Italic: *text* (handles *Trade-off:*, *Aura Micro-Core*)
  // 8. Underscore bold: __text__
  // 9. Underscore italic: _text_
  const pattern =
    /(\*\*\*\[[^\]\n]+\]\([^)\n]+\)\*\*\*|\*\*\[[^\]\n]+\]\([^)\n]+\)\*\*|\*\[[^\]\n]+\]\([^)\n]+\)\*|`[^`\n]+`|\[[^\]\n]+\]\([^)\n]+\)|(?:https?:\/\/[^\s/]+)?\/products\/[a-zA-Z0-9_-]+|\*\*\*(?!\s)[^*\n]+?(?<!\s)\*\*\*|\*\*(?!\s)[^*\n]+?(?<!\s)\*\*|\*(?!\s)[^*\n]+?(?<!\s)\*|\b__(?!\s)[^_\n]+?(?<!\s)__\b|\b_(?!\s)[^_\n]+?(?<!\s)_\b)/g;

  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold + Italic Link: ***[label](url)***
    if (part.startsWith("***[") && part.endsWith("]***") && part.length > 8) {
      return (
        <strong key={index} className="font-semibold text-[#0F172A]">
          <em className="italic">{parseInlineText(part.slice(3, -3), onNavigate)}</em>
        </strong>
      );
    }

    // Bold Link: **[label](url)**
    if (part.startsWith("**[") && part.endsWith("]**") && part.length > 6) {
      return (
        <strong key={index} className="font-semibold text-[#0F172A]">
          {parseInlineText(part.slice(2, -2), onNavigate)}
        </strong>
      );
    }

    // Italic Link: *[label](url)*
    if (part.startsWith("*[") && part.endsWith("]*") && part.length > 4) {
      return (
        <em key={index} className="italic text-[#0F172A]">
          {parseInlineText(part.slice(1, -1), onNavigate)}
        </em>
      );
    }

    // Inline code: `content`
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={index}
          className="font-mono text-[11px] bg-[#EAF2FF] text-[#2563EB] px-1 py-0.5 rounded border border-[#E2E8F0]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Markdown link: [label](url)
    const mdLinkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (mdLinkMatch) {
      const [, label, url] = mdLinkMatch;
      const productPathMatch = url.match(/(?:https?:\/\/[^\s/]+)?\/products\/([a-zA-Z0-9_-]+)/i);
      if (productPathMatch) {
        const rawSlug = productPathMatch[1].toLowerCase().trim();
        const verifiedProduct =
          getProductBySlug(rawSlug) ||
          products.find((p) => p.slug.toLowerCase() === rawSlug);

        if (verifiedProduct) {
          return (
            <Link
              key={index}
              href={`/products/${verifiedProduct.slug}`}
              onClick={onNavigate}
              className="text-[#2563EB] hover:underline font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563EB] rounded-xs"
            >
              {parseInlineText(label, onNavigate)}
            </Link>
          );
        }
      }

      if (url.startsWith("/") && !url.startsWith("//")) {
        return (
          <Link
            key={index}
            href={url}
            onClick={onNavigate}
            className="text-[#2563EB] hover:underline font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563EB] rounded-xs"
          >
            {parseInlineText(label, onNavigate)}
          </Link>
        );
      }

      // Plain text fallback if external or unverified (blocks javascript:, data:, etc.)
      return <span key={index}>{parseInlineText(label, onNavigate)}</span>;
    }

    // Bold + Italic: ***content***
    if (part.startsWith("***") && part.endsWith("***") && part.length > 6) {
      return (
        <strong key={index} className="font-semibold text-[#0F172A]">
          <em className="italic">{parseInlineText(part.slice(3, -3), onNavigate)}</em>
        </strong>
      );
    }

    // Bold text: **content**
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-[#0F172A]">
          {parseInlineText(part.slice(2, -2), onNavigate)}
        </strong>
      );
    }

    // Bold text (underscore): __content__
    if (part.startsWith("__") && part.endsWith("__") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-[#0F172A]">
          {parseInlineText(part.slice(2, -2), onNavigate)}
        </strong>
      );
    }

    // Italic / Emphasis: *content* (e.g. *Trade-off:*, *Aura Micro-Core*)
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={index} className="italic text-[#0F172A]">
          {parseInlineText(part.slice(1, -1), onNavigate)}
        </em>
      );
    }

    // Italic / Emphasis (underscore): _content_
    if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
      return (
        <em key={index} className="italic text-[#0F172A]">
          {parseInlineText(part.slice(1, -1), onNavigate)}
        </em>
      );
    }

    // Bare /products/[slug] URL or full URL (strictly anchored from start to end)
    const bareMatch = part.match(/^(?:https?:\/\/[^\s/]+)?\/products\/([a-zA-Z0-9_-]+)$/i);
    if (bareMatch) {
      const rawSlug = bareMatch[1].toLowerCase().trim();
      const verifiedProduct =
        getProductBySlug(rawSlug) ||
        products.find((p) => p.slug.toLowerCase() === rawSlug);

      if (verifiedProduct) {
        return (
          <Link
            key={index}
            href={`/products/${verifiedProduct.slug}`}
            onClick={onNavigate}
            className="text-[#2563EB] hover:underline font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563EB] rounded-xs"
          >
            {verifiedProduct.name}
          </Link>
        );
      }
      return <span key={index}>{part}</span>;
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Checks if a line is a Markdown table separator (e.g. |:---|:---:|---:| or |---|---|).
 */
function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes("-")) return false;
  return /^\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?$/.test(trimmed);
}

/**
 * Splits a table line into cell values, trimming outer and inner whitespace.
 */
function parseTableCells(line: string): string[] {
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  return trimmed.split("|").map((c) => c.trim());
}

/**
 * Extracts alignment indicators from table separator row.
 */
function parseAlignments(separatorLine: string): ("left" | "center" | "right")[] {
  const cells = parseTableCells(separatorLine);
  return cells.map((cell) => {
    const hasLeftColon = cell.startsWith(":");
    const hasRightColon = cell.endsWith(":");
    if (hasLeftColon && hasRightColon) return "center";
    if (hasRightColon) return "right";
    return "left";
  });
}

/**
 * Extracts unique verified catalogue products referenced in the text.
 * Strictly deduplicates by canonical product.id so each verified product card
 * is rendered at most once per assistant response, regardless of how many times
 * it is linked or mentioned in the text.
 */
export function extractVerifiedProducts(text: string): Product[] {
  const normalizedText = normalizeMarkdown(text);
  const slugRegex = /(?:https?:\/\/[^\s/]+)?\/products\/([a-zA-Z0-9_-]+)/gi;
  const verifiedMap = new Map<string, Product>();
  let match: RegExpExecArray | null;

  while ((match = slugRegex.exec(normalizedText)) !== null) {
    const rawSlug = match[1];
    if (!rawSlug) continue;

    const normalizedSlug = rawSlug.toLowerCase().trim();
    const product =
      getProductBySlug(normalizedSlug) ||
      products.find((p) => p.slug.toLowerCase() === normalizedSlug);

    // Strictly deduplicate by canonical product.id
    if (product && !verifiedMap.has(product.id)) {
      verifiedMap.set(product.id, product);
    }
  }

  return Array.from(verifiedMap.values());
}

/**
 * Safe Message Content Renderer.
 * Zero dangerous HTML; structured paragraph, heading, list, and comparison table formatting
 * with verified product chips.
 */
export function SafeMessageContent({
  content,
  isAssistant = false,
  onNavigate,
}: SafeMessageContentProps) {
  // If user message, render as clean text with linebreaks and decoded entities
  if (!isAssistant) {
    return (
      <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white">
        {decodeHtmlEntities(content)}
      </div>
    );
  }

  // Preprocess assistant content (normalize escapes, decode safe entities)
  const normalizedContent = normalizeMarkdown(content);
  const lines = normalizedContent.split("\n");
  const elements: React.ReactNode[] = [];

  let currentBulletList: React.ReactNode[] = [];
  let currentOrderedList: React.ReactNode[] = [];

  const flushLists = (keySuffix: string | number) => {
    if (currentBulletList.length > 0) {
      elements.push(
        <ul key={`ul-${keySuffix}`} className="my-2 space-y-1 pl-0.5">
          {currentBulletList}
        </ul>
      );
      currentBulletList = [];
    }
    if (currentOrderedList.length > 0) {
      elements.push(
        <ol key={`ol-${keySuffix}`} className="my-2 space-y-1 pl-0.5">
          {currentOrderedList}
        </ol>
      );
      currentOrderedList = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Blank line -> flush any active list
    if (!trimmed) {
      flushLists(i);
      i++;
      continue;
    }

    // 2. Table detection: Check if current line + next line form a valid markdown table
    if (trimmed.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      flushLists(i);
      const headers = parseTableCells(trimmed);
      const alignments = parseAlignments(lines[i + 1]);
      const rows: string[][] = [];

      i += 2; // Advance past header and separator rows
      while (i < lines.length) {
        const nextTrimmed = lines[i].trim();
        if (!nextTrimmed || !nextTrimmed.includes("|")) {
          break;
        }
        rows.push(parseTableCells(nextTrimmed));
        i++;
      }

      const alignClasses: Record<string, string> = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      };

      elements.push(
        <div
          key={`table-${i}`}
          tabIndex={0}
          role="region"
          aria-label="Product comparison table"
          className="my-2.5 overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-2xs max-w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563EB]"
        >
          <table className="w-full min-w-[280px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#CBD5E1] bg-[#F1F5F9]/90">
                {headers.map((header, hIdx) => {
                  const align = alignments[hIdx] || "left";
                  return (
                    <th
                      key={hIdx}
                      scope="col"
                      className={`px-3 py-2 text-[11px] font-semibold text-[#0F172A] whitespace-nowrap ${alignClasses[align]}`}
                    >
                      {parseInlineText(header, onNavigate)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={
                    rIdx % 2 === 0
                      ? "bg-white hover:bg-blue-50/30 transition-colors"
                      : "bg-[#F8FAFC]/80 hover:bg-blue-50/30 transition-colors"
                  }
                >
                  {row.map((cell, cIdx) => {
                    const align = alignments[cIdx] || "left";
                    const isFirstCol = cIdx === 0;
                    return (
                      <td
                        key={cIdx}
                        className={`px-3 py-2 text-xs text-[#334155] ${
                          align === "left" && isFirstCol
                            ? "font-medium text-[#0F172A]"
                            : ""
                        } ${alignClasses[align]}`}
                      >
                        {parseInlineText(cell, onNavigate)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // 3. Headings: # through ######
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushLists(i);
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];

      if (level === 1) {
        elements.push(
          <h1
            key={`h1-${i}`}
            className="text-sm font-bold text-[#09152B] tracking-tight mt-3 mb-1.5 pb-1 border-b border-slate-200/80"
          >
            {parseInlineText(headingText, onNavigate)}
          </h1>
        );
      } else if (level === 2) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className="text-sm font-semibold text-[#09152B] tracking-tight mt-2.5 mb-1"
          >
            {parseInlineText(headingText, onNavigate)}
          </h2>
        );
      } else if (level === 3) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-xs font-semibold text-[#0F172A] tracking-wide mt-2 mb-1"
          >
            {parseInlineText(headingText, onNavigate)}
          </h3>
        );
      } else {
        elements.push(
          <h4
            key={`h4-${i}`}
            className="text-xs font-medium text-[#1E293B] mt-1.5 mb-0.5"
          >
            {parseInlineText(headingText, onNavigate)}
          </h4>
        );
      }
      i++;
      continue;
    }

    // 4. Bullet lists: * or - or • or +
    const bulletMatch = trimmed.match(/^[*•\-+]\s+(.*)$/);
    if (bulletMatch) {
      if (currentOrderedList.length > 0) {
        flushLists(`ol-before-ul-${i}`);
      }
      currentBulletList.push(
        <li key={`li-${i}`} className="flex items-start gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0"
            aria-hidden="true"
          />
          <span className="flex-1 leading-relaxed">
            {parseInlineText(bulletMatch[1], onNavigate)}
          </span>
        </li>
      );
      i++;
      continue;
    }

    // 5. Ordered lists: 1. or 1)
    const orderedMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (orderedMatch) {
      if (currentBulletList.length > 0) {
        flushLists(`ul-before-ol-${i}`);
      }
      const num = orderedMatch[1];
      currentOrderedList.push(
        <li key={`oli-${i}`} className="flex items-start gap-2">
          <span className="font-mono text-[11px] font-semibold text-[#2563EB] mt-0.5 w-4 shrink-0 text-right">
            {num}.
          </span>
          <span className="flex-1 leading-relaxed">
            {parseInlineText(orderedMatch[2], onNavigate)}
          </span>
        </li>
      );
      i++;
      continue;
    }

    // 6. Normal paragraph line
    flushLists(i);
    elements.push(
      <p key={`p-${i}`} className="my-1.5 leading-relaxed">
        {parseInlineText(trimmed, onNavigate)}
      </p>
    );
    i++;
  }

  // Flush any remaining list items at the end
  flushLists("end");

  // Identify any verified products explicitly mentioned in the response
  const verifiedProducts = extractVerifiedProducts(content);

  return (
    <div className="text-xs sm:text-sm text-[#0F172A] break-words">
      <div className="space-y-1">{elements}</div>

      {/* Render Verified Product Recommendation Cards (Strictly Deduplicated: 1 card per verified product) */}
      {verifiedProducts.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-[#E2E8F0]">
          <p className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#475569] mb-1.5 flex items-center justify-between">
            <span>
              Verified Catalogue Specimen{verifiedProducts.length > 1 ? "s" : ""}:
            </span>
            <span className="text-[9px] font-normal text-[#64748B]">
              Direct Catalogue Navigation
            </span>
          </p>
          <div className="space-y-1.5">
            {verifiedProducts.map((prod) => (
              <ProductRecommendationCard
                key={prod.id}
                product={prod}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

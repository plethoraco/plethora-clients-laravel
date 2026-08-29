import type { SignatureValues } from "./types";

const OPTIONAL_BLOCKS = ["phone", "ddi"] as const;

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function withLineBreaks(value: string): string {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, "<br />");
}

function stripTag(html: string, tag: string): string {
  return html
    .replace(new RegExp(`<\\/${tag}>`, "gi"), "")
    .replace(new RegExp(`<${tag}[^>]*>`, "gi"), "");
}

function processOptionalBlock(
  html: string,
  field: (typeof OPTIONAL_BLOCKS)[number],
  value: string | undefined,
): string {
  const block = `${field}Block`;
  if (!value) {
    return html.replace(new RegExp(`<${block}>[\\s\\S]*?<\\/${block}>`, "gi"), "");
  }
  return stripTag(html, block);
}

export function minifySignatureHtml(html: string): string {
  return html
    .replace(/>[^\S ]+/g, ">")
    .replace(/[^\S ]+</g, "<")
    .replace(/(\s)+/g, "$1")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}

export function generateSignature(
  sourceTemplate: string,
  values: SignatureValues,
  uppercaseName = false,
): string {
  let html = stripTag(sourceTemplate, "body");

  for (const field of OPTIONAL_BLOCKS) {
    html = processOptionalBlock(html, field, values[field]);
  }

  const replacements: Record<string, string> = {
    ...values,
    name: uppercaseName ? values.name.toUpperCase() : values.name,
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(`{${key}}`, withLineBreaks(value ?? ""));
  }

  return minifySignatureHtml(html);
}

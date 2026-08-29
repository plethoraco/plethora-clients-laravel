import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { escapeHtml, generateSignature } from "../src/core/generate-signature";
import type { SignatureValues } from "../src/core/types";

const publicPath = (...segments: string[]): string => resolve(import.meta.dirname, "..", "public", ...segments);
const template = (...segments: string[]): string => readFileSync(publicPath(...segments), "utf8");

const baseValues: SignatureValues = {
  template: "1",
  name: "André O'Connor",
  title: "Director & Adviser",
  email: "andre@example.com",
  phone: "021 555 0101",
  ddi: "09 555 0102",
  address: "First floor\nAuckland",
  imageUrl: "https://clients.plethora.co/3group/templates/1/images",
};

describe("signature generation", () => {
  it("escapes user-entered HTML", () => {
    expect(escapeHtml(`<script>"x" & 'y'</script>`)).toBe(
      "&lt;script&gt;&quot;x&quot; &amp; &#039;y&#039;&lt;/script&gt;",
    );
  });

  it("retains the established 3Group formatting and canonical image URL", () => {
    const html = generateSignature(
      template("3group", "templates", "1", "main.html"),
      baseValues,
      true,
    );

    expect(html).toContain("ANDRÉ O&#039;CONNOR");
    expect(html).toContain("Director &amp; Adviser");
    expect(html).toContain(`${baseValues.imageUrl}/logo-3group.png`);
    expect(html).toContain("DDI:");
    expect(html).not.toMatch(/\{[a-z]+\}/i);
  });

  it("removes an empty multiline DDI block from the B3 template", () => {
    const html = generateSignature(
      template("3group", "templates", "3", "main.html"),
      { ...baseValues, template: "3", ddi: "" },
      false,
    );

    expect(html).not.toContain("<ddiBlock>");
    expect(html).not.toContain("tel:09 555 0102");
    expect(html).toContain("André O&#039;Connor");
  });

  it("removes an empty optional mobile number from a TCC template", () => {
    const html = generateSignature(
      template("tcc", "signature-builder", "templates", "2", "main.html"),
      {
        ...baseValues,
        template: "2",
        phone: "",
        imageUrl: "https://clients.plethora.co/tcc/signature-builder/templates/2/images",
      },
    );

    expect(html).not.toContain("<phoneBlock>");
    expect(html).not.toContain("<span style=\"font-weight: bold;\">M</span>");
    expect(html).toContain("First floor<br />Auckland");
  });
});

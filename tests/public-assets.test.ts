import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..", "public");

const permanentPublicAssets = [
  "3group/templates/1/images/logo-3group.png",
  "3group/templates/2/images/logo-a3.png",
  "3group/templates/3/images/logo-b3.png",
  "3group/templates/3/images/logo-b3-interiors.png",
  "3group/templates/4/images/logo-c3.png",
  "3group/templates/5/images/logo-d3.png",
  "3group/templates/6/images/logo-3capital.png",
  "tcc/signature-builder/templates/1/images/cullinary-collective-logo.png",
  "tcc/signature-builder/templates/2/images/nzcom-logos.png",
  "tcc/signature-builder/templates/3/images/nzios-logos.png",
  "tcc/signature-builder/templates/4/images/nzma-logos.png",
  "tcc/signature-builder/templates/5/images/all-logos-tcl.png",
  "tcc/signature-builder/templates/5/images/all-logos-nzis.png",
  "tcc/signature-builder/templates/5/images/all-logos-nzcm.png",
  "tcc/signature-builder/templates/5/images/all-logos-nzma.png",
  "tcc/signature-builder/templates/5/images/all-logos-up.png",
  "tcc/signature-builder/templates/5/images/all-logos.png",
  "tcc/signature-builder/uploads/photo-5cc64eb4223fe.png",
] as const;

describe("permanent public URLs", () => {
  it.each(permanentPublicAssets)("retains /%s", (relativePath) => {
    expect(existsSync(resolve(root, relativePath))).toBe(true);
  });

  it("uses the canonical hostname in hard-coded template URLs", () => {
    const culinaryTemplate = readFileSync(
      resolve(root, "tcc/signature-builder/templates/1/main.html"),
      "utf8",
    );
    expect(culinaryTemplate).toContain("https://clients.plethora.co/");
  });
});

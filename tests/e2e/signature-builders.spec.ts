import { expect, test, type Page } from "@playwright/test";
import { threeGroupConfig } from "../../src/clients/3group";
import { tccConfig } from "../../src/clients/tcc";

const clients = [
  { path: "/3group/", config: threeGroupConfig },
  { path: "/tcc/signature-builder/", config: tccConfig },
] as const;

async function createSignature(page: Page, path: string, brandId: string): Promise<string> {
  await page.goto(path);
  await page.getByLabel(/Brand \*|School \*/).selectOption(brandId);
  await page.getByLabel("Name *").fill("Andre O'Connor");
  await page.getByLabel("Title *").fill("Director & Adviser");

  const email = page.getByLabel("Email *");
  if (!(await email.isEditable())) {
    await expect(email).toHaveValue(/andre\.o'connor@.+/);
  } else {
    await email.fill("andre@example.com");
  }

  const mobile = page.getByLabel(/^Mobile/);
  await mobile.fill("021 555 0101");

  const ddi = page.getByLabel("DDI");
  if (await ddi.count()) {
    await ddi.fill("09 555 0102");
  }

  await page.getByRole("button", { name: "Create signature" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Signature created." })).toBeVisible();
  await expect(page.getByRole("region", { name: "Install your signature" })).toBeVisible();

  return page.locator("#signature-code").inputValue();
}

test.describe("every customer template", () => {
  for (const client of clients) {
    for (const brand of client.config.brands) {
      test(`${client.config.title}: ${brand.name}`, async ({ page }) => {
        const html = await createSignature(page, client.path, brand.id);

        expect(html).toContain(
          `https://clients.plethora.co${client.config.basePath}/templates/${brand.id}/images`,
        );
        expect(html).not.toMatch(/\{[a-z]+\}/i);
        expect(html).toMatch(/Andre O&#039;Connor/i);
      });
    }
  }
});

test("switches between Outlook, Gmail, and Apple Mail instructions", async ({ page }) => {
  await createSignature(page, "/3group/", "1");

  for (const name of ["Outlook", "Gmail", "Apple Mail"] as const) {
    const tab = page.getByRole("tab", { name });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(".instruction-panel").filter({ has: page.getByRole("heading", { name }) })).toBeVisible();
  }
});

test("copies code and rich signatures to the clipboard", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const html = await createSignature(page, "/3group/", "1");

  await page.getByRole("button", { name: "Copy signature HTML" }).click();
  await expect(page.getByText("Copied.")).toBeVisible();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(html);

  for (const application of ["Gmail", "Apple Mail"] as const) {
    await page.getByRole("tab", { name: application }).click();
    await page.getByRole("button", { name: "Copy signature", exact: true }).click();
    await expect(page.locator(".instruction-panel:visible .copy-status")).toHaveText("Copied.");

    const clipboardHtml = await page.evaluate(async () => {
      const items = await navigator.clipboard.read();
      const item = items.find(({ types }) => types.includes("text/html"));
      return item ? (await item.getType("text/html")).text() : "";
    });
    expect(clipboardHtml).toContain("clients.plethora.co/3group/templates/1/images/logo-3group.png");
  }
});

test("every image referenced by every generated builder returns an image response", async ({ page, request }) => {
  const paths = new Set<string>();

  for (const client of clients) {
    for (const brand of client.config.brands) {
      await createSignature(page, client.path, brand.id);
      const sources = await page.locator("img").evaluateAll((images) =>
        images.map((image) => (image as HTMLImageElement).src),
      );
      for (const source of sources) paths.add(new URL(source).pathname);
    }
  }

  expect(paths.size).toBeGreaterThan(20);
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.ok(), `${path} returned ${response.status()}`).toBe(true);
    expect(response.headers()["content-type"], path).toMatch(/^image\//);
  }
});

test.describe("mobile layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const client of clients) {
    test(`${client.config.title} fits a phone viewport`, async ({ page }) => {
      await createSignature(page, client.path, client.config.brands[0]!.id);

      const layout = await page.evaluate(() => {
        const grid = document.querySelector<HTMLElement>(".form-grid");
        const pageShell = document.querySelector<HTMLElement>(".page-shell");
        return {
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          gridColumns: grid ? getComputedStyle(grid).gridTemplateColumns.split(" ").length : 0,
          shellRight: pageShell?.getBoundingClientRect().right ?? Infinity,
          minimumControlHeight: Math.min(
            ...Array.from(document.querySelectorAll<HTMLElement>("input, select, button"))
              .filter(({ offsetHeight }) => offsetHeight > 0)
              .map(({ offsetHeight }) => offsetHeight),
          ),
        };
      });

      expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
      expect(layout.gridColumns).toBe(1);
      expect(layout.shellRight).toBeLessThanOrEqual(layout.viewportWidth);
      expect(layout.minimumControlHeight).toBeGreaterThanOrEqual(42);
    });
  }
});

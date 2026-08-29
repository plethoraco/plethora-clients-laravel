import { generateSignature } from "./generate-signature";
import type { Brand, ClientConfig, SignatureValues } from "./types";

const CANONICAL_ORIGIN = "https://clients.plethora.co";

function option(value: string, label: string): string {
  const element = document.createElement("option");
  element.value = value;
  element.textContent = label;
  return element.outerHTML;
}

function input(form: HTMLFormElement, name: string): HTMLInputElement {
  const element = form.elements.namedItem(name);
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Missing input: ${name}`);
  }
  return element;
}

function select(form: HTMLFormElement, name: string): HTMLSelectElement {
  const element = form.elements.namedItem(name);
  if (!(element instanceof HTMLSelectElement)) {
    throw new Error(`Missing select: ${name}`);
  }
  return element;
}

function selectedBrand(config: ClientConfig, brandId: string): Brand {
  const brand = config.brands.find(({ id }) => id === brandId);
  if (!brand) {
    throw new Error("Please choose a valid brand.");
  }
  return brand;
}

function emailFromName(name: string, domain: string): string {
  const localPart = name.toLowerCase().trim().replace(/\s+/g, ".");
  return localPart && domain ? `${localPart}@${domain}` : "";
}

async function fetchTemplate(
  config: ClientConfig,
  brandId: string,
  variant: "main" | "minimal",
): Promise<string | null> {
  const path = `${config.basePath}/templates/${brandId}/${variant}.html`;
  const response = await fetch(path);
  return response.ok ? response.text() : null;
}

function outlookSteps(basePath: string): string {
  return `
    <ol>
      <li>Copy the signature HTML above.</li>
      <li>In Outlook, open <em>File</em> → <em>Options</em> → <em>Mail</em> → <em>Signatures…</em></li>
      <li>Create a blank signature and close the editor.<br><img src="${basePath}/img/outlook-signature-window.png" alt="Outlook signature window"></li>
      <li>Open <em>Signatures…</em> again while holding <em>Ctrl</em> to open the signatures folder.<br><img src="${basePath}/img/outlook-open-folder.png" alt="Outlook signatures folder"></li>
      <li>Open the new <em>.htm</em> signature file in a text editor.<br><img src="${basePath}/img/outlook-edit-menu.png" alt="Outlook edit menu"></li>
      <li>Replace everything between the <em>&lt;body&gt;</em> and <em>&lt;/body&gt;</em> tags with the copied HTML.<br><img src="${basePath}/img/outlook-body-tag.png" alt="Outlook body tag"></li>
      <li>Save the file and close Outlook Options.</li>
    </ol>`;
}

function appMarkup(config: ClientConfig): string {
  const brandOptions = config.brands.map(({ id, name }) => option(id, name)).join("");
  const phoneRequired = config.phoneRequired ? "required" : "";
  const emailReadonly = config.autoGenerateEmail ? "readonly" : "";

  return `
    <div class="page-shell">
      <header class="page-header">
        <p class="eyebrow">Email signatures</p>
        <h1>${config.title}</h1>
      </header>

      <section class="card form-card" aria-labelledby="details-heading">
        <div class="section-heading">
          <span>01</span>
          <div><h2 id="details-heading">Your details</h2><p>Fields marked with an asterisk are required.</p></div>
        </div>
        <form id="signature-form">
          <div class="form-grid">
            <label><span>${config.brandLabel} *</span><select name="template" required>${brandOptions}</select></label>
            <label><span>Name *</span><input name="name" type="text" maxlength="50" autocomplete="name" required></label>
            <label><span>Title *</span><input name="title" type="text" maxlength="80" autocomplete="organization-title" required></label>
            <label><span>Email *</span><input name="email" type="email" maxlength="100" autocomplete="email" ${emailReadonly} required></label>
            <label><span>Mobile${config.phoneRequired ? " *" : ""}</span><input name="phone" type="tel" maxlength="50" autocomplete="tel" ${phoneRequired}></label>
            ${config.ddiEnabled ? '<label><span>DDI</span><input name="ddi" type="tel" maxlength="50" placeholder="Optional"></label>' : ""}
            <label id="address-field" hidden><span>Address *</span><select name="address"></select></label>
          </div>
          <div class="form-actions">
            <button class="primary-button" type="submit">Create signature</button>
            <p id="form-status" class="status" role="status" aria-live="polite"></p>
          </div>
        </form>
      </section>

      <section id="results" class="card results-card" aria-labelledby="results-heading" hidden>
        <div class="section-heading">
          <span>02</span>
          <div><h2 id="results-heading">Install your signature</h2><p>Choose your email application and follow the steps.</p></div>
        </div>
        <div class="tabs" role="tablist" aria-label="Email application">
          <button type="button" role="tab" aria-selected="true" data-panel="outlook">Outlook</button>
          <button type="button" role="tab" aria-selected="false" data-panel="gmail">Gmail</button>
          <button type="button" role="tab" aria-selected="false" data-panel="mac">Apple Mail</button>
        </div>

        <section class="instruction-panel" data-panel-content="outlook">
          <h3>Outlook</h3>
          <div class="preview-frame"><div id="outlook-preview"></div></div>
          <div class="copy-row">
            <button class="secondary-button" type="button" data-copy-code>Copy signature HTML</button>
            <span class="copy-status" role="status" aria-live="polite"></span>
          </div>
          <details><summary>View signature HTML</summary><textarea id="signature-code" class="code" readonly spellcheck="false"></textarea></details>
          ${outlookSteps(config.basePath)}
        </section>

        <section class="instruction-panel" data-panel-content="gmail" hidden>
          <h3>Gmail</h3>
          <div class="preview-frame"><div id="gmail-preview"></div></div>
          <div class="copy-row">
            <button class="secondary-button" type="button" data-copy-rich="gmail-preview">Copy signature</button>
            <span class="copy-status" role="status" aria-live="polite"></span>
          </div>
          <ol>
            <li>Copy the signature above.</li>
            <li>Open <a href="https://mail.google.com/mail/u/0/#settings/general" target="_blank" rel="noreferrer">Gmail general settings</a>.</li>
            <li>Paste it into the signature editor and save your changes.<br><img src="${config.basePath}/img/gmail-signature-box.png" alt="Gmail signature editor"></li>
          </ol>
        </section>

        <section class="instruction-panel" data-panel-content="mac" hidden>
          <h3>Apple Mail</h3>
          <div class="preview-frame"><div id="mac-preview"></div></div>
          <div class="copy-row">
            <button class="secondary-button" type="button" data-copy-rich="mac-preview">Copy signature</button>
            <span class="copy-status" role="status" aria-live="polite"></span>
          </div>
          <ol>
            <li>Copy the signature above.</li>
            <li>Open Mail → Settings → Signatures and add a new signature.</li>
            <li>Paste into the editor and turn off “Always match my default message font.”<br><img src="${config.basePath}/img/mac-mail-preferences.png" alt="Apple Mail signature settings"></li>
          </ol>
        </section>
      </section>
    </div>`;
}

function selectNodeContents(element: HTMLElement): void {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

async function copyRichHtml(element: HTMLElement, html: string): Promise<void> {
  if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
    const plainText = element.innerText;
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plainText], { type: "text/plain" }),
      }),
    ]);
    return;
  }

  selectNodeContents(element);
  if (!document.execCommand("copy")) {
    throw new Error("Copy was not available in this browser.");
  }
}

function setCopyStatus(button: HTMLButtonElement, message: string, isError = false): void {
  const status = button.parentElement?.querySelector<HTMLElement>(".copy-status");
  if (status) {
    status.textContent = message;
    status.classList.toggle("error", isError);
  }
}

export function mountSignatureBuilder(config: ClientConfig): void {
  const root = document.querySelector<HTMLElement>("#app");
  if (!root) {
    throw new Error("Missing application root.");
  }
  root.innerHTML = appMarkup(config);

  const form = root.querySelector<HTMLFormElement>("#signature-form");
  const results = root.querySelector<HTMLElement>("#results");
  const status = root.querySelector<HTMLElement>("#form-status");
  const addressField = root.querySelector<HTMLElement>("#address-field");
  const code = root.querySelector<HTMLTextAreaElement>("#signature-code");
  const outlookPreview = root.querySelector<HTMLElement>("#outlook-preview");
  const gmailPreview = root.querySelector<HTMLElement>("#gmail-preview");
  const macPreview = root.querySelector<HTMLElement>("#mac-preview");

  if (!form || !results || !status || !addressField || !code || !outlookPreview || !gmailPreview || !macPreview) {
    throw new Error("The signature builder could not be initialised.");
  }

  const brandSelect = select(form, "template");
  const addressSelect = select(form, "address");
  const nameInput = input(form, "name");
  const emailInput = input(form, "email");

  const updateEmail = (): void => {
    if (!config.autoGenerateEmail) return;
    const brand = selectedBrand(config, brandSelect.value);
    emailInput.value = emailFromName(nameInput.value, brand.domain ?? "");
  };

  const updateAddresses = (): void => {
    const brand = selectedBrand(config, brandSelect.value);
    const addresses = brand.addresses ?? [];
    addressSelect.innerHTML = addresses.map(({ address, name }) => option(address, name)).join("");
    addressSelect.required = addresses.length > 0;
    addressField.hidden = addresses.length === 0;
  };

  nameInput.addEventListener("input", updateEmail);
  brandSelect.addEventListener("change", () => {
    updateEmail();
    updateAddresses();
  });
  updateAddresses();

  root.querySelectorAll<HTMLButtonElement>("[role=tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.panel;
      root.querySelectorAll<HTMLButtonElement>("[role=tab]").forEach((candidate) => {
        candidate.setAttribute("aria-selected", String(candidate === tab));
      });
      root.querySelectorAll<HTMLElement>("[data-panel-content]").forEach((panel) => {
        panel.hidden = panel.dataset.panelContent !== target;
      });
    });
  });

  let generatedMainHtml = "";
  let generatedMinimalHtml = "";

  root.querySelector<HTMLButtonElement>("[data-copy-code]")?.addEventListener("click", async (event) => {
    const button = event.currentTarget as HTMLButtonElement;
    try {
      await navigator.clipboard.writeText(generatedMainHtml);
      setCopyStatus(button, "Copied.");
    } catch {
      code.focus();
      code.select();
      setCopyStatus(button, "Select the code and copy it manually.", true);
    }
  });

  root.querySelectorAll<HTMLButtonElement>("[data-copy-rich]").forEach((button) => {
    button.addEventListener("click", async () => {
      const targetId = button.dataset.copyRich;
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;
      const html = targetId === "mac-preview" ? generatedMinimalHtml : generatedMainHtml;
      try {
        await copyRichHtml(target, html);
        setCopyStatus(button, "Copied.");
      } catch (error) {
        selectNodeContents(target);
        setCopyStatus(button, error instanceof Error ? error.message : "Select and copy the preview manually.", true);
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Creating your signature…";
    status.classList.remove("error");

    try {
      const brand = selectedBrand(config, brandSelect.value);
      const mainTemplate = await fetchTemplate(config, brand.id, "main");
      if (!mainTemplate) throw new Error("The selected signature template could not be loaded.");
      const minimalTemplate = config.minimalTemplateBrands.includes(brand.id)
        ? (await fetchTemplate(config, brand.id, "minimal")) ?? mainTemplate
        : mainTemplate;

      const values: SignatureValues = {
        template: brand.id,
        name: nameInput.value,
        title: input(form, "title").value,
        email: emailInput.value,
        phone: input(form, "phone").value,
        ddi: config.ddiEnabled ? input(form, "ddi").value : "",
        address: brand.addresses ? addressSelect.value : "",
        imageUrl: `${CANONICAL_ORIGIN}${config.basePath}/templates/${brand.id}/images`,
      };

      generatedMainHtml = generateSignature(mainTemplate, values, config.uppercaseName(brand.id));
      generatedMinimalHtml = generateSignature(minimalTemplate, values, config.uppercaseName(brand.id));

      outlookPreview.innerHTML = generatedMainHtml;
      gmailPreview.innerHTML = generatedMainHtml;
      macPreview.innerHTML = generatedMinimalHtml;
      code.value = generatedMainHtml;
      results.hidden = false;
      status.textContent = "Signature created.";
      results.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "Your signature could not be created.";
      status.classList.add("error");
    }
  });
}

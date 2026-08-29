# Plethora client tools

Static, browser-based tools hosted at `https://clients.plethora.co`.

The repository currently provides:

- `/3group/` — 3Group email signature builder
- `/tcc/signature-builder/` — UP Education email signature builder
- The existing template image paths used by installed email signatures

There is no application server, database, or persistent storage. Vite builds the TypeScript interface and Cloudflare Workers Static Assets serves the output.

## Local development

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Run all checks:

```bash
npm run verify
```

This performs a strict TypeScript check, unit and public-asset compatibility tests, a production build, and a Wrangler dry run.

## Public URL contract

Files below these directories may be embedded in emails and must not be renamed or removed:

```text
public/3group/templates/*/images/*
public/tcc/signature-builder/templates/*/images/*
public/tcc/signature-builder/uploads/*
```

The builder always emits image URLs on `https://clients.plethora.co`, including when it is running on a preview URL.

## Deployment

See [Cloudflare migration and deployment](docs/cloudflare-deployment.md).

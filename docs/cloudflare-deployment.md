# Cloudflare migration and deployment

## Git structure

- `laravel-production-final` is the annotated tag for the last Laravel production revision.
- `cloudflare-migration` contains the static rewrite and is merged through a pull request.
- `master` remains the production branch. Rename it separately, after the hosting migration, if desired.

## Cloudflare setup

The project is a static-assets-only Worker. `wrangler.jsonc` contains a production environment whose custom domain is `clients.plethora.co`.

Before the first production deployment:

1. Add `plethora.co` as an active zone in the intended Cloudflare account.
2. Create a scoped API token that can deploy Workers and manage the required Worker route/custom domain.
3. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions secrets.
4. Protect the GitHub `production` environment if deployment approval is desired.
5. Confirm the current `clients.plethora.co` DNS record and reduce its TTL before cutover.

The production workflow is manual so merging code cannot unexpectedly move the custom domain. Start it from GitHub Actions after the cutover checks are complete.

## Preview

After authenticating Wrangler locally, deploy the root Worker without the production environment:

```bash
npm run build
npx wrangler deploy
```

This publishes the preview/root Worker without attaching `clients.plethora.co`. Signature HTML still points at the production hostname, so previewing cannot accidentally install `workers.dev` image URLs.

## Pre-cutover checks

1. Run `npm run verify`.
2. Test every brand and school in the preview deployment.
3. Paste representative signatures into current Outlook, Gmail, and Apple Mail clients.
4. Verify every path covered by `tests/public-assets.test.ts` on the preview deployment.
5. Compare generated HTML with representative output captured from the Laravel application.
6. Confirm the existing DNS record can be replaced by a Worker Custom Domain. Cloudflare cannot attach a Custom Domain while a conflicting CNAME remains.

## Cutover

1. Keep the existing Render service running.
2. Merge `cloudflare-migration` into `master`.
3. Start and monitor the production GitHub Actions deployment.
4. Attach/verify `clients.plethora.co` and remove its conflicting legacy DNS record when prompted.
5. Check both builder pages, all permanent image paths, redirects from `index.php`, and response headers.
6. Monitor requests and errors before decommissioning Render.

## Rollback

The quickest rollback is infrastructure-only: restore the previous `clients.plethora.co` DNS/origin configuration while leaving Render running. The exact old code is retained by the `laravel-production-final` tag.

Do not delete the Cloudflare deployment during a rollback. Keeping it intact makes diagnosis and a second cutover safer.

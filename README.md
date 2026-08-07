# Shipment Board — free hosting on Cloudflare Pages

This is the same dashboard, restructured to run as a real website for free:

- `public/index.html` — the dashboard (unchanged UI/behavior)
- `functions/api/board.js` — a Cloudflare Pages Function that reads/writes the board data, gated by a PIN
- No `window.storage` (that's Claude-only) — replaced with `fetch("/api/board")` calls, and Cloudflare **Workers KV** for storage

**Cost: $0.** Cloudflare Pages, Pages Functions, and Workers KV are all free at this scale — no credit card required to sign up.

---

## 1. Create a free Cloudflare account

[dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) — just an email, no card needed.

## 2. Push this folder to GitHub

```bash
cd shipment-board-app
git init
git add .
git commit -m "Shipment board"
git remote add origin <your-repo-url>
git push -u origin main
```

(Private repo is fine.)

## 3. Create a Workers KV namespace (this is where board data is stored)

1. Cloudflare dashboard → **Workers & Pages** → **KV** → **Create a namespace**
2. Name it something like `shipment-board` → Create

## 4. Create the Pages project

1. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Pick your repo
3. Build settings:
   - Framework preset: **None**
   - Build command: *(leave blank)*
   - Build output directory: `public`
4. Deploy — you'll get a free URL like `https://shipment-board-xyz.pages.dev`

## 5. Bind the KV namespace and set your PIN

Back in the Pages project → **Settings** → **Functions**:

1. Under **KV namespace bindings** → Add binding:
   - Variable name: `BOARD_KV`
   - KV namespace: the one you created in step 3
2. Go to **Settings** → **Environment variables** → Add variable:
   - Name: `BOARD_PIN`
   - Value: whatever PIN you want your team to use (e.g. `4471`)
   - Click the "Encrypt" option so it's stored as a secret

Redeploy (Pages → Deployments → ⋯ → Retry deployment) so the new bindings take effect.

## 6. Test it

Visit your `.pages.dev` URL. You'll see a PIN screen — enter the PIN from step 5, and the board loads. Share the URL + PIN with your team.

---

### Notes

- **This is basic protection, not real authentication.** Anyone with the URL and PIN can view and edit — fine for a small trusted team, not appropriate if you need per-user accounts, audit logs, or to guarantee only specific individuals get in. If you ever need that, that's the Entra ID / Azure path we scoped earlier (paid, ~$9/mo, restricted to your company's actual Microsoft logins).
- **Custom domain**: Pages → your project → **Custom domains** — free to attach a domain you own (e.g. `dispatch.yourcompany.com`).
- **Changing the PIN later**: just update the `BOARD_PIN` environment variable and redeploy. Anyone with an old PIN cached in their browser will be prompted again the next time their session storage clears (or you can just tell them the new one).
- **Local testing**: `npx wrangler pages dev public` runs it locally (needs [Node.js](https://nodejs.org) and the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/), both free).

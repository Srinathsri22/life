# srinath.is-a.dev

A personal log: one hundred things to do, a journal of book notes and memories,
places visited, and a lab of hobby builds.

Static site, no database, no paid services. Content is Markdown in this repo,
edited through a browser admin at `/admin/`. Photos live on Cloudinary.

- **Framework:** Astro 5 (static output, almost no client JavaScript)
- **Admin:** Sveltia CMS at `/admin/` — commits Markdown straight to this repo
- **Photos:** Cloudinary free tier
- **Hosting:** Cloudflare Pages, deployed on every push to `main`
- **Domain:** `srinath.is-a.dev`, free via the is-a.dev registry

## Running it locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Setup, once

### 1. Push to GitHub

Create a repo called `life` under your account and push this folder to `main`.
If you name it something else, change `repo:` in `public/admin/config.yml`.

### 2. Deploy on Cloudflare Pages

Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.

- Framework preset: **Astro**
- Build command: `npm run build`
- Output directory: `dist`

Every push to `main` rebuilds the site. Free, no card required.

### 3. Get the domain

Fork `github.com/is-a-dev/register`, add `domains/srinath.json`:

```json
{
  "owner": { "username": "srinathsri22" },
  "records": { "CNAME": "<your-project>.pages.dev" }
}
```

Open a PR. Once merged, add `srinath.is-a.dev` as a custom domain in your
Cloudflare Pages project. If `srinath` is taken, pick another name — the file
name is the subdomain.

### 4. Cloudinary

Sign up free, then in `public/admin/config.yml` fill in `cloud_name` and
`api_key` from your dashboard. Both are public values and safe to commit —
never put the API *secret* in this repo.

In Cloudinary, go to Settings → Upload and enable unsigned uploading so the
admin can upload directly.

### 5. Signing in to the admin

Go to `/admin/` and sign in with a GitHub personal access token
(Settings → Developer settings → Personal access tokens → Fine-grained,
with read/write access to this repo only).

You only need the OAuth flow if someone non-technical ever edits the site; in
that case deploy `sveltia/sveltia-cms-auth` as a free Cloudflare Worker and add
its URL as `base_url` under `backend:` in the config.

## Adding things

Everything is editable at `/admin/`. Under the hood:

| Section | Folder | Notes |
|---|---|---|
| The list | `src/content/quests/` | `status` is `cleared`, `active` or `someday`; `progress` drives the bar |
| Journal | `src/content/journal/` | `kind` is `book`, `memory`, `thought` or `trip` |
| World | `src/content/places/` | `visited: false` puts it under "still on the list" |
| Lab | `src/content/lab/` | Hobby builds |

Save in the admin → commit → Cloudflare rebuilds → live in about a minute.

Schemas are enforced in `src/content.config.ts`. If a required field is missing,
the build fails loudly rather than shipping a broken page.

## Photos

Every section takes a main photo plus an unlimited list of extras. In the admin
the list has an "Add photo" button — add as many as you want, drag to reorder.

On the site they render as a swipeable strip; tapping one opens a full-screen
viewer you can swipe or arrow through. Cloudinary serves each image in WebP or
AVIF at the size the device actually needs, so a hundred photos cost you nothing
in build time and very little in bandwidth.

## Analytics

Cloudflare Pages → your project → Analytics → enable **Web Analytics**. Free,
cookieless, no code to add and nothing to consent to.

## Mobile

The site is built phone-first: a fixed tab bar sits within thumb reach, taps
have 44px+ targets, safe-area insets are respected on notched phones, and the
manifest means you can add it to your home screen and open it like an app.

Cross-page transitions, scroll reveals and the count-up on the homepage all
switch off automatically when the phone is set to reduce motion.

# srinath.is-a.dev

A personal log: one hundred things to do before I'm done, a journal of book
notes and memories, places visited, and a lab of hobby builds.

Static site, no database, no paid services, no vendor lock-in. Content is
Markdown in this repo, edited through a browser admin at `/admin/`. Photos live
on Cloudinary.

| | |
|---|---|
| **Framework** | Astro 5 — static output, almost no client JavaScript |
| **Admin** | Sveltia CMS at `/admin/`, commits Markdown straight to this repo |
| **Photos** | Cloudinary free tier |
| **Hosting** | Cloudflare Pages, rebuilds on every push to `main` |
| **Live at** | `life-4th.pages.dev` → `srinath.is-a.dev` once the DNS PR merges |
| **Repo** | `Srinathsri22/life` |

Total running cost: zero.

## Running it locally

```bash
npm install
npm run dev              # http://localhost:4321
npm run dev -- --host    # also reachable from your phone on the same wifi
npm run build            # output in dist/
```

## Where everything lives

```
src/
  content.config.ts        schemas — the source of truth for every field
  content/
    quests/                the 100-item list
    journal/               book notes, memories, thoughts, trips
    places/                travel
    lab/                   hobby builds
  layouts/Base.astro       nav, footer, mobile dock, SEO tags, ALL motion JS
  components/
    Photo.astro            Cloudinary URL rewriting + srcset
    Gallery.astro          swipeable strip + full-screen lightbox
    QuestRow.astro         one row of the list
    EntryCard.astro        one journal card
  pages/
    index.astro            homepage
    list/                  the list + per-quest pages
    journal/               index + per-entry pages
    world/ lab/            travel, hobby builds
    admin/index.astro      loads the CMS  ← a route, not a static file
    rss.xml.js             feed
  styles/global.css        design tokens, reveal primitive, marquee
public/
  admin/config.yml         the content model the CMS reads
  manifest.webmanifest     home-screen install
```

Design tokens (colours, spacing, fonts) are the `:root` block at the top of
`src/styles/global.css`. Change them there, not in individual components.

## Setup, once

### 1. GitHub

Repo is `Srinathsri22/life`, branch `main`. The capitalisation of the username
in `public/admin/config.yml` must match GitHub exactly — the CMS passes that
string to the API verbatim.

### 2. Cloudflare Pages

Dashboard → Workers & Pages → Create → **Continue to Pages** → connect the repo.

- Framework preset: **Astro**
- Build command: `npm run build`
- Output directory: `dist`

Use the **Pages** flow, not the newer Workers flow. Workers custom domains
require the domain's zone to live in your own Cloudflare account; `is-a.dev`
doesn't, so only Pages can serve it.

### 3. Custom domain

Pages project → **Custom domains** → Set up a domain → `srinath.is-a.dev`.

Do this **before** the is-a.dev PR merges. It will sit pending until the DNS
exists, which is correct. If Cloudflare hasn't been told to answer for the
hostname, the merged CNAME resolves to Cloudflare and gets an error page.

### 4. The domain itself

Fork `github.com/is-a-dev/register`, add `domains/srinath.json`:

```json
{
  "owner": {
    "username": "Srinathsri22",
    "email": "srinathsvsp@gmail.com"
  },
  "records": {
    "CNAME": "life-4th.pages.dev"
  }
}
```

The **filename** is the subdomain. The **CNAME** is where it points — the
Pages hostname, never the is-a.dev name itself. No `https://`, no trailing dot.

Open the PR **across forks**: base `is-a-dev/register` `main`, head your fork's
branch. A PR inside your own fork does nothing. Fill their template exactly —
checkboxes take only `[x]`, lowercase, no spaces, and the HTML comments must
stay. "Merging is blocked / review required" is normal; only maintainers merge.

Status: PR #58157, awaiting review.

### 5. Cloudinary

In `public/admin/config.yml` fill in `cloud_name` and `api_key`. Both are
public values and safe to commit. **Never commit the API secret.**

Settings → Upload → upload preset:

- Signing mode: **Unsigned** — required for browser uploads
- **Append a unique suffix: on** — otherwise two phone photos both named
  `IMG_1234.jpg` silently overwrite each other
- Asset folder: something like `life`, to keep these separate

### 6. Signing in to the admin

`/admin/` locally is `http://localhost:4321/admin/`.

**The big button goes to Netlify's OAuth service — don't use it.** It's the
legacy fallback, it asks for access to all your public and private repos plus
full personal user data, and it fails with "Not Found" unless you have a
Netlify account. Use the **personal access token** option on the same screen
instead.

Create the token at GitHub → Settings → Developer settings → Personal access
tokens → **Fine-grained**:

- Repository access: **Only select repositories** → `life` (not "All")
- Permissions → Repository → **Contents: Read and write** (Metadata is automatic)
- Set an expiry; regenerate and re-paste when it lapses

Copy it immediately — GitHub shows it once. It's revocable in one click.

The admin talks directly to the GitHub API, so **editing from localhost still
commits for real**. There's no sandbox unless you enable Sveltia's local
backend.

## Adding things

Everything is editable at `/admin/`. Under the hood:

| Section | Folder | Notes |
|---|---|---|
| The list | `src/content/quests/` | `status` is `cleared`, `active` or `someday`; `progress` drives the bar; `number` orders it |
| Journal | `src/content/journal/` | `kind` is `book`, `memory`, `thought` or `trip`; `draft: true` hides it |
| World | `src/content/places/` | `visited: false` moves it to "still on the list" |
| Lab | `src/content/lab/` | Hobby builds |

Save in the admin → commits to `main` → Cloudflare rebuilds → live in about a
minute.

Schemas are enforced in `src/content.config.ts`. A missing required field fails
the build loudly instead of shipping a broken page. Adding a field means
editing **both** `content.config.ts` (so the build accepts it) and
`public/admin/config.yml` (so the admin offers it).

## Photos

Every section takes a main photo plus an unlimited list of extras — the admin
list has an "Add photo" button, and they drag to reorder.

They render as a swipeable strip; tapping one opens a full-screen viewer you can
swipe, arrow-key or Escape out of. `Photo.astro` rewrites Cloudinary URLs with
`f_auto,q_auto` and a width cap, and serves a 2x srcset, so each device gets
WebP or AVIF at the size it actually needs. Photos never enter the repo, so
build times stay flat however many you add.

## Motion

All of it is one script at the bottom of `src/layouts/Base.astro`, re-run after
every client-side navigation:

- Headline lines rise from behind a mask on load
- The cleared count ticks up; progress bars draw
- Sections and rows reveal on scroll, staggered 70ms apart
- Scroll progress as a line at the top and a ring in the header
- The photo strip drifts sideways at 0.12× scroll — tune that number to taste
- Page-to-page view transitions; a CSS marquee between hero and list

Reveals use **IntersectionObserver**, not CSS `animation-timeline`. That matters:
scroll-driven CSS animations don't run on iOS Safari, so the CSS-only version
showed no motion at all on iPhone.

Everything switches off under `prefers-reduced-motion`.

## Analytics

Cloudflare Pages → project → Analytics → enable **Web Analytics**. Free,
cookieless, no code, nothing to consent to.

## Mobile

Built phone-first: a fixed tab bar within thumb reach, 44px+ tap targets,
safe-area insets for notched phones, scroll-snapped photo strips, and a
manifest so it installs to the home screen.

## Gotchas hit while building this

- **`/admin/` 404s** → the admin must be `src/pages/admin/index.astro`, a real
  route. As a static file in `public/admin/`, Astro's dev server won't resolve
  the trailing slash.
- **Push rejected, "fetch first"** → `git pull --rebase` then push. Happens
  after editing files in the GitHub web UI.
- **403 on push** → Windows Credential Manager is sending a different GitHub
  account. Remove `git:https://github.com` from Generic Credentials and retry.
- **LF/CRLF warnings on Windows** → harmless.

## Possible next steps

- Fill in real content; placeholder text is still in a few entries
- `robots.txt` and a sitemap, with `/admin/` excluded from indexing
- A real interactive map on the World page (needs a mapping library — it would
  roughly double the site's JavaScript, hence left out)
- Tag filtering on the journal
- Per-entry OG images generated at build time

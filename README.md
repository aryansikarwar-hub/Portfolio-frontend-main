# Aryan Sikarwar Portfolio — Next.js Version

This is the **Next.js 15 (App Router)** port of the original Vite + React +
React Router portfolio. The look, feel, and component behaviour are
preserved — only the build system and the routing layer changed.

## Quick start

```bash
npm install
cp .env.example .env.local      # fill in your EmailJS / GitHub keys
npm run dev                     # http://localhost:3000
```

Other scripts:

| script          | what it does                       |
| --------------- | ---------------------------------- |
| `npm run dev`   | dev server with hot reload         |
| `npm run build` | production build (`.next/`)        |
| `npm run start` | run the production build           |
| `npm run lint`  | Next.js ESLint                     |

Deploy on Vercel as a Next.js project — no `vercel.json` needed.

## Project layout

```
app/                    file-based routes (Next.js App Router)
├── layout.js           html/head/body, fonts, metadata
├── AppShell.jsx        client wrapper: intro state, nav, cursor, footer,
│                       AnimatePresence for page transitions
├── page.js             /
├── about/page.js       /about
├── skills/page.js
├── projects/
│   ├── page.js         /projects
│   └── [slug]/page.js  /projects/:slug
├── blog/
│   ├── page.js
│   └── [slug]/page.js
├── hobbies/
│   ├── page.js
│   └── [slug]/page.js
├── experience/page.js
├── contact/page.js
├── certificates/page.js
└── not-found.js        404

src/
├── components/         all UI components (unchanged behaviour)
├── views/              the old src/pages/ — renamed to avoid clashing
│                       with Next's pages-router convention
├── hooks/              useParallax, use3DTilt, useMagnetic
├── data/               blogPosts, projects, hobbies
└── styles/
    └── global.css      design tokens, base typography, utility classes
```

Each `app/*/page.js` is a thin re-export of the matching component in
`src/views/`. The view components hold the actual JSX and animations.

## What changed during the port

### Routing — react-router-dom → next/navigation

| old                                         | new                                              |
| ------------------------------------------- | ------------------------------------------------ |
| `<BrowserRouter>` / `<Routes>` / `<Route>`  | file-based routes under `app/`                   |
| `import { Link } from 'react-router-dom'`   | `import Link from 'next/link'`                   |
| `<Link to="/about">`                        | `<Link href="/about">`                           |
| `useNavigate()` + `navigate(path)`          | `useRouter()` + `router.push(path)`              |
| `navigate(-1)`                              | `router.back()`                                  |
| `useLocation().pathname`                    | `usePathname()`                                  |
| `useParams()`                               | `useParams()` from `next/navigation`             |
| `/projects/:slug`                           | `app/projects/[slug]/page.js`                    |

### Build / config

- **Removed:** `vite`, `@vitejs/plugin-react`, `vite.config.js`,
  `index.html`, `src/main.jsx`, `vercel.json`, `TagCloud` (it was a
  package.json dep but no source file ever imported it).
- **Added:** `next.config.mjs`, `jsconfig.json` (with `@/* → ./src/*`
  path alias), the entire `app/` tree, `app/AppShell.jsx`.
- **package.json:** `vite` removed, `next ^15` added, scripts switched
  to `next dev / build / start / lint`.

### Environment variables

| old (Vite)                          | new (Next.js)                              |
| ----------------------------------- | ------------------------------------------ |
| `import.meta.env.VITE_X`            | `process.env.NEXT_PUBLIC_X`                |
| `VITE_GITHUB_TOKEN`                 | `NEXT_PUBLIC_GITHUB_TOKEN`                 |
| `VITE_EMAILJS_SERVICE_ID`           | `NEXT_PUBLIC_EMAILJS_SERVICE_ID`           |
| `VITE_EMAILJS_TEMPLATE_ID`          | `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`          |
| `VITE_EMAILJS_PUBLIC_KEY`           | `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`           |

`NEXT_PUBLIC_*` values are bundled into the client. Keep that in mind
if you ever add anything that should stay server-side.

### Server/client components

Every `.jsx` file under `src/components/` and `src/views/` starts with
`'use client'`. The components use `useState`, `useEffect`, framer-motion,
lenis, EmailJS — all browser-side primitives — so server-component mode
is not an option for them.

`app/layout.js`, `app/page.js`, and every `app/*/page.js` are kept as
plain server components. They render the client component below them.
This is the standard Next.js pattern.

### Page transitions

The old App.jsx wrapped `<Routes>` in `<AnimatePresence mode="wait">`
keyed by `location.pathname`. The equivalent now lives in
`app/AppShell.jsx`:

```jsx
const pathname = usePathname()
return (
    <AnimatePresence mode="wait">
        <Suspense fallback={...} key={pathname}>
            {children}
        </Suspense>
    </AnimatePresence>
)
```

The `key={pathname}` on the wrapper forces React to remount on
navigation so motion.divs inside each page run their `initial` / `exit`
animations exactly like before.

### Fonts

Google Fonts are still loaded via `<link>` tags in the root layout (not
via `next/font/google`). This is deliberate: ~140 lines of existing CSS
across the codebase reference fonts by literal name
(`font-family: 'JetBrains Mono'` etc.), and keeping the link-tag
approach means none of those rules need editing. If you ever want the
self-hosted, zero-FOUT behaviour `next/font` gives you, the migration is
a one-time CSS pass (replace each named font with the matching
`var(--font-…)` CSS variable).

### Skeleton intro

The old `index.html` had an inline `<style>` + skeleton DOM that
flashed "ARYAN SIKARWAR" before React mounted. That existed to give
Vite an LCP target before the JS bundle parsed. With Next.js the page
is server-rendered, so the real `<Intro />` component appears in the
initial HTML — no skeleton needed.

## Known things to double-check on first run

These are conversion-time risks that should be verified once locally
with `npm run dev`:

1. **EmailJS contact form** — the env vars renamed; confirm a real
   send works after filling `.env.local`.
2. **Anchor/hash links** (e.g. `<Link href="/about#facts">`). The
   `useLocation().hash` reads were rewritten to read `window.location.hash`
   inside effects. If any component relied on hash changes triggering
   a React re-render, replace with a `hashchange` event listener.
3. **Scroll-restore on navigation** — Next.js scrolls to top by
   default. The existing `ScrollToTop` component still runs and is
   keyed on `usePathname`, so behaviour should match the old build.
4. **framer-motion + Suspense fallback** — large pages briefly show
   the empty fallback before mounting. If the flash bothers you, pass
   a richer skeleton into `AppShell`'s `<Suspense fallback>`.

## License

See `LICENSE`.

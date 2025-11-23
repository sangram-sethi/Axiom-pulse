# Axiom Pulse – Token Discovery Table

A pixel-perfect, high-performance clone of the **Axiom Trade “Pulse” token discovery table**, built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS v4**, **Redux Toolkit**, and **React Query**.

It showcases **real-time token price updates**, **rich interactions** (popover / tooltip / modals / sorting), **glassmorphism UI**, and **mobile-first responsive layout** down to **320px**.

---

## 1. Live Demo & Video

- **Vercel deployment:**  
  👉 `https://your-vercel-url.vercel.app`  <!-- replace with your URL -->

- **YouTube walkthrough (1–2 min):**  
  🎥 `https://youtu.be/your-video-id`  <!-- replace with your video -->

- **GitHub repo:**  
  💻 `https://github.com/your-username/axiom-pulse`  <!-- replace with repo URL -->

---

## 2. Core Features vs Requirements

### 2.1. Token table features

- **All token columns / phases**
  - `New pairs`
  - `Final stretch`
  - `Migrated`
  - **Bonus:** `Watchlist` tab (empty-state messaging; ready to wire to a star toggle)

- **Data & metrics per token**
  - Name / symbol / avatar
  - Age (minutes → human readable)
  - Market cap
  - Liquidity
  - 24h volume
  - 24h transactions (buys / sells)
  - Token score (0–100)

- **Interactions**
  - **Sorting:** Market cap column is sortable (asc/desc) using a reusable `useTokenSorting` hook.
  - **Search:** Global search by name/symbol with shared state across desktop & mobile nav.
  - **Phase filters:** Pills above table filter blocks of tokens (`new`, `final`, `migrated`, `watchlist`).

### 2.2. Interaction patterns (popover / tooltip / modals)

- **Popovers**
  - Token score chip → Radix Popover showing detailed metrics (score, mcap, volume, txns).
  - Small `i` icon → Radix Popover showing “Pair age” with a small arrow.

- **Tooltips**
  - `Live` pill in the top nav → tooltip: `"Prices are simulated and refresh every 3 seconds"`.
  - Simple tooltip wrapper (`SimpleTooltip`) reusable across the app.

- **Modals / dialogs**
  - **Login modal** in top nav:
    - Glass-style dialog with top accent bar and CTA.
    - Username + password fields, with “Forgot password” and “Sign up” links.
  - **Token buy dialog**:
    - Per-row “Buy” button opens a Radix Dialog with price, mcap, volume and a quick “Place Order” input.
  - **Token details dialog**:
    - Clicking a desktop row opens a “Token details” dialog summarising key metrics (price, change, mcap, volume, age, txns).

---

## 3. Real-time price updates

- **WebSocket mock**
  - Implemented via a custom hook `usePriceSocket(tokens: Token[])`.
  - Periodically simulates price changes for tokens and dispatches updates to a **Redux slice** (`tokens.runtime`).
  - Each `TokenRow` reads `runtime[token.id]` (price + direction) from Redux.

- **UI behaviour**
  - Per-row price cell reads either:
    - `runtime.lastPriceUsd` (if live update exists), or
    - `token.priceUsd` (initial API value).
  - The direction (`"up" | "down" | "flat"`) controls:
    - Text color (`text-axiom-positive` / `text-axiom-negative` / neutral).
    - Smooth transitions with Tailwind + `transition-colors`.

- **“Last updated” indicator**
  - Header displays: `Updated just now` / `Updated Xs ago` with a green dot.
  - Tied to Redux runtime changes; clock ticks every second via a lightweight `setInterval`.

---

## 4. Loading, Error & Empty States

- **Loading**
  - On first load, **skeleton rows** (`TokenSkeletonRow`) render with shimmer.
  - No layout shift: the skeleton preserves row heights & grid layout.

- **Error boundary**
  - `TokenTable` is wrapped in a reusable `<ErrorBoundary>` component.
  - If data fetching fails, `TokenTableError` shows a friendly message plus a **Retry** button wired to `refetch()` from React Query.

- **Empty states**
  - **Generic:** When filters result in no tokens:
    - `No tokens available in this view. Try switching tabs or updating your watchlist.`
  - **Search-specific:** When search filters everything out:
    - `No tokens match “query”. Try adjusting the phase filter or clearing your search.`
  - **Watchlist tab:**
    - If watchlist is empty:
      - `Your watchlist is empty. Use the watchlist button in the table rows to save tokens here.`
    - If watchlist has ids but search hides them:
      - `No watchlisted tokens match “query”. Try clearing your search or switching back to all tokens.`

---

## 5. UI & UX Design

### 5.1. Layout & styling

- **Tech:** Tailwind CSS v4 (PostCSS-based, no `tailwind.config.js`), custom Axiom-inspired color palette.
- **Main card:**
  - Glassmorphism:
    - `bg-slate-900/40` with radial gradient overlays.
    - `backdrop-blur-2xl`.
    - Outer border `border-white/8` + subtle inner highlight border.
  - Shadow: `shadow-[0_18px_45px_rgba(0,0,0,0.85)]` for depth.

- **Rows:**
  - Desktop rows are:
    - Grid-based (`grid-cols-[minmax(0,2.5fr)_repeat(4,minmax(0,1.1fr))_minmax(0,2fr)_112px]`).
    - Semi-transparent stripes (`bg-slate-900/25` → `bg-slate-900/50` on hover).
    - Left accent bar appears on hover using `group` + `absolute` gradient.

  - Mobile rows (`< md`):
    - Card-style stacked layout:
      - Top: avatar + name/symbol + age.
      - Right: mcap + 24h change.
      - “More details” pill with chevron toggles an expanded section:
        - Liquidity / volume / txns / score + `Buy` button.

- **Top navigation**
  - Left: Axiom logo (using `next/image`) + `AXIOM Pro / Pulse` labels.
  - Center (desktop): search input with `/⌘K` hint and clear `×` button.
  - Right:
    - Live pill with tooltip.
    - Notification & settings icon buttons.
    - Green **Login** pill (Radix Dialog).
    - Primary **Connect** button (desktop).
    - Mobile **hamburger** button opens a dropdown:
      - Mobile search + clear.
      - “Connection stable” pill and Connect button.

### 5.2. Responsiveness

- Designed **mobile-first** and tested down to **320px**.
- Token table is wrapped in `overflow-x-auto` with `min-w-[880px]` to preserve column layout while remaining usable on small screens.
- On phones:
  - Top nav collapses:
    - Search + Connect move into a dropdown.
    - Login / notification / settings stay visible.
  - Table rows use card layout instead of horizontal scrolling for better readability.

### 5.3. Visual fidelity

The goal was to keep the layout within ~**2px of the Axiom Pulse page**, including:

- Spacing between nav elements.
- Grid column proportions for pair / mcap / liquidity / volume / txns / action.
- Font sizes (`text-[11px]`, `text-sm`, etc.) and typographic hierarchy.
- Colors and glass-panel feel close to the original design.

---

## 6. Architecture & State Management

### 6.1. Project structure

```text
src/
  app/
    page.tsx              # Home – renders TokenTable
    layout.tsx            # Root layout, TopNav, Providers
    api/
      tokens/route.ts     # Serverless route for token data (external API + fallback)

  components/
    layout/
      TopNav.tsx          # Top navigation, search, login dialog, mobile menu
    tokens/
      TokenTable.tsx      # Main table: phases, sorting, filters, rows
      TokenTableHeader.tsx# Header with phase tabs + MCap sort
      TokenRow.tsx        # Row (desktop grid + mobile card), dialogs, popovers
      TokenSkeletonRow.tsx# Loading shimmer
      TokenTableError.tsx # Error state with retry
    ui/
      Button.tsx          # Reusable button component
      SimpleTooltip.tsx   # Lightweight tooltip wrapper

  hooks/
    useTokensQuery.ts     # React Query hook for /api/tokens
    useTokenSorting.ts    # Sorting hook (key + direction + memoized sort)
    usePriceSocket.ts     # WebSocket-like live price simulation
    useAppSelector.ts     # Typed Redux selector

  store/
    index.ts              # Redux store configuration
    tokensSlice.ts        # Token slice + runtime (live prices)
    uiSlice.ts            # UI preferences (e.g., liveUpdatesEnabled, watchlist)

  context/
    SearchContext.tsx     # Global search state used by nav + table

  lib/
    format.ts             # Formatting (compact currency, age strings)

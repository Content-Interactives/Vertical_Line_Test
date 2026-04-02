# Vertical Line Test Interactive — Technical README

Students move a **vertical line** across a **canvas graph** to see how many times it intersects a curve. If **two or more** distinct intersections occur at the probe position, the **slider locks** (test failed / not a function). The app supports **preset curves** (HTML Canvas 2D) and a **free-draw** mode.

**Live build:** [https://content-interactives.github.io/Vertical_Line_Test/](https://content-interactives.github.io/Vertical_Line_Test/)

**Curriculum context (non-technical):** CK-12 Basic Algebra — [Recognizing Functions / vertical line test](https://flexbooks.ck12.org/cbook/ck-12-basic-algebra-concepts/section/1.14/primary/lesson/vertical-line-test-bsc-alg/).

---

## Stack

| Layer | Technology |
|--------|------------|
| Build | [Vite](https://vitejs.dev/) 5, `@vitejs/plugin-react` |
| Language | TypeScript 4.9 |
| UI | React 19 |
| Styling | Tailwind CSS 4 (`index.css`), plus extensive **inline styles** and `App.css` |
| Graphics | **Canvas 2D** (`GraphCanvas`, `DrawFunction`) |
| Deploy | Static `dist/` → GitHub Pages (`gh-pages` CLI in `package.json`) |

---

## Repository layout

```
index.html                 # Vite shell
vite.config.ts             # base: '/' (dev) or '/Vertical_Line_Test/' (build)
tailwind.config.js, postcss (via Tailwind 4)
src/
  index.tsx                # createRoot → <App />
  App.tsx                  # Layout, slider, Flexi, animation selection, canvas size
  App.css
  constants/index.ts       # CANVAS_DIMENSIONS, VERTICAL_LINE_TEST thresholds
  types/index.ts
  hooks/useVerticalLineTest.ts   # Alternate hook (not wired from App.tsx)
  components/
    AnimationMenu.tsx      # Preset keys: line, circle, parabola, parabola90, draw
    GraphCanvas.tsx        # Canvas + axes + selected preset animation + intersection dots
    DrawFunction.tsx       # Freehand draw + vertical line + intersections
    FlexiController.tsx    # Present in repo; not imported by current App.tsx
    miniGraphics.tsx       # Thumbnail icons for menu buttons
    animations/            # Per-curve draw + getIntersection(scaledX, w, h)
      index.ts             # allAnimations: line, circle, parabola, parabola90, sinWave, invertedSinWave
      verticalLineTest.ts  # Shared vertical line + dot drawing helpers
      line.ts, circle.ts, parabola.ts, parabola90.ts, sinWave.ts, invertedSinWave.ts
  utils/
    intersectionUtils.ts   # Segment–vertical-line intersection; dedupe by tolerance
    flexiUtils.ts
Ck12_Assets/               # Flexi SVGs (imported in App.tsx)
```

---

## Runtime architecture

### `App.tsx`

- **Left rail:** `AnimationMenu` switches `selectedAnimation` and calls `resetVerticalLineTest()` (slider to 0, re-enable slider).
- **Main column:** title, then either `DrawFunction` (`selectedAnimation === 'draw'`) or `GraphCanvas` (presets).
- **Slider:** `0…500` maps to canvas **x** as `(value / 500) * canvasSize` (see `SLIDER_RANGE` in canvas components). **`sliderDisabled`** when intersection count ≥ **`VERTICAL_LINE_TEST.INTERSECTION_THRESHOLD` (2)**.
- **Presets:** `handleSliderChange` resolves `allAnimations.find(...)`, calls `getIntersection(scaledX, canvasSize, canvasSize)`, sets `sliderDisabled` from `ys.length >= 2`.
- **Draw mode:** Intersections are computed inside `DrawFunction`; `onIntersectionChange` feeds the same threshold logic.
- **Canvas size:** `min(0.6 * innerWidth, 0.6 * innerHeight)`, updated on **debounced resize** (300 ms) only if delta **> 50 px** to reduce mobile chrome jitter.
- **Flexi:** SVG from `Ck12_Assets`; speech text from slider state (`sliderDisabled`, `verticalLineX === 500`, draw mode).

### `GraphCanvas.tsx`

- `useEffect` redraws when `selectedAnimation`, dimensions, `verticalLineX`, or test flag change.
- Draws axes with arrows, delegates curve to `animation.draw(ctx, { width, height, verticalLineX })`, then `getIntersection` + `drawIntersectionDot` for each **y** (multiple dots ⇒ failed test visually).

### `animations/*.ts`

Each export implements `Animation`: **`key`**, **`label`** (not always used by menu), **`draw`**, optional **`getIntersection`** returning **array of y** values at the given canvas **x**.

**Note:** `allAnimations` includes **`sinWave`** and **`invertedSinWave`**, but **`AnimationMenu`** only exposes five keys; the sine presets are **dead entries** unless the menu is extended.

### `DrawFunction.tsx`

- Pointer path → polyline in canvas coordinates; local copy of segment intersection logic (overlap with `intersectionUtils.ts` conceptually).
- Reports intersection count upward for slider disable behavior.

### Constants (`constants/index.ts`)

- **`INTERSECTION_THRESHOLD: 2`** — fail if ≥ 2 intersections (function fails vertical line test).
- **`INTERSECTION_TOLERANCE: 3`** — px deduplication in `getDrawnCurveIntersections`.
- **`LINE_DETECTION_DELTA`** — reserved / draw tuning.

---

## `vite.config.ts` and paths

```ts
base: command === 'serve' ? '/' : '/Vertical_Line_Test/'
```

Production asset URLs assume the repo is served at **`/Vertical_Line_Test/`** (capital **V**, **L**, **T**). Renaming the GitHub repo or path requires updating **`base`**.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Vite dev server (`base` `/`) |
| `npm run build` | Production bundle → `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run deploy` | `predeploy` build, then `gh-pages -d dist` |

---

## Embedding

- Layout uses **viewport widths** (`vw`/`vh`) for menu, slider column, and Flexi; test in target iframe size.
- No `postMessage` or LMS API.

---

## Maintenance notes

- **`useVerticalLineTest.ts`** centralizes threshold logic but **`App.tsx` duplicates** state; consider wiring the hook or deleting the unused file to avoid drift.
- **`App-refactored.tsx`**, **`DrawFunction-refactored.tsx`**, **`FlexiController.tsx`** appear to be experiments; **`index.tsx` imports `./App`** only.
- **`GraphCanvas`** uses `ys.length > 1` for dot styling in one branch; **`App`** uses `>= INTERSECTION_THRESHOLD` (2). Behavior matches for integer counts; keep consistent if thresholds change.

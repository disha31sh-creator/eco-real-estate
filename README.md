# Eco Estate

Cinematic 3D real estate website. React + TypeScript + Three.js (React Three Fiber) + GSAP ScrollTrigger + Lenis + Tailwind CSS.

## Run it

1. Install Node.js (LTS) from https://nodejs.org
2. Open a terminal in this folder
3. `npm install`
4. `npm run dev`
5. Open the address it prints (usually http://localhost:5173)

Stay online the first time: the fonts (Fraunces, Inter) load from Google Fonts.

## What you will see

- A preloader, then a misty forest at dawn. Scroll to fly through it toward the house.
- The camera follows a spline path (src/utils/terrain.ts) driven by scroll.
- The scene dissolves into the ivory page: search bar, welcome, 3D property cards, why-us, call to action.

## Quality modes

The site picks a quality tier automatically. Force one by adding it to the address:

- http://localhost:5173/?quality=high  (full forest, shadows, bloom, vignette)
- http://localhost:5173/?quality=low   (lighter scene for weaker computers and phones)

## Where things live

- `src/components/three/`  the 3D scene (Forest, Terrain, House, Lighting, Atmosphere, CameraRig, Effects, PropertyView)
- `src/components/sections/`  page sections (Journey is the scroll-driven hero)
- `src/components/ui/`  buttons, split-text headlines, scroll reveals, property card
- `src/data/properties.ts`  the three placeholder listings
- `src/utils/terrain.ts`  camera flight path and ground shape
- `src/styles/globals.css`  colours and fonts (Tailwind theme)

## Placeholders to replace

- The house is built from simple shapes. A real GLB model comes later (put it in public/models).
- All copy, prices, statistics, email and phone are placeholders.

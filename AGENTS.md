# Agent instructions

This repo is a take-home Airbnb listing clone. Keep the work focused on visual and interaction fidelity.

## Priorities

1. Match the reference listing, photo tour, and lightbox before adding extra product features.
2. Desktop only. Do not spend time on mobile breakpoints.
3. Prefer reproducing UI from screenshots and live behaviour. Do not lift bundled source from the reference site.
4. Keep the API read-only. Seed data is enough.

## Commands

- `npm run dev` — client + API
- `npm run seed` — load Mongo when `MONGO_URI` is set

## Quality bar

- Spacing, type, and colour should match Airbnb tokens (`#FF385C`, `#222`, `#6A6A6A`, 80px side padding).
- Overlays must be keyboard accessible: Escape, arrows, visible focus, `aria-modal`.
- If Mongo is unavailable, the API must still serve seed listings so the demo never hard-fails.

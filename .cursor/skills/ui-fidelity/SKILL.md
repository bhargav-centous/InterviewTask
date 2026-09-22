# UI fidelity skill

Use this skill when changing listing, photo tour, or lightbox UI.

## Checklist

- Compare against https://airbnb-orpin-pi.vercel.app/listing/1 at 1440px width.
- Keep the 5-photo hero, 8px gaps, 12px radius, and “Show all photos” chip.
- Photo tour is a full-screen white overlay, not a black lightbox.
- Lightbox is a single-photo viewer with circular prev/next controls.
- Hover on photos uses a 12% black veil.
- Motion: 250–300ms, cubic-bezier(0.2, 0.8, 0.2, 1).
- Do not introduce a new colour or typeface without matching the reference first.

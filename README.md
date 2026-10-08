# Global Travel (Global-Tap)

A simple, clean prototype of the Global Travel app: UPI payments in India and
a separate International Pay experience when travelling abroad.

> Prototype only. Every transaction, rate, merchant and fee on screen is
> sandbox/demo data. No real money moves and no payment partner is connected.

## Run it

No build step. Either:

- Open `index.html` directly in a browser, or
- From this folder, run `python3 -m http.server 8000` and visit
  `http://localhost:8000`.

## Folder structure

```
index.html          Page structure (header, payment card, assistant, services,
                    transactions, dialogs). Links the CSS and JS below.
css/style.css       All styling: layout, colors, cards, dialogs, animations.
js/app.js           All behavior: mode switch, dialogs, sandbox payment flow,
                    converter, assistant answers, privacy/terms content.
assets/favicon.svg  App icon.
pages/privacy.html  Standalone Privacy page.
pages/terms.html    Standalone Terms & Conditions page.
```

## Where to edit what

- Change text on screen: `index.html`
- Change colors, spacing, layout: `css/style.css` (palette lives in `:root`)
- Change demo rate, fees, assistant answers: `js/app.js`
  (search for `83.4`, `respond(`, `privacy =`, `terms =`)
- Change legal copy: `pages/privacy.html`, `pages/terms.html`
  (the same copy also appears inside `js/app.js` for the in-app dialogs;
  keep both in sync)

## Design rules followed

No purple gradients, no pill buttons, no fake reviews/metrics/counters,
no emoji icons (inline SVG instead), no em dashes, no heavy scroll or
cursor animations, no AI-slop stock copy. Buttons are rectangles with a
small radius; one accent color; flat surfaces.

---
name: testing-vitabi-toasts
description: Run the VitaBi (pfevitabi) frontend locally and test the toast notification system end-to-end. Use when verifying toast/alert UI changes or doing general frontend smoke tests of the VitaBi app.
---

# Testing VitaBi toast notifications

The app is a Vite + React 19 frontend located in `pfevitabi/`. It replaced native `alert()` calls with an in-app toast system (`src/components/Toast.jsx`, styles in `src/components/Toast.css`, context in `src/ToastStore.js`, hook in `src/useToast.js`, provider mounted in `src/App.jsx`).

## Run locally

```bash
cd pfevitabi
npm install
npm run dev   # serves http://localhost:5173
```

Lint/build:
```bash
cd pfevitabi
npm run lint
npm run build
```

Note: there are pre-existing lint errors in the repo (in files like AdminProducts.jsx, AuthContext.jsx, CartContext.jsx, Shop.jsx) unrelated to toast work. Verify any "new" lint error is actually new by comparing against the base branch before treating it as a regression.

## Toast system overview

Variants and their styling (left-border accent + icon):
- `success` — green, ✓
- `error` — red, ✕
- `warning` — orange, !
- `info` — pink/primary, i

Toasts render fixed in the **top-right**, auto-dismiss after ~4s, show a progress bar, and have a manual × close button (`aria-label="Fermer la notification"`, `role="alert"`).

## Where to trigger each toast (for end-to-end UI testing)

All of these are frontend-only and work even when the backend is down.

- **Shop page (`/shop`)**
  - Click a product card's heart/favorites button → success toast "Ajouté aux favoris !"
  - Click "En profiter" in the promo banner (scroll down) → success toast "Code VITA20 appliqué !"
  - Click the floating support button (bottom-right) → info toast "Chat de support bientôt disponible !" (good for proving variant color differs from success)
- **Home page (`/`)**: submit the newsletter form → success toast "Merci de votre inscription !"
- **Nutrition page (`/nutrition`)**: saving a meal triggers warning (not logged in) / success / error variants.
- **Cart / checkout without login** (Navbar cart button, PaymentModal) → warning toast "Veuillez vous inscrire ou vous connecter pour passer une commande."

To test manual dismiss: trigger any toast, then click its × before the ~4s auto-dismiss; the toast should disappear immediately and the toast container empties in the DOM.

## Gotchas

- A "Join the Waitlist" modal may pop up on `/shop` after a moment — close it (× top-right) before clicking product buttons.
- The Shop shows a banner "Le backend n'est pas disponible pour le moment. Des produits de démonstration sont affichés." when the API is down. This is expected and does not block toast testing.
- The Vercel preview deployment is protected and returns HTTP 401, so it can't be used for anonymous browser testing — test against the local dev build of the branch instead.
- Toasts auto-dismiss quickly (~4s); take the verification screenshot immediately after the triggering click, before zooming or doing other actions.

## Devin Secrets Needed

None — the toast flows are frontend-only and require no authentication or secrets.

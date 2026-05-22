# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Déployer sur Vercel

1. Poussez le dépôt sur GitHub (racine du projet `Pfe_ihssaan`).
2. Sur vercel.com -> "New Project" -> importez le dépôt GitHub.
	- Root Directory: `pfevitabi`
	- Framework: Vite (ou `Other`)
	- Install Command: `npm install`
	- Build Command: `npm run build`
	- Output Directory: `dist`
3. Ajoutez les variables d'environnement côté Vercel si nécessaire (préfixez-les `VITE_` pour y accéder côté client).
4. Si votre API Laravel est déployée ailleurs, configurez `VITE_API_URL` dans les variables d'environnement Vercel.

Remarque: le backend Laravel doit être déployé séparément (Vercel n'héberge pas Laravel/PHP de façon native). Configurez CORS dans `backend/config/cors.php` pour autoriser le domaine Vercel.

Un fichier `vercel.json` a été ajouté à la racine du dépôt pour indiquer à Vercel de construire le frontend situé dans `pfevitabi`.

# Vocabe

Una parola italiana al giorno: significato, esempi, etimologia. Il giorno dopo un quiz per ripassarla.

**[federicodiluca.github.io/vocabe](https://federicodiluca.github.io/vocabe/)**

Ripetizione spaziata per il ripasso, glossario di 1027 parole e raccolte tematiche da
completare. Web app (PWA), funziona offline. Nessun account: i progressi stanno in
`localStorage`, esportabili come file JSON dalle impostazioni.

## Sviluppo

Node 20.19.1.

```bash
npm install
npm run dev
npm test                 # 82 test sulla logica pura
npm run words:validate   # valida words.json e collections.json
npm run build
```

Stack: Vite, React, TypeScript, Tailwind, react-router, vite-plugin-pwa.

```text
src/
  app/        shell, routing, tema
  core/       content, storage, srs (Leitner), streak, badges, share, challenge, recap
  state/      store esterno + persistenza
  features/   daily · recall · explore · progress · settings · challenge · recap
  ui/         componenti condivisi (Logo, Icon, Button, Card, Sheet)
  data/       words.json (1027 voci) + collections.json (8 raccolte)
scripts/
  build-seo.mjs    genera dopo la build /parole/<slug>/, glossario, sitemap.xml
  build-icons.mjs  rigenera le icone da icon-source.svg (npm run icons:build)
```

## Deploy

GitHub Actions pubblica su GitHub Pages a ogni push su `main`
(`.github/workflows/deploy.yml`). Il `base` diventa `/vocabe/` solo con `GITHUB_PAGES=true`.

## Note

Vocabe è gratuito e senza pubblicità: nessun account, nessun acquisto, nessun servizio di
terze parti, nessuna analitica. Non c'è app da installare dagli store — dal browser di uno
smartphone si aggiunge alla schermata home e si comporta come un'app, anche offline.

---

[Federico Di Luca](https://federicodiluca.github.io/)

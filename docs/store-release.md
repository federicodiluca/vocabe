# Pubblicazione

**Target attivo: Android.** iOS è in pausa (serve un Mac, vedi in fondo).

Vocabe è gratuito e senza pubblicità: non ci sono account RevenueCat, Stripe o AdMob da
configurare, e nella Play Console non vanno dichiarati né annunci né acquisti in-app.

## Già pronto nel codice

- Icone e splash generati da `assets/` — `npm run assets:build` poi
  `npx -y @capacitor/assets@latest generate --android`.
- Firma Android: `signingConfigs.release` legge `android/key.properties` (git-ignored);
  senza quel file la release usa la chiave di debug.
- Shell nativa: splash screen, status bar a tema, icona notifica `ic_stat_notification`.
- Promemoria giornaliero con `@capacitor/local-notifications`.
- Privacy policy: `public/privacy/` → `/vocabe/privacy/`, linkata da Opzioni e sitemap.
- `.gitignore`: keystore, `key.properties`, file dei servizi Google.

## Da fare — Android

- [ ] Android Studio + SDK installati.
- [ ] Account Play Console (25 $ una tantum).
- [ ] Generare il **keystore** di release:
      `keytool -genkey -v -keystore vocabe-release.keystore -alias vocabe -keyalg RSA -keysize 2048 -validity 10000`
      — tenerlo fuori dal repo, creare `android/key.properties`.
      È l'unico vero segreto del progetto: perderlo significa non poter più aggiornare l'app.
- [ ] `versionCode` / `versionName` in `android/app/build.gradle`.
- [ ] `npm run cap:sync`, poi in Android Studio: Build → Generate Signed Bundle (`.aab`).
- [ ] Play Console: scheda, screenshot, content rating, data safety (nessuna raccolta dati),
      URL privacy `…/vocabe/privacy/`, canale di test interno.

## iOS — in pausa

Il progetto `ios/` esiste già (`@capacitor/ios`, icone). Per completarlo serve **macOS**
(CocoaPods + Xcode per firma e build) oppure una **CI macOS** (GitHub Actions runner
`macos-*`, Codemagic) più un **Apple Developer Program** ($99/anno). Quando ci sarà:

- [ ] `sudo gem install cocoapods`, `npx cap sync ios`.
- [ ] Xcode: team, bundle id `app.vocabe.mobile`, signing.
- [ ] App Store Connect: scheda, screenshot, privacy labels, revisione.

## Note

- Capacitor 7 (v8 richiede Node ≥ 22; ora si usa Node 20).
- Se un giorno servisse monetizzare, l'aggancio ad AdMob e RevenueCat è recuperabile
  dalla storia di git: era in `src/core/{ads,iap}` fino al commit che li ha rimossi.

# Welcome App Template

## Overview
**Tipo**: Template Web App (mobile-first, PWA-ready)
**Cliente / Scopo**: MooRent — template riutilizzabile per creare Welcome App personalizzate per ogni appartamento in gestione
**Data inizio**: 2026-05-27
**Deadline**: N/D (template permanente)
**Stato**: Completato — pronto per essere duplicato

## Stack tecnico
- React 19 + Vite 8
- CSS plain (no Tailwind, no framework UI)
- No TypeScript (JavaScript puro)
- Deploy: GitHub Pages (`https://moorentpm.github.io/Welcome-App-Template/`)
- Repository: `git@github.com:MoorentPm/Welcome-App-Template.git`

## Obiettivi principali
- [x] App ospiti completa per appartamento singolo
- [x] Design iOS-inspired, mobile-first
- [x] Tutte le sezioni: Check-in, Wi-Fi, Regole, Checkout, Guide elettrodomestici, Luoghi, Coupon, FAQ, Emergenze
- [x] Struttura dati separata in `data.js` per personalizzazione rapida
- [ ] Push su GitHub + attivazione GitHub Pages
- [ ] Primo duplicato per secondo appartamento MooRent

## Come creare una nuova app da questo template

1. Duplica la directory del progetto
2. Modifica **solo** `src/data.js` con i dati del nuovo appartamento
3. Sostituisci eventuali immagini specifiche
4. Cambia il nome del progetto in `package.json`
5. Crea nuovo repository GitHub e fai push
6. Abilita GitHub Pages → branch `main` / `dist` (dopo `npm run build`)

## Struttura del progetto
```
src/
├── main.jsx              # Entry point React
├── data.js               # TUTTI i dati specifici dell'appartamento
├── styles.css            # Stili globali
└── components/
    ├── App.jsx           # Router principale tra le schermate
    ├── Login.jsx         # Schermata di benvenuto con nome ospite
    ├── Home.jsx          # Dashboard principale
    ├── Screens.jsx       # Tutte le sotto-schermate (check-in, regole, ecc.)
    ├── Padova.jsx        # Guida città (specifica per Padova — da rifare per altre città)
    └── Icons.jsx         # Icone SVG inline
```

## Sezioni dell'app
| Sezione | Dati in data.js | Note |
|---------|----------------|------|
| Login / Benvenuto | `APARTMENT`, `guest` | Nome ospite, notti, checkout |
| Wi-Fi | `APARTMENT.wifi` | SSID + password |
| Check-in steps | `CHECKIN_STEPS` | Passi fotografati |
| Regole casa | `HOUSE_RULES` | Lista con icone |
| Checkout | `CHECKOUT_STEPS` | Checklist prima di partire |
| Elettrodomestici | `APPLIANCES` | Guide per singolo elettrodomestico |
| Luoghi / Itinerari | `PLACES`, `MOODS`, `TODAY_PICKS` | Da personalizzare per città |
| Coupon | `COUPONS_RICH` | Con codici sconto per esercizi locali |
| FAQ | `FAQ` | Domande frequenti |
| Emergenze | `EMERGENCY` | Contatti host + 112 |

## Primo appartamento: Elegant Loft
- Indirizzo: Via Trieste 25, Padova
- Host: Mattia (+39 351 988 6489)
- Wi-Fi: ElegantLoft_WIFI / Civico25
- Codice portone: 25# — Cassetta chiavi n°5, codice 0425

## Note e vincoli
- Il file `data.js` nella root è la versione precedente (pre-Vite) — usare `src/data.js`
- Analogamente, i `.jsx` nella root sono versioni legacy — i file attivi sono in `src/components/`
- La sezione Padova (`Padova.jsx`) è hardcoded per Padova: per altre città va creato un componente equivalente
- Nessun backend, nessun database: tutto statico

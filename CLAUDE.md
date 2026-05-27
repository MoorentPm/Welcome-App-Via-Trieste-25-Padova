# Contesto progetto: Welcome App Template

Vedi `PROJECT.md` per il contesto completo.

## Regole specifiche di questo progetto

### File attivi vs. legacy
- I file JSX **attivi** sono in `src/components/` — NON modificare i `.jsx` nella root (legacy pre-Vite)
- Il `data.js` **attivo** è `src/data.js` — NON modificare `data.js` nella root

### Come personalizzare per un nuovo appartamento
L'unico file da modificare è `src/data.js`. Contiene tutti i dati specifici dell'appartamento:
- `APARTMENT` — nome, indirizzo, host, Wi-Fi, check-in/out, tassa soggiorno
- `guest` — nome ospite corrente, notti, data checkout (cambia per ogni prenotazione)
- `MOODS`, `TODAY_PICKS`, `PLACES` — suggerimenti città (da localizzare)
- `CHECKIN_STEPS`, `CHECKOUT_STEPS` — istruzioni fisiche
- `HOUSE_RULES`, `FAQ`, `EMERGENCY`, `APPLIANCES`, `COUPONS_RICH` — contenuto informativo

### Stack e stile
- React 19 + Vite — no TypeScript, no Tailwind
- Design iOS-inspired, mobile-first — mantenere lo stesso linguaggio visivo
- CSS in `src/styles.css` — niente CSS-in-JS
- Nessun backend: tutto statico, deploy su GitHub Pages

### Deploy
```bash
npm run build        # genera dist/
# poi push su GitHub + GitHub Pages da dist/ o main
```

### Creare un'istanza per nuovo appartamento
1. Duplica il progetto in una nuova directory
2. Modifica `src/data.js` con i dati del nuovo appartamento
3. Se la città è diversa da Padova, aggiorna `src/components/Padova.jsx` (o creane uno equivalente)
4. `npm install && npm run build`
5. Crea repo GitHub + GitHub Pages

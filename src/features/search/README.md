# Kandidatensuche mit Explorium API

Diese Funktion nutzt die Explorium API, um echte Kandidaten zu finden und anzureichern.

## Setup

1. **API-Schlüssel erhalten:**
   - Registrieren Sie sich bei [Explorium](https://explorium.ai)
   - Erhalten Sie Ihren API-Schlüssel

2. **Umgebungsvariable setzen:**
   ```bash
   VITE_EXPLORIUM_API_KEY=ihr_api_schlüssel_hier
   ```

3. **Anwendung neu starten:**
   ```bash
   pnpm dev
   ```

## Funktionen

### Kandidatensuche
- **Endpoint:** `POST /api/v1/prospects`
- **Funktionalität:** Sucht nach Kandidaten basierend auf Filtern
- **Filter:**
  - Erfahrungslevel (Entry, Mid, Senior, Executive)
  - Standort (Stadt)
  - Ausbildung (Bachelor, Master, MBA, PhD)
  - Abteilung
  - Fähigkeiten

### Kontaktanreicherung
- **Endpoint:** `POST /api/v1/prospects/contacts_information/enrich`
- **Funktionalität:** Holt E-Mail und Telefonnummer für einen Kandidaten
- **Kosten:** 
  - Nur E-Mail: 2 Credits
  - Nur Telefon: 5 Credits
  - Beides: 5 Credits

## Datenstruktur

### Candidate Type
```typescript
interface Candidate {
  id: string                    // prospect_id von Explorium
  name: string                  // Vollständiger Name
  role: string                  // Job-Titel
  department: string            // Abteilung
  skills: string[]              // Liste der Fähigkeiten
  status: 'Available' | 'Interviewing' | 'Hired'
  experience: string            // z.B. "8 years"
  experienceYears: number       // Numerischer Wert
  location: string              // Stadt, Region
  education: string             // Ausbildungsniveau
  salary: string                // Geschätztes Gehalt
  avatar: string                // Initialen
  email?: string                // E-Mail (nach Anreicherung)
  phone?: string                // Telefon (nach Anreicherung)
  linkedin?: string             // LinkedIn-Profil
  prospectId?: string           // Explorium Prospect ID
}
```

## API-Mapping

Die Explorium-Daten werden wie folgt gemappt:

- **Erfahrung:** Basierend auf `job_level_main`
  - entry/junior → 1-2 Jahre
  - non-managerial → 3 Jahre
  - senior → 6 Jahre
  - manager → 8 Jahre
  - director → 10 Jahre
  - vp/c-level/executive → 12-15 Jahre

- **Ausbildung:** Extrahiert aus `experience` Array
  - Sucht nach Keywords: PhD, MBA, Master, Bachelor

- **Gehalt:** Geschätzt basierend auf Job-Level und Standort
  - Höhere Gehälter für San Francisco, New York, Seattle

## Verwendung

```typescript
import { searchCandidates, enrichCandidateContact } from './api'

// Kandidaten suchen
const candidates = await searchCandidates('Software Engineer', {
  experience: 'senior',
  locationCity: 'San Francisco',
  education: 'Bachelor',
})

// Kontaktdaten anreichern
const contact = await enrichCandidateContact(candidate.prospectId)
// { email: '[email protected]', phone: '+1234567890' }
```

## Fehlerbehandlung

Die API-Calls nutzen React Query für:
- Automatisches Caching (5 Minuten)
- Fehlerbehandlung
- Loading States
- Retry-Logik

Bei Fehlern wird eine Fehlermeldung angezeigt mit dem Hinweis, den API-Schlüssel zu überprüfen.

## Kosten-Optimierung

- Suchergebnisse werden gecacht (5 Minuten)
- Kontaktanreicherung erfolgt nur auf Anfrage
- Bulk-Enrichment für mehrere Kandidaten verfügbar

## Weitere Informationen

- [Explorium API Dokumentation](https://developers.explorium.ai/reference)
- [Prospecting Use Case](https://developers.explorium.ai/reference/quick-starts/use_case_prospecting)

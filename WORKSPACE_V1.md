# WORKSPACE V1 – BESTANDSAUFNAHME

**Status:** Test Version 1 erreicht  
**Datum:** 15.11.2026  
**Repo:** Bossid300/B2B-fertig  

---

## 📦 KOMPONENTEN-ÜBERSICHT

### **Dateistruktur**
```
src/experimental/workspace/
├── ProjectWorkspace.jsx              [HAUPT-CONTAINER]
├── WorkspaceCanvas.jsx               [ARBEITSFLÄCHE]
├── WorkspaceCard.jsx                 [EINZELNE KARTE]
├── WorkspaceDrawer.jsx               [LINKE SCHUBLADE]
├── workspace.css                     [STYLING]
└── components/
    ├── EventInfoBlock.jsx            [EVENT-HEADER]
    └── WorkspaceDetailsPanel.jsx     [RECHTE DETAILMAPPE]
```

---

## 🏗️ KOMPONENTEN-BESCHREIBUNG

### **1. ProjectWorkspace.jsx**
**Rolle:** Haupt-Container, Orchestrierung aller Teile

**Props:** Keine (selbstständige Komponente)

**State:**
- `activeEventRef` – Aktives Event aus localStorage
- `profiles[]` – Alle öffentlichen Profile
- `favoriteIds[]` – Favoriten des angemeldeten Nutzers
- `events[]` – Alle verfügbaren Events
- `loading` – Lade-Status
- `loadError` – Fehler-Message
- `drawerCollapsed` – Schublade eingeklappt (true/false)
- `selectedProfile` – Ausgewähltes Profil (für Detailmappe)
- `selectedCardId` – Ausgewählte Karten-ID auf Canvas

**Funktionen:**
- ✅ Lädt Daten beim Mount: `getPublicProfiles()`, `getEvents()`, `getFavorites()`
- ✅ Liest aktives Event aus localStorage (`gigsda_active_event`)
- ✅ Berechnet `profileStatuses` (Bestätigt/Angefragt/Favorit/etc.)
- ✅ Passiert `activeEvent` an alle Subkomponenten

**Daten-Flow:**
```
localStorage (gigsda_active_event)
        ↓
ProjectWorkspace
├── → WorkspaceDrawer (favorites, crew, profiles)
├── → EventInfoBlock (activeEvent, crew, profiles)
└── → WorkspaceCanvas (activeEvent, profileStatuses)
      └── → WorkspaceDetailsPanel (selectedProfile)
```

**Abhängigkeiten:**
- `apiService.js` – getPublicProfiles, getEvents, getFavorites
- `localStorage` – gigsda_active_event, gigsda_profile_id

---

### **2. WorkspaceCanvas.jsx**
**Rolle:** Arbeitsfläche zum Ablegen von Karten (frei positionierbar)

**Props:**
- `selectedCardId` – ID der derzeit ausgewählten Karte
- `profileStatuses` – Map<profileId, statusString>
- `onProfileSelect` – Callback beim Klick auf Karte
- `activeEvent` – Aktuell aktives Event (NEW)

**State:**
- `cards[]` – Karten auf der Arbeitsfläche
  ```javascript
  {
    instanceId: string,           // "profileId-timestamp-index"
    profile: object,              // Profil-Daten
    left: number,                 // X-Position (px)
    top: number,                  // Y-Position (px)
    eventId: string,              // Event-ID (NEW)
    eventTitle: string,           // Event-Titel (NEW)
    placedAt: ISO-string          // Zeitstempel (NEW)
  }
  ```
- `isDragOver` – Benutzer zieht über Canvas (true/false)

**Funktionen:**
- ✅ `handleDrop()` – Karten ablegen
  - Liest Profil-Daten aus Drag-Event
  - Berechnet Position auf Canvas (mit Clamp-Limits)
  - Speichert Event-Bezug lokal (eventId, eventTitle, placedAt)
- ✅ Karten sind verschiebbar (Drag-and-Drop)
- ✅ Visuelle Feedback: "ist-drag-over" Klasse
- ✅ Empty-State: "Ziehe Profile aus der Schublade hierher"

**Speicherung:**
- ⚠️ **NUR LOCAL** – Im Component-State, nicht persistent
- ⚠️ **KEIN API-Call** – Keine Datenbank-Speicherung
- ⚠️ **KEIN localStorage** – Verschwindet beim Refresh

---

### **3. WorkspaceCard.jsx**
**Rolle:** Einzelne Karte auf dem Canvas

**Props:**
- `profile` – Profil-Daten
- `status` – Status-String (z.B. "Bestätigt")
- `eventTitle` – Event-Titel (NEW)
- `selected` – Boolean (Karte ausgewählt)
- `style` – Position {left, top}
- `onClick` – Klick-Handler
- `onDragStart` – Drag-Start Handler

**Render-Elemente:**
- Accent-Stripe (oben)
- Avatar + Name + Kategorie
- Status-Badge mit Status-Text
- Event-Badge (wenn `eventTitle` vorhanden) – NEW
- Drag-Hint "Ziehen zum Verschieben"

**Event-Badge (NEW):**
```
┌──────────────────┐
│ EVENT                      │
│ Raunenfehesang   │
└──────────────────┘
```

**Styling:**
- Gradient-Hintergrund
- Cyan-Accent (#67e8f9)
- Responsive Größe (240px × 150px)
- Hover-Effekte
- Grab-Cursor beim Hover

---

### **4. WorkspaceDrawer.jsx**
**Rolle:** Linke Schublade mit Profil-Quellen

**Props:**
- `collapsed` – Schublade eingeklappt (true/false)
- `onToggle` – Callback zum Ein-/Ausklappen
- `favorites[]` – Favorit-Profile
- `profiles[]` – Alle öffentlichen Profile
- `crew[]` – Crew-Profile des aktiven Events
- `loading` – Boolean
- `loadError` – Error-String oder null
- `hasActiveEvent` – Boolean

**State:**
- `activeTab` – Aktiver Tab ('favorites', 'search', 'crew')
- `search` – Such-Text

**Tabs:**
1. **Favoriten** – Favorites aus der DB
2. **Suche** – Alle Profile mit Live-Filter
   - Durchsucht: Name, Kategorie, Stadt, Ort
3. **Crew** – Nur Crew des aktiven Events

**Funktionen:**
- ✅ Profile werden per Drag-and-Drop in Canvas gezogen
- ✅ Live-Suche (Name, Kategorie, Standort)
- ✅ Collapse-Button zum Ein-/Ausklappen
- ✅ Fehler-Handling und Empty-States

**Conditional Rendering:**
- "Kein aktives Event ausgewählt" – Wenn Crew-Tab und kein Event
- "Keine Favoriten gefunden" – Wenn Favoriten-Tab leer
- "Keine Profile verfügbar" – Wenn Profiles leer
- Loading-State – "Daten werden geladen …"

---

### **5. EventInfoBlock.jsx**
**Rolle:** Event-Informationen im Header

**Props:**
- `event` – Event-Objekt (oder null)
- `crew[]` – Crew-Profile (optional)
- `profiles[]` – Alle Profile (optional)

**Render-Blöcke (Conditional):**

**A. Event-Header**
```
RAUNENFEHESANG
```

**B. Event-Details**
- Event-ID (wenn vorhanden)
- Datum (wenn vorhanden)
- Ort (wenn vorhanden)
- Owner (wenn vorhanden)

**C. KPI-Bereich**
- **Crew** – `event.crewIds?.length`
- **Anfragen** – Crew mit Status "pending/angefragt"
- **Zusagen** – Crew mit Status "confirmed/bestätigt" oder `confirmed=true`

**KPI-Berechnung:**
```javascript
crewCount = event.crewIds?.length || 0
requestsCount = event.crew.filter(m => 
  status in ['pending', 'angefragt', 'requested']
).length
confirmedCount = event.crew.filter(m => 
  status in ['accepted', 'confirmed', 'gebucht'] 
  || m.confirmed === true
).length
```

**Datum-Formatierung:**
- Input: `event.date` oder `event.eventDate` oder `event.startDate`
- Output: "30.10.2026" (de-DE Locale)

**Return Value:**
- `null` – Wenn kein Event
- Vollständiger Block – Wenn Event vorhanden

---

### **6. WorkspaceDetailsPanel.jsx**
**Rolle:** Rechte Detailmappe für ausgewähltes Profil

**Props:**
- `profile` – Profil-Objekt (oder null)

**State:**
- `openSheet` – Boolean (Sheet-Modal offen)
- `openPortfolio` – Boolean (Portfolio-Modal offen)

**Anzeige (wenn Profile vorhanden):**

**Header:**
- "PROJEKT WORKSPACE"
- "DETAILMAPPE"
- File-Mark "01"

**Identity-Bereich:**
- Avatar
- Name
- Kategorie

**Facts:**
- Kategorie
- Standort
- Status (mit grünem Dot)

**Kurzbeschreibung:**
- Text aus: `short_description`, `shortDescription`, `bio`, `description`, `about`

**Aktionen (6 Buttons):**
1. DETAILS – Platzhalter
2. SHEET – Öffnet Role-spezifisches Sheet Modal
3. PORTFOLIO – Öffnet Portfolio Modal
4. CHAT – Platzhalter
5. ANFRAGE – Platzhalter
6. FAVORIT – Platzhalter

**Modals:**
- ✅ Sheet Modal – Mit `SheetRouter` + `getRoleSheet()`
- ✅ Portfolio Modal – Mit `PortfolioRouter`
- ⚠️ Andere Actions – Nur Konsolen-Output (Platzhalter)

**Empty State (wenn kein Profile):**
```
+
Objekt auswählen
Klicke eine Karte auf dem Workspace an...
```

---

## 📊 FUNKTIONEN-MATRIX

| Feature | Status | Typ | Notizen |
|---------|--------|-----|---------|
| Profile laden | ✅ | API | `getPublicProfiles()` |
| Events laden | ✅ | API | `getEvents()` |
| Favoriten laden | ✅ | API | `getFavorites(profileId)` |
| Aktives Event lesen | ✅ | localStorage | `gigsda_active_event` |
| **Karte ablegen** | ✅ | State | Speichert Position + Event-Bezug lokal |
| **Karte verschieben** | ✅ | State | Drag-and-Drop, Position aktualisiert |
| **Karte anklicken** | ✅ | State | Zeigt Profil in Detailmappe |
| Profil durchsuchen | ✅ | State | Live-Filter nach Name/Kategorie/Ort |
| Favoriten anzeigen | ✅ | State | Separate Tab in Schublade |
| Crew anzeigen | ✅ | State | Nur wenn aktives Event |
| Event-Info anzeigen | ✅ | Computed | Titel, ID, Datum, Ort, Owner |
| **KPIs berechnen** | ✅ | Computed | Crew, Anfragen, Zusagen |
| Profilinformationen zeigen | ✅ | Props | In Detailmappe |
| Sheet öffnen | ✅ | Modal | Funktional für Rollen-Sheets |
| Portfolio öffnen | ✅ | Modal | Funktional |
| Status-Badge | ✅ | Computed | Bestätigt/Angefragt/Favorit/etc. |
| **Event-Badge** | ✅ | NEW | Zeigt Event auf Karte |
| Drag-Visual-Feedback | ✅ | CSS | "ist-drag-over" Highlight |
| Schublade collapse | ✅ | State | Toggle-Button |
| **Details speichern** | ⚠️ | Platzhalter | Nur Console.log |
| **Chat starten** | ⚠️ | Platzhalter | Nur Console.log |
| **Anfrage senden** | ⚠️ | Platzhalter | Nur Console.log |
| **Favorit togglen** | ⚠️ | Platzhalter | Nur Console.log |
| Persistierung | ❌ | N/A | Absichtlich nicht implementiert |

---

## 📥 DATEN-QUELLEN

### **Gelesen:**

#### **A. APIs (apiService.js)**
```javascript
getPublicProfiles()
  → Liste aller öffentlichen Profile
  → Feld-Mapping:
     - id, name, display_name, user_name, project_name
     - role, type, gewerk
     - avatarMediaUrl, avatarUrl
     - city, ort, location, standort
     - status, availability, verfuegbarkeit
     - short_description, shortDescription, bio, description, about
     - profile_json (JSON String mit erweiterten Daten)

getEvents()
  → Liste aller Events
  → Feld-Mapping:
     - id, eventId, _id
     - title, name
     - date, eventDate, startDate
     - location, ort, place
     - owner, ownerName, organizer
     - crew[] (Crew-Mitglieder mit status, confirmed)
     - crewIds[] (Array von Profil-IDs)
     - acceptedDeals{} (Map: profileId → confirmed)

getFavorites(profileId)
  → Favorit-Liste des Nutzers
  → Feld: favorite_profile_id
```

#### **B. localStorage**
```javascript
gigsda_active_event
  → JSON-String
  → Feld: id (wird matched gegen event.id, event.eventId, event._id)

gigsda_profile_id
  → Aktuelle Nutzer-ID (für Favoriten-Fetch)
```

---

## 📤 DATEN-SCHREIBVORGÄNGE

### **Geschrieben:**

| Ziel | Daten | Typ | Persistiert |
|------|-------|-----|-------------|
| Canvas State | Cards[] (Position + Event) | JavaScript Object | ❌ Nein |
| Schublade State | activeTab, searchText | String | ❌ Nein |
| Detailmappe State | selectedProfile, selectedCardId | Object/String | ❌ Nein |
| Drawer State | collapsed | Boolean | ❌ Nein |
| Modal State | openSheet, openPortfolio | Boolean | ❌ Nein |

**Keine Schreibvorgänge in:**
- ❌ Datenbank
- ❌ localStorage
- ❌ API

**Alle Daten sind temporär** und gehen beim Refresh verloren.

---

## 🎯 STATUS PRO KOMPONENTE

### **ProjectWorkspace.jsx**
- ✅ Daten-Orchestrierung
- ✅ Event-Auflösung
- ✅ Status-Berechnung
- ✅ Alle Props korrekt weitergegeben

### **WorkspaceCanvas.jsx**
- ✅ Drag-and-Drop funktional
- ✅ Position-Clamp implementiert
- ✅ Event-Bezug speichert (NEW)
- ✅ Karten anklickbar
- ✅ Visual Feedback

### **WorkspaceCard.jsx**
- ✅ Profil-Informationen angezeigt
- ✅ Status-Badge funktional
- ✅ Event-Badge angezeigt (NEW)
- ✅ Drag-Cursor
- ✅ Selected-State

### **WorkspaceDrawer.jsx**
- ✅ 3 Tabs funktional (Favoriten/Suche/Crew)
- ✅ Live-Filter arbeitet
- ✅ Drag-Start setzt korrekten Payload
- ✅ Collapse-Funktion
- ✅ Empty-States und Error-Handling

### **EventInfoBlock.jsx**
- ✅ Event-Titel angezeigt
- ✅ Event-Details (ID, Datum, Ort, Owner)
- ✅ KPIs berechnet
- ✅ Conditional Rendering für fehlende Felder
- ✅ Datum-Formatierung (de-DE)

### **WorkspaceDetailsPanel.jsx**
- ✅ Profil-Informationen angezeigt
- ✅ Sheet-Modal funktional
- ✅ Portfolio-Modal funktional
- ✅ Empty-State
- ⚠️ Action-Buttons: 4 sind Platzhalter (DETAILS, CHAT, ANFRAGE, FAVORIT)

---

## 🎨 STYLING (workspace.css)

**Umfang:** ~800 Zeilen CSS

**Haupt-Klassen:**
- `.workspace-app` – Top-Level Container
- `.workspace-drawer` – Linke Schublade
- `.workspace-main` – Haupt-Bereich
- `.workspace-header` – Header mit Event-Block
- `.workspace-workbench` – Canvas + Detailmappe Flex-Container
- `.workspace-canvas` – Arbeitsfläche
- `.workspace-card` – Einzelne Karte
- `.workspace-card__event` – Event-Badge (NEW)
- `.workspace-details` – Rechte Detailmappe
- `.event-info-*` – Event-Block Styling

**Responsive:**
- Breakpoint: max-width 680px
- Drawer wird schmäler
- Canvas + Details werden übereinander angeordnet

**Design-System:**
- Farben: Slate/Cyan (#67e8f9) auf Dark (#070913)
- Font: Inter
- Spacing: 8px Grid
- Border-Radius: 8-12px

---

## ⚠️ BEKANNTE EINSCHRÄNKUNGEN

### **Absichtlich NICHT implementiert:**
1. **Persistierung** – Cards verschwinden beim Refresh
2. **Datenbank-Speicherung** – Nur LocalStorage lesen
3. **API für Workspace** – Keine neuen Endpoints
4. **Migration** – Keine DB-Änderungen
5. **Action-Buttons** – 4 von 6 sind Platzhalter

### **Daten-Mapping-Abhängigkeiten:**
- Event-Feld-Namen sind flexibel (z.B. `date` oder `eventDate`)
- Profil-Feld-Namen sind flexibel (z.B. `ort` oder `location`)
- Status-Strings werden normalized (lowercase, trim)

### **Fehlerbehandlung:**
- ✅ API-Fehler werden geloggt und angezeigt
- ✅ Parsing-Fehler bei profile_json werden abgefangen
- ✅ Fehlende Felder zeigen Fallback-Texte
- ✅ localStorage-Fehler werden geloggt

---

## 🔄 DATEN-FLOW DIAGRAMM

```
┌─────────────────────────────────────────────────────────────┐
│                     EXTERNAL SOURCES                        │
├─────────────────────────────────────────────────────────────┤
│  API (getPublicProfiles) → profiles[]                      │
│  API (getEvents)        → events[]                         │
│  API (getFavorites)     → favoriteIds[]                    │
│  localStorage           → activeEventRef                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
            ┌──────────────────────┐
            │  ProjectWorkspace    │
            │  (Orchestrator)      │
            └──────────────────────┘
                  │    │    │
      ┌───────────┼────┼────┼────────────┐
      │           │    │    │            │
      ↓           ↓    ↓    ↓            ↓
    Drawer    Canvas Event-Info   Details-Panel
      │           │    │              │
      │     ┌─────┘    │              │
      │     │  cards[] │              │
      │     │  (State) │              │
      │     ↓          │              ↓
      │   Card       KPIs         (selected profile)
      │     │
      └─────┴─────────────────────────────────┐
                                              │
                                    USER INTERACTIONS
                                    (No persistence)
```

---

## 📋 KOMPONENTEN-CHECKLISTE

- [x] ProjectWorkspace – Main Container
- [x] WorkspaceCanvas – Arbeitsfläche
- [x] WorkspaceCard – Einzelne Karte
- [x] WorkspaceDrawer – Profil-Quellen
- [x] EventInfoBlock – Event-Header
- [x] WorkspaceDetailsPanel – Detailmappe
- [x] workspace.css – Vollständiges Styling

---

## 🎯 VERSION HISTORIE

### **V1 (Aktuell) – 15.11.2026**
- ✅ Basis-Layout: 3-spaltig (Drawer | Canvas | Details)
- ✅ Drag-and-Drop Profiles
- ✅ Event-Infoblock mit KPIs
- ✅ Profildetails anzeigen
- ✅ Sheet + Portfolio Modals
- ✅ Event-Bezug pro Karte
- ✅ Live-Suche
- ✅ 3 Drawer-Tabs

### **V2 (Geplant) – Offen**
- [ ] Persistierung (localStorage)
- [ ] Action-Buttons Implementierung
- [ ] Weitere KPIs / Metriken
- [ ] Export-Funktionen

---

## 📝 NOTIZEN

**Warum keine Persistierung in V1?**
- Anforderung war: "Nur lokal im Workspace-State halten"
- Keine Datenbankänderungen
- Keine API-Aufrufe
- Korrekt umgesetzt ✅

**Event-Bezug Speicherung:**
- Jede Karte speichert beim Ablegen:
  - `eventId` – Eindeutige Event-ID
  - `eventTitle` – Event-Name für Anzeige
  - `placedAt` – Zeitstempel des Ablegung
- Lokal im Canvas-State
- Angezeigt auf der Karte

**Komponenten-Unabhängigkeit:**
- Drawer und Canvas sind unabhängig
- Canvas speichert Profil-Snapshots (nicht Referenzen)
- Detailmappe reagiert nur auf Klicks
- Event-Block ist deklarativ (dependet auf Props)

**Performance:**
- useMemo für profileStatuses, favorites, crew, visibleProfiles
- Keine unnötigen Re-Renders
- Canvas: Nur selectedCardId wird zur Comparison verwendet

---

**Dokumentation erstellt:** 15.11.2026  
**Autor:** GIGSDA Workspace Team  
**Status:** ✅ Test Version 1

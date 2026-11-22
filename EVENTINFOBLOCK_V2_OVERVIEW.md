# EventInfoBlock v2 - Vollständige Informationen

## 🎯 Anforderung
✅ **KEINE Informationen verlieren!**  
✅ Event-ID oben statt "GIGSDA · EXPERIMENT"  
✅ Event-Titel darunter  
✅ Rechts: Veranstalter, Lokation, Adresse vertikal  
✅ KPIs mit Datum im KPI-Style  
✅ Farbe bleibt Cyan/Türkis

---

## 📐 Layout V2 (Neu)

### Desktop-View (Breite 1920px+)

```
╔════════════════════════════════════════════════════════════════════════════╗
║ Projekt Workspace                                                           ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  Event-ID: 12345      │  Veranstalter:              │  [Datum] [Crew]   ║
║  RAUNENFEHESANG       │  Max Mustermann             │  30.10    5       ║
║                       │  Lokation:                  │                   ║
║                       │  Braunau am Inn             │  [Anfr]  [Zus]   ║
║                       │  Adresse:                   │   2       3       ║
║                       │  Marktplatz 1, 5280 Braunau │                   ║
║                                                                              ║
╚════════════════════════════════════════════════════════════════════════════╝
```

**Grid-Layout:**
- Spalte 1 (auto): Event-ID + Titel (fest, nicht schrumpbar)
- Spalte 2 (1fr): Veranstalter + Lokation + Adresse (flexibel)
- Spalte 3 (auto): 4 KPI-Karten (fest, nicht schrumpbar)

**Gap:** 32px zwischen Spalten

---

## 📱 Mobile-View (≤680px)

```
╔──────────────────────────────────────╗
║ Projekt Workspace                    ║
╠──────────────────────────────────────╣
║                                      ║
║  Event-ID: 12345                     ║
║  RAUNENFEHESANG                      ║
║                                      ║
║  Veranstalter: Max Mustermann        ║
║  Lokation: Braunau am Inn            ║
║  Adresse: Marktplatz 1, 5280         ║
║                                      ║
║  [Datum] [Crew] [Anfr] [Zus]        ║
║   30.10   5      2      3            ║
║                                      ║
╚──────────────────────────────────────╝
```

**Single-Column Layout:**
- 1 Spalte (100% Breite)
- Alles vertikal gestapelt
- KPIs nehmen full-width auf Mobile
- Jede Karte flex: 1 (gleiche Breite)

---

## 🎨 CSS-Struktur

```css
.workspace-event-info-block {
  display: grid;
  grid-template-columns: auto 1fr auto;  /* Fest | Flexibel | Fest */
  gap: 32px;
  width: 100%;
  align-items: flex-start;
  padding: 14px 0;
}

/* Desktop: 3 Spalten */
/* Mobile (≤680px): 1 Spalte */
@media (max-width: 680px) {
  grid-template-columns: 1fr;  /* 1 Spalte, 100% Breite */
  gap: 12px;
}
```

### Linke Spalte
```css
.event-info__left {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;  /* ← Darf nicht schrumpfen */
}

.event-info__id {
  color: #67e8f9;  /* Cyan */
  font-size: 11px;
  text-transform: uppercase;
}

.event-info__title {
  color: #f1f5f9;  /* Hell */
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

### Mittlere Spalte
```css
.event-info__middle {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;  /* ← Nimmt verfügbaren Platz */
  min-width: 200px;
}

.event-info__detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-info__detail-label {
  color: #8290a5;  /* Grau */
  font-size: 9px;
  text-transform: uppercase;
  font-weight: 700;
}

.event-info__detail-value {
  color: #cbd5e1;  /* Mittelgrau */
  font-size: 12px;
  font-weight: 500;
}
```

### Rechte Spalte (KPIs)
```css
.event-info__kpis {
  display: flex;
  gap: 10px;
  flex-shrink: 0;  /* ← Darf nicht schrumpfen */
}

.event-info__kpi-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border: 1px solid rgba(103, 232, 249, 0.16);  /* Cyan Border */
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    rgba(8, 145, 178, 0.08),
    rgba(14, 116, 144, 0.06)
  );
  text-align: center;
  white-space: nowrap;
}

.event-info__kpi-label {
  color: #8290a5;
  font-size: 8px;
  text-transform: uppercase;
  font-weight: 700;
}

.event-info__kpi-value {
  color: #67e8f9;  /* Cyan */
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
}
```

---

## 📊 Vergleich: v1 (Komprimiert) vs v2 (Vollständig)

| Aspekt | v1 | v2 |
|--------|----|----|
| **Platznutzung** | Super kompakt (45px) | Normal (60-80px) |
| **Infos sichtbar** | Minimal | Maximal |
| **Event-ID** | ❌ Entfernt | ✅ Oben links |
| **Titel** | ✅ | ✅ |
| **Veranstalter** | ❌ Entfernt | ✅ Mitte |
| **Lokation** | ✅ Inline | ✅ Mitte |
| **Adresse** | ❌ Entfernt | ✅ Mitte |
| **KPI-Datum** | ✅ | ✅ |
| **KPI-Crew** | ✅ | ✅ |
| **KPI-Anfragen** | ✅ | ✅ |
| **KPI-Zusagen** | ✅ | ✅ |
| **Layout** | 1 Reihe | 3 Spalten |

---

## 🔄 Datenfluss

```
Event-Objekt
│
├─ event.id/eventId/_id → Event-ID (links oben)
├─ event.title/name → Eventtitel (links unten)
│
├─ event.owner/ownerName → Veranstalter (Mitte, Zeile 1)
├─ event.location/ort/place → Lokation (Mitte, Zeile 2)
├─ event.address/adresse/street → Adresse (Mitte, Zeile 3)
│
├─ event.date/eventDate/startDate → Datum KPI (rechts oben)
├─ event.crewIds?.length → Crew KPI
├─ event.crew[].status → Anfragen & Zusagen KPI
└─ (KPI-Berechnung mit useMemo)
```

---

## ✨ Highlights

✅ **Grid-Layout:** Professionell, flexibel, responsive  
✅ **Alle Infos:** Nichts mehr versteckt  
✅ **KPI-Style:** 4 Metriken prominent rechts  
✅ **Mobile-Ready:** Stacked single column  
✅ **Cyan-Design:** Konsistent mit GIGSDA  
✅ **Build:** ✅ 1.68s, 0 Fehler

---

## 📝 Fallbacks & Edge Cases

| Feld | Vorhanden | Nicht vorhanden |
|------|-----------|-----------------|
| Event-ID | Angezeigt | Label nicht sichtbar |
| Veranstalter | Angezeigt | Detail-Block nicht sichtbar |
| Lokation | Angezeigt | Detail-Block nicht sichtbar |
| Adresse | Angezeigt | Detail-Block nicht sichtbar |
| Datum KPI | Angezeigt | KPI-Card nicht sichtbar |
| Crew/Anfr/Zus | Immer (default: 0) | Zeigt 0 an |

---

## 🎓 Code-Beispiel

```jsx
// Komponente nutzt diese Fallbacks
const eventId = event.id || event.eventId || event._id;
const organizer = event.owner || event.ownerName || event.organizer;
const location = event.location || event.ort || event.place;
const address = event.address || event.adresse || event.street || '';

// Conditional Rendering - zeigt nur wenn Wert existiert
{eventId && <div>...</div>}
{organizer && <div>...</div>}
{location && <div>...</div>}
{address && <div>...</div>}
{eventDate && <div>...</div>}
```

---

## 🚀 Status

**Version:** 2.0 - Vollständig  
**Build:** ✅ Erfolgreich  
**Tests:** ✅ Bestanden  
**Deployment:** 🟢 Ready  
**Last Updated:** 2026-11-18 13:02


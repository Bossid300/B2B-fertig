# Event Info Block Implementation

## Übersicht
Der Workspace wurde um einen echten Event-Infoblock im Header erweitert. Dieser zeigt detaillierte Informationen zum aktuell aktiven Event sowie kompakte KPI-Metriken an.

## Neue Dateien

### `src/experimental/workspace/components/EventInfoBlock.jsx`
React-Komponente, die:
- Event-Informationen anzeigt (Titel, ID, Datum, Ort, Owner)
- KPIs berechnet und anzeigt (Crew, Anfragen, Zusagen)
- Nur verfügbare Felder rendert (conditional rendering)
- Automatisch `null` zurückgibt, wenn kein Event aktiv ist

## Geänderte Dateien

### `src/experimental/workspace/ProjectWorkspace.jsx`
- Import von `EventInfoBlock` hinzugefügt
- Alter einfacher Event-Text durch `<EventInfoBlock event={activeEvent} crew={crew} profiles={profiles} />` ersetzt
- Die Komponente wird im Header renderiert

### `src/experimental/workspace/workspace.css`
- Alte `.workspace-event` CSS-Klasse und ihre Media-Query-Regeln entfernt
- Neue CSS-Klassen für EventInfoBlock hinzugefügt:
  - `.workspace-event-info-block`: Container
  - `.event-info__header`: Titel-Bereich
  - `.event-info__title`: Event-Titel
  - `.event-info__details`: Details-Container
  - `.event-info__detail-item`: Einzelne Detail-Reihe
  - `.event-info__detail-label`: Label
  - `.event-info__detail-value`: Wert
  - `.event-info__kpis`: KPI-Grid
  - `.event-info__kpi-card`: Einzelne KPI-Karte
  - `.event-info__kpi-label`: KPI-Label
  - `.event-info__kpi-value`: KPI-Wert
- Responsive Design mit Mobile-First-Approach

## Datenquellen

Die Komponente verwendet nur bereits vorhandene Event-Felder:

| Information | Mögliche Quellen | Fallback |
|-------------|------------------|----------|
| Event-Titel | `event.title` oder `event.name` | "Event" |
| Event-ID | `event.id`, `event.eventId` oder `event._id` | Nicht angezeigt |
| Datum | `event.date`, `event.eventDate` oder `event.startDate` | Nicht angezeigt |
| Ort | `event.location`, `event.ort` oder `event.place` | Nicht angezeigt |
| Owner | `event.owner`, `event.ownerName` oder `event.organizer` | Nicht angezeigt |
| Crew-Anzahl | `event.crewIds?.length` | 0 |
| Anfragen | `event.crew[]` mit `status: 'pending/angefragt/requested'` | 0 |
| Zusagen | `event.crew[]` mit `status: 'confirmed/accepted/gebucht'` oder `confirmed: true` | 0 |

## Anforderungen erfüllt

✅ **Position**: Im Header des Workspace  
✅ **Vollständige Eventinformationen**: Event-ID, Datum, Ort, Owner  
✅ **Nur vorhandene Daten**: Keine neuen Datenbankfelder, keine Migration, keine API  
✅ **Flexible Anzeige**: Felder werden nur angezeigt, wenn vorhanden  
✅ **KPI-Bereich**: Crew, Anfragen, Zusagen in Kartenformat  
✅ **Design**: Konsistent mit GIGSDA Design System (cyan/türkis)  
✅ **Responsive**: Funktioniert auf Desktop und Mobile  

## Testing

Der Build wurde erfolgreich durchgeführt:
- ✅ Vite Build erfolgreich
- ✅ Keine TypeScript/Linting-Fehler in der neuen Komponente
- ✅ Hot Module Replacement funktioniert
- ✅ Backward Compatible: Alte Event-Daten werden weiterhin unterstützt

## Zukunft

Falls zusätzliche Event-Felder in Zukunft verfügbar sind, können sie einfach hinzugefügt werden:

```jsx
// Beispiel: Event-Beschreibung hinzufügen
const description = event.description || event.descriptionShort;
```

Die Komponente wird automatisch nur die Felder rendern, die einen Wert haben.

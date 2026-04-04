# Pitchdeck Tool – Prozess & UI/UX Spezifikation

## Ziel

Entwicklung einer mobilen & Desktop-optimierten Web-App zur Erstellung automatisierter Pitchdecks:

- geführter Prozess (Wizard-Flow)
- klare Kartenstruktur statt komplexem Dashboard
- KI-gestützte Konzept- & Slide-Erstellung
- asynchrone Präsentation (inkl. Audio optional)

---

## 1. Gesamt-UX Prinzipien

### Design-Leitlinien

- Mobile First
- Kartenbasierte UI (Card System)
- Minimaler kognitiver Load
- Geführter Prozess statt freier Navigation
- Live-Preview statt statischer Outputs

### Hauptbereiche

1. Übersicht (Cards)
2. Pitchdeck-Erstellung (Wizard)
3. Konzept-Review
4. Slide-Editor
5. Präsentations-Output

---

## 2. Startscreen (Home / Übersicht)

### UI-Aufbau

Grid mit Cards:

#### Card-Typen

- 🟡 Entwürfe (Draft)
- 🔵 In Bearbeitung (Processing)
- 🟢 Gesendet (Delivered)

#### Card-Inhalt

- Titel (Kunde)
- Status
- Fortschritt (%)
- Letzte Änderung
- Quick Actions:
  - Öffnen
  - Duplizieren
  - Löschen

#### CTA

- ➕ "Neues Pitchdeck erstellen"

---

## 3. Pitchdeck Wizard (Step-by-Step Flow)

### Navigation

- Progress Bar oben
- Zurück / Weiter Buttons
- Autosave

---

### STEP 1: Kundendaten

#### UI

Form Card

#### Felder

- Firmenname
- Ansprechpartner
- Branche
- Website
- Zusatzinfos

---

### STEP 2: Discovery (Kerninput)

#### UI

Mehrere Cards (Sections)

#### Sections

1. Pain Points
2. Ziele
3. Prozesse
4. Tech-Stack
5. Budget / Prioritäten

#### Features

- Freitext + strukturierte Inputs
- Chips / Tags für schnelle Eingabe

---

### STEP 3: Stil-Konfiguration

#### UI

Visual Selection Grid

#### Optionen

##### Textstil

- Minimal
- Medium
- Ausführlich

##### Tonalität

- Business
- Sales
- Technisch

##### Designstil

- Clean
- Modern
- Bold
- Corporate

##### Bildstil

- Realistisch
- Illustration
- 3D
- Minimal Icons

#### UX

- Jede Auswahl zeigt Preview
- Hover / Tap → Beispiel-Folie

---

### STEP 4: Dokumente & Kontext

#### UI

Upload Card

#### Funktionen

- PDFs hochladen
- Webseiten analysieren
- Notizen hinzufügen

---

### STEP 5: Konzept generieren

#### UI

Centered Action Screen

#### Button

🚀 "Konzept generieren"

#### Prozess (Backend)

- Deep Research
- Strukturierung
- Konzeptaufbau

#### Frontend Feedback

Loader mit Steps:

- Analyse läuft
- Struktur wird erstellt
- Pitch wird aufgebaut

---

## 4. Konzept-Review

### UI

Vertical Flow (Scroll)

### Sections

- Executive Summary
- Probleme
- Lösungen
- Strategie
- Roadmap

### Interaktionen

- Inline Edit
- Accept / Reject pro Abschnitt
- Kommentare

### CTA

- "Konzept freigeben"

---

## 5. Slide-Generierung

### Prozess

Nach Freigabe: automatische Erstellung aller Slides

### UI

Slide Overview Grid

#### Slide Card

- Titel
- Vorschau
- Status (Generated / Edited)

---

## 6. Slide Editor

### Layout

Split Screen:

#### Links

- Struktur / Inhalte

#### Rechts

- Live Preview

### Bearbeitbare Elemente

#### Text

- Headline
- Bulletpoints
- Fließtext

#### Bilder

- Automatisch generiert
- Button: "Neu generieren"
- Style bleibt konstant

#### Layout

Komponenten wechseln:

- Grid
- Hero
- Timeline

---

## 7. Sprechertext + Audio

### UI

Slide Detail View

### Tabs

- Inhalt
- Sprechertext
- Audio

### Funktionen

- Auto-generierter Sprechertext
- Editierbar
- Audio generieren (optional)

---

## 8. Finaler Review

### UI

Geführter Flow

### Pro Slide

- Preview
- Text
- Audio Check

### CTA

- "Pitchdeck finalisieren"

---

## 9. Präsentations-Output

### UI (Kundensicht)

#### Format

Scrollbare Landingpage

### Aufbau

#### Section = Slide

- Titel
- Inhalt
- Bild
- Audio (Auto-Play optional)

### Features

- Fortschrittsanzeige
- Navigation
- Mobile optimiert
- Share-Link
- Passwortschutz (optional)

---

## 10. Datenmodell (Frontend-relevant)

### Entities

#### Client

- id
- name
- branche

#### DiscoverySession

- inputs
- status

#### Concept

- sections[]
- approved

#### PitchDeck

- slides[]

#### Slide

- title
- content
- image
- script
- audio

---

## 11. UX Highlights

### Wichtig

- Kein klassisches Dashboard
- Flow statt Tool
- Jede Entscheidung visuell
- KI = Assistent, nicht Blackbox

---

## 12. MVP Fokus

### Must-Have

- Discovery Flow
- Konzeptgenerierung
- Slide-Struktur
- Web-Präsentation

### Später

- Audio
- Bilder-Feinschliff
- Templates
- Multi-User

---

## Fazit

Die App funktioniert wie ein geführter Verkaufsprozess:

→ Input  
→ Struktur  
→ Review  
→ Output  

Nicht wie ein Editor, sondern wie ein intelligenter Assistent.

import React from 'react';

export const initialProfilesData = [
  {
    id: "Jud-Winston",
    name: "Winston",
    lastname: "Jud",
    phone: "+43 (676) 47 555 22",
    email: "winston@gigsda.com",
    zip: "5280",
    city: "Braunau am Inn",
    bio: "Handgemachter, rauer Rock direkt aus dem Keller auf die großen Bühnen. Wir bringen unsere eigene Backline mit.",
    genre: "Rock",
    minGage: "350",
    wishGage: "500",
    kmCost: "0.30",
    facebook: "://facebook.com",
    twitter: "://twitter.com",
    youtube: "://youtube.com",
    // Dynamische Pfade passend zu deinem Ordner
    folder: "Jud-Winston",
    slide0Sub: "// op-winston.html"
  },
  {
    id: "Pichler-Oliver",
    name: "Oliver",
    lastname: "Pichler",
    stageName: "Socn MC",
    phone: "+43 (XXX) XX XX XX", // Hier bei Bedarf anpassen
    email: "oliver@gigsda.com",
    zip: "5280",
    city: "Braunau am Inn",
    bio: "HipHop Liveartist direkt aus Braunau am Inn. Gerockte Locations: Rockhaus SBG, Postkutsche Mattsee, Stadtoase Braunau, Haus der Jugend Simbach, Festhalle Schalchen, etc.",
    genre: "HipHop",
    minGage: "400",
    wishGage: "600",
    kmCost: "0.40",
    facebook: "https://facebook.com",
    twitter: "://twitter.com",
    youtube: "https://youtube.com",
    // Dynamische Pfade passend zu deinem Ordner
    folder: "Pichler-Oliver",
    slide0Sub: "// op-oliver.html"
  },
    {
    id: "Klingelsberger-Daniel",
    name: "Daniel",
    lastname: "Klingelsberger",
    stageName: "Licht- & Tontechnik",
    phone: "+43 (XXX) XX XX XX", // Bei Bedarf anpassen
    email: "daniel@gigsda.com",
    zip: "5280",
    city: "Braunau am Inn",
    bio: "Erfahrener Techniker für Live-Events und Club-Gigs. Full-Service Betreuung von der Planung bis zur Show.",
    genre: "Licht & Ton", // Missbraucht als Spezialisierung
    minGage: "250",
    wishGage: "400",
    kmCost: "0.42",
    facebook: "://facebook.com",
    twitter: "://twitter.com",
    youtube: "://youtube.com",
    folder: "Klingelsberger-Daniel",
    slide0Sub: "// op-input.html",
    slide0Gen: "Spezialisiert: HOG4 Operator",
    slide1Sub: "Live-Produktion",
    slide1Gen: "Großbühnen & Licht-Design",
    slide2Sub: "Gala & Club-Betreuung",
    slide2Gen: "Perfekter Sound & Atmosphäre",
    slide3Sub: "Festival Setup",
    slide3Gen: "Zuverlässige Systemtechnik"
  },
    {
    id: 8, // Exakte ID aus der mockData!
    name: "Stadtpark",
    lastname: "OpenAir",
    stageName: "Sommerbühne",
    phone: "+43 (XXX) XX XX XX",
    email: "events@stadtpark-braunau.at",
    zip: "5280",
    city: "Braunau am Inn",
    bio: "Saisonale Sommerbühne im Herzen von Braunau. Voll ausgestattete Open-Air Location mit integrierter Gastronomie, perfekt für Live-Gigs, Festivals und Unplugged-Sessions im Grünen.",
    genre: "Open-Air Bühne", // Als Location-Typ genutzt
    minGage: "Keine (Gastro)", 
    wishGage: "Eintritts-Split",
    kmCost: "0.00",
    facebook: "://facebook.com",
    twitter: "://twitter.com",
    youtube: "://youtube.com",
    folder: "Stadtpark-OpenAir", // Name für den neuen Bilder-Ordner
    slide0Sub: "// location-view.html",
    slide0Gen: "Kapazität: Bis 500 Personen",
    slide1Sub: "Hauptbühne",
    slide1Gen: "Überdachte Open-Air Konstruktion",
    slide2Sub: "Zuschauerbereich",
    slide2Gen: "Idyllische Wiese mit Gastro-Inseln",
    slide3Sub: "Technik-Rider",
    slide3Gen: "Inklusive 16-Kanal Tonanlage"
  },
    {
    id: 13, // Exakte ID aus der mockData
    name: "AudioRent",
    lastname: "Group",
    stageName: "PA & Veranstaltungstechnik",
    phone: "+43 (XXX) XX XX XX",
    email: "rent@audiorent-group.at",
    zip: "5280",
    city: "Braunau am Inn",
    bio: "Dein professioneller Partner für Großbeschallung und Event-Technik im Innviertel. Wir liefern modernste Line-Arrays, digitale Mischpulte und drahtlose Mikrofonsysteme inklusive Full-Service Betreuung vor Ort.",
    genre: "PA & Tonsysteme", // Als Verleiher-Typ genutzt
    minGage: "200", // Hier als Mindest-Mietpreis genutzt
    wishGage: "500",
    kmCost: "0.50",
    facebook: "://facebook.com",
    twitter: "://twitter.com",
    youtube: "://youtube.com",
    folder: "AudioRent-Group", // Name für den Bilder-Ordner
    slide0Sub: "// supplier-view.html",
    slide0Gen: "Fokus: Line-Arrays & Tonsysteme",
    slide1Sub: "PA Beschallung",
    slide1Gen: "Druckvoller Sound für jede Location",
    slide2Sub: "FOH Mischpulte",
    slide2Gen: "Digitale High-End Konsolen",
    slide3Sub: "Mikrofonie Setup",
    slide3Gen: "Drahtlose Funkstrecken & Verleih"
  },
  {
    id: 14, // Exakte ID aus der mockData
    name: "Backline",
    lastname: "Support",
    stageName: "Instrumenten- & Ampverleih",
    phone: "+43 (XXX) XX XX XX",
    email: "office@backline-support.at",
    zip: "5280",
    city: "Braunau am Inn",
    bio: "Erstklassiger Backline-Verleih für Festivals, Club-Gigs und Tourneen. Wir stellen perfekt gewartete Schlagzeuge, legendäre Röhren-Gitarrenverstärker (Marshall, Fender) und amtliche Bass-Rigs bereit.",
    genre: "Instrumente & Amps",
    minGage: "150",
    wishGage: "350",
    kmCost: "0.35",
    facebook: "://facebook.com",
    twitter: "://twitter.com",
    youtube: "://youtube.com",
    folder: "Backline-Support", // Name für den Bilder-Ordner
    slide0Sub: "// supplier-view.html",
    slide0Gen: "Fokus: Amps & Schlagzeuge",
    slide1Sub: "Gitarren-Amps",
    slide1Gen: "Klassischer Marshall- & Fender-Sound",
    slide2Sub: "Drum-Kits",
    slide2Gen: "Komplette Schlagzeuge spielbereit gestimmt",
    slide3Sub: "Bass-Rigs",
    slide3Gen: "Ampeg Power für das perfekte Fundament"
  }



];

export const initialEventsData = [
  { id: 1, title: "Winston Jud – Live & Unplugged", venue: "Backstage Halle, München", date: "Fr, 18. Sept 2026", time: "Einlass: 19:00 Uhr // Showtime: 21:00 Uhr", category: "Rock" },
  { id: 2, title: "The Neon Sparks – Electro-Pop Night", venue: "The Jazz Cave, Landshut", date: "Sa, 10. Okt 2026", time: "Einlass: 20:00 Uhr // Beginn: 21:30 Uhr", category: "Electro-Pop" },
  { id: 3, title: "Stadtpark OpenAir Fest", venue: "Stadtpark Wiese, Braunau", date: "Sa, 15. Aug 2026", time: "Beginn: 14:00 Uhr // Curfew: 22:00 Uhr", category: "Festivals" }
];

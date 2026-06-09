import React from 'react';

export const initialWinstonProfile = {
  name: "Winston",
  lastname: "Jud",
  genre: "Rock, Old School",
  bioEinleitung: "Das Wichtigste in ein bis zwei Sätzen (Geburtsname, Geburtsdatum, Nationalität, Genre, wichtige Bandzugehörigkeiten, Bedeutung).",
  bioKarriere: "Je nach Bedeutung des Musikers einen oder mehrere Abschnitte zur künstlerischen Laufbahn erstellen. Bei längeren Beiträgen ist es sinnvoll, diese mit Untertiteln zu versehen.",
  bioPrivates: "Kurze Beschreibung des privaten Lebens (Familie etc.) Dabei beachten, dass für lebende Personen besondere Richtlinien gelten.",
  diskografie: "Hier sollte eine chronologische Diskografie publiziert werden. Es ist keine Liste nötig, die alle Titel eines Albums enthält, ebenso wenig wie Liedlänge und sämtliche Remix-Versionen oder Auslandserscheinungen.",
  tracks: [
    { id: 1, title: "HaWiSve" },
    { id: 2, title: "Until Sky" },
    { id: 3, title: "Picture of a Dream" },
    { id: 4, title: "Where The Peace Comes From" }
  ],
  aufstellung: "Drums Center, Lead-Vocals vorne Mitte. Vorerst genügt ein Bild bis unser Bühnenkonfigurator verfügbar ist.",
  backline: "Marshall JCM800 Gitarren-Amp, Ampeg SVT Bass-Rig, Shure SM58 Mikrofone.",
  
  // 📸 DIE ECHTEN SLIDER-BILDER UND TEXTE
  slides: [
    { id: 0, image: '/winston_banner.jpg', sub: 'Musiker: Winston Jud', gen: 'Genre: Rock, Old School' },
    { id: 1, image: '/live1.jpg', sub: 'Live on Stage', gen: 'Braunau am Inn // Club-Gig' },
    { id: 2, image: '/live2.jpg', sub: 'Backstage & Rehearsal', gen: 'Ehrlicher Keller-Sound' },
    { id: 3, image: '/live3.jpg', sub: 'Gear & Backline Setup', gen: 'Marshall Power & Pure Rock' }
  ]
};

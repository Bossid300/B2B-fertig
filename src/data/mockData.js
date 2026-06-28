// src/data/mockData.js

export const initialUsers = [
  {
    id: "GIGS-7677",
    name: "Winston Jud",
    role: "Künstler",
    city: "Altötting"
  },
  {
    id: "GIGS-1111",
    name: "Security grober lackl",
    role: "Crew",
    city: "Braunau"
  }
  // Hier kannst du deine restlichen 10 Test-User als einfache Objekte einreihen
];

export const initialProfiles = [
  {
    id: "GIGS-7677",
    name: "Winston Jud",
    mainInstrument: "E-Gitarre",
    subInstruments: "Vocals",
    genre: "Rock/Rockig",
    formation: "solo",
    rate_hour: "75",
    rate_day: "600",
    payment_terms: "14",
    gage_min: 600,
    gage_max: 1200,
    duration_max: 90,
    rider_monitors: "IEM Stereo",
    rider_backline: "2x 230V Schuko am Platz",
    setup_time: 45,
    patch_matrix: [
      { ch: "1", audio_signal: "Vocals", mikrofon: "wet" },
      { ch: "2", audio_signal: "E-Gitarre", mikrofon: "wet" }
    ]
  },
  {
    id: "GIGS-8899", // Deine bestehende ID der Arena
    name: "Arena Braunau",
    role: "Location",
    city: "Braunau am Inn",
    room_capacity: 200,
    // === NEUE B2B TECH-FIELDS FÜR LOCATIONS ===
    power_supply: "CEE 32A",       // Branchenstandard für Club/Mittelgroße Halle
    curfew_time: "02:00"           // Uhrzeit, ab wann die Musik leise sein muss
  }

];

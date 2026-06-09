import React from 'react';
import { Music, Building, Hammer, Wrench } from 'lucide-react';

export const searchDatabase = [
  { id: 'Jud-Winston', name: 'Winston Jud', type: 'artist', typeLabel: 'Künstler // Rock', location: '1.2 km entfernt', info: 'Live im Subway Club heute ab 21:00 Uhr.', icon: <Music className="w-4 h-4 text-emerald-400" />, lng: 45, lat: 20 },
  { id: 'spark', name: 'The Neon Sparks', type: 'artist', typeLabel: 'Künstler // Pop', location: '0.8 km entfernt', info: 'Spontanes Open-Air am Königsplatz.', icon: <Music className="w-4 h-4 text-emerald-400" />, lng: 35, lat: 30 },
  { id: 'luna', name: 'Luna & The Beats', type: 'artist', typeLabel: 'Künstler // Indie', location: '2.5 km entfernt', info: 'Melancholischer Indie-Pop.', icon: <Music className="w-4 h-4 text-emerald-400" />, lng: 55, lat: 50 },
  { id: 'cyber', name: 'DJ CyberPulse', type: 'artist', typeLabel: 'Künstler // Techno', location: '4.8 km entfernt', info: 'Treibender Dark-Techno, Vinyl Set.', icon: <Music className="w-4 h-4 text-emerald-400" />, lng: 60, lat: 15 },
  { id: 'backstage', name: 'Backstage Halle', type: 'location', typeLabel: 'Location // Club', location: '3.5 km entfernt', info: '🔥 HEUTE: Metal-Night & Indoor Festival.', icon: <Building className="w-4 h-4 text-cyan-400" />, lng: 70, lat: 40 },
  { id: 6, name: 'Kulturzentrum West', type: 'location', typeLabel: 'Location // Halle', location: '8.1 km entfernt', info: 'Große Open-Air Fläche und Halle.', icon: <Building className="w-4 h-4 text-cyan-400" />, lng: 85, lat: 25 },
  { id: 7, name: 'The Jazz Cave', type: 'location', typeLabel: 'Location // Keller', location: '1.7 km entfernt', info: 'Urbane Kellerbar für Unplugged-Gigs.', icon: <Building className="w-4 h-4 text-cyan-400" />, lng: 30, lat: 45 },
  { id: 8, name: 'Stadtpark OpenAir', type: 'location', typeLabel: 'Location // Wiese', location: '6.2 km entfernt', info: 'Saisonale Sommerbühne mit Gastro.', icon: <Building className="w-4 h-4 text-cyan-400" />, lng: 75, lat: 70 },
  { id: 9, name: 'Sarah Sound', type: 'tech', typeLabel: 'Techniker // Ton', location: '4.1 km entfernt', info: 'Freie Kapazitäten für Last-Minute Support.', icon: <Hammer className="w-4 h-4 text-purple-400" />, lng: 20, lat: 65 },
  { id: 10, name: 'Marcus Light', type: 'tech', typeLabel: 'Techniker // Licht', location: '3.0 km entfernt', info: 'Spezialist für DMX Shows & Timecode.', icon: <Hammer className="w-4 h-4 text-purple-400" />, lng: 50, lat: 60 },
  { id: 11, name: 'Tom Stagehand', type: 'tech', typeLabel: 'Techniker // Aufbau', location: '1.5 km entfernt', info: 'Schneller Auf- und Abbau vor Ort.', icon: <Hammer className="w-4 h-4 text-purple-400" />, lng: 40, lat: 55 },
  { id: 12, name: 'Elena Monitor', type: 'tech', typeLabel: 'Techniker // In-Ear', location: '5.5 km entfernt', info: 'Anspruchsvolle Monitor-Mischung.', icon: <Hammer className="w-4 h-4 text-purple-400" />, lng: 15, lat: 35 },
  { id: 13, name: 'AudioRent Group', type: 'supplier', typeLabel: 'Verleiher // PA', location: '7.0 km entfernt', info: 'Line-Arrays und Mikrofone im Großverleih.', icon: <Wrench className="w-4 h-4 text-amber-400" />, lng: 80, lat: 80 },
  { id: 14, name: 'Backline Support', type: 'supplier', typeLabel: 'Verleiher // Amps', location: '2.1 km entfernt', info: 'Miet-Schlagzeuge & Marshall Amps.', icon: <Wrench className="w-4 h-4 text-amber-400" />, lng: 22, lat: 22 },
  { id: 15, name: 'FX Effects Berlin', type: 'supplier', typeLabel: 'Verleiher // FX', location: '9.5 km entfernt', info: 'Nebelmaschinen & CO2-Jets für Shows.', icon: <Wrench className="w-4 h-4 text-amber-400" />, lng: 90, lat: 60 },
  { id: 16, name: 'Cables & More', type: 'supplier', typeLabel: 'Verleiher // Strom', location: '3.8 km entfernt', info: 'Kabelbrücken & Baustromverteiler.', icon: <Wrench className="w-4 h-4 text-amber-400" />, lng: 50, lat: 75 },
  { id: "Pichler-Oliver", name: "Socn MC", type: "artist", typeLabel: "Künstler // HipHop", location: "0.2 km entfernt", info: "HipHop Liveartist direkt aus Braunau am Inn. Gerockte Locations: Rockhaus SBG, Postkutsche Mattsee, Stadtoase Braunau.", icon: <Music className="w-4 h-4 text-emerald-400" />, lng: 42, lat: 28 },
  { id: "Klingelsberger-Daniel", name: "Daniel Klingelsberger", type: "tech", typeLabel: "Techniker // Licht & Ton", location: "1.5 km entfernt", info: "Professioneller Systemtechniker & Lichtoperator. Spezialisiert auf HOG4 Konsolen und Event-Betreuung.", icon: <Hammer className="w-4 h-4 text-purple-400" />, lng: 48, lat: 32 }

];


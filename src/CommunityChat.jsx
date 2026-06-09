import React, { useState } from 'react';
import { Send, Users, ShieldCheck, MapPin } from 'lucide-react';

export default function CommunityChat({ onBack, progress, onNavigateToStep }) {
  // 1. Die Teilnehmerliste (Sidebar) direkt aus eurer Projekt-Crew
  const crewChannels = [
    { id: 'all', name: "📢 Haupt-Kanal", role: "Alle Crewmitglieder", isGroup: true },
    { id: 'jud', name: "Winston Jud", role: "Künstler // Main-Act", active: true },
    { id: 'pichler', name: "Oliver Pichler (Socn MC)", role: "Künstler // Support" },
    { id: 'klingelsberger', name: "Daniel Klingelsberger", role: "Licht- & Tonsystemtechnik" },
    { id: 'stadtpark', name: "Stadtpark OpenAir", role: "Location // Braunau" },
    { id: 'audiorent', name: "AudioRent Group", role: "PA & Tonsystem-Verleih" },
  ];

  const [activeChannel, setActiveChannel] = useState('all');
  const [message, setMessage] = useState('');
  
  // Beispiel-Nachrichten für das System
  const [chatHistory, setChatHistory] = useState([
    { id: 1, channel: 'all', user: 'Daniel Klingelsberger', text: 'Moin! Tonsystem steht bereit. Habt ihr den Rider final freigegeben?', time: '14:22' },
    { id: 2, channel: 'all', user: 'Stadtpark OpenAir', text: 'Ja, Rider ist auf 100%. Stromanschlüsse auf der Hauptbühne sind verriegelt.', time: '14:35' },
    { id: 3, channel: 'all', user: 'Winston Jud', text: 'Hammer! Soundcheck machen wir dann pünktlich um 16:30 Uhr.', time: '15:01' },
    
    // Private Nachrichten vorbelegt
    { id: 4, channel: 'klingelsberger', user: 'Daniel Klingelsberger', text: '[Direktnachricht] Hey Winston, bringst du dein eigenes Gesangsmikrofon mit?', time: 'Gestern' },
  ]);

  const currentChannelInfo = crewChannels.find(c => c.id === activeChannel);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = {
      id: Date.now(),
      channel: activeChannel,
      user: "Winston Jud (Du)",
      text: message,
      time: "Jetzt"
    };

    setChatHistory([...chatHistory, newMsg]);
    setMessage('');

    // 🛸 DER INTELLIGENTE GIGSDA-DISPATCHER (Passend zu eurer Struktur!)
    setTimeout(() => {
      const queryText = newMsg.text.toLowerCase();
      let botAnswer = "Verstanden. Ich habe das Protokoll aktualisiert. Benötigst du weitere Daten zur Pipeline?";

      if (queryText.includes("budget") || queryText.includes("geld") || queryText.includes("finanz")) {
        botAnswer = "📊 REAKTIVES BUDGET-CLEARING: Das verfügbare Budget beträgt aktuell 14.500,00 €. 8.320,00 € sind fest für Gagen gebunden.";
      } else if (queryText.includes("crew") || queryText.includes("shortlist") || queryText.includes("musiker")) {
        botAnswer = "🚨 CREW-WARNUNG: Bei 'Winston Jud - Live & Unplugged' hakt es noch in Meilenstein 1. Es stehen noch 3 Zusagen aus.";
      } else if (queryText.includes("rider") || queryText.includes("bühne") || queryText.includes("tech")) {
        botAnswer = "⚙️ RIDER-CHECKED: Die Bühnenanweisungen für das 'Stadtpark OpenAir Fest' wurden vom Künstler zu 100 % freigegeben.";
      } else if (queryText.includes("hallo") || queryText.includes("hi ") || queryText.includes("moin")) {
        botAnswer = "🛸 GIGSDA COCKPIT ACTIVE: Hallo Manager! Ich scanne den LocalStorage. Wonach suchst du? (Budgets, Crew, Rider...)";
      }

      const botMsg = {
        id: Date.now() + 1,
        channel: activeChannel,
        user: "Gigsda Dispatcher",
        text: botAnswer,
        time: "Jetzt"
      };

      setChatHistory(prev => [...prev, botMsg]);
    }, 1000);
  };


  // Filtert nur die Nachrichten für den aktuell ausgewählten Kanal
  const filteredMessages = chatHistory.filter(m => m.channel === activeChannel);

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs">
      
      {/* HEADER */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">// Ebene 3b: Crew-Kommunikation</span>
          <h2 className="text-xl font-bold text-white mt-0.5">CommunityChat & Absprachen</h2>
          <p className="text-slate-400 text-[11px]">Direkter Draht zu Künstlern, Technikern und Dienstleistern ohne WhatsApp-Chaos.</p>
        </div>
        <button type="button" onClick={onBack} className="bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold hover:text-white hover:border-slate-700 transition-all">
          ‹ Dashboard
        </button>
      </div>

      {/* CHAT GRID-SPLIT: SIDEBAR LINKS vs. NACHRICHTEN RECHTS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[500px]">
        
        {/* LINKS: INTERAKTIVE TEILNEHMER-BUTTONS (4 Spalten) */}
        <div className="md:col-span-4 bg-slate-950 border border-slate-900 rounded-3xl p-4 flex flex-col gap-2 overflow-y-auto">
          <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest mb-1">// Crew Kanäle & Kontakte</p>
          
          {crewChannels.map((channel) => {
            const isSelected = activeChannel === channel.id;
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full text-left p-3 rounded-2xl border transition-all flex flex-col justify-center min-h-[54px] active:scale-[0.98] ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'bg-slate-900/40 border-slate-900/60 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-tight block truncate">
                  {channel.name}
                </span>
                <span className="text-[9px] font-mono text-slate-500 mt-0.5 block truncate">
                  {channel.role}
                </span>
              </button>
            );
          })}
        </div>

        {/* RECHTS: CHATFENSTER (8 Spalten) */}
        <div className="md:col-span-8 bg-slate-900/40 border border-slate-900 rounded-3xl flex flex-col overflow-hidden h-full">
          
          {/* Aktiver Kanal-Header */}
          <div className="bg-slate-950 border-b border-slate-900/60 p-4 shrink-0 flex justify-between items-center">
            <div>
              <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest">// Chatkanal aktiv</span>
              <h3 className="text-sm font-black text-white">{currentChannelInfo?.name}</h3>
            </div>
            <span className="text-[9px] font-mono text-slate-600 bg-slate-900 px-2 py-1 rounded-md">
              Secure Core ✓
            </span>
          </div>

          {/* Nachrichten-Verlauf */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-[11px] bg-slate-950/20">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => {
                const isMe = msg.user.includes("(Du)");
                return (
                  <div key={msg.id} className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 mb-0.5 px-1">
                      <span className={isMe ? 'text-cyan-400 font-bold' : 'text-purple-400'}>{msg.user}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className={`p-3 rounded-2xl border ${
                      isMe 
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200 rounded-tr-none' 
                        : 'bg-slate-900 border-slate-800 text-slate-300 rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 opacity-60">
                <p className="text-lg">💬</p>
                <p className="mt-1 font-mono text-[10px] uppercase">Kanal ist verschlüsselt und leer.</p>
                <p className="text-[9px] text-slate-700 mt-0.5">Schreibe die erste Nachricht, um die Absprache zu starten.</p>
              </div>
            )}
          </div>

          {/* Eingabezeile ganz unten */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-900 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder={`Nachricht an ${currentChannelInfo?.name} verfassen...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 text-xs"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-2.5 rounded-xl font-bold flex items-center justify-center transition-all active:scale-95 shadow-md shadow-cyan-500/10"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Send, Users, ShieldCheck, MapPin } from 'lucide-react';

export default function CommunityChat({ onBack, progress, onNavigateToStep }) {

  const currentUserName = localStorage.getItem('gigsda_user_name');
  const profiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
  const currentProfile = profiles.find(p =>
    (p.name || '').toLowerCase() === (currentUserName || '').toLowerCase()
  );
  const currentUserId = currentProfile?.id || "";

  const activeStub = JSON.parse(localStorage.getItem('gigsda_active_event') || 'null');
  const events = JSON.parse(localStorage.getItem('gigsda_events') || '[]');

  const activeEvent = events.find(e => e.id === activeStub?.id);
  const hasAccess =
  activeEvent &&
  (
    activeEvent.ownerId === currentUserId ||
    activeEvent.crewIds?.includes(currentUserId)
  );

  // 1. Die Teilnehmerliste (Sidebar) direkt aus eurer Projekt-Crew

const crewChannels = (() => {
  const activeStub = JSON.parse(localStorage.getItem('gigsda_active_event') || 'null');
  const events = JSON.parse(localStorage.getItem('gigsda_events') || '[]');
  const profiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');

  const currentEvent = events.find(e => e.id === activeStub?.id);

  const members = (currentEvent?.crewIds || [])
    .map(id => profiles.find(p => p.id === id))
    .filter(Boolean);

    return [
      {
        id: 'all',
        name: "📢 Haupt-Kanal",
        role: "Alle Crewmitglieder",
        isGroup: true,
        unread: false
      },

      ...members.map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        unread: false
      }))
    ];
})();


const [activeChannel, setActiveChannel] = useState('USR-8717');
  const [message, setMessage] = useState('');
    
  // Beispiel-Nachrichten für das System
    const [chatHistory, setChatHistory] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('gigsda_chats') || '[]');
    if (!activeEvent) return [];
    const eventChat = saved.find(c => c.eventId === activeEvent.id);
    return eventChat?.messages || [];
  });

  const currentChannelInfo = crewChannels.find(c => c.id === activeChannel);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = {
      id: Date.now(),
      senderId: currentUserId,
      receiverId: activeChannel,
      channel: activeChannel,
      text: message,
      time: "Jetzt"
    };
    
    const chats = JSON.parse(localStorage.getItem('gigsda_chats') || '[]');
    const activeEvent = JSON.parse(localStorage.getItem('gigsda_active_event') || 'null');

    if (!activeEvent) return;

    // finde chat für dieses event
    let eventChat = chats.find(c => c.eventId === activeEvent.id);

    if (!eventChat) {
      eventChat = {
        eventId: activeEvent.id,
        messages: []
      };
      chats.push(eventChat);
    }

    // neue message rein
    eventChat.messages.push({
      id: Date.now(),
      senderId: currentUserId,
      channel: activeChannel,
      text: message,
      time: new Date().toLocaleTimeString().slice(0,5)
    });

    // speichern
    localStorage.setItem('gigsda_chats', JSON.stringify(chats));



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

  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-slate-400">
        <p className="text-lg">🔒 Zugriff verweigert</p>
        <p className="text-sm mt-2">
          Du bist kein Teil dieses Projekts.
        </p>
      </div>
    );
  }

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
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-tight block truncate">
                    {channel.name}
                  </span>

                    {channel.unread && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>
                    )}
                </div>

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
                const isMe = msg.user?.includes("(Du)");
                const senderName =
                  profiles.find(p => p.id === msg.senderId)?.name ||
                  msg.user ||
                  "Unbekannt";

                return (
                  <div key={msg.id} className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 mb-0.5 px-1">
                      <span className={isMe ? 'text-cyan-400 font-bold' : 'text-purple-400'}>{senderName}</span>
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

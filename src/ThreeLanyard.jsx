import React, { useState, useRef } from 'react';
import { QrCode, Users, RotateCw } from 'lucide-react';

export default function ThreeLanyard({ ticketName, setView }) {
  const [flipped, setFlipped] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest('.qr-clickable')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: Math.max(-150, Math.min(150, e.clientX - dragStart.current.x)),
      y: Math.max(-30, Math.min(200, e.clientY - dragStart.current.y))
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const distance = Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2));
    if (distance < 5) setFlipped(!flipped);
    setPosition({ x: 0, y: 0 });
  };

  const anchorX = 120;
  const lanyardPath = `M ${anchorX} 0 Q ${anchorX + position.x * 0.4} ${(90 + position.y) * 0.5} ${anchorX + position.x} ${80 + position.y}`;

  return (
    <div className="w-full h-[400px] relative overflow-visible flex flex-col items-center justify-end pb-4 select-none cursor-grab active:cursor-grabbing" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
        <path d={lanyardPath} fill="none" stroke="url(#lGradient)" strokeWidth="3.5" strokeLinecap="round" />
        <defs><linearGradient id="lGradient" x1="0" y1="0" x2="0" y2="100%"><stop offset="0%" stopColor="#1e293b" /><stop offset="100%" stopColor="#10b981" /></linearGradient></defs>
      </svg>
      <div onMouseDown={handleMouseDown} style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)`, transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} className="w-56 h-[270px] [perspective:1000px] relative z-20">
        <div className={`w-full h-full relative [transform-style:preserve-3d] duration-700 ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
          <div className="absolute inset-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center shadow-2xl flex flex-col justify-between [backface-visibility:hidden]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-t-2xl" />
            <Users className="w-8 h-8 mx-auto text-cyan-400 mt-2" />
            <h3 className="text-base font-black text-white truncate px-1">{ticketName}</h3>
            <div className="bg-slate-950 p-2 rounded-xl text-[8px] text-slate-500 font-mono flex justify-between border border-slate-900"><span>GIGSDA LIVE</span><span className="text-slate-400 font-bold">#48RT56</span></div>
          </div>
          <div className="absolute inset-0 bg-slate-900 border border-emerald-500/10 rounded-2xl p-4 text-center shadow-2xl flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div onClick={(e) => { e.stopPropagation(); setView('profile'); }} className="qr-clickable w-20 h-20 bg-white p-1.5 rounded-xl mx-auto flex items-center justify-center cursor-pointer"><QrCode className="text-slate-950" /></div>
            <div className="text-[8px] font-mono bg-slate-950 py-1.5 rounded-lg text-emerald-400 border border-slate-900 font-semibold">Klicke QR-Code für Profil</div>
          </div>
        </div>
      </div>
    </div>
  );
}

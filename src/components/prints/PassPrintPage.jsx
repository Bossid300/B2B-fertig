import React, { useState, useEffect } from 'react';
import { getProfilesDb } from '../../services/apiService';
import QRCode from "react-qr-code";

export default function PassPrintPage() {
  const [profile, setProfile] = useState(null);
  const targetUser = localStorage.getItem('gigsda_user_name');

  useEffect(() => {
    getProfilesDb()
      .then(profiles => {
        const found = profiles.find(
          p =>
            p &&
            (p.name || p.user_name || p.display_name)
              ?.trim()
              .toLowerCase() ===
            targetUser?.trim().toLowerCase()
        );

        if (found) {
          if (found.profile_json) {
            setProfile(JSON.parse(found.profile_json));
          } else {
            setProfile(found);
          }
        }
      })
      .catch(console.error);
  }, [targetUser]);

  useEffect(() => {
    if (profile) {
      const timer = setTimeout(() => {
        window.print();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen font-sans text-slate-400">
        Pass wird geladen...
      </div>
    );
  }

  return (
    <>
      <style>{`
        @page {
          size: A4 landscape;
          margin: 0mm !important;
        }
        @media print {
          html, body {
            background: #ffffff !important;
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 210mm !important;
            overflow: hidden !important; /* Verhindert das Entstehen einer zweiten Seite */
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-page-wrapper {
            display: flex !important;
            flex-direction: row !important;
            justifyContent: center !important;
            align-items: center !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            width: 297mm !important;
            height: 210mm !important;
            max-height: 210mm !important;
            padding: 0 !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
            overflow: hidden !important; /* Riegelt den Container ab */
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .print-card-scale {
            width: 85mm !important;
            height: 54mm !important;
            min-height: 54mm !important;
            border-radius: 4mm !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          header, footer, nav { display: none !important; }
        }
      `}</style>

      <div
        className="print-page-wrapper"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15mm',
          background: '#f4f4f5',
          padding: '0 20mm',
          boxSizing: 'border-box'
        }}
      >
        
        {/* VORDERSEITE */}
        <div
          className="print-card-scale bg-[rgba(25,50,99,1)] border border-cyan-500/20 relative overflow-hidden flex items-center"
          style={{
            width: '85mm',
            height: '54mm',
            borderRadius: '4mm',
            padding: '4mm 5mm',
            boxSizing: 'border-box'
          }}
        >
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-fuchsia-500/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-full grid grid-cols-[32mm_1px_1fr] items-center text-white">
            <div className="flex flex-col items-center justify-center pr-1">
              <div className="w-[19mm] h-[19mm] rounded-full p-[1px] bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_8px_rgba(34,211,238,0.35)] flex items-center justify-center">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-[18mm] h-[18mm] rounded-full object-cover"
                />
              </div>
              <p className="text-cyan-400 mt-2 tracking-[0.15em] uppercase text-[12px] font-bold text-center">
                GIGSDA PASS
              </p>
            </div>

            <div className="h-[38mm] w-px bg-cyan-500/30" />

            <div className="text-left pl-4 flex flex-col justify-center">
              <p className="text-cyan-400 tracking-[0.15em] uppercase text-[10px] font-bold mb-1">
                VERIFIED MEMBER
              </p>
              <h3 className="text-[16px] font-black leading-tight text-white break-words max-w-[42mm]">
                {profile.name}
              </h3>
              <div className="mt-1 text-[12px] font-mono font-bold text-cyan-400 tracking-wider">
                {profile.id}
              </div>
              <div className="mt-2 inline-block self-start px-2 py-0.5 rounded-full border border-cyan-500/50 text-cyan-400 text-[10px] font-bold tracking-wider uppercase">
                ARTIST MEMBER • 2026
              </div>
            </div>
          </div>
        </div>

        {/* RÜCKSEITE */}
        <div
          className="print-card-scale bg-[rgba(25,50,99,1)] border border-cyan-500/20 relative overflow-hidden flex items-center"
          style={{
            width: '85mm',
            height: '54mm',
            borderRadius: '4mm',
            padding: '4mm 5mm',
            boxSizing: 'border-box'
          }}
        >
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-fuchsia-500/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-full grid grid-cols-[1fr_1px_32mm] items-center text-white">
            <div className="text-left pr-4 flex flex-col justify-center">
              <p className="text-cyan-400 tracking-[0.15em] uppercase text-[9px] font-bold mb-1">
                GIGSDA
              </p>
              <h3 className="text-[15px] font-black leading-tight text-white">MUSIK.</h3>
              <h3 className="text-[15px] font-black leading-tight text-white">VERANSTALTUNGEN.</h3>
              <h3 className="text-[15px] font-black leading-tight text-cyan-400">DABEI SEIN.</h3>
              <p className="mt-2 text-slate-400 text-[9px] leading-tight">
                Portfolio • Profil • Referenzen
              </p>
              <p className="mt-0.5 text-cyan-400 font-mono text-[9px]">
                ://gigsda.com
              </p>
            </div>

            <div className="h-[38mm] w-px bg-cyan-500/30" />

            <div className="flex flex-col items-center justify-center pl-2">
              <div className="w-[25mm] h-[25mm] rounded-xl border border-cyan-500/20 bg-slate-950 flex items-center justify-center p-1">
                <QRCode
                  value={`https://gigsda.com/2026?portfolio=${profile.id}`}
                  size={76}
                  bgColor="transparent"
                  fgColor="#ffffff"
                />
              </div>
              <p className="mt-1 text-cyan-400 text-[8px] tracking-[0.15em] uppercase text-center w-full">
                Digital Access
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

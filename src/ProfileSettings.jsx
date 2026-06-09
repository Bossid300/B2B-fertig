import React, { useState } from 'react';
import { Save } from 'lucide-react';
import ProfileFormFields from './ProfileFormFields.jsx';

export default function ProfileSettings({ onBack, currentData, onSaveSuccess }) {
  const [formData, setFormData] = useState({ ...currentData });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveSuccess) onSaveSuccess(formData);
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl my-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">// op-input.html</span>
          <h2 className="text-base font-black text-white">Profileingabemaske (Backstage)</h2>
        </div>
        <button type="button" onClick={onBack} className="text-xs text-slate-500 hover:text-white">Abbrechen</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ProfileFormFields formData={formData} setFormData={setFormData} />
        <div className="pt-2 flex justify-end">
          <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black px-6 h-10 rounded-xl text-xs shadow-lg transition-transform hover:scale-105">
            Änderungen speichern
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { Ticket, CompanySettings } from '@/types';
import { Download, Upload, Trash2, Store, Key, Sparkles, ImageIcon, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { checkSystemStatus } from '@/services/geminiService';

const Settings = ({ tickets, onImport, onClear, companySettings, onUpdateCompany }: any) => {
  const [active, setActive] = useState('company');
  const [ai, setAi] = useState('idle');
  const fileRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const handleLogo = (e: any) => {
    const f = e.target.files[0];
    if(f && f.size < 500000) {
       const r = new FileReader();
       r.onloadend = () => onUpdateCompany({...companySettings, logo: r.result});
       r.readAsDataURL(f);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex gap-4">
          <button onClick={() => setActive('company')} className={`px-4 py-2 rounded-lg font-bold flex gap-2 ${active==='company'?'bg-black text-white':'bg-white'}`}><Store className="w-4 h-4"/> Negocio</button>
          <button onClick={() => setActive('data')} className={`px-4 py-2 rounded-lg font-bold flex gap-2 ${active==='data'?'bg-black text-white':'bg-white'}`}><Download className="w-4 h-4"/> Datos</button>
       </div>

       {active === 'company' && (
         <div className="bg-white p-6 rounded-2xl border space-y-6">
            <div>
               <label className="block font-bold mb-2">Logo</label>
               <div className="flex gap-4">
                  <div className="w-24 h-24 border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden relative group">
                     {companySettings.logo ? <img src={companySettings.logo} className="w-full h-full object-contain"/> : <ImageIcon className="text-gray-300"/>}
                     {companySettings.logo && <button onClick={() => onUpdateCompany({...companySettings, logo: undefined})} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100"><Trash2/></button>}
                  </div>
                  <button onClick={() => logoRef.current?.click()} className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex gap-2"><Upload className="w-4 h-4"/> Subir Logo</button>
                  <input ref={logoRef} type="file" className="hidden" accept="image/*" onChange={handleLogo}/>
               </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
               <div><label className="font-bold text-sm">Nombre</label><input className="w-full p-2 border rounded" value={companySettings.name} onChange={e=>onUpdateCompany({...companySettings, name: e.target.value})}/></div>
               <div><label className="font-bold text-sm">Teléfono</label><input className="w-full p-2 border rounded" value={companySettings.phone} onChange={e=>onUpdateCompany({...companySettings, phone: e.target.value})}/></div>
            </div>
            <div><label className="font-bold text-sm">Dirección</label><input className="w-full p-2 border rounded" value={companySettings.address} onChange={e=>onUpdateCompany({...companySettings, address: e.target.value})}/></div>
            <div><label className="font-bold text-sm">Términos</label><textarea className="w-full p-2 border rounded" rows={3} value={companySettings.terms} onChange={e=>onUpdateCompany({...companySettings, terms: e.target.value})}/></div>
            <div className="pt-4 border-t">
               <button onClick={async () => {setAi('loading'); const ok = await checkSystemStatus(); setAi(ok?'ok':'error');}} className={`w-full p-2 rounded font-bold border ${ai==='ok'?'bg-green-100 text-green-700':'bg-gray-50'}`}>{ai==='loading'?'...':ai==='ok'?'IA Conectada':'Probar IA'}</button>
            </div>
         </div>
       )}

       {active === 'data' && (
         <div className="bg-white p-6 rounded-2xl border space-y-4">
            <div className="flex gap-4">
               <button onClick={() => {const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(tickets)],{type:'application/json'})); a.download='backup.json'; a.click();}} className="flex-1 p-4 border rounded-xl hover:bg-gray-50 flex justify-center gap-2"><Download/> Exportar</button>
               <button onClick={() => fileRef.current?.click()} className="flex-1 p-4 border rounded-xl hover:bg-gray-50 flex justify-center gap-2"><Upload/> Importar</button>
               <input ref={fileRef} type="file" className="hidden" accept=".json" onChange={e => {const f=e.target.files?.[0]; if(f){const r=new FileReader(); r.onload=ev=>{try{onImport(JSON.parse(ev.target?.result as string));}catch{alert('Error');}}; r.readAsText(f);}}} />
            </div>
            <div className="bg-red-50 p-4 rounded-xl flex justify-between items-center text-red-700 border border-red-200">
               <span className="font-bold flex gap-2"><AlertTriangle/> Zona Peligro</span>
               <button onClick={onClear} className="bg-white px-3 py-1 rounded border border-red-200 text-sm">Reset</button>
            </div>
         </div>
       )}
    </div>
  );
};
export default Settings;
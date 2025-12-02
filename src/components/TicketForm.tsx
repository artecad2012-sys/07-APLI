import React, { useState } from 'react';
import { Ticket, TicketStatus } from '@/types';
import { analyzeDeviceIssue } from '@/services/geminiService';
import { Sparkles, Loader2, Save, User, Smartphone } from 'lucide-react';

export default function TicketForm({ onSubmit }: { onSubmit: (t: any) => void }) {
  const [form, setForm] = useState({ customerName: '', customerPhone: '', deviceModel: '', issueDescription: '', priceQuote: 0 });
  const [ai, setAi] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!form.deviceModel) return;
    setLoading(true);
    const res = await analyzeDeviceIssue(form.deviceModel, form.issueDescription);
    setAi(res);
    setLoading(false);
    if(res?.estimatedPrice) setForm({...form, priceQuote: res.estimatedPrice});
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-6">Nuevo Ingreso</h2>
        <div className="space-y-4">
          <input className="w-full p-3 border rounded-lg" placeholder="Nombre Cliente" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} />
          <input className="w-full p-3 border rounded-lg" placeholder="Teléfono" value={form.customerPhone} onChange={e => setForm({...form, customerPhone: e.target.value})} />
          <input className="w-full p-3 border rounded-lg" placeholder="Modelo Dispositivo" value={form.deviceModel} onChange={e => setForm({...form, deviceModel: e.target.value})} />
          <textarea className="w-full p-3 border rounded-lg" rows={3} placeholder="Falla" value={form.issueDescription} onChange={e => setForm({...form, issueDescription: e.target.value})} />
          <div className="flex gap-4 items-center">
            <button type="button" onClick={analyze} disabled={loading} className="px-4 py-2 border rounded-lg flex gap-2 items-center hover:bg-gray-50">{loading?<Loader2 className="animate-spin"/>:<Sparkles/>} IA Analizar</button>
            <input type="number" className="p-2 border rounded-lg w-32 font-bold text-lg" value={form.priceQuote} onChange={e => setForm({...form, priceQuote: +e.target.value})} />
          </div>
          <button onClick={() => onSubmit({...form, status: TicketStatus.RECEIVED, aiDiagnosis: ai})} className="w-full bg-black text-white p-4 rounded-xl font-bold flex justify-center gap-2"><Save/> Guardar</button>
        </div>
      </div>
      {ai && (
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
           <h3 className="font-bold text-purple-800 mb-4 flex gap-2"><Sparkles/> Diagnóstico</h3>
           <p className="font-bold text-xs text-gray-500">PROBLEMA</p><p className="mb-2">{ai.category}</p>
           <p className="font-bold text-xs text-gray-500">TIEMPO</p><p className="mb-2">{ai.estimatedTime}</p>
           <p className="font-bold text-xs text-gray-500">SUGERENCIAS</p>
           <ul className="list-disc pl-4 text-sm">{ai.suggestedActions?.map((a:string,i:number)=><li key={i}>{a}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
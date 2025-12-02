import React, { useState } from 'react';
import { Ticket, TicketStatus } from '@/types';
import { Search, Printer, CheckCircle } from 'lucide-react';

export default function TicketList({ tickets, onStatusUpdate, onPrint }: any) {
  const [search, setSearch] = useState('');
  const filtered = tickets.filter((t: Ticket) => t.customerName.toLowerCase().includes(search.toLowerCase()) || t.deviceModel.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reparaciones</h2>
      <div className="relative"><Search className="absolute left-3 top-3 text-gray-400"/><input className="w-full pl-10 p-3 border rounded-xl" placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="grid gap-4">
        {filtered.map((t: Ticket) => (
          <div key={t.id} className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center">
             <div>
               <div className="flex gap-2 mb-1"><span className="text-xs font-mono bg-gray-100 px-2 rounded">#{t.id.slice(-4)}</span><span className="text-xs font-bold">{t.status}</span></div>
               <h3 className="font-bold">{t.deviceModel}</h3>
               <p className="text-sm text-gray-600">{t.customerName}</p>
             </div>
             <div className="flex gap-2">
               {t.status !== TicketStatus.DELIVERED && <button onClick={() => onStatusUpdate(t.id, TicketStatus.DELIVERED)} className="p-2 bg-green-100 text-green-700 rounded"><CheckCircle/></button>}
               <button onClick={() => onPrint(t, 'ticket')} className="p-2 border rounded hover:bg-gray-50"><Printer/></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
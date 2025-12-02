import React from 'react';
import { Ticket, TicketStatus } from '@/types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports({ tickets }: { tickets: Ticket[] }) {
  const data = [
    { name: 'Activos', value: tickets.filter(t => t.status !== TicketStatus.DELIVERED).length },
    { name: 'Entregados', value: tickets.filter(t => t.status === TicketStatus.DELIVERED).length }
  ];
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="font-bold mb-4">Resumen</h3>
        <p className="text-4xl font-bold">${tickets.filter(t => t.status === TicketStatus.DELIVERED).reduce((a,b)=>a+b.priceQuote,0)}</p>
        <p className="text-gray-500">Ingresos Totales</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border shadow-sm h-64">
        <ResponsiveContainer width="100%" height="100%"><BarChart data={data}><XAxis dataKey="name"/><Tooltip/><Bar dataKey="value" fill="#000"/></BarChart></ResponsiveContainer>
      </div>
    </div>
  );
}
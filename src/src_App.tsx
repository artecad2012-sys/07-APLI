import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { PrintLayout } from './components/PrintLayout';
import { Ticket, TicketStatus, CompanySettings } from './types';
import { Smartphone, Lock, ArrowRight, Loader2, CheckSquare, HelpCircle } from 'lucide-react';

const DEFAULT_COMPANY: CompanySettings = {
  name: 'Mi Centro de Servicio',
  address: 'Av. Principal 123',
  phone: '555-0000',
  terms: 'Garantía 30 días.'
};

const injectStyles = () => {
  if (typeof window === 'undefined') return;
  // @ts-ignore
  if (typeof window.tailwind === 'undefined') {
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);
  }
};

const LoginScreen: React.FC<{ onLogin: (r: boolean) => void, companyName: string, companyLogo?: string }> = ({ onLogin, companyName, companyLogo }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => injectStyles(), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const stored = localStorage.getItem('techfix_pin') || '1234';
      if(pin === stored) onLogin(false);
      else { setError(true); setPin(''); }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border relative">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4 border overflow-hidden">
             {companyLogo ? <img src={companyLogo} className="w-full h-full object-contain"/> : <Smartphone className="w-8 h-8"/>}
          </div>
          <h1 className="text-2xl font-bold">{companyName}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="password" value={pin} onChange={e => {setError(false); setPin(e.target.value.slice(0,4));}} className="w-full text-center text-2xl tracking-widest p-4 border rounded-xl" placeholder="PIN" maxLength={4}/>
          {error && <p className="text-red-500 text-center">PIN Incorrecto</p>}
          <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold">{loading ? '...' : 'Entrar'}</button>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [auth, setAuth] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [company, setCompany] = useState<CompanySettings>(DEFAULT_COMPANY);
  const [print, setPrint] = useState<{data: Ticket, format: 'ticket' | 'a5'} | null>(null);

  useEffect(() => {
    injectStyles();
    const t = localStorage.getItem('techfix_tickets');
    if(t) setTickets(JSON.parse(t));
    const c = localStorage.getItem('techfix_company');
    if(c) setCompany(JSON.parse(c));
  }, []);

  useEffect(() => { localStorage.setItem('techfix_tickets', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('techfix_company', JSON.stringify(company)); }, [company]);

  if(!auth) return <LoginScreen onLogin={() => setAuth(true)} companyName={company.name} companyLogo={company.logo}/>;

  return (
    <>
      <Layout activeTab={tab} onTabChange={setTab} onLogout={() => setAuth(false)} companyName={company.name} companyLogo={company.logo}>
        {tab === 'dashboard' && <div className="text-2xl font-bold">Bienvenido a {company.name}</div>}
        {tab === 'new-ticket' && <TicketForm onSubmit={(t) => {
           setTickets([{...t, id: Math.random().toString().slice(2,8), createdAt: Date.now(), updatedAt: Date.now(), history: []}, ...tickets]);
           setTab('tickets');
        }} />}
        {tab === 'tickets' && <TicketList tickets={tickets} onStatusUpdate={(id, s) => setTickets(tickets.map(t => t.id===id ? {...t, status: s} : t))} onPrint={(t, f) => {setPrint({data: t, format: f}); setTimeout(() => window.print(), 100);}} />}
        {tab === 'reports' && <Reports tickets={tickets} />}
        {tab === 'settings' && <Settings tickets={tickets} onImport={setTickets} onClear={() => setTickets([])} companySettings={company} onUpdateCompany={setCompany} />}
      </Layout>
      {print && <PrintLayout data={print.data} format={print.format} companySettings={company} />}
    </>
  );
};
export default App;
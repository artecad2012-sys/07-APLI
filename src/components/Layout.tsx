import React from 'react';
import { Smartphone, LayoutDashboard, FilePlus, FileText, Settings, Menu, X, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  companyName?: string;
  companyLogo?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onLogout, companyName = 'TechFix Pro', companyLogo }) => {
  const [open, setOpen] = React.useState(false);
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-ticket', label: 'Ingreso', icon: FilePlus },
    { id: 'tickets', label: 'Reparaciones', icon: Smartphone },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100 no-print">
      <aside className={`fixed inset-y-0 z-50 w-64 bg-black text-white transition-transform md:relative md:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3">
          {companyLogo ? <img src={companyLogo} className="w-10 h-10 bg-white rounded object-contain"/> : <Smartphone/>}
          <span className="font-bold truncate">{companyName}</span>
          <button onClick={() => setOpen(false)} className="md:hidden ml-auto"><X/></button>
        </div>
        <nav className="p-4 space-y-2">
          {items.map(i => (
            <button key={i.id} onClick={() => {onTabChange(i.id); setOpen(false);}} className={`w-full flex gap-3 p-3 rounded ${activeTab===i.id?'bg-white text-black':'text-gray-400 hover:text-white'}`}>
              <i.icon className="w-5 h-5"/> {i.label}
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto">
          <button onClick={onLogout} className="w-full flex gap-3 p-3 text-red-400 hover:bg-gray-900 rounded"><LogOut/> Salir</button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-6 justify-between shrink-0">
          <button onClick={() => setOpen(true)} className="md:hidden"><Menu/></button>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold">A</div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
           <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};
export default Layout;
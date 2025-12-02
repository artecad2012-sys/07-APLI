import React, { useRef, useState, useEffect } from 'react';
import { Ticket, CompanySettings } from '@/types';
import { Download, Upload, Trash2, AlertTriangle, Store, Key, Sparkles, Loader2, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { checkSystemStatus } from '@/services/geminiService';

interface SettingsProps {
  tickets: Ticket[];
  onImport: (data: Ticket[]) => void;
  onClear: () => void;
  companySettings: CompanySettings;
  onUpdateCompany: (settings: CompanySettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ tickets, onImport, onClear, companySettings, onUpdateCompany }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  // En producción, simplificamos las pestañas o quitamos 'deploy' si no se necesita.
  // Pero para mantener consistencia, dejaremos las pestañas.
  const [activeTab, setActiveTab] = useState<'data' | 'company'>('company');
  const [accessPin, setAccessPin] = useState('1234');
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const savedPin = localStorage.getItem('techfix_pin');
    if (savedPin) setAccessPin(savedPin);
  }, []);

  const handlePinChange = (newPin: string) => {
    const cleanPin = newPin.replace(/\D/g, '').slice(0, 4);
    setAccessPin(cleanPin);
    if (cleanPin.length === 4) {
      localStorage.setItem('techfix_pin', cleanPin);
    }
  };

  const handleTestAi = async () => {
    setAiStatus('loading');
    const isWorking = await checkSystemStatus();
    setAiStatus(isWorking ? 'success' : 'error');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(tickets, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respaldo_taller_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          onImport(data);
        } else {
          alert('El archivo no tiene el formato correcto.');
        }
      } catch (err) {
        alert('Error al leer el archivo de respaldo.');
      }
    };
    reader.readAsText(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500000) {
      alert('La imagen es muy pesada. Por favor usa una imagen menor a 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpdateCompany({ ...companySettings, logo: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    const newSettings = { ...companySettings };
    delete newSettings.logo;
    onUpdateCompany(newSettings);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Configuración del Sistema</h2>
          <p className="text-neutral-500">Administra tus datos y perfil.</p>
        </div>
        
        <div className="flex p-1 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-x-auto">
          <button 
            onClick={() => setActiveTab('company')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'company' ? 'bg-black text-white shadow' : 'text-neutral-600 hover:bg-neutral-50'}`}
          >
            <Store className="w-4 h-4" />
            Negocio
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'data' ? 'bg-black text-white shadow' : 'text-neutral-600 hover:bg-neutral-50'}`}
          >
            <Download className="w-4 h-4" />
            Datos
          </button>
        </div>
      </div>

      {activeTab === 'company' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
             <div className="p-6">
               <h3 className="text-lg font-bold text-neutral-900 mb-6">Información del Negocio</h3>
               
               <div className="mb-8 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                 <label className="block text-sm font-medium text-neutral-700 mb-4">Logotipo de la Empresa</label>
                 <div className="flex items-center gap-6">
                   <div className="w-24 h-24 bg-white rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center relative overflow-hidden group">
                     {companySettings.logo ? (
                       <>
                         <img src={companySettings.logo} alt="Logo Preview" className="w-full h-full object-contain" />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button onClick={handleRemoveLogo} className="p-1 bg-red-500 text-white rounded-full">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       </>
                     ) : (
                       <ImageIcon className="w-8 h-8 text-neutral-300" />
                     )}
                   </div>
                   
                   <div className="space-y-3">
                     <button 
                       onClick={() => logoInputRef.current?.click()}
                       className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors flex items-center gap-2"
                     >
                       <Upload className="w-4 h-4" />
                       Subir Imagen
                     </button>
                     <p className="text-xs text-neutral-500">
                       Recomendado: 500x500px, PNG o JPG.<br/>Máximo 500KB.
                     </p>
                     <input 
                       ref={logoInputRef}
                       type="file" 
                       accept="image/*" 
                       className="hidden" 
                       onChange={handleLogoUpload}
                     />
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre del Negocio</label>
                    <input type="text" value={companySettings.name} onChange={(e) => onUpdateCompany({...companySettings, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono</label>
                    <input type="text" value={companySettings.phone} onChange={(e) => onUpdateCompany({...companySettings, phone: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black outline-none" />
                  </div>
               </div>
               <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Dirección</label>
                  <input type="text" value={companySettings.address} onChange={(e) => onUpdateCompany({...companySettings, address: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Términos y Condiciones (Ticket)</label>
                  <textarea rows={4} value={companySettings.terms} onChange={(e) => onUpdateCompany({...companySettings, terms: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-black outline-none resize-none" />
               </div>
             </div>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                   <Key className="w-5 h-5 text-neutral-500" /> PIN de Acceso
                </h3>
                <input 
                  type="text" 
                  maxLength={4}
                  placeholder="Nuevo PIN"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black outline-none mb-2"
                  onChange={(e) => handlePinChange(e.target.value)}
                />
             </div>

             <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-purple-600" /> Estado de IA
                </h3>
                <button 
                  onClick={handleTestAi}
                  disabled={aiStatus === 'loading'}
                  className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                    aiStatus === 'success' ? 'bg-green-100 text-green-700' : 
                    aiStatus === 'error' ? 'bg-red-100 text-red-700' : 
                    'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  {aiStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                   aiStatus === 'success' ? <><CheckCircle className="w-4 h-4" /> Conectado</> : 
                   aiStatus === 'error' ? <><AlertTriangle className="w-4 h-4" /> Error de Conexión</> : 
                   'Probar Conexión'}
                </button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-6">Gestión de Datos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={handleExport} className="p-6 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-black transition-all flex items-center justify-center gap-3">
                   <Download className="w-6 h-6" /> Exportar Respaldo
                </button>
                <button onClick={handleImportClick} className="p-6 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-black transition-all flex items-center justify-center gap-3">
                   <Upload className="w-6 h-6" /> Importar Respaldo
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
              </div>

              <div className="mt-8 pt-8 border-t border-neutral-100">
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
                   <div>
                     <h4 className="text-red-900 font-bold text-sm flex items-center gap-2">
                       <AlertTriangle className="w-4 h-4" /> Zona de Peligro
                     </h4>
                   </div>
                   <button onClick={onClear} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
                     <Trash2 className="w-4 h-4" /> Resetear Todo
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
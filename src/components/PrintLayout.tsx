import React from 'react';
import { Ticket, CompanySettings } from '@/types';

export const PrintLayout = ({ data, format, companySettings }: any) => {
  if (!data) return null;
  return (
    <div className="print-only">
      <div className={format === 'ticket' ? 'print-format-ticket' : 'hidden'}>
        <div className="text-center mb-4 border-b pb-2">
           {companySettings.logo && <img src={companySettings.logo} className="w-16 h-16 object-contain mx-auto grayscale"/>}
           <h1 className="font-bold">{companySettings.name}</h1>
           <p className="text-xs">{companySettings.phone}</p>
        </div>
        <p>ORDEN: #{data.id.slice(-6)}</p>
        <p>CLIENTE: {data.customerName}</p>
        <p>MODELO: {data.deviceModel}</p>
        <div className="flex justify-between font-bold text-lg mt-4 border-t pt-2"><span>TOTAL</span><span>${data.priceQuote}</span></div>
        <p className="text-[10px] mt-4 text-center">{companySettings.terms.slice(0,100)}...</p>
      </div>
      <div className={format === 'a5' ? 'print-format-a5' : 'hidden'}>
         <div className="flex justify-between border-b pb-4 mb-4">
            <div className="flex gap-4">
              {companySettings.logo && <img src={companySettings.logo} className="w-20 h-20 object-contain"/>}
              <div><h1 className="text-2xl font-bold">{companySettings.name}</h1><p>{companySettings.address}</p></div>
            </div>
            <div className="text-right"><h2 className="text-xl font-bold">ORDEN #{data.id}</h2></div>
         </div>
         <div className="grid grid-cols-2 gap-8 mb-8">
            <div><p className="font-bold text-gray-500 text-xs">CLIENTE</p><p className="text-xl">{data.customerName}</p></div>
            <div><p className="font-bold text-gray-500 text-xs">MODELO</p><p className="text-xl">{data.deviceModel}</p></div>
         </div>
         <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <p>{data.issueDescription}</p>
            <div className="flex justify-between font-bold text-2xl mt-4 border-t pt-4"><span>TOTAL</span><span>${data.priceQuote}</span></div>
         </div>
         <p className="text-xs text-gray-500 text-justify">{companySettings.terms}</p>
      </div>
    </div>
  );
};
export enum TicketStatus {
  RECEIVED = 'Recibido',
  DIAGNOSING = 'Diagnosticando',
  IN_PROGRESS = 'En Reparación',
  READY = 'Listo',
  DELIVERED = 'Entregado',
  CANCELLED = 'Cancelado'
}

export interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  terms: string;
  logo?: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deviceModel: string;
  issueDescription: string;
  aiDiagnosis?: {
    category: string;
    estimatedPrice: number;
    estimatedTime: string;
    suggestedActions: string[];
  };
  status: TicketStatus;
  createdAt: number;
  updatedAt: number;
  priceQuote: number;
  technicianNotes?: string;
  history: {
    status: TicketStatus;
    timestamp: number;
    note?: string;
  }[];
}
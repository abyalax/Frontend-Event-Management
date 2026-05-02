export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export interface GeneratedTicket {
  id: string;
  qrCodeUrl: string;
  pdfUrl: string;
  isUsed: boolean;
  issuedAt: Date;
}

export interface OrderItem {
  id: string;
  ticketId: string;
  ticketName?: string;
  quantity: number;
  price: number;
  subtotal: number;
  generatedTickets?: GeneratedTicket[];
}

export interface OrderPayment {
  id: string;
  externalId: string;
  status: string;
  amount: number;
  paymentMethod: string;
  paymentUrl?: string | null;
  paidAt?: Date | null;
  expiresAt?: Date | null;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  expiredAt?: Date | null;
  createdAt?: string;
  updatedAt?: string;
  items: OrderItem[];
  payment?: OrderPayment | null;
}

export interface QueryUserOrders {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
  search?: string;
}

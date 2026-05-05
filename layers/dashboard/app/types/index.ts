export interface QueryDashboard {
  startDate?: string;
  endDate?: string;
}

export interface TotalSales {
  totalSales: string;
  totalOrders: string;
}

export interface TopEvent {
  event_id: string;
  event_title: string;
  totalsales: string;
  totalorders: string;
}

export interface TopCategory {
  category_id: string;
  category_name: string;
  totalsales: string;
  totalorders: string;
}

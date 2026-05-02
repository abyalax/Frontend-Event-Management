import type { EventCategory, EventMedia, Ticket } from '~/layers/events/app/types';

export interface EventPublic {
  id: string;
  title: string;
  description?: string | null;
  maxAttendees?: number | null;
  isVirtual: boolean;
  location: string;
  startDate?: string;
  endDate?: string;
  status: string;
  categoryId: number;
  createdBy: string;
  category?: EventCategory;
  media?: EventMedia[];
  tickets?: Ticket[];
  bannerUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventCategory {
  id: number;
  name: string;
  description?: string | null;
}

export interface EventMediaObject {
  id: string;
  bucket?: string;
  objectKey?: string;
  accessType?: string;
}

export enum EventMediaType {
  BANNER = 'banner',
  POSTER = 'poster',
  GALLERY = 'gallery',
  THUMBNAIL = 'thumbnail',
}

export interface EventMedia {
  id: string;
  eventId: string;
  mediaId: string;
  type: EventMediaType;
  order: number;
  media?: EventMediaObject;
}

export interface Event {
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
  bannerUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  maxAttendees?: number;
  isVirtual?: boolean;
  location: string;
  startDate?: string | Date;
  endDate?: string | Date;
  status: string;
  categoryId: number;
  createdBy: string;
  bannerMediaId: string;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

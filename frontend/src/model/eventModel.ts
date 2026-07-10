export interface EventItem  {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string;
  created_by: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
};

export interface CreateEventForm {
  title: string;
  description: string;
  location: string;
  event_date: string;
};

export interface CreateEventResponse {
  message: string;
  event: EventItem;
};
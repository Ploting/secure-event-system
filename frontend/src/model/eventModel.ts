export type EventItem = {
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

export type CreateEventForm = {
  title: string;
  description: string;
  location: string;
  event_date: string;
};

export type CreateEventResponse = {
  message: string;
  event: EventItem;
};

export type GetEventResponse = {
  event: EventItem;
};

export type UpdateEventForm = {
  title: string;
  description: string;
  location: string;
  event_date: string;
};

export type UpdateEventResponse = {
  message: string;
  event?: EventItem;
};

export type DeleteEventResponse = {
  message: string;
};
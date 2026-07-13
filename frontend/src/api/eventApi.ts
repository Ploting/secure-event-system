import api from "./axios";
import type {
  EventItem,
  CreateEventForm,
  CreateEventResponse,
  UpdateEventForm,
  UpdateEventResponse,
  DeleteEventResponse
} from "../model/eventModel";

interface GetEventsResponse {
  events: EventItem[];
}

type GetEventByIdResponse = {
  message: string;
  event: EventItem[];
};

export const getEvents = async () => {
  const response = await api.get<GetEventsResponse>("/api/events");

  return response.data.events;
};

export const createEvent = async (form: CreateEventForm) => {
  const response = await api.post<CreateEventResponse>("/api/events", form);

  return response.data;
};

export const getEventById = async (id: string) => {
  const response = await api.get<GetEventByIdResponse>(`/api/events/${id}`);

  return response.data.event[0];
};

export const updateEvent = async (id: string, form: UpdateEventForm) => {
  const response = await api.put<UpdateEventResponse>(
    `/api/events/${id}`,
    form,
  );

  return response.data;
};

export const deleteEvent = async (id: string | number) => {
  const response = await api.delete<DeleteEventResponse>(
    `/api/events/${id}`
  );

  return response.data;
};
import api from "./axios";
import type {
  EventItem,
  CreateEventForm,
  CreateEventResponse,
} from "../model/eventModel";

interface GetEventsResponse {
  events: EventItem[];
};

export const getEvents = async () => {
  const response = await api.get<GetEventsResponse>("/api/events");

  return response.data.events;
};

export const createEvent = async (form: CreateEventForm) => {
  const response = await api.post<CreateEventResponse>(
    "/api/events",
    form
  );

  return response.data;
};
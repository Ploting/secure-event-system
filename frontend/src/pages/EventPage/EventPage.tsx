import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../api/eventApi";
import type { EventItem } from "../../model/eventModel";

export function EventsPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEvents();

      setEvents(data);
    } catch (error) {
      console.log(error);
      setError("ไม่สามารถโหลดรายการ event ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center">Loading events...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchEvents}
          className="border px-3 py-2 rounded bg-blue-500 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg">
        <h1 className="text-4xl font-bold">Events</h1>
        <button
          onClick={() => navigate("/events/create")}
          className="border px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition cursor-pointer"
        >
          Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">ยังไม่มี event</p>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-4 flex flex-col gap-2"
            >
              <h2 className="text-2xl font-bold">{event.title}</h2>

              <p>{event.description || "-"}</p>

              <p>
                <span className="font-bold">Location:</span>{" "}
                {event.location || "-"}
              </p>

              <p>
                <span className="font-bold">Date:</span> {event.event_date}
              </p>

              {event.created_by_name && (
                <p>
                  <span className="font-bold">Created by:</span>{" "}
                  {event.created_by_name}
                </p>
              )}

              <div className="self-end flex flex-row gap-5">
                
                <button
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="border px-3 py-2 rounded w-fit bg-gray-500 hover:bg-gray-700 text-white cursor-pointer transition"
                >
                  View Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

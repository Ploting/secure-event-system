import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../api/eventApi";
import type { EventItem } from "../../model/eventModel";
import { useAuth } from "../../hooks/useAuth";

export function EventsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between ">
          <h1 className="text-xl font-bold text-gray-900">Events</h1>
          <div className="flex items-center space-x-3">
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/events/create")}
                className="px-4 py-5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Create Event
              </button>
            )}
            <button
              onClick={() => {
                logout();
                navigate("/login", { replace: false });
              }}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full overflow-y-auto px-4 py-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">ยังไม่มี event</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                    <p className="mt-2 text-gray-600">{event.description || "-"}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p className="mb-1"><span className="font-semibold">Location:</span> {event.location || "-"}</p>
                    <p><span className="font-semibold">Date:</span> {event.event_date}</p>
                  </div>
                </div>

                {event.created_by_name && (
                  <div className="mt-4 text-sm text-gray-500">
                    <span className="font-semibold">Created by:</span> {event.created_by_name}
                  </div>
                )}

                <div className="mt-6">
                  <button
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
                  >
                    View Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById } from "../../api/eventApi";
import type { EventItem } from "../../model/eventModel";
import { useAuth } from "../../hooks/useAuth";

export function EventDetailPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { id } = useParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError("");

      if (!id) {
        setError("ไม่พบ event id");
        return;
      }

      const data = await getEventById(id);

      console.log("event detail data =", data);

      setEvent(data);
    } catch (error) {
      console.log(error);
      setError("ไม่สามารถโหลดรายละเอียด event ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const isOwner = Number(user?.id) === Number(event?.created_by);

  const canManageEvent = isAdmin || isOwner;

  if (loading) {
    return <p className="text-center">Loading event...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/events")}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return <p className="text-center">ไม่พบข้อมูล event</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/events")}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
            >
              Back
            </button>
            {canManageEvent && (
              <button
                onClick={() => navigate(`/events/${event.id}/edit`)}
                className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 hover:text-black"
              >
                Edit
              </button>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900 flex-1 text-center">{event.title}</h1>
        </div>
      </header>

      <main className="flex-1 w-full overflow-y-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>

            <p className="text-gray-600">{event.description || "-"}</p>

            <div className="text-sm text-gray-500 space-y-2">
              <p>
                <span className="font-semibold">Location:</span> {event.location || "-"}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {event.event_date}
              </p>
              <p>
                <span className="font-semibold">Created by:</span> {event.created_by_name || event.created_by}
              </p>
              <p>
                <span className="font-semibold">Created at:</span> {event.created_at}
              </p>
              <p>
                <span className="font-semibold">Updated at:</span> {event.updated_at}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
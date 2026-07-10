import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById } from "../../api/eventApi";
import type { EventItem } from "../../model/eventModel";

export function EventDetailPage() {
  const navigate = useNavigate();
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

  if (loading) {
    return <p className="text-center">Loading event...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-500">{error}</p>

        <button
          onClick={() => navigate("/events")}
          className="border px-3 py-2 rounded bg-blue-500 text-white"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return <p className="text-center">ไม่พบข้อมูล event</p>;
  }

  //   console.log(event);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between">
        <button
          onClick={() => navigate("/events")}
          className="border px-3 py-2 rounded w-fit hover:bg-gray-200 transition cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={() => navigate(`/events/${event.id}/edit`)}
          className="px-3 py-2 rounded w-fit bg-yellow-500 text-white transition hover:bg-yellow-600 hover:text-black cursor-pointer"
        >
          Edit
        </button>
      </div>

      <div className="border rounded-lg p-6 flex flex-col gap-3">
        <h1 className="text-4xl font-bold">{event.title}</h1>

        <p>{event.description || "-"}</p>

        <p>
          <span className="font-bold">Location:</span> {event.location || "-"}
        </p>

        <p>
          <span className="font-bold">Date:</span> {event.event_date}
        </p>

        <p>
          <span className="font-bold">Created by:</span>{" "}
          {event.created_by_name || event.created_by}
        </p>

        <p>
          <span className="font-bold">Created at:</span> {event.created_at}
        </p>

        <p>
          <span className="font-bold">Updated at:</span> {event.updated_at}
        </p>
      </div>
    </div>
  );
}

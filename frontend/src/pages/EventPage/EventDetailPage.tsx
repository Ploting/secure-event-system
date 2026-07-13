import { useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteEvent, getEventById } from "../../api/eventApi";
import type { EventItem } from "../../model/eventModel";
import { useAuth } from "../../hooks/useAuth";
import { useAppNotification } from "../../hooks/useAppNotification";

export function EventDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const { contextHolder, openNotification } = useAppNotification();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadEvent() {
      if (!id) {
        if (!ignore) {
          setError("ไม่พบ event id");
          setLoading(false);
        }

        return;
      }

      try {
        const data = await getEventById(id);

        if (!ignore) {
          setEvent(data);
        }
      } catch (error) {
        console.error("Fetch event failed:", error);

        if (!ignore) {
          setError("ไม่สามารถโหลดรายละเอียด event ได้");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadEvent();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!id || !event) {
      openNotification("error", "Delete Failed", "ไม่พบข้อมูล event", 2);

      return;
    }

    const confirmed = window.confirm(
      `ต้องการลบ event "${event.title}" ใช่หรือไม่?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deleteEvent(id);

      openNotification("success", "Delete Successfully", "ลบ event สำเร็จ", 2);

      navigate("/events", { replace: true });
    } catch (error) {
      console.error("Delete event failed:", error);

      openNotification("error", "Delete Failed", "ไม่สามารถลบ event ได้", 2);
    } finally {
      setDeleting(false);
    }
  };

  const isOwner = Number(user?.id) === Number(event?.created_by);

  const canManageEvent = isAdmin || isOwner;

  if (loading) {
    return <p className="text-center">Loading event...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        {contextHolder}

        <p className="text-red-500">{error}</p>

        <button
          type="button"
          onClick={() => navigate("/events")}
          className="rounded bg-blue-500 px-3 py-2 text-white"
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
    <div className="flex flex-col gap-6">
      {contextHolder}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate("/events")}
          className="rounded border px-3 py-2"
        >
          Back
        </button>

        {canManageEvent && (
          <>
            <button
              type="button"
              onClick={() => navigate(`/events/${event.id}/edit`)}
              className="rounded bg-yellow-500 px-3 py-2 text-white"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded bg-red-500 px-3 py-2 text-white disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-6">
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
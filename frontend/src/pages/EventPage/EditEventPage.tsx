import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../api/eventApi";
import { useAppNotification } from "../../้hooks/useAppNotification";
import type { UpdateEventForm } from "../../model/eventModel";

function toDateTimeLocal(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 16);
}

function toMysqlDateTime(value: string) {
  return value.replace("T", " ") + ":00";
}

export function EditEventPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { contextHolder, openNotification } = useAppNotification();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<UpdateEventForm>({
    title: "",
    description: "",
    location: "",
    event_date: "",
  });

  useEffect(() => {
    async function fetchEvent() {
      try {
        setFetching(true);
        setError("");

        if (!id) {
          setError("ไม่พบ event id");
          return;
        }

        const event = await getEventById(id);

        setForm({
          title: event.title,
          description: event.description || "",
          location: event.location || "",
          event_date: toDateTimeLocal(event.event_date),
        });
      } catch (error) {
        console.log(error);
        setError("ไม่สามารถโหลดข้อมูล event ได้");
      } finally {
        setFetching(false);
      }
    }

    fetchEvent();
  }, [id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      if (!id) {
        openNotification("error", "Update Failed", "ไม่พบ event id", 2);
        return;
      }

      if (!form.title || !form.event_date) {
        openNotification(
          "error",
          "Update Failed",
          "กรุณากรอก title และ event date",
          2,
        );
        return;
      }

      const payload: UpdateEventForm = {
        ...form,
        event_date: toMysqlDateTime(form.event_date),
      };

      await updateEvent(id, payload);

      openNotification(
        "success",
        "Update Event Successfully",
        "แก้ไข event สำเร็จ",
        2,
      );

      navigate(`/events/${id}`);
    } catch (error) {
      console.log(error);

      openNotification("error", "Update Failed", "ไม่สามารถแก้ไข event ได้", 2);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="text-center">Loading event...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        {contextHolder}

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

  return (
    <div className="flex flex-col gap-8">
      {contextHolder}

      <h1 className="text-4xl font-bold text-center">Edit Event</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col w-100 place-self-center">
          <label className="font-bold">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            className="input"
          />
        </div>

        <div className="flex flex-col w-100 place-self-center">
          <label className="font-bold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="input"
          />
        </div>

        <div className="flex flex-col w-100 place-self-center">
          <label className="font-bold">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
            className="input"
          />
        </div>

        <div className="flex flex-col w-100 place-self-center">
          <label className="font-bold">Event Date</label>
          <input
            name="event_date"
            type="datetime-local"
            value={form.event_date}
            onChange={(e) =>
              setForm({
                ...form,
                event_date: e.target.value,
              })
            }
            className="input"
          />
        </div>

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate(`/events/${id}`)}
            className="border px-3 py-2 rounded"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            type="submit"
            className="border px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

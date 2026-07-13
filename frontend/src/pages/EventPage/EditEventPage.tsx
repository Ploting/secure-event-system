import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../api/eventApi";
import { useAppNotification } from "../../hooks/useAppNotification";
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
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-gray-900">Edit Event</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`/events/${id}`)}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
            >
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full overflow-y-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="input w-full h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: e.target.value,
                  })
                }
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event Date</label>
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
                className="input w-full"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/events/${id}`)}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
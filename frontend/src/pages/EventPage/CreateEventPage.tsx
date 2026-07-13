import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../api/eventApi";
import { useAppNotification } from "../../hooks/useAppNotification";
import type { CreateEventForm } from "../../model/eventModel";

export function CreateEventPage() {
  const navigate = useNavigate();
  const { contextHolder, openNotification } = useAppNotification();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CreateEventForm>({
    title: "",
    description: "",
    location: "",
    event_date: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      if (!form.title || !form.event_date) {
        openNotification(
          "error",
          "Create Event Failed",
          "กรุณากรอก title และ event date",
          2,
        );
        return;
      }

      await createEvent(form);

      openNotification(
        "success",
        "Create Event Successfully",
        "สร้าง event สำเร็จ",
        2,
      );

      navigate("/events");
    } catch (error) {
      console.log(error);

      openNotification(
        "error",
        "Create Event Failed",
        "ไม่สามารถสร้าง event ได้",
        2,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Create Event</h1>
          <button
            onClick={() => navigate("/events")}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
          >
            Back
          </button>
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
                onClick={() => navigate("/events")}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../api/eventApi";
import { useAppNotification } from "../../้hooks/useAppNotification";
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
    <div className="flex flex-col gap-8">
      {contextHolder}

      <h1 className="text-4xl font-bold text-center">Create Event</h1>

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

        <div className="flex flex-row justify-between">
          <button
            onClick={() => (navigate("/events"))}
            type="button"
            className="border self-center w-fit px-3 py-2 rounded bg-blue-500 text-white transition-all cursor-pointer hover:bg-blue-700 disabled:opacity-50"
          >
            {`<`} back
          </button>
          <button
            disabled={loading}
            type="submit"
            className="border self-center w-fit px-3 py-2 rounded bg-blue-500 text-white transition-all cursor-pointer hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

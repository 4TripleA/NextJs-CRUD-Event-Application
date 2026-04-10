"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Event {
  $id?: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  organizer: string;
}

interface EditEventFormProps {
  event: Event;
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    category: event.category,
    date: event.date,
    location: event.location,
    organizer: event.organizer,
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/events?id=${encodeURIComponent(event.$id!)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update event");
      }

      setIsEditing(false);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      location: event.location,
      organizer: event.organizer,
    });
    setError("");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-300 p-6 shadow-sm">
          <p className="text-sm text-gray-500">{event.category}</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{event.title}</h1>
          <p className="mt-4 text-gray-700">{event.description}</p>
        </div>

        <div className="">
          <div className="rounded-xl border border-gray-300 p-6">
            <h2 className="text-xl font-semibold">Event details</h2>
            <div className="mt-4 space-y-4 text-gray-700">
              <div>
                <span className="font-semibold">Date:</span> {event.date}
              </div>
              <div>
                <span className="font-semibold">Location:</span> {event.location}
              </div>
              <div>
                <span className="font-semibold">Organizer:</span> {event.organizer}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 hover:bg-slate-100 cursor-pointer"
              >
                Edit event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-300 p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
              placeholder="e.g., Technology, Sports"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
              placeholder="Event description"
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="">
        <div className="rounded-xl border border-gray-300 p-6">
          <h2 className="text-xl font-semibold mb-4">Event details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 rounded-lg border border-gray-300 px-4 py-2 ml-2"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                placeholder="Event location"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Organizer</label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                placeholder="Organizer name"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

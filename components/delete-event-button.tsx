"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteEventButtonProps {
  eventId: string;
}

export default function DeleteEventButton({ eventId }: DeleteEventButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/events?id=${encodeURIComponent(eventId)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete event");
      }

      router.push("/");
    } catch (error) {
      console.error("Error deleting event:", error);
      window.alert(
        error instanceof Error ? error.message : "Unable to delete event. Please try again."
      );
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDeleting ? "Deleting..." : "Delete event"}
    </button>
  );
}

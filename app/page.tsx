import { Suspense } from 'react';
import Navbar from "@/components/navbar"
import EventsCard from "@/components/eventscard"

interface Event {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  slug: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  date: string;
  organizer?: string;
}

async function getAllEvents(): Promise<Event[]> {
  try {
    console.log('Fetching events from API...');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Response received:', { status: response.status, ok: response.ok });

    if (!response.ok) {
      console.error('Failed to fetch events:', `Status: ${response.status}, StatusText: ${response.statusText || 'Unknown'}`);
      return [];
    }

    const data = await response.json();
    // console.log('API response data:', data);
    // console.log('Data type:', typeof data, 'Is array:', Array.isArray(data));
    return data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

function EventsList({ events }: { events: Event[] }) {
  // console.log('Rendering EventsList with events:', events);

  return (
    <>
      <div className="mt-4 flex flex-row mx-7 mt-6">
        <div>
          <h1 className="font-bold text-[20px]">All Events</h1>
          <span>{events.length} Events Found</span>
        </div>
        <a href={'/add-event'} className="ml-auto border border-gray-500 rounded-[7px] p-2 mb-2.5">Add Event</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 mx-7">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No events found. <a href="/add-event" className="text-blue-500 hover:underline">Create your first event</a></p>
          </div>
        ) : (
          events.map((event) => (
            <EventsCard
              key={event.$id || event.slug}
              slug={event.slug}
              title={event.title}
              category={event.category}
              location={event.location}
              date={event.date}
            />
          ))
        )}
      </div>
    </>
  );
}

async function EventsContent() {
  try {
    const events = await getAllEvents();
    // console.log('Events loaded:', events);
    return <EventsList events={events} />;
  } catch (error) {
    console.error('Error in EventsContent:', error);
    return (
      <div className="mt-4 flex flex-row mx-7 mt-6">
        <div>
          <h1 className="font-bold text-[20px]">All Events</h1>
          <span>Error loading events</span>
        </div>
        <a href={'/add-event'} className="ml-auto border border-gray-500 rounded-[7px] p-2 mb-2.5">Add Event</a>
      </div>
    );
  }
}

function EventsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 mx-7">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-300 p-6 shadow-sm animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-8 bg-blue-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <Navbar />

      <Suspense fallback={
        <>
          <div className="mt-4 flex flex-row mx-7 mt-6">
            <div>
              <h1 className="font-bold text-[20px]">All Events</h1>
              <span>Loading events...</span>
            </div>
            <a href={'/add-event'} className="ml-auto border border-gray-500 rounded-[7px] p-2 mb-2.5">Add Event</a>
          </div>
          <EventsSkeleton />
        </>
      }>
        <EventsContent />
      </Suspense>
    </div>
  );
}
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Navbar from "@/components/navbar"
import DeleteEventButton from "@/components/delete-event-button";
import EditEventForm from "@/components/edit-event-form";
import { Client, Databases, Query } from "node-appwrite";

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

// async function getEventBySlug(slug: string): Promise<Event | null> {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/v1/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_COLLECTION_ID}/documents?queries[0]=equal("slug","${encodeURIComponent(slug)}")`, {
//       headers: {
//         'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
//         'X-Appwrite-Key': process.env.APPWRITE_API_KEY!,
//       },
//       cache: 'no-store'
//     });

//     if (!response.ok) {
//       return null;
//     }

//     const data = await response.json();
//     return data.documents?.[0] || null;
//   } catch (error) {
//     console.error('Error fetching event:', error);
//     return null;
//   }
// }


async function getEventBySlug(slug: string): Promise<Event | null> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  const databases = new Databases(client);

  const res = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID!,
    process.env.APPWRITE_COLLECTION_ID!,
    [Query.equal("slug", slug)]
  );

  return (res.documents?.[0] as unknown as Event) || null;
}

// async function getAllEvents() {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/v1/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_COLLECTION_ID}/documents`, {
//       headers: {
//         'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
//         'X-Appwrite-Key': process.env.APPWRITE_API_KEY!,
//       },
//       cache: 'no-store'
//     });

//     if (!response.ok) {
//       return [];
//     }

//     const data = await response.json();
//     return data.documents || [];
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     return [];
//   }
// }

async function getAllEvents() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  const databases = new Databases(client);

  const res = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID!,
    process.env.APPWRITE_COLLECTION_ID!
  );

  return res.documents || [];
}



function EventDetailsContent({ event }: { event: Event | null }) {
  if (!event) {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-8">
        <h1 className="text-2xl font-semibold text-red-700">Event not found</h1>
        <p className="mt-2 text-gray-700">The event you selected does not exist or may have been removed.</p>
      </div>
    );
  }

  return (
    <div>
      <EditEventForm event={event} />
      <div className="mt-6">
        {event.$id ? (
          <DeleteEventButton eventId={event.$id} />
        ) : null}
      </div>
    </div>
  );
}

async function EventDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  // Convert Appwrite object to plain object for Client Component
  const plainEvent = event ? JSON.parse(JSON.stringify(event)) : null;
  return <EventDetailsContent event={plainEvent}/>;
}

function EventDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-300 p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-gray-300 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-300 bg-slate-50 p-6 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-5"></div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EventDetailsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  return (
    <div>
      <Navbar />
      <div className="mt-6 mx-7">
        <Suspense fallback={<EventDetailsSkeleton />}>
          <EventDetails params={params} />
        </Suspense>
      </div>
    </div>
  );
}
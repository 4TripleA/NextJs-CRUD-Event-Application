import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID, Query } from 'node-appwrite';

const initializeAppwrite = () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  if (process.env.APPWRITE_API_KEY) {
    client.setKey(process.env.APPWRITE_API_KEY!);
  }

  return new Databases(client);
};

const databases = initializeAppwrite();

function generateSlug(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  return `${base}-${Date.now()}`; 
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      //  single event by slug
      const response = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_COLLECTION_ID!,
        slug ? [Query.equal('slug', slug)] : []
      );



      return NextResponse.json(response.documents[0] || null);
    } else {
      // Fetch all events
      const response = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_COLLECTION_ID!,
        [],
        undefined,
        false
      );

      return NextResponse.json(response.documents);
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, date, location, category, organizer } = body;

    // Validate required fields
    if (!title || !description || !date || !location || !category || !organizer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const newEvent = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      ID.unique(),
      {
        title,
        description,
        date,
        location,
        category,
        organizer,
        slug,
      }
    );

    return NextResponse.json(
      { message: 'Event created successfully', event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    await databases.deleteDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      id
    );

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, date, location, category, organizer } = body;

    // Build update object with only the provided fields
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = date;
    if (location !== undefined) updateData.location = location;
    if (category !== undefined) updateData.category = category;
    if (organizer !== undefined) updateData.organizer = organizer;

    // If title was updated, regenerate slug
    if (title !== undefined) {
      updateData.slug = generateSlug(title);
    }

    // Update the event document in Appwrite
    const updatedEvent = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      id,
      updateData
    );

    return NextResponse.json(
      { message: 'Event updated successfully', event: updatedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
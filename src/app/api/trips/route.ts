import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { trips } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { FullItinerary } from '@/types/travel';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ success: true, trips: [], guest: true });
  }

  try {
    const dbTrips = await db
      .select()
      .from(trips)
      .where(eq(trips.userId, user.id))
      .orderBy(desc(trips.createdAt));
    return NextResponse.json({ success: true, trips: dbTrips });
  } catch (error: any) {
    console.warn('Postgres query fallback:', error?.message);
    return NextResponse.json({ success: true, trips: [], isFallback: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Create a free account to save trips to the cloud.', guest: true },
        { status: 401 }
      );
    }

    const body = await req.json();
    const itinerary: FullItinerary = body.itinerary;

    if (!itinerary) {
      return NextResponse.json({ success: false, error: 'Itinerary payload is required' }, { status: 400 });
    }

    const inserted = await db.insert(trips).values({
      userId: user.id,
      title: itinerary.title || `${itinerary.durationDays}-Day Trip to ${itinerary.destination}`,
      originCity: itinerary.originCity,
      destination: itinerary.destination,
      vibe: itinerary.vibe,
      durationDays: itinerary.durationDays,
      startDate: itinerary.startDate,
      endDate: itinerary.endDate,
      budgetLevel: itinerary.budgetLevel,
      travelParty: itinerary.travelParty,
      pace: itinerary.pace,
      interests: itinerary.interests,
      currency: itinerary.currency,
      totalCostUsd: itinerary.totalCostUsd,
      totalCostInr: itinerary.totalCostInr,
      itinerary: itinerary,
      emergencyContacts: itinerary.emergencyContacts,
      packingChecklist: itinerary.packingChecklist
    }).returning();

    return NextResponse.json({
      success: true,
      trip: inserted[0]
    });
  } catch (error: any) {
    console.error('Save trip error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save trip' },
      { status: 500 }
    );
  }
}

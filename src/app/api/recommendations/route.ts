import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedDestinations } from '@/lib/destination-data';
import { INDIAN_STATES, INDIAN_CITY_INDEX } from '@/lib/indian-cities';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vibe, budget, season, travelParty, interests, country, state, search, limit } = body;

    const recommendations = getRecommendedDestinations({
      vibe: vibe || 'Open-Ended',
      budget: budget || 'Moderate',
      season,
      travelParty,
      interests: Array.isArray(interests) ? interests : [],
      country,
      state,
      search
    });

    const countryFilter = (country || 'all').toLowerCase();
    const showAll = countryFilter === 'india' || !!search || !!state;
    const sliceCount = typeof limit === 'number' ? limit : showAll ? recommendations.length : 3;

    return NextResponse.json({
      success: true,
      recommendations: recommendations.slice(0, sliceCount),
      allMatches: recommendations,
      total: recommendations.length,
      indianStates: INDIAN_STATES,
      indianCityCount: INDIAN_CITY_INDEX.length
    });
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to recommend destinations' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    indianStates: INDIAN_STATES,
    indianCities: INDIAN_CITY_INDEX,
    count: INDIAN_CITY_INDEX.length
  });
}

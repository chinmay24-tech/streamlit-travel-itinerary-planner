import { NextRequest, NextResponse } from 'next/server';
import { swapSlot } from '@/lib/itinerary-generator';
import { ActivitySlot } from '@/types/travel';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slot, customPrompt, presetIndex } = body as {
      slot: ActivitySlot;
      customPrompt?: string;
      presetIndex?: number;
    };

    if (!slot) {
      return NextResponse.json({ success: false, error: 'Slot data is required' }, { status: 400 });
    }

    const updatedSlot = swapSlot(slot, customPrompt, presetIndex);

    return NextResponse.json({
      success: true,
      updatedSlot
    });
  } catch (error: any) {
    console.error('Error swapping activity slot:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to swap activity' },
      { status: 500 }
    );
  }
}

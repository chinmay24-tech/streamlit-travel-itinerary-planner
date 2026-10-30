import { NextRequest, NextResponse } from 'next/server';
import { generateItinerary } from '@/lib/itinerary-generator';
import { UserPreferences } from '@/types/travel';

export async function POST(req: NextRequest) {
  try {
    const prefs: UserPreferences = await req.json();

    // Default to the rich algorithmic clustering engine
    const basePlan = generateItinerary(prefs);

    // If Groq or Gemini API key provided, we can optionally enhance the insights
    const effectiveKey = prefs.apiKey?.trim() || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

    if (prefs.apiProvider === 'groq' && effectiveKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${effectiveKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: 'You are a senior fullstack travel architect. Provide a high-level transit and clustering advisory note for this trip in under 60 words.'
              },
              {
                role: 'user',
                content: `Advise on minimizing transit fatigue for a ${prefs.durationDays}-day ${prefs.budgetLevel} trip to ${prefs.destination || 'Tokyo'} with vibe ${prefs.vibe}.`
              }
            ],
            max_tokens: 120,
            temperature: 0.6
          })
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const advice = groqData.choices?.[0]?.message?.content;
          if (advice) {
            basePlan.transitGuidelines.unshift(`Groq AI Optimization: ${advice.trim()}`);
          }
        }
      } catch (llmErr) {
        console.warn('Groq advisory fallback to local engine:', llmErr);
      }
    } else if (prefs.apiProvider === 'gemini' && effectiveKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Provide a quick local insider transit tip (under 50 words) to avoid backtracking across ${prefs.destination || 'the city'}.`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const geminiAdvice = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (geminiAdvice) {
            basePlan.transitGuidelines.unshift(`Gemini AI Insider: ${geminiAdvice.trim()}`);
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini advisory fallback to local engine:', geminiErr);
      }
    }

    return NextResponse.json({
      success: true,
      itinerary: basePlan
    });
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate itinerary' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Transcript is required and must be a string' },
        { status: 400 }
      );
    }

    // TODO: Replace this with your actual AI summary generation logic
    // This could be a call to OpenAI, Claude, or any other AI service
    const summary = await generateAISummary(transcript);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

async function generateAISummary(transcript: string): Promise<string> {

  const lines = transcript.split('\n').filter(line => line.trim());
  console.log("lines", lines);
  const res = await fetch("https://n8n.syedd.com/webhook/e16ddf85-b81b-40db-9f70-0be41ab4b13c", {
    method: "POST",
    body: JSON.stringify({
      lines
    })
  })
  const data = await res.json();
  console.log("data", data);
 return data.output.summary
} 
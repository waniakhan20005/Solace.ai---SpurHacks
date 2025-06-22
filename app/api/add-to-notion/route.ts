import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { transcript, summary } = await request.json();

    if (!summary || typeof summary !== 'string') {
      return NextResponse.json(
        { error: 'Summary is required and must be a string' },
        { status: 400 }
      );
    }

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Transcript is required and must be a string' },
        { status: 400 }
      );
    }

    // TODO: Replace this with your actual Notion integration logic
    // This could be a call to Notion API or any other service
    const result = await addToNotion(transcript, summary);

    return NextResponse.json({ success: true, message: 'Successfully added to Notion', result });
  } catch (error) {
    console.error('Error adding to Notion:', error);
    return NextResponse.json(
      { error: 'Failed to add to Notion' },
      { status: 500 }
    );
  }
}

async function addToNotion(transcript: string, summary: string): Promise<any> {

  const res = await fetch("https://n8n.syedd.com/webhook-test/62c79a44-5917-43c9-9e15-86dd7b25c016", {
    method: "POST",
    body: JSON.stringify({
      transcript,
      summary
    })
  })
  const data = await res.json();
  
  
  return {
    pageId: data.pageId,
    url: data.url,
    title: data.title
  };
} 
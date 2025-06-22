// lib/getTranscript.ts

export async function getVapiTranscript(sessionId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.vapi.ai/v1/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const transcript = data?.transcript || null
    return transcript
  } catch (error) {
    console.error('Failed to fetch transcript:', error)
    return null
  }
}

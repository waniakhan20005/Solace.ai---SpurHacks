import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { session_id, user_id, transcript } = req.body

    if (!session_id || !user_id || !transcript) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Update Firestore session with the transcript
    const sessionRef = doc(db, 'users', user_id, 'sessions', session_id)
    await updateDoc(sessionRef, {
      transcript
    })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

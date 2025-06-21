// lib/chat.ts (add this below startNewSession)
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export async function addMessageToSession(
  userId: string,
  sessionId: string,
  sender: 'user' | 'ai',
  content: string
) {
  const sessionRef = doc(db, 'users', userId, 'sessions', sessionId)
  await updateDoc(sessionRef, {
    messages: arrayUnion({
      sender,
      content,
      timestamp: Timestamp.now()
    })
  })
}

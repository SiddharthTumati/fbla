import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.apiKey !== 'your-api-key',
  )
}

let app: FirebaseApp | null = null
let auth: Auth | null = null

export function getFirebaseAuth(): Auth | null {
  if (!isFirebaseConfigured()) return null
  if (!app) {
    app = initializeApp(config)
    auth = getAuth(app)
  }
  return auth
}

const provider = new GoogleAuthProvider()

export async function signInWithGoogle(): Promise<User> {
  const a = getFirebaseAuth()
  if (!a) throw new Error('Firebase is not configured. Add credentials to .env')
  const result = await signInWithPopup(a, provider)
  return result.user
}

export async function signOut(): Promise<void> {
  const a = getFirebaseAuth()
  if (a) await firebaseSignOut(a)
}

export function subscribeAuth(callback: (user: User | null) => void): () => void {
  const a = getFirebaseAuth()
  if (!a) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(a, callback)
}

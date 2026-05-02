/**
 * Firebase Admin init — skeleton. Real init is lazy so unit tests that do
 * not touch Firestore never require credentials.
 *
 * Production flow: Cloud Run picks up Application Default Credentials from
 * the runtime service account; local dev uses GOOGLE_APPLICATION_CREDENTIALS.
 */

export interface FirebaseAdminConfig {
  projectId: string;
  clientEmail?: string;
  privateKey?: string;
}

export interface FirebaseAdminHandle {
  projectId: string;
  /** True once the SDK has been wired up. */
  initialized: boolean;
  /** Placeholder — in the full build we expose `admin.firestore()` etc. */
  firestore?: unknown;
  auth?: unknown;
  messaging?: unknown;
}

let handle: FirebaseAdminHandle | null = null;

/**
 * Initializes Firebase Admin SDK lazily. The real implementation will import
 * `firebase-admin` and call `initializeApp()`; kept abstract here so the
 * monorepo type-checks without pulling the SDK during the scaffolding phase.
 */
export const initFirebaseAdmin = (config: FirebaseAdminConfig): FirebaseAdminHandle => {
  if (handle) return handle;
  handle = {
    projectId: config.projectId,
    initialized: true,
  };
  return handle;
};

export const getFirebaseAdmin = (): FirebaseAdminHandle => {
  if (!handle) {
    throw new Error('Firebase Admin not initialized — call initFirebaseAdmin() first.');
  }
  return handle;
};

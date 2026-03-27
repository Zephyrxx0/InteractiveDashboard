# External Integrations

**Analysis Date:** 2026-03-27

## APIs & External Services

**Authentication:**
- Firebase Authentication - User authentication provider
  - SDK: `firebase` v12.10.0
  - Implementation: `src/lib/firebase.ts`
  - Auth context: `src/lib/auth.tsx`
  - Config: Client-side via `NEXT_PUBLIC_FIREBASE_*` env vars

## Data Storage

**Database:**
- Firebase Firestore (implied by Firebase SDK usage)
- No explicit database client configuration found
- Connection: Managed through Firebase SDK

**File Storage:**
- Firebase Storage (implied by Firebase configuration)
- Storage bucket configured via `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- Firebase Authentication
  - Implementation: Custom auth context in `src/lib/auth.tsx`
  - Uses Firebase Auth SDK
  - Session management via Firebase

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Console logging (standard for client-side)
- No external logging service integrated

## CI/CD & Deployment

**Hosting:**
- Not specified (Next.js can deploy to Vercel, Node server, or containers)

**CI Pipeline:**
- None detected

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID

**Secrets location:**
- `.env.local` and `.env` files (not read - contains secrets)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

---

*Integration audit: 2026-03-27*
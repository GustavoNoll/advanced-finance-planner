import { HimetricaClient } from "@himetrica/tracker-js";
import { validateFrontendEnv } from "@app/shared";

interface HimetricaEventProperties {
  [key: string]: unknown;
}

interface HimetricaIdentity {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

let himetricaClient: HimetricaClient | null = null;
const env = validateFrontendEnv();
const himetricaApiKey = env.VITE_HIMETRICA_API_KEY;
let hasLoggedMissingKeyWarning = false;

export function initializeHimetrica(): HimetricaClient | null {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  if (himetricaClient) {
    return himetricaClient;
  }

  if (!himetricaApiKey) {
    if (!hasLoggedMissingKeyWarning) {
      console.warn("Himetrica is disabled: VITE_HIMETRICA_API_KEY is not set.");
      hasLoggedMissingKeyWarning = true;
    }
    return null;
  }

  himetricaClient = new HimetricaClient({
    apiKey: himetricaApiKey,
    trackVitals: true,
    autoTrackErrors: true,
  });

  return himetricaClient;
}

export function trackHimetricaEvent(
  eventName: string,
  properties: HimetricaEventProperties = {},
): void {
  const client = initializeHimetrica();
  if (!client) {
    return;
  }

  client.track(eventName, properties);
}

export function identifyHimetricaUser(identity: HimetricaIdentity): void {
  const client = initializeHimetrica();
  if (!client) {
    return;
  }

  client.identify(identity);
}

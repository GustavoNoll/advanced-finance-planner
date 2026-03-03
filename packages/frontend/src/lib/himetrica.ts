import { HimetricaClient } from "@himetrica/tracker-js";

interface HimetricaEventProperties {
  [key: string]: unknown;
}

interface HimetricaIdentity {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

let himetricaClient: HimetricaClient | null = null;

export function initializeHimetrica(): HimetricaClient | null {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  if (himetricaClient) {
    return himetricaClient;
  }

  himetricaClient = new HimetricaClient({
    apiKey: "hm_7d4105097abcbae3eb5bcf179f9f35b2f4536b6390995fcf",
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

"use client";

// this utility can't do a dynamic lookup on process.env because of Next's bundling behavior
// https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser
function expectEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new TypeError(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getApiUrl(): string {
  // fallback for build and to avoid hydration mismatch in dev
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL_DEV || "http://localhost:8080";
  }

  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes(".dev.")) {
    return expectEnvVar("NEXT_PUBLIC_API_URL_DEV", process.env.NEXT_PUBLIC_API_URL_DEV);
  }

  // this is safe because auth token for dev won't work in production
  // alternative approach: check for the specific prod hostname instead of falling back
  return expectEnvVar("NEXT_PUBLIC_API_URL_PROD", process.env.NEXT_PUBLIC_API_URL_PROD);
}

export function getFaroUrl(): string {
  // fallback for build and to avoid hydration mismatch in dev
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_FARO_URL_DEV || "http://localhost:12345/collect";
  }

  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes(".dev.")) {
    return expectEnvVar("NEXT_PUBLIC_FARO_URL_DEV", process.env.NEXT_PUBLIC_FARO_URL_DEV);
  }

  // this is safe because auth token for dev won't work in production
  // alternative approach: check for the specific prod hostname instead of falling back
  return expectEnvVar("NEXT_PUBLIC_FARO_URL_PROD", process.env.NEXT_PUBLIC_FARO_URL_PROD);
}

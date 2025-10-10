import { getFaroUrl } from "@/lib/client-utils";
import { type Faro, getWebInstrumentations, initializeFaro } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";
import { context, trace } from "@opentelemetry/api";

const faroUrl = getFaroUrl();
const backendUrls: RegExp[] = [
  new RegExp(process.env.NEXT_PUBLIC_API_URL_DEV + ".*"),
  new RegExp(process.env.NEXT_PUBLIC_API_URL_PROD + ".*"),
];
const serviceNameForClientSide =
  (process.env.NEXT_PUBLIC_SERVICE_NAME ?? "unknown-service") + "-client";

function initFaro(): Faro | null {
  if (typeof window === "undefined") {
    console.warn("Faro SDK can only be initialized on the client side.");
    return null;
  }

  if (!faroUrl) {
    console.warn("Faro collector url is not set. Skipping initialization.");
    return null;
  }

  const newFaroInstance = initializeFaro({
    url: faroUrl,
    // apiKey: process.env.NEXT_PUBLIC_FARO_API_KEY, // Optional: enable if you set api_key in Alloy faro.receiver
    app: {
      name: serviceNameForClientSide,
      namespace: "virksomhet",
    },
    instrumentations: [
      ...getWebInstrumentations(),
      new TracingInstrumentation({
        instrumentationOptions: { propagateTraceHeaderCorsUrls: backendUrls },
      }),
    ],
  });

  newFaroInstance.api.initOTEL(trace, context);

  console.info(`Initialized Faro SDK at URL ${faroUrl}`);

  return newFaroInstance;
}

export const faroInstance: Faro | null = initFaro();

faroInstance?.api.pushLog(["Finished client instrumentation"]);

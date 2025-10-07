import { registerOTel } from "@vercel/otel";

export function register() {
  // Register the OpenTelemetry.
  const serviceName = (process.env.OTEL_SERVICE_NAME ?? "unknown-service") + "-server";
  const backendUrls = [new RegExp(process.env.WEB_APP_URL + ".*")];
  registerOTel({
    serviceName: serviceName,
    spanProcessors: ["auto"],
    instrumentationConfig: {
      fetch: {
        ignoreUrls: [],
        propagateContextUrls: backendUrls,
      },
    },
  });
}

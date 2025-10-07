# web

## Getting Started

First, run the development server:

```bash
npm run dev
```

## .env

```sh
NEXT_PUBLIC_API_URL_DEV=http://localhost:8080  # api
```

## Observability

`@grafana/faro-web-sdk` is used to provide client (browser) tracing to the Grafana collector in Nais for the deployed application. Locally with Docker Compose, we currently use the `@grafana/otel-lgtm` image for OpenTelemetry, which does not support Faro out of the box.

Server-side Next collects tracing through the `@vercel/otel` package and [instrumentation.ts](./instrumentation.ts).

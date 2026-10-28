# Track a request

Use these endpoints to follow the progress of a request.

- **Job status:** [`GET /v2.25/domain/jobs/{jobId}`](../../openapi/openapi.yaml) returns the state of an asynchronous request and its item results.
- **Domain status:** [`GET /v2.25/domain/status/{domain}`](../../openapi/openapi.yaml) returns the order, payment, and transfer fields for one domain.
- **Domain info:** [`POST /v2.25/domain/info`](../../openapi/openapi.yaml) returns the registry record for a domain.

Domain order timestamps (`created`, `updated`, `domain_created`, `domain_expires`) are ISO 8601 date-time strings.

See [errors](../errors.md) for result codes and retry guidance.

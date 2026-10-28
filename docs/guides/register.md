# Register a domain

1. Check availability with [`POST /v2.25/domain/check`](../../openapi/openapi.yaml).
2. Submit the registration with [`POST /v2.25/domain/register`](../../openapi/openapi.yaml). Use the async form (no `sync` flag) unless you need an immediate result. The async response returns a `jobId`.
3. Track the job with [`GET /v2.25/domain/jobs/{jobId}`](../../openapi/openapi.yaml) until it finishes.
4. Fetch the order with [`GET /v2.25/domain/status/{domain}`](../../openapi/openapi.yaml).

Store the `jobId` and the domain name so you can resume tracking after a restart.

For several domains, send an `items` array. Each item has its own result.

See [errors](../errors.md) for error handling.

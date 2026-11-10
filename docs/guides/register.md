# Register a domain

1. Check availability with [`POST /v2.25/domain/check`](../../openapi/openapi.yaml).
2. Submit the registration with [`POST /v2.25/domain/register`](../../openapi/openapi.yaml). Use the async form (no `sync` flag) unless you need an immediate result. The async response returns a `jobId`.
3. Track the job with [`GET /v2.25/domain/jobs/{jobId}`](../../openapi/openapi.yaml) until it finishes.
4. Fetch the order with [`GET /v2.25/domain/status/{domain}`](../../openapi/openapi.yaml).

Store the `jobId` and the domain name so you can resume tracking after a restart.

For several domains, send an `items` array. Each item has its own result.

For a Verisign IDN registration, send the domain in Punycode and include
`idn_language` in the single-domain request or the corresponding `items`
entry. For example, use `"idn_language": "KOR"` for a Korean IDN. The value is
required for Verisign IDNs, is not inferred from Punycode, and is not needed
for ordinary ASCII registrations. See the [Verisign IDN registration guide](idn-registration.md)
for an example and supported language tags. This does not imply universal IDN
support across registries.

See [errors](../errors.md) for error handling.

# Renew a domain

1. Send [`POST /v2.25/domain/renew`](../../openapi/openapi.yaml) with `domain` and `years`. Set `sync: true` to attempt synchronous processing.
2. Read the `result` array. Each item has its own `success` and `result.code`.
3. Confirm the new expiry date with [`GET /v2.25/domain/status/{domain}`](../../openapi/openapi.yaml).

To check the price first, call [`GET /v2.25/tld/price`](../../openapi/openapi.yaml) with `product_type=renewal`.

See [errors](../errors.md) for error handling.

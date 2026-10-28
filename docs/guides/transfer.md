# Transfer a domain in

1. Get the authorization code from the domain's current registrar and store it securely.
2. To check the price, call [`GET /v2.25/tld/price`](../../openapi/openapi.yaml) with `product_type=transfer`.
3. Submit the transfer with [`POST /v2.25/domain/transfer`](../../openapi/openapi.yaml). Send an `items` array with `domain` and `authCode` for each domain (up to 50 per request).
4. A `transfer_status` of `pending` is returned in the examples for an accepted transfer. Track it with [`GET /v2.25/domain/status/{domain}`](../../openapi/openapi.yaml).

See [errors](../errors.md) for error handling.

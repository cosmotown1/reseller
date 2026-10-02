# Reseller API Integration Guide

This guide outlines a simple registration and tracking workflow. For request fields, response schemas, and endpoint details, use the [v2.25 API reference](./api/v2.25/domain/registration.md).

## Get Started

Obtain an API key from Cosmotown support. Send it with each authenticated request:

```http
x-api-key: YOUR_API_KEY
```

Verify connectivity:

```bash
curl https://cosmotown.com/api/reseller/ping \
  -H "x-api-key: YOUR_API_KEY"
```

## Register and Track a Domain

1. Submit a registration request to `POST /v2.25/domain/register`.
2. Save the returned `jobId` and use `GET /v2.25/domain/jobs/{jobId}` to check progress.
3. Use `GET /v2.25/domain/status/{domain}` to check the stored order status. For multiple domains, use `POST /v2.25/domain/status` with up to 50 domains.
4. Follow the returned status and payment fields to determine when the order is complete.

See the [registration API reference](./api/v2.25/domain/registration.md) for examples and field definitions.

## Integration Notes

- Use a reasonable polling interval and increase the delay between repeated checks.
- Handle `429 Too Many Requests` by backing off before retrying. Rate-limit response headers indicate the current request allowance.
- Store the domain and job ID in your own system so you can resume tracking after a restart.
- Treat API responses as authoritative; a missing job result does not by itself indicate registration failure.

## Support

For API questions, contact [developer@cosmotown.com](mailto:developer@cosmotown.com) and include the endpoint, domain, and response details. Do not include your API key.

**API Version:** v2.25
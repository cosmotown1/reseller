# Asynchronous Registration Overview

Domain registration can be submitted for background processing. The API returns a job ID that you can use to check progress without keeping the original request open.

## Tracking Options

- **Job status:** Use `GET /v2.25/domain/jobs/{jobId}` to check the progress and result associated with a submitted request.
- **Domain status:** Use `GET /v2.25/domain/status/{domain}` to look up the stored registration order for a domain. Use `POST /v2.25/domain/status` to look up to 50 domains in one request.

Keep the job ID and domain in your system so you can continue tracking after a restart. A missing job result does not by itself indicate that registration failed; check domain status and interpret the returned order and payment fields.

## Integration Guidance

Poll only as often as your application needs. When you receive `429 Too Many Requests`, wait before retrying and increase the delay between repeated requests. See the [API reference](./v2.25/domain/registration.md) for request formats, response fields, and examples.

For practical setup steps, see the [Reseller API Integration Guide](../WORKFLOW_GUIDE.md).

**API Version:** v2.25
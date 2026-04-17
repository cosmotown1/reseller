# Domain Registration Workflow Guide

This guide provides practical instructions for integrating and managing Cosmotown's asynchronous domain registration API.

**Quick Links:**
- [Async Workflow Documentation](./api/ASYNC_WORKFLOW.md) — Technical architecture and polling strategies
- [API Reference (v2.25)](./api/v2.25/domain/registration.md) — Complete endpoint documentation
- [Code Examples](./api/v2.25/domain/registration.http) — HTTP collection for testing

---

## Getting Started

### 1. Get Your API Key
Contact Cosmotown support to obtain your API key. All requests require:

```http
x-api-key: YOUR_API_KEY
```

### 2. Test Connectivity
```bash
curl -X GET https://cosmotown.com/api/reseller/ping \
  -H "x-api-key: YOUR_API_KEY"
```

Expected response:
```json
{
  "status": "ok",
  "server_time": "2026-04-17T12:00:00Z"
}
```

### 3. Submit Your First Registration
See [Async Workflow: Code Examples](./api/ASYNC_WORKFLOW.md#code-examples) for code in JavaScript, Python, or cURL.

---

## Recommended Integration Pattern

### Flow Diagram
```
┌─────────────────────────────────────────────────────────┐
│ 1. Submit Domain Registration (POST /domain/register)   │
│    Response: { jobId, status, ... }                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2a. Poll Job API (Optional, first 1-2 hours)            │
│    GET /domain/jobs/{jobId}                             │
│    → Execution details, attempt count                   │
└─────────────────────────────────────────────────────────┘
                     │
                     ├──→ Job expires from queue
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2b. Poll Status API (Any time, recommended)             │
│    GET /domain/status/example.com                       │
│    Response: { processed, payment_status, order_id }    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ (Poll every 30-60 seconds)
┌─────────────────────────────────────────────────────────┐
│ 3. Domain Ready?                                        │
│    processed=true AND payment_status=completed          │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
      ✓ YES                       ✗ NO
      Success                     Continue polling
      (Use customer_product_id,   (Timeout after
       order_id, invoice_id)      10-15 minutes)
```

---

## Common Scenarios

### Scenario 1: Single Domain Registration
```http
POST /api/reseller/v2.25/domain/register HTTP/1.1
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "domain": "example123.com",
  "years": 1,
  "ns": ["ns1.cosmotown.com", "ns2.cosmotown.com"],
  "contact_info": {
    "registrant": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1.5551234567",
      "address1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "US",
      "company": "Example Corp"
    }
  }
}
```

**Then poll:**
```http
GET /api/reseller/v2.25/domain/status/example123.com HTTP/1.1
x-api-key: YOUR_API_KEY
```

### Scenario 2: Bulk Domain Registration
Submit multiple requests in a loop:
```javascript
const domains = ['domain1.com', 'domain2.com', 'domain3.com'];
const jobIds = [];

for (const domain of domains) {
  const response = await registerDomain(domain);
  jobIds.push(response.jobId);
}

// Track all at once
const statuses = await batchCheckStatus(domains);
```

### Scenario 3: Resuming Tracking After App Restart
Your application loses the job ID. No problem:

```http
POST /api/reseller/v2.25/domain/status HTTP/1.1
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "domains": ["example123.com", "example456.com"]
}
```

This always works, regardless of when registration was submitted.

---

## Key Takeaways

✅ **DO:**
- Use `/domain/status` for persistent tracking (works forever)
- Poll every 30-60 seconds in production
- Implement timeouts (10-15 minutes max wait)
- Store domain names locally for future lookups
- Check payment_status in addition to processed

❌ **DON'T:**
- Rely on `job/{jobId}` for tracking beyond 2 hours
- Poll too frequently (< 10 seconds) — wastes bandwidth
- Assume job deletion means registration failed — check status API
- Ignore payment_status (must be "completed")

---

## Integration Quickstart

### Option 1: HTTP Client Library (Postman, Insomnia, VS Code REST Client)
1. Import [api/v2.25/domain/registration.http](./api/v2.25/domain/registration.http)
2. Set `{{token}}` and `{{baseUrl}}` variables
3. Submit and track requests directly

### Option 2: SDK / Library
We're working on official SDKs. Until then, use code examples from [ASYNC_WORKFLOW.md](./api/ASYNC_WORKFLOW.md#code-examples).

### Option 3: Custom Integration
Follow the polling strategies in [ASYNC_WORKFLOW.md](./api/ASYNC_WORKFLOW.md#polling-strategies).

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Job returns 404 | Job has expired. Use `/domain/status` instead. |
| Status shows `processed: false` after 5 minutes | Normal. Keep polling. Registration is still processing. |
| Payment failed | Check response `payment_status: "failed"`. Resubmit with valid payment info. |
| Batch request returns 400 | Domains array may be too large (max 100). Split into smaller batches. |
| Rate limit exceeded | Reduce polling frequency. Max 600 requests/10 min per customer. |

---

## Support

- Questions? Contact: developer@cosmotown.com
- API Issues? Reference the error code in [API Documentation](./api/v2.25/domain/registration.md)
- Found a bug? Create an issue in this repository

---

**Last Updated:** April 2026  
**API Version:** v2.25

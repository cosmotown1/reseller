# Async Domain Registration Workflow

**Cosmotown's domain registration API uses async-first architecture.** This guide explains how jobs work, their lifecycle, and the recommended polling strategies for tracking domain registrations.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Job Lifecycle](#job-lifecycle)
3. [API Endpoints Summary](#api-endpoints-summary)
4. [Polling Strategies](#polling-strategies)
5. [Code Examples](#code-examples)
6. [FAQ](#faq)

---

## Architecture Overview

When you submit a domain registration request, the operation is **queued immediately** and processing happens asynchronously in the background. Your response includes a `jobId` that you can use to track progress.

### Key Points

- **Non-blocking:** The API returns instantly; actual registration may take seconds to minutes
- **Reliable:** Jobs are persistent and retried automatically on failure
- **Stateful:** Both the job queue and the database maintain the domain state

---

## Job Lifecycle

### Phase 1: Queue (0 - ~2 hours)
- Job is enqueued and begins processing
- Job details are retrievable via `GET /domain/jobs/{jobId}`
- Status transitions: `created` → `processing` → `completed`

### Phase 2: Pruning (> ~2 hours)
- Completed jobs are automatically purged from the queue
- `GET /domain/jobs/{jobId}` returns `404 Not Found`
- **Domain state remains in the database** — use `/domain/status` API

### Phase 3: Persistent State (indefinite)
- Database tables hold all registration metadata
- Query via `/domain/status` endpoint at any time
- No expiration; accessible for the domain's lifetime

---

## API Endpoints Summary

| Endpoint | Purpose | Persistence | When to Use |
|----------|---------|--------------|------------|
| `POST /v2.25/domain/register` | Submit registration | Returns jobId | Initial submission |
| `GET /v2.25/domain/jobs/{jobId}` | Fetch job details | ~1-2 hours | Immediate post-submission |
| `GET /v2.25/domain/status/{domain}` | Fetch domain state | Indefinite | Anytime after submission |
| `POST /v2.25/domain/status` | Batch domain status | Indefinite | Track multiple domains |

---

## Polling Strategies

### Strategy 1: Job API (Fresh Submissions)

**Use this for domains submitted within the last hour:**

```http
GET /api/reseller/v2.25/domain/jobs/{jobId} HTTP/1.1
x-api-key: YOUR_API_KEY
```

**Pros:**
- Complete job execution details (attempt count, error logs, etc.)
- Real-time status from the queue

**Cons:**
- Only available for ~1-2 hours after submission
- Expires automatically

**Poll Interval:** Every 5-10 seconds

### Strategy 2: Status API (Any Time)

**Use this for domains at any point in time:**

#### Single Domain
```http
GET /api/reseller/v2.25/domain/status/example.com HTTP/1.1
x-api-key: YOUR_API_KEY
```

#### Multiple Domains (Batch)
```http
POST /api/reseller/v2.25/domain/status HTTP/1.1
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "domains": ["example.com", "another.com"]
}
```

**Response (example):**
```json
{
  "domains": [
    {
      "domain": "example.com",
      "status": "completed",
      "processed": true,
      "payment_status": "completed",
      "customer_product_id": "17465",
      "order_id": "78634",
      "invoice_id": "15074",
      "domain_created": "2026-04-17T02:59:14Z",
      "domain_expires": "2027-04-17T02:59:14Z"
    }
  ]
}
```

**Pros:**
- Works forever (no job expiration)
- Comprehensive domain metadata
- Batch queries (up to 100 domains per request)
- Definitive source of truth

**Cons:**
- Limited job execution details

**Poll Interval:** Every 30-60 seconds

### Strategy 3: Hybrid (Recommended)

**Immediately post-submission (first hour):**
1. Use Job API to monitor queue progress
2. Use Status API for domain-level state verification

**After hour 1:**
- Use Status API only (job has likely expired)

**Example workflow:**
```
T+0s:    Submit registration → get jobId
T+10s:   Poll job/{jobId} → { state: 'processing', ... }
T+30s:   Poll job/{jobId} → { state: 'processing', ... }
T+60s:   Job still processing
T+90s:   Poll status/example.com → { processed: false, ... }
T+120s:  Job expires from queue ⚠️
T+150s:  Poll status/example.com → { processed: true, payment_status: 'completed', ... }
T+∞:     Status API remains available
```

---

## Code Examples

### JavaScript / Node.js

```javascript
const axios = require('axios');

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://cosmotown.com/api/reseller/v2.25';

// 1. Submit registration
async function registerDomain(domain) {
  const response = await axios.post(`${BASE_URL}/domain/register`, {
    domain,
    years: 1,
    ns: ['ns1.cosmotown.com', 'ns2.cosmotown.com']
  }, {
    headers: { 'x-api-key': API_KEY }
  });

  const { jobId } = response.data;
  console.log(`Registration submitted. Job ID: ${jobId}`);
  return jobId;
}

// 2. Poll status (indefinite)
async function pollDomainStatus(domain, maxAttempts = 120) {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await axios.get(`${BASE_URL}/domain/status/${domain}`, {
      headers: { 'x-api-key': API_KEY }
    });

    const { processed, payment_status, customer_product_id } = response.data.domains[0];
    
    console.log(`Attempt ${i + 1}: processed=${processed}, payment_status=${payment_status}`);

    if (processed && payment_status === 'completed') {
      console.log(`✓ Domain registered! Customer product ID: ${customer_product_id}`);
      return true;
    }

    // Wait 30 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 30000));
  }

  console.log('✗ Registration did not complete in time');
  return false;
}

// 3. Usage
(async () => {
  const jobId = await registerDomain('example123.com');
  await pollDomainStatus('example123.com');
})();
```

### cURL (Bash)

```bash
#!/bin/bash

API_KEY="YOUR_API_KEY"
BASE_URL="https://cosmotown.com/api/reseller/v2.25"
DOMAIN="example123.com"

# 1. Submit registration
echo "Submitting registration..."
JOB_ID=$(curl -s -X POST "$BASE_URL/domain/register" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"domain\": \"$DOMAIN\", \"years\": 1}" | jq -r '.jobId')

echo "Job ID: $JOB_ID"

# 2. Poll status
echo "Polling domain status..."
for i in {1..120}; do
  RESPONSE=$(curl -s -X GET "$BASE_URL/domain/status/$DOMAIN" \
    -H "x-api-key: $API_KEY")

  PROCESSED=$(echo "$RESPONSE" | jq -r '.domains[0].processed')
  PAYMENT_STATUS=$(echo "$RESPONSE" | jq -r '.domains[0].payment_status')

  echo "Attempt $i: processed=$PROCESSED, payment_status=$PAYMENT_STATUS"

  if [ "$PROCESSED" = "true" ] && [ "$PAYMENT_STATUS" = "completed" ]; then
    echo "✓ Domain registered!"
    exit 0
  fi

  sleep 30
done

echo "✗ Registration did not complete"
exit 1
```

### Python

```python
import requests
import time

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://cosmotown.com/api/reseller/v2.25"

def register_domain(domain):
    """Submit a domain registration."""
    response = requests.post(
        f"{BASE_URL}/domain/register",
        headers={"x-api-key": API_KEY},
        json={"domain": domain, "years": 1}
    )
    job_id = response.json().get("jobId")
    print(f"Registration submitted. Job ID: {job_id}")
    return job_id

def poll_domain_status(domain, max_attempts=120, poll_interval=30):
    """Poll domain status until completion."""
    for attempt in range(max_attempts):
        response = requests.get(
            f"{BASE_URL}/domain/status/{domain}",
            headers={"x-api-key": API_KEY}
        )
        data = response.json()["domains"][0]
        
        processed = data.get("processed")
        payment_status = data.get("payment_status")
        
        print(f"Attempt {attempt + 1}: processed={processed}, payment_status={payment_status}")
        
        if processed and payment_status == "completed":
            print(f"✓ Domain registered! Customer product ID: {data.get('customer_product_id')}")
            return True
        
        time.sleep(poll_interval)
    
    print("✗ Registration did not complete")
    return False

# Usage
if __name__ == "__main__":
    job_id = register_domain("example123.com")
    poll_domain_status("example123.com")
```

---

## FAQ

### Q: Why does my job return `404 Not Found`?
**A:** Jobs expire from the queue after ~1-2 hours. Use the `/domain/status` API instead — it provides indefinite access to domain state.

### Q: How long does registration take?
**A:** Typically 10-30 seconds, but can take up to several minutes in high-load scenarios. Always implement polling with appropriate timeouts.

### Q: What's the difference between `job/{jobId}` and `status/{domain}`?
**A:** 
- `job/{jobId}` → Queue metadata (execution history, attempt count) → Expires after ~2 hours
- `status/{domain}` → Database metadata (registration status, product ID, payment) → Available indefinitely

### Q: Can I batch register multiple domains?
**A:** Yes, submit multiple `/domain/register` requests (one per domain) and track each `jobId` or use `/domain/status` with a batch query (up to 100 domains).

### Q: What payment statuses exist?
**A:** 
- `pending` — Not charged yet
- `completed` — Successfully charged
- `failed` — Payment failed
- `refunded` — Payment reversed

### Q: My status shows `processed: false` but no errors. What's happening?
**A:** The domain is still being processed. This is normal. Continue polling every 30-60 seconds. If it stays false for > 10 minutes, contact support.

### Q: Can I rely on job IDs for long-term audit trails?
**A:** No. Use application-level logging to capture job IDs and responses at submission time. For ongoing queries, use domain status and order IDs from the response.

---

## Support & Troubleshooting

For issues or questions:
- Check [API Response Status Codes](./v2.25/domain/registration.md)
- Review error logs in the registration response
- Contact: developer@cosmotown.com

---

**Last Updated:** April 2026

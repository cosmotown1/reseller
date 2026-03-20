# Cosmotown Reseller API

## Authentication
All APIs require:

```
x-api-key: YOUR_API_KEY
```

---

## Base URL
```
https://cosmotown.com/api/reseller
```

---

# Response Structure

All APIs follow a consistent structure:

```json
{
  "success": true,
  "data": {},
  "result": {
    "code": 1000,
    "message": "Command completed successfully",
    "description": "..."
  }
}
```

---

# Domain Check

## Request
```http
POST /v2/domain/check
```

```json
{
  "domain": "example.com"
}
```

---

# Domain Registration

## 1. Async Registration (Recommended)

### Request (Single)
```json
{
  "domain": "example.com",
  "years": 1
}
```

### Request (Bulk)
```json
{
  "domains": [
    {
      "domain": "example1.com",
      "years": 1
    },
    {
      "domain": "example2.com",
      "years": 1
    }
  ]
}
```

---

## Async Response

```json
{
  "success": true,
  "data": {
    "status": "processing",
    "jobId": "26",
    "ignoredDomains": []
  }
}
```

### ignoredDomains

List of domains skipped due to validation issues:

```json
{
  "ignoredDomains": ["invalid-domain", "bad_format"]
}
```

---

# Job API

## Request
```http
GET /v2/domain/jobs/{jobId}
```

---

## Job States

| State     | Meaning |
|----------|--------|
| active   | Processing |
| delayed  | Queued |
| completed| Finished |
| failed   | Failed |

---

## Job Response Structure

```json
{
  "jobId": "26",
  "state": "completed",
  "result": [
    {
      "success": true,
      "data": {},
      "result": {
        "code": 1000,
        "message": "...",
        "description": "..."
      }
    }
  ]
}
```

---

## Success Example

```json
{
  "success": true,
  "data": {
    "id": "46",
    "domain": "example.com",
    "status": "completed",
    "price": "7.10",
    "years": 1,
    "total": "7.10",
    "payment_status": "completed",
    "domain_created": "2026-03-20T08:47:48Z",
    "domain_expires": "2027-03-20T08:47:48Z"
  },
  "result": {
    "code": 1000,
    "message": "Command completed successfully",
    "description": "Command completed successfully"
  }
}
```

---

## Failure Example (Domain Exists)

```json
{
  "success": false,
  "result": {
    "code": 2302,
    "message": "Domain already exists",
    "description": "Command failed; object exists"
  }
}
```

---

## Duplicate Request Behavior

If the same domain is already processed:

```json
{
  "success": true,
  "data": {
    "domain": "example.com",
    "status": "completed"
  },
  "result": {
    "code": 1000,
    "message": "Command completed successfully",
    "description": "Domain registration completed.",
    "isDuplicateRequest": true
  }
}
```

---

# EPP Codes

| Code | Meaning |
|------|--------|
| 1000 | Success |
| 2302 | Domain already exists |
| 2303 | Missing nameserver / host |

---

# Legacy Support (Optional)

Older payload format is supported:

```json
{
  "items": [
    {
      "name": "example.com",
      "years": 1
    }
  ]
}
```

Recommended to use `domain` or `domains`.

---

# Notes

- Async flow is recommended for performance
- Use Job API as the source of truth
- `result.code` determines final outcome
- Bulk requests return per-domain results

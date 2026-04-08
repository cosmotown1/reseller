# Cosmotown Reseller API v2.25

This document is the current public reference for reseller domain APIs.

## Authentication
All endpoints require an API key header unless explicitly noted:

```http
x-api-key: YOUR_API_KEY
```

## Base URL

```text
https://cosmotown.com/api/reseller
```

## Endpoint Summary

- `GET /health` (no auth)
- `GET /ping`
- `POST /v2/domain/check`
- `POST /v2.25/domain/register`
- `GET /v2.25/domain/jobs/{jobId}`

- `GET /v2.25/domain/status/{domain}`
- `POST /v2.25/domain/status`

## Response Shape (v2.25)

- Async register returns top-level `status` and `jobId`
- Sync register returns top-level `result` (array)
- Error result entries do not include a null-only `data` object

---

## 1) Health

### Request

```http
GET /health
```

### Live Response (Local)

```json
{"status":"ok"}
```

---

## 2) Ping

### Request

```http
GET /ping
x-api-key: YOUR_API_KEY
```

### Live Response (Local)

```json
{
  "status": "ok",
  "ip": "172.19.0.1",
  "server_time": "2026-04-07T16:57:16.989Z"
}
```

---

## 3) Domain Check

### Request

```http
POST /v2/domain/check
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example1123.com"
}
```

### Live Response (Local)

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "name": "example1123.com",
        "available": false
      }
    ],
    "result": {
      "code": 1000,
      "message": "Command completed successfully"
    }
  }
}
```

---

## 4) Domain Register (v2.25)

### Async Request (Recommended)

```http
POST /v2.25/domain/register
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example-doc-20260407-01.com",
  "years": 1
}
```

### Live Async Response (Local)

```json
{
  "success": true,
  "status": "processing",
  "jobId": "216"
}
```

### Sync Request

```http
POST /v2.25/domain/register
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example1123.com",
  "years": 1,
  "sync": true
}
```

### Live Sync Error Response (Local)

```json
{
  "success": true,
  "result": [
    {
      "success": false,
      "result": {
        "code": 2302,
        "message": "Domain already exists",
        "description": "Command failed; object exists"
      }
    }
  ]
}
```

---

## 5) Job Status

### Current Endpoint

```http
GET /v2.25/domain/jobs/{jobId}
x-api-key: YOUR_API_KEY
```

### Live Response (Local)

```json
{
  "jobId": "216",
  "state": "completed",
  "result": [
    {
      "success": false,
      "result": {
        "code": 2302,
        "message": "Domain already exists",
        "description": "Command failed; object exists"
      }
    }
  ],
  "createdAt": 1775582512847,
  "processedAt": 1775582512854,
  "finishedAt": 1775582515224
}
```


---

## 6) Domain Status (v2.25)

### Single Domain

```http
GET /v2.25/domain/status/example1123.com
x-api-key: YOUR_API_KEY
```

### Live Response (Local)

```json
{
  "success": true,
  "data": {
    "reseller_order_id": "153",
    "domain": "example1123.com",
    "action": "createDomain",
    "status": "failed",
    "processed": false,
    "years": 1,
    "price": "7.10",
    "total_price": "7.10",
    "domain_created": null,
    "domain_expires": null,
    "payment_status": "pending",
    "ns": null,
    "customer_product_id": null,
    "order_id": null,
    "invoice_id": null,
    "whois_privacy": null,
    "locked": null,
    "auto_billing": null,
    "domain_registry_roid": null,
    "created": "2026-04-07T17:21:27.655Z",
    "updated": "2026-04-07T17:21:29.990Z"
  }
}
```

### Bulk Domain Status

```http
POST /v2.25/domain/status
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domains": ["example1123.com", "invalid_domain"]
}
```

### Live Response (Local)

```json
{
  "success": true,
  "data": [
    {
      "reseller_order_id": "153",
      "domain": "example1123.com",
      "action": "createDomain",
      "status": "failed",
      "processed": false,
      "years": 1,
      "price": "7.10",
      "total_price": "7.10",
      "domain_created": null,
      "domain_expires": null,
      "payment_status": "pending",
      "ns": null,
      "customer_product_id": null,
      "order_id": null,
      "invoice_id": null,
      "whois_privacy": null,
      "locked": null,
      "auto_billing": null,
      "domain_registry_roid": null,
      "created": "2026-04-07T17:21:27.655Z",
      "updated": "2026-04-07T17:21:29.990Z"
    }
  ],
  "ignored": ["invalid_domain"]
}
```

---

## Notes

- Local samples were captured from `http://127.0.0.1:3080/api/reseller` using `newtown_local_v2.http` flows on 2026-04-07.
- For new integrations, use v2.25 registration and jobs endpoints.

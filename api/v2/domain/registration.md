# Cosmotown Reseller API v2 (Legacy Compatibility)

This document is a legacy compatibility reference.

For all new integrations, use:
- `api/v2.25/domain/registration.md`
- `api/v2.25/domain/registration.http`

## Endpoints Still Supported

- `POST /v2/domain/check`
- `POST /v2/domain/register`
- `GET /v2/domain/register/jobs/{jobId}`


### Compatibility Alias

```http
GET /v2/domain/register/jobs/{jobId}
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
      "customer_id": "2956",
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

## Key Differences vs v2.25

- v2 async register returns `success.data.status` + `success.data.jobId`
- v2.25 async register returns top-level `status` + `jobId`
- v2 job alias response may include legacy compatibility fields not present in v2.25

## Migration Guidance

1. Keep `v2` only for backward compatibility.
2. Move new flows to `v2.25` routes.
3. For job polling, prefer `GET /v2.25/domain/jobs/{jobId}`.
4. For status lookup, use `GET|POST /v2.25/domain/status`.

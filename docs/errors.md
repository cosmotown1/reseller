# Errors

Check the HTTP status first, then read the response body.

## HTTP status codes

| Status | Meaning | Retry? | What to do |
| --- | --- | --- | --- |
| `207` | Synchronous batch with mixed item results. | No | Check each item's `success` and `result.code`. |
| `400` | The request is malformed or fails validation (for example, an invalid domain name or a payload schema error). Read `error` and `error.details`. | No | Fix the request payload. Validation errors are `400`, not `422`. |
| `401` | The API key is missing or invalid. | No | Check the `x-api-key` header, or contact support. |
| `402` | Synchronous registration where every item failed with `INSUFFICIENT_FUNDS`. | No | Top up the account, then retry. |
| `403` | The customer is not allowed to act on the resource. | No | Check the account configuration or domain ownership. |
| `404` | The resource does not exist or is no longer available. | No | Check the path and parameters. For a job, check the domain with `getDomainStatus`. |
| `429` | Too many requests. | Yes | Retry with exponential backoff and jitter. Read the `x-ratelimit-*` headers. |
| `500`–`599` | Server error. | Yes | Retry with backoff. Contact support if it persists. |

## Error envelope

Most errors use this shape:

```json
{
  "success": false,
  "data": null,
  "error": "Invalid domain name"
}
```

Validation errors can return `error` as an object with a `details` array. Use `error.details` to find the invalid field.

## Result codes

Successful and partial responses can include a numeric `result.code`. These codes come from the registry.

| Code | Meaning |
| --- | --- |
| `1000` | Command completed successfully. |
| `1001` | Command completed successfully; action pending. |
| `2302` | Object already exists. |

This list covers the codes shown in the examples. More codes will be added as they are published.

## Per-item results

Bulk requests (`items`) return one result per item. The envelope `success` can be `true` while an item has `success: false`. Check each item's `success` and `result.code`.

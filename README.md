# Cosmotown Reseller API v2.25

This document is the canonical public reference for the Cosmotown Reseller domain APIs. It documents the v2.25 endpoints used for domain-related reseller integrations.


## Versioning

- The examples in this document target the **v2.25** API. Paths include the `/v2.25/` segment.
- When newer versions are released we will publish a changelog and migration notes.

## Authentication

All endpoints require an API key provided in the `x-api-key` header unless explicitly noted. Keep your API key private and never embed it in public client-side code.

Example (curl):

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  https://cosmotown.com/api/reseller/v2.25/domain/check
```

## Table of Contents

- [API Overview](#api-overview)
- [APIs](#apis)
  - [Health](#health)
  - [Ping](#ping)
  - [Domain Check](#domain-check)
  - [Domain Register](#domain-register)
    - [Async Request (Recommended)](#async-request)
    - [Async Request with Name Servers](#async-request-with-name-servers)
    - [Sync Request](#sync-request)
    - [Domain Registration with Contact Information](#domain-registration-with-contact-information)
  - [Job Status](#job-status)
  - [Domain Status](#domain-status)
  - [Domain Info](#domain-info)
  - [Domain Lock](#domain-lock)
  - [Domain Unlock](#domain-unlock)
  - [Change Domain Name Servers](#change-domain-name-servers)
  - [Domain Contact Update](#domain-contact-update)
  - [Get Default Contact Information](#get-default-contact-information)
  - [Update Default Contact Information](#update-default-contact-information)
  - [Fetch Domain Contacts](#fetch-domain-contacts)
  - [Get My Domains](#get-my-domains)
  - [Get Domain DNS Settings](#get-domain-dns-settings)
  - [Save Domain DNS Settings](#save-domain-dns-settings)
  - [Change Domain Options](#change-domain-options)
  - [Domain Renewal](#domain-renewal)
  - [Domain Transfer](#domain-transfer)
- [Quick start](#quick-start)
  - [Typical Integration Workflow](#typical-integration-workflow)
  - [API Design Principles](#api-design-principles)
  - [Naming and formatting conventions](#naming-and-formatting-conventions)
  - [Rate limiting and throttling](#rate-limiting-and-throttling)
  - [Asynchronous Processing](#asynchronous-processing)
  - [How to handle errors](#how-to-handle-errors)
  - [Common result codes](#common-result-codes)
  - [Validation](#validation)
- [Notes](#notes)
- [Developer Roadmap](#developer-roadmap)
- [Changelog](#changelog)
- [FAQ & Troubleshooting](#faq-troubleshooting)

---

## API Overview

The Reseller API is organized around common domain management workflows.
Core capabilities include:

#### Base URL

https://cosmotown.com/api/reseller/

#### General

- `GET /health` (no auth)
- `GET /ping`

#### Domain Registration

- `POST /v2.25/domain/check`
- `POST /v2.25/domain/register`
- `GET /v2.25/domain/jobs/{jobId}`
- `GET /v2.25/domain/status/{domain}`

#### Domain Management

- `POST /v2.25/domain/info`
- `POST /v2.25/domain/lock`
- `POST /v2.25/domain/unlock`
- `POST /v2.25/domain/change-nameserver`
- `GET /v2.25/domain/list`
- `POST /v2.25/domain/options`
- `GET /v2.25/domain/dns-settings`
- `POST /v2.25/domain/dns-settings`

#### Domain Contacts

- `POST /v2.25/domain/contacts/save`
- `GET /v2.25/domain/contacts/{domain}`
- `GET /v2.25/domain/contacts/default`
- `POST /v2.25/domain/contacts/default`

#### Domain Renewal

- `POST /v2.25/domain/renew`

#### Domain Transfer-In

- `POST /v2.25/domain/transfer`

# APIs

## Health

#### Request

```http
GET /health
```

#### Example response

```json
{
  "status": "ok"
}
```


## Ping

#### Request

```http
GET /ping
x-api-key: YOUR_API_KEY
```

#### Example response

```json
{
  "status": "ok",
  "ip": "your.server.ip.address",
  "server_time": "2026-04-07T16:57:16.989Z"
}
```

---

## Domain Check

#### Request

```http
POST /v2.25/domain/check
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example1123.com"
}
```

#### Parameters
- **domain**: string — *required*. The fully qualified domain name to check (example: "example.com").


#### Example response

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
## Domain Register

### Async Request

```http
POST /v2.25/domain/register
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example-doc-20260407-01.com",
  "years": 1
}
```

#### Parameters
Common request fields (single-item or per-item in `items`):

- **domain**: string — *required*. The fully qualified domain name to register.
- **years**: integer — *required*. Number of years to register (registry limits may apply).
- **ns**: array[string] — *optional*. Name servers to set for the domain (e.g., `["ndns1.cosmotown.com", "ndns2.cosmotown.com"]`).
- **contact_info**: object — *optional*. Contact objects (`registrant`, `administrative`, `technical`, `billing`) with standard contact fields (firstName, lastName, email, phone, address1, city, state, zip, country).
- **options**: object — *optional*. Registration options such as `enable_private_whois` and `enable_auto_billing`.
- **sync**: boolean — *optional*. When `true`, request attempts synchronous processing and returns per-item `result` entries.
- **items**: array[object] — *optional*. Batch registration format; each item accepts the same fields as above.


#### Example response (async)

```json
{
  "success": true,
  "status": "processing",
  "jobId": "216"
}
```

### Async Request with Name Servers
Recommended for New Integrations.

```http
POST /v2.25/domain/register
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "items": [
    {
      "domain": "example12470.com",
      "years": 1,
      "ns": [
        "ndns1.cosmotown.com",
        "ndns2.cosmotown.com"
      ]
    }
  ]
}
```

#### Example response (async)

```json
{
  "success": true,
  "status": "processing",
  "jobId": "51040"
}
```

---

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

#### Example response (sync error)

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

#### Example response (sync success)

```http
POST /v2.25/domain/register
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example12471.com",
  "years": 1,
  "sync": true
}
```

```json
{
  "success": true,
  "result": [
    {
      "success": true,
      "result": {
        "code": 1000,
        "message": "Command completed successfully",
        "description": "Command completed successfully"
      },
      "data": {
        "reseller_order_id": "472",
        "customer_id": "101",
        "reseller_customer_id": "1",
        "domain": "example12471.com",
        "action": "createDomain",
        "status": "completed",
        "processed": false,
        "price": "9.50",
        "total_price": "9.50",
        "years": 1,
        "domain_created": "2026-06-24T04:41:54Z",
        "domain_expires": "2027-06-24T04:41:54Z",
        "created": "2026-06-24T04:41:54.890Z",
        "updated": "2026-06-24T04:41:54.890Z",
        "payment_status": "completed",
        "ns": [],
        "customer_product_id": null,
        "order_id": null,
        "invoice_id": null,
        "contacts": {},
        "item_num": 1,
        "options": null
      }
    }
  ]
}
```

---

### Domain Registration with Contact Information

#### Request

```http
POST /v2.25/domain/register
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example12473.com",
  "years": 1,
  "ns": [
    "ndns1.cosmotown.com",
    "ndns2.cosmotown.com"
  ],
  "contact_info": {
    "registrant": {
      "firstName": "John",
      "lastName": "Doe",
      "company": "Example Corp",
      "phone": "+1.5551234567",
      "extension": "123",
      "fax": "+1.5551234568",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "US",
      "email": "john.doe@example.com",
      "address1": "123 Main St",
      "address2": "Suite 456"
    },
    "administrative": {
      "firstName": "Jane",
      "lastName": "Smith",
      "company": "Example Corp",
      "phone": "+1.5559876543",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "US",
      "email": "jane.smith@example.com",
      "address1": "123 Main St"
    },
    "technical": {
      "firstName": "Bob",
      "lastName": "Johnson",
      "company": "Tech Support Inc",
      "phone": "+1.5555555555",
      "city": "Los Angeles",
      "state": "CA",
      "zip": "90210",
      "country": "US",
      "email": "bob.johnson@techsupport.com",
      "address1": "456 Tech Blvd"
    },
    "billing": {
      "firstName": "Alice",
      "lastName": "Brown",
      "company": "Billing Dept",
      "phone": "+1.5551112222",
      "city": "Chicago",
      "state": "IL",
      "zip": "60601",
      "country": "US",
      "email": "alice.brown@billing.com",
      "address1": "789 Finance Ave"
    }
  },
  "options": {
    "enable_private_whois": true,
    "enable_auto_billing": true
  }
}
```

#### Response

> The response format is identical to the Async or Sync registration examples shown above, depending on whether the request is submitted asynchronously or with `"sync": true`.

---
## Job Status

The Job Status API returns the current status and final result of asynchronous domain operations initiated through supported domain APIs.

#### Current Endpoint

```http
GET /v2.25/domain/jobs/{jobId}
x-api-key: YOUR_API_KEY
```

#### Parameters
- **jobId**: string — *required* (path). Identifier returned by async registration requests. Use this value with `GET /v2.25/domain/jobs/{jobId}` to retrieve processing results.


#### Example response

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

#### Example request (job success)

```http
GET /v2.25/domain/jobs/51040
x-api-key: YOUR_API_KEY
```

```json
{
  "jobId": "51040",
  "state": "completed",
  "result": [
    {
      "success": true,
      "result": {
        "code": 1000,
        "message": "Command completed successfully",
        "description": "Command completed successfully"
      },
      "data": {
        "reseller_order_id": "471",
        "customer_id": "101",
        "reseller_customer_id": "1",
        "domain": "example12470.com",
        "action": "createDomain",
        "status": "completed",
        "processed": true,
        "price": "9.50",
        "total_price": "9.50",
        "years": 1,
        "domain_created": "2026-06-24T04:40:59.000Z",
        "domain_expires": "2027-06-24T04:40:59.000Z",
        "created": "2026-06-24T04:40:58.977Z",
        "updated": "2026-06-24T04:40:59.100Z",
        "payment_status": "completed",
        "ns": [
          "ndns1.cosmotown.com",
          "ndns2.cosmotown.com"
        ],
        "customer_product_id": "17564",
        "order_id": "78718",
        "invoice_id": "15157",
        "contacts": {},
        "item_num": 1,
        "options": null
      }
    }
  ],
  "createdAt": 1782276058972,
  "processedAt": 1782276058973,
  "finishedAt": 1782276059059
}
```

---

## Domain Status

> **Recommendation:** For asynchronous registration requests, first query the **Job Status API** (`GET /v2.25/domain/jobs/{jobId}`) to retrieve the operation result. Use the Domain Status API to fetch the latest order and domain information after processing has completed.

#### Request

```http
GET /v2.25/domain/status/example1123.com
x-api-key: YOUR_API_KEY
```

#### Parameters 

- **domain**: string — *required* (path). The domain to query.


#### Example response

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

#### Example response (success)

```http
GET /v2.25/domain/status/example12470.com
x-api-key: YOUR_API_KEY
```

```json
{
  "success": true,
  "data": {
    "reseller_order_id": "471",
    "domain": "example12470.com",
    "action": "createDomain",
    "status": "completed",
    "processed": true,
    "years": 1,
    "price": "9.50",
    "total_price": "9.50",
    "domain_created": "2026-06-24T04:40:59.000Z",
    "domain_expires": "2027-06-24T04:40:59.000Z",
    "payment_status": "completed",
    "ns": [
      "ndns1.cosmotown.com",
      "ndns2.cosmotown.com"
    ],
    "customer_product_id": "17564",
    "order_id": "78718",
    "invoice_id": "15157",
    "whois_privacy": false,
    "locked": false,
    "auto_billing": false,
    "domain_registry_roid": "143845493_DOMAIN_COM-VRSN",
    "created": "2026-06-24T04:40:58.977Z",
    "updated": "2026-06-24T04:40:59.100Z"
  }
}
```

---
## Domain Info

The Domain Info API retrieves the latest registry information for a domain, including its status, name servers, contacts, important dates, and classification.

#### Request

```http
POST /v2.25/domain/info
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example12470.com"
}
```

#### Parameters
- **domain**: string — *required*. The fully qualified domain name to query registry information for.


#### Example response

```json
{
  "success": true,
  "data": {
    "name": "example12470.com",
    "roid": "143845493_DOMAIN_COM-VRSN",
    "status": [
      {
        "value": "ok",
        "lang": "en"
      }
    ],
    "contacts": {},
    "nameServers": [
      "NDNS1.COSMOTOWN.COM",
      "NDNS2.COSMOTOWN.COM"
    ],
    "createdAt": "2026-06-24T04:40:59Z",
    "expiresAt": "2027-06-24T04:40:59Z",
    "updatedAt": "2026-06-24T04:40:59Z",
    "authInfoRequired": false
  },
  "result": {
    "code": 1000,
    "message": "Command completed successfully"
  },
  "classification": "managed_here"
}
```

#### Example response (locked domain)

```json
{
  "success": true,
  "data": {
    "name": "example12470.com",
    "roid": "143845493_DOMAIN_COM-VRSN",
    "status": [
      {
        "value": "clientDeleteProhibited",
        "lang": "en"
      },
      {
        "value": "clientTransferProhibited",
        "lang": "en"
      },
      {
        "value": "clientRenewProhibited",
        "lang": "en"
      },
      {
        "value": "clientUpdateProhibited",
        "lang": "en"
      }
    ],
    "contacts": {},
    "nameServers": [
      "NDNS1.COSMOTOWN.COM",
      "NDNS2.COSMOTOWN.COM"
    ],
    "createdAt": "2026-06-24T04:40:59Z",
    "expiresAt": "2027-06-24T04:40:59Z",
    "updatedAt": "2026-06-24T04:56:45Z",
    "authInfoRequired": false
  },
  "result": {
    "code": 1000,
    "message": "Command completed successfully"
  },
  "classification": "managed_here"
}
```

#### Example response (unlocked domain)

```json
{
  "success": true,
  "data": {
    "name": "example12470.com",
    "roid": "143845493_DOMAIN_COM-VRSN",
    "status": [
      {
        "value": "ok",
        "lang": "en"
      }
    ],
    "contacts": {},
    "nameServers": [
      "NDNS1.COSMOTOWN.COM",
      "NDNS2.COSMOTOWN.COM"
    ],
    "createdAt": "2026-06-24T04:40:59Z",
    "expiresAt": "2027-06-24T04:40:59Z",
    "updatedAt": "2026-06-24T05:00:11Z",
    "authInfoRequired": false
  },
  "result": {
    "code": 1000,
    "message": "Command completed successfully"
  },
  "classification": "managed_here"
}
```

---

## Domain Lock

Locks a domain at the registry to prevent unauthorized updates, transfers, or deletion.

#### Request

```http
POST /v2.25/domain/lock
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example12470.com"
}
```

#### Parameters
- **domain**: string — *required*. Domain to lock at the registry.


#### Example response

```json
{
  "success": true,
  "data": {
    "domain": "example12470.com",
    "customer_product_id": "17564",
    "action": "lock",
    "locked": true
  },
  "result": {
    "code": 1000,
    "message": "Command completed successfully"
  }
}
```

---

## Domain Unlock

Unlocks a previously locked domain, allowing updates and transfers.

#### Request

```http
POST /v2.25/domain/unlock
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example12470.com"
}
```

#### Parameters
- **domain**: string — *required*. Domain to unlock at the registry.


#### Example response

```json
{
  "success": true,
  "data": {
    "domain": "example12470.com",
    "customer_product_id": "17564",
    "action": "unlock",
    "locked": false,
    "result": {
      "code": 1000,
      "message": "Command completed successfully"
    }
  },
  "result": {
    "code": 1000,
    "message": "Command completed successfully"
  }
}
```

---

## Change Domain Name Servers

Updates the authoritative name servers for a managed domain.

#### Request

```http
POST /v2.25/domain/change-nameserver
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example12470.com",
  "ns": [
    "ndns1.cosmotown.com"
  ]
}
```

#### Parameters
- **domain**: string — *required*.
- **ns**: array[string] — *required*. List of name servers to set for the domain.


#### Example response

```json
{
  "success": true,
  "data": {
    "domain": "example12470.com",
    "nameservers": [
      "ndns1.cosmotown.com"
    ],
    "previous_nameservers": [
      "NDNS1.COSMOTOWN.COM",
      "NDNS2.COSMOTOWN.COM"
    ]
  }
}
```

---
## Domain Contact Update

Updates one or more domain contacts. Supported contact types are:

- `registrant`
- `administrative`
- `technical`
- `billing`

#### Request

```http
POST /v2.25/domain/contacts/save
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example123557.com",
  "contact_info": {
    "technical": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1.1234567890",
      "address1": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345",
      "country": "US"
    }
  }
}
```

#### Parameters
- **domain**: string — *required*. Domain to update contacts for.
- **contact_info**: object — *required*. One or more contact roles (`registrant`, `administrative`, `technical`, `billing`) with standard contact fields (firstName, lastName, email, phone, address1, city, state, zip, country).


#### Example response

```json
{
  "success": true,
  "data": {
    "domain": "example123557.com",
    "savedContacts": {
      "registrant": "138443"
    },
    "results": [
      {
        "type": "registrant",
        "contact_type_id": 2,
        "contact_info_id": "138443",
        "status": "saved"
      }
    ]
  }
}
```

---

## Get Default Contact Information

Retrieves the authenticated customer's default domain contact information.

#### Request

```http
GET /v2.25/domain/contacts/default
x-api-key: YOUR_API_KEY
```

#### Example response

```json
{
  "success": true,
  "data": {
    "registrant": {
      "FirstName": "Jane",
      "LastName": "Doe",
      "Email": "jane@example.com",
      "Address1": "123 Main St",
      "Address2": "Suite 100",
      "City": "Anytown",
      "State": "CA",
      "Zip": "12345",
      "Country": "US",
      "Phone": "+1.1234567890",
      "Extension": "",
      "Fax": "",
      "Company": "Acme Corp"
    },
    "administrative": {},
    "technical": {},
    "billing": {}
  }
}
```

---

## Update Default Contact Information

Saves or updates the authenticated customer's default domain contact information.

#### Request

```http
POST /v2.25/domain/contacts/default
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "contact_info": {
    "registrant": {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "phone": "+1.1234567890",
      "address1": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345",
      "country": "US"
    }
  }
}
```

#### Parameters
- **contact_info**: object — *required*. One or more defaults for `registrant`, `administrative`, `technical`, or `billing`.
- Allowed contact fields: `firstName` / `FirstName`, `lastName` / `LastName`, `company` / `Company`, `email` / `Email`, `phone` / `Phone`, `extension` / `Extension`, `fax` / `Fax`, `address1` / `Address1`, `address2` / `Address2`, `city` / `City`, `state` / `State`, `zip` / `Zip`, `country` / `Country`.

#### Example response

```json
{
  "success": true,
  "data": {
    "registrant": {
      "FirstName": "Jane",
      "LastName": "Doe",
      "Email": "jane@example.com",
      "Address1": "123 Main St",
      "Address2": "",
      "City": "Anytown",
      "State": "CA",
      "Zip": "12345",
      "Country": "US",
      "Phone": "+1.1234567890",
      "Company": "Acme Corp"
    }
  }
}
```

---

## Get My Domains

Returns the authenticated customer's managed domain list.

#### Request

```http
GET /v2.25/domain/list?limit=20&offset=0&sort=expiration_date&order=desc
x-api-key: YOUR_API_KEY
```

#### Query parameters
- **domain**: string — *optional*. Return only the specified domain.
- **limit**: integer — *optional*. Maximum number of records, default `20`, maximum `100`.
- **offset**: integer — *optional*. Result offset, default `0`.
- **sort**: string — *optional*. One of `domain`, `auto_billing`, `whois_privacy`, `locked`, `created`, `expiration_date`. Default `expiration_date`.
- **order**: string — *optional*. `asc` or `desc`. Default `desc`.

#### Example response

```json
{
  "domains": [
    {
      "domain": "example12470.com",
      "auto_billing": false,
      "whois_privacy": false,
      "locked": false,
      "created": "2026-06-24T04:40:58.977Z",
      "expiration_date": "2027-06-24T04:40:59.000Z"
    }
  ]
}
```

---

## Get Domain DNS Settings

Retrieves the configured DNS settings for a managed domain.

#### Request

```http
GET /v2.25/domain/dns-settings?domain=example12470.com
x-api-key: YOUR_API_KEY
```

#### Query parameters
- **domain**: string — *required*. Domain to retrieve DNS settings for.

#### Example response

```json
{
  "success": true,
  "data": {
    "domain": "example12470.com",
    "nameservers": [
      "ndns1.cosmotown.com",
      "ndns2.cosmotown.com"
    ],
    "records": [
      {
        "type": "A",
        "name": "@",
        "value": "1.2.3.4",
        "ttl": 3600
      }
    ]
  }
}
```

---

## Save Domain DNS Settings

Updates the DNS settings for a managed domain.

#### Request

```http
POST /v2.25/domain/dns-settings
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example12470.com",
  "records": {
    "@": [
      { "type": "A", "value": "1.2.3.4", "ttl": 3600 }
    ]
  },
  "mode": "merge"
}
```

#### Parameters
- **domain**: string — *required*. Domain to update.
- **records**: object — *optional*. Record data to save for the domain.
- **mode**: string — *optional*. `merge` (default) or `delete`.
- **all**: boolean — *optional*. When `true` with `mode: delete`, the endpoint deletes all records for the domain.

#### Behavior
- If `records` is provided, the endpoint saves the DNS records.
- If `records` is provided and `mode` is `delete`, the endpoint deletes those DNS records provided for the domain.
- If `mode` is `delete` and `all` is `true`, the endpoint deletes all DNS records for the domain.
- If no `records` are provided and delete-all is not requested, the endpoint performs a DNS settings refresh/update.

#### Example response

```json
{
  "success": true,
  "data": {
    "domain": "example12470.com",
    "updated": true
  }
}
```

---

## Change Domain Options

Updates domain-level options such as privacy, lock status, and auto billing. Supports single-domain payloads or bulk updates via `items`.

#### Request (single domain)

```http
POST /v2.25/domain/options
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example12470.com",
  "options": {
    "enable_private_whois": true,
    "lock_domain": true,
    "enable_auto_billing": false
  }
}
```

#### Request (bulk)

```http
POST /v2.25/domain/options
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "items": [
    {
      "domain": "example12470.com",
      "options": {
        "enable_private_whois": true,
        "lock_domain": false,
        "enable_auto_billing": true
      }
    }
  ]
}
```

#### Parameters
- **domain**: string — *required* for single-domain payloads.
- **items**: array[object] — *optional*. Batch updates.
- **options**: object — *required*. Supported fields:
  - `enable_private_whois`: boolean
  - `lock_domain`: boolean
  - `enable_auto_billing`: boolean

#### Example response

```json
{
  "success": true,
  "results": [
    {
      "success": true,
      "domain": "example12470.com",
      "whois_privacy": false,
      "locked": true,
      "auto_billing": false
    }
  ]
}
```

---

## Fetch Domain Contacts

Retrieves the contact information currently associated with a managed domain.

#### Request

```http
GET /v2.25/domain/contacts/example123557.com
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

#### Parameters
- **domain**: string — *required* (path). Domain to fetch contacts for.


#### Example response

```json
{
  "success": true,
  "data": {
    "domain": "example123557.com",
    "contacts": {
      "administrative": {
        "contact_info_id": "138442",
        "contact_type_id": "3",
        "type": "administrative",
        "firstName": "John",
        "lastName": "Doe",
        "company": "",
        "email": "john@example.com",
        "phone": "+1.1234567890",
        "extension": "",
        "fax": "",
        "address1": "123 Main St",
        "address2": "",
        "city": "Anytown",
        "state": "CA",
        "zip": "12345",
        "country": "US"
      }
    }
  }
}
```

---

## Domain Renewal

The Domain Renewal API renews an existing domain registration.

#### Request

```http
POST /v2.25/domain/renew
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "domain": "example123570.com",
  "years": 1,
  "sync": true
}
```

#### Parameters
- **domain**: string — *required*. Domain to renew.
- **years**: integer — *required*. Number of years to renew.
- **sync**: boolean — *optional*. When `true`, attempt synchronous processing.


#### Example response

```json
{
  "success": true,
  "result": [
    {
      "success": true,
      "result": {
        "code": 1000,
        "message": "Command completed successfully",
        "description": "Command completed successfully"
      },
      "data": {
        "reseller_order_id": "473",
        "customer_id": "101",
        "reseller_customer_id": "1",
        "domain": "example123570.com",
        "action": "renewDomain",
        "status": "completed",
        "processed": false,
        "price": "9.49",
        "total_price": "9.49",
        "years": 1,
        "domain_created": null,
        "domain_expires": "2029-06-24T01:42:38Z",
        "created": "2026-06-24T05:05:16.868Z",
        "updated": "2026-06-24T05:05:16.868Z",
        "payment_status": "completed",
        "ns": [],
        "customer_product_id": null,
        "order_id": null,
        "invoice_id": null,
        "contacts": {},
        "item_num": 1,
        "options": null
      }
    }
  ]
}
```

---
## Domain Transfer

Bulk domain transfers are supported via the `items` array. Up to **50 items per request** are supported and the HTTP body limit is 1 MB.

#### Request

```http
POST /v2.25/domain/transfer
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "items": [
    {
      "domain": "example123570.com",
      "authCode": "QVVUSC0xMjM="
    }
  ],
  "sync": true
}
```

#### Example response (sync)

```json
{
  "success": true,
  "result": [
    {
      "success": true,
      "result": {
        "code": 1001,
        "message": "Command completed successfully; action pending",
        "description": "Command completed successfully; action pending",
        "transfer_status": "pending"
      },
      "data": {
        "reseller_order_id": "474",
        "domain": "example123570.com",
        "action": "transferDomain",
        "status": "completed",
        "transfer_status": "pending"
      }
    }
  ]
}
```

Refer to `GET /v2.25/domain/status/{domain}` to fetch final domain details.

---

## Quick start

### Typical Integration Workflow

A minimal, recommended integration flow for reseller systems:

1. Obtain an API key from Cosmotown support and store it securely.
2. Use the Domain Check API to verify availability: `POST /v2.25/domain/check`.
3. Submit registration (, transfer, or renew) requests with `POST /v2.25/domain/register` (prefer async).
4. Poll the Job Status API `GET /v2.25/domain/jobs/{jobId}` to retrieve results.
5. After processing, fetch domain/order details with `GET /v2.25/domain/status/{domain}`.
6. Manage contacts and nameservers as needed via contacts and change-nameserver endpoints.

This README contains full examples and per-endpoint parameter details below.

### API Design Principles

- RESTful resource-oriented endpoints.
- JSON request and response bodies (`Content-Type: application/json`).
- API Key authentication using the `x-api-key` header.
- Batch limits: bulk endpoints (register, transfer, renew) support up to **50 items per request** and an HTTP body limit of **1 MB**.

### Naming and formatting conventions

- Domains: use lowercase fully-qualified domain names (FQDN). IDNs should be sent in punycode when required by the registry.
- Dates: ISO 8601 in UTC (e.g., `2026-06-24T04:40:59Z`).
- Monetary values are decimal string (e.g., `"9.50"`).

### Rate limiting and throttling 

The service implements two rate-limit layers :

- Layer 1 (IP baseline): `300` requests per minute per IP (global onRequest rate limiter).
- Layer 2 (post-auth customer-based): variable per-minute quotas — `1200` for priority API keys, `600` for authenticated customers, `120` fallback. 

Clients should implement retries with exponential backoff and jitter to handle `429` responses. 

### Asynchronous Processing

The asynchronous endpoints immediately return a `jobId` while processing continues in the background, poll the Job Status API to read the final result.

Typical lifecycle:

> submitted → processing → completed

OR

> submitted → processing → failed

When polling jobs, use exponential backoff and cap total polling time to a sensible limit appropriate for your integration.

When `"sync": true` is supplied, the request attempts to perform the operation synchronously and returns per-item results.

### How to handle errors

Treat HTTP status codes first, then inspect the response envelope for details:

- `400` — client error (fix request payload). Do not retry.
- `401` — invalid API key. Refresh credentials or contact support. Do not retry.
- `403` — insufficient permission. Check account configuration. Do not retry.
- `404` — resource not found. Verify request path/parameters.
- `422` — validation error. Inspect `error.details` and correct input.
- `429` — rate limited. Retry with exponential backoff.
- `5xx` — server error. Retry with backoff; if persistent contact support.

### Common result codes

The API frequently uses numeric `code` values inside `result` objects. Below are common codes observed in examples; this list should be extended as the service publishes a full mapping.

Examples: 
 
 | Code |  Description |
 | --- | --- |
 | 1000 |  Command completed successfully |
 | 1001  |  Command accepted; action pending |
 | 2302  |  Object already exists |

If the server uses a different error envelope, the authoritative format will be published here.

### Validation

General validation rules:

-   Valid FQDN.
-   Registry-supported registration period.
-   Valid nameserver hostnames.
-   Valid email addresses.
-   Phone numbers should follow E.164 where possible.

Some registries require additional fields depending on the TLD.

## Notes

- For new integrations, use the **v2.25** endpoints, avoid previous version v2 if provided.
- For asynchronous operations, submit the request and use the returned `jobId` with the **Job Status API** (`GET /v2.25/domain/jobs/{jobId}`) to retrieve the operation result.
- The Domain Status API provides the latest reseller order and domain information after processing.
- Both single-domain registration requests and the newer `items` array request format are supported for backward compatibility.
- Domain registration supports optional custom name servers (`ns`), contact information (`contact_info`), and registration options (`options`) when provided.
- Contact updates support the following contact types:
  - `registrant`
  - `administrative`
  - `technical`
  - `billing`

## Developer Roadmap

### Phase 2

- Get Transfer-Out status

- Get TLD prices

- Get domain AuthCode

### Phase 3

- Get DNSSEC domain status

- Enable domain DNSSEC

- Disable domain DNSSEC

## Changelog

This file records notable public API changes. For each release include the version, date, and migration notes.

- [**v2.25** phase-2 APIs](#versioning)
- **v2.25** (latest) 
- **v2** 

## FAQ & Troubleshooting

- **Q: I received EPP code `2302` (object exists) when registering — what now?**
  - A: `2302` commonly means the domain already exists at the registry. Clients should treat this as a conflict: do not retry immediately. For async flows the platform may attempt recovery (see internal recovery logic). If you expect the domain to be available, contact Cosmotown support with the domain and the jobId.

- **Q: I submitted a batch and some items succeeded while others failed — how should I handle this?**
  - A: For sync requests inspect the per-item `result` entries. For async requests poll the job and examine `result` array after sometime.

- **Q: What does the `processed` field mean in responses?**
  - A: `processed` indicates whether the reseller order has been processed by downstream systems (billing/provisioning). `processed: false` often means the domain/order is accepted but not yet fully handled by downstream workflows.


---

 [⬆ Back to Top](#versioning)  
 [Table of Contents](#table-of-contents)
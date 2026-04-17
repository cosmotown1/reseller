# reseller
API documentaion and other resources for resellers 

## Documentation

### Getting Started
- **[Workflow Guide](./WORKFLOW_GUIDE.md)** — Integration quickstart, common scenarios, and troubleshooting
- **[Async Architecture](./api/ASYNC_WORKFLOW.md)** — Job lifecycle, polling strategies, and code examples in JavaScript, Python, cURL

### API Reference
- **Current API (v2.25):** [Registration Reference](./api/v2.25/domain/registration.md)
- **Previous (v2 - Legacy):** [Registration Reference](./api/v2/domain/registration.md)

### Testing & Integration
- **API Collection (v2.25):** [HTTP Requests](./api/v2.25/domain/registration.http) — Import into Postman, Insomnia, or [VS Code REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- **API Collection (v2):** [HTTP Requests](./api/v2/domain/registration.http)

---

## Quick Start

1. Get your API key from Cosmotown support
2. Read [Workflow Guide](./WORKFLOW_GUIDE.md) for integration patterns
3. Review [code examples](./api/ASYNC_WORKFLOW.md#code-examples) in your preferred language
4. Test using [HTTP requests](./api/v2.25/domain/registration.http)

## Key Concepts

- **Async-First:** Registration requests are queued and processed asynchronously
- **Job Lifecycle:** Jobs persist ~1-2 hours; use `/domain/status` API for indefinite tracking
- **Polling:** Check `/domain/status` every 30-60 seconds (recommended)
- **Status API:** Works forever — use this for persistent domain tracking

For details, see [Async Architecture](./api/ASYNC_WORKFLOW.md).

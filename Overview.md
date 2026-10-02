# reseller
API documentation and other resources for resellers

## Documentation

### Getting Started
- **[Workflow Guide](./WORKFLOW_GUIDE.md)** — Integration quickstart, common scenarios, and troubleshooting
- **[Async Registration Overview](./api/ASYNC_WORKFLOW.md)** — Brief overview of registration tracking options

### API Reference
- **Current API (v2.25):** [Registration Reference](./api/v2.25/domain/registration.md)
- **Previous (v2 - Legacy):** [Registration Reference](./api/v2/domain/registration.md)

### Testing & Integration
- **API Collection (v2.25):** [HTTP Requests](./api/v2.25/domain/registration.http) — Import into Postman, Insomnia, or [VS Code REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- **API Collection (v2):** [HTTP Requests](./api/v2/domain/registration.http)

## Key Concepts

- **Async-First:** Registration requests are queued and processed asynchronously
- **Tracking:** Use the returned job ID to check request progress and domain status to look up the stored order.

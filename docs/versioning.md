# Versioning and deprecation

## API version

The API version is in the URL path, for example `/v2.25/domain/check`. Endpoints without a version segment (`/health`, `/ping`) are shared across versions.

The OpenAPI document in [openapi/openapi.yaml](../openapi/openapi.yaml) describes the current version. Its `info.version` matches the release tag.

## Release tags

- Each documentation release is a git tag such as `v2.25_2`.
- Release notes go in [changelog.md](../changelog.md) and in the matching GitHub Release.
- Older versions are not kept as folders. Read them at their tag, for example `git show v2.25_1:README.md`.

## Compatibility

Within a version, changes must not break existing integrations. Breaking changes are checked in CI with `oasdiff`.

Non-breaking changes include new optional fields, new endpoints, and new result codes. Clients should ignore unknown fields.

## Deprecation policy

When an endpoint, field, or behaviour is deprecated:

1. Mark it `deprecated: true` in the OpenAPI spec and note it in the changelog.
2. State the planned removal date in the changelog entry.
3. Keep the behaviour unchanged until the removal date.
4. Remove it only in a new version path, such as `/v2.26/`.

Proposed notice periods (pending API owner approval):

- Field or behaviour changes: at least 90 days.
- Endpoint removal: at least 180 days.

Deprecated endpoints return a `Deprecation` header and, once a removal date is set, a `Sunset` header (RFC 8594). The legacy job routes already send `Sunset` in the source.

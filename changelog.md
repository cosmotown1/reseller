# Changelog

All notable changes to the Cosmotown Reseller API are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- `openapi/openapi.yaml` (OpenAPI 3.1) as the source of the endpoint reference, with lint (`npm run docs:lint`) and HTML build (`npm run docs:build`).
- Task guides in `docs/guides/` (register, track, renew, transfer), an error reference in `docs/errors.md`, and a versioning policy in `docs/versioning.md`.
- CI checks for pull requests: spec lint, reference build, breaking-change check against the base branch, and Markdown link check.

### Changed
- Documented that `GET /v2.25/domain/list` has no substring search. Use `domain` for an exact lookup.
- Documented the 50-item limit for batch register, renew, and transfer requests, matching the service validation.
- Documented job `404` and `403` responses, and the `207` and `402` register responses.
- Changed validation errors from `422` to `400`, matching the service.
- Added a Postman collection build (`npm run docs:postman`), run in CI and uploaded as a workflow artifact.
- Removed roadmap entries for capabilities already documented as available.
- Consolidated documentation into `README.md`; removed legacy v2 documentation, internal workflow notes, and the sample test runner.

## [v2.25 phase-2](https://github.com/cosmotown1/reseller/releases/tag/v2.25_2) - 2026-08-11

### Added
- Support for `.net` TLD.
- Documentation for `GET /v2.25/domain/dns-settings`.
- Documentation for `POST /v2.25/domain/dns-settings`.
- Documentation for `GET /v2.25/domain/contacts/default`.
- Documentation for `POST /v2.25/domain/contacts/default`.
- Documentation for `GET /v2.25/domain/list`.
- Documentation for `POST /v2.25/domain/options`.
- Updated API overview and Table of Contents coverage for new reseller endpoints added in this release.

### Changed
- Moved changelog details out of `README.md` into this standalone `changelog.md`.
- Clarified API overview section and endpoint grouping.

## [v2.25](https://github.com/cosmotown1/reseller/releases/tag/v2.25_1) - 2026-03-20

### Added
- Published the initial public reference for Cosmotown Reseller API v2.25.
- Documented core reseller endpoints and async job status behavior.

### Changed
- Established a canonical changelog file for future API release notes.

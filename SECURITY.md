# Security Policy

## Reporting a vulnerability

Please **do not** open a public GitHub Issue or Discussion for security vulnerabilities.

Use GitHub's [Private vulnerability reporting](https://github.com/willink-oss/willink-design-system/security/advisories/new) (GitHub Security Advisories) to submit reports privately. This allows us to triage and patch before public disclosure.

Include as much of the following as possible:

- A description of the vulnerability and its impact
- Steps to reproduce (or a proof-of-concept)
- Affected package(s) and version(s)
- Your suggested mitigation if any

---

## Supported versions

| Version | Supported |
|---|---|
| Latest minor (current `1.x`) | Yes |
| Older minors | No — please upgrade |

Security fixes are applied only to the latest released minor of each npm package (`@willink-labs/tokens`, `@willink-labs/tailwind-preset`, `@willink-labs/react`, `@willink-labs/css-tokens`). The Flutter DS now lives in the separate [PULSE](https://github.com/willink-oss/pulse_theme) package (`pulse_theme`); the legacy `willink_theme` package is being superseded. Older minors are not patched; we recommend upgrading.

The packages are post-1.0 and follow strict SemVer ([ADR-0010](./docs/adr/0010-semver-policy.md)).

---

## Response timeline

- **Initial response**: within **5 business days** of report receipt (acknowledgement + initial triage).
- **Fix timeline**: depends on severity. Critical issues are prioritized; we will share a target ETA in the initial response.
- **Disclosure**: coordinated with the reporter. We will publish a GitHub Security Advisory with a CVE if applicable once a fix is released.

---

## Scope

**In scope:**

- Code shipped in the published packages: `@willink-labs/tokens`, `@willink-labs/tailwind-preset`, `@willink-labs/react`, `willink_theme`.
- Build artifacts produced by this repository's release pipeline.

**Out of scope:**

- Consumer applications using these packages — those are the responsibility of the consuming project. Vulnerabilities arising from misuse (e.g. unsanitized props passed into DS components by a consumer) are not in scope unless the component itself has a documented safe-input contract that is violated.
- Third-party dependencies — please report upstream. We will update our pinned versions once a fix is available upstream.
- Issues only reproducible in development mode (`pnpm dev`) with debug tooling enabled.

---

Thanks for helping keep i-Willink Design System and its users safe.

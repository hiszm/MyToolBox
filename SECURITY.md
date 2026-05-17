# Security Policy

## Supported versions

Only the latest minor release of MyToolBox is supported. There are no separate security branches — all fixes ship in the next release.

| Version | Supported |
|---------|-----------|
| 2.x     | ✅        |
| 1.x     | ❌        |

## Reporting a vulnerability

Because MyToolBox runs entirely in the browser and never talks to a backend, the surface area for traditional vulnerabilities is small. The most likely categories are:

- **XSS** — a tool that renders user-controlled content unsafely
- **Prototype pollution** — through a parser that walks untrusted JSON
- **DoS / freeze** — a tool that hangs the tab on a malicious input
- **Supply chain** — a compromised npm dependency

If you discover any of the above, please **do not open a public issue**. Instead:

1. Email `hiszm.security@gmail.com` (or contact `@hiszm` privately on GitHub)
2. Include a clear reproduction (URL, payload, browser version)
3. Allow up to 7 days for an initial response

We'll work with you to confirm and fix the issue, then coordinate a public disclosure once a patch is released.

## Out of scope

These do **not** qualify as security issues because the project is intentionally a client-only static site:

- Lack of HTTPS Strict-Transport-Security headers (GitHub Pages handles this)
- Missing CORS/CSP headers (the app makes no cross-origin requests)
- Self-XSS that requires the user to paste arbitrary code into a tool

## Recognition

Researchers who responsibly disclose verified vulnerabilities will be credited in the [CHANGELOG](./CHANGELOG.md) for the release that fixes the issue, unless they prefer to remain anonymous.

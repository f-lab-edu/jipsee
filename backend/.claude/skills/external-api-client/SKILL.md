---
name: external-api-client
description: >
  Use when writing code that calls an external HTTP API (public data APIs, LLM APIs, etc.).
  Defines client class layout, configuration, and response handling.
---

# External API Client

- One `*Client` class per external API. Base URL and key come from config.
- Map responses to outcomes in the client: 404 skip, 5xx and timeouts retry, other 4xx fail.

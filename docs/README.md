# Documentation

This documentation describes the implementation in the repository as of 18 October 2026. The code is the source of truth. When a document and the code disagree, update the document after verifying the code.

The current interface copy is in Indonesian. This documentation is in English, so quoted UI labels remain in their original Indonesian form.

## Reading paths

### For non-developers

1. Read [Product overview](about.md) to understand what the application is and what it does not do.
2. Read [Current features](FEATURES.md) to see what is available today.
3. Read [User flows](user-flows.md) to follow the screens and actions in order.

### For developers

1. Read [Getting started](getting-started.md) to run the project.
2. Read [Architecture](architecture.md) for the rendering and data flow.
3. Read [Data model](data-model.md) for types, DTOs, repository behavior, and browser storage.
4. Read [Routes and SEO](routes-and-seo.md) before changing pages or metadata.
5. Read [Testing](testing.md) before changing the validation workflow.
6. Use [Troubleshooting](troubleshooting.md) when local setup or runtime behavior fails.

### For maintainers

Use [References](references.md) for verified external documentation links and [Roadmap](roadmap.md) for planned work. The roadmap is a template. Blank or unchecked items are not commitments until the project owner fills them in.

## Document status

| Status | Meaning |
| --- | --- |
| Implemented | The repository contains working code for the behavior. |
| Prototype | The behavior works, but the content or data is sample material. |
| UI only | The screen exists, but the action is not connected to a backend or durable service. |
| Not implemented | The repository does not contain working code for the behavior. |
| Reference | The document describes a contract, route, or system without adding a product claim. |

## Document map

| Document | Topic | Primary audience |
| --- | --- | --- |
| [Product overview](about.md) | Product purpose, audience, and current scope | Non-developers and new team members |
| [Getting started](getting-started.md) | Installation, environment variables, and local commands | Developers and operators |
| [Troubleshooting](troubleshooting.md) | Common local setup and runtime problems | Developers and operators |
| [Current features](FEATURES.md) | Feature inventory and limitations | Everyone |
| [Architecture](architecture.md) | Rendering boundaries, data flow, and runtime integrations | Developers |
| [Data model](data-model.md) | Entities, DTOs, repository methods, and local storage | Developers |
| [User flows](user-flows.md) | Screen-by-screen user journeys | Product, design, QA, and non-developers |
| [Routes and SEO](routes-and-seo.md) | Routes, query parameters, metadata, sitemap, and manifest | Developers and content operators |
| [Testing](testing.md) | Test commands, current results, and known lint issue | Developers |
| [References](references.md) | Verified external links and verification status | Everyone |
| [Roadmap](roadmap.md) | Template for future work | Project owner and maintainers |
| [Design system](../DESIGN.md) | Visual tokens, typography, components, and accessibility | Designers and developers |

## Related legacy entry points

- [System design map](system_design.md) points to the focused documents above.
- [Database status](database.md) records that no database is implemented.

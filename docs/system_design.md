# System Design Map

The previous system design file mixed architecture, data contracts, user journeys, and design tokens. The current documentation separates those topics so each page has one purpose.

## Current system boundary

The repository is a Next.js front end with a local TypeScript data source. It has no API route, database, authentication, or server-side write path.

## Focused documents

| Topic | Document |
| --- | --- |
| Runtime architecture and data flow | [Architecture](architecture.md) |
| Types, DTOs, repository, and local storage | [Data model](data-model.md) |
| Screen-by-screen user journeys | [User flows](user-flows.md) |
| Routes, metadata, sitemap, and manifest | [Routes and SEO](routes-and-seo.md) |
| Visual tokens and component rules | [Design system](../DESIGN.md) |
| Feature status | [Current features](FEATURES.md) |
| Planned work template | [Roadmap](roadmap.md) |

## Reading rule

Use the code as the source of truth. A type or an unused component does not make a feature available. The feature list records whether the route actually uses the behavior.

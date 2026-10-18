# Product Overview

VisitPekalongan is a local discovery site for places in Pekalongan, Indonesia. The interface covers food, coffee, nature, and heritage spots. It gives each place a photo, a short story, practical details, opening hours, facilities, and a route action.

The current repository is a prototype. It uses 28 sample records so the interface, search, filters, detail page, map, sharing, and bookmark behavior can be reviewed without a backend.

## Who the current version serves

The interface is written for visitors who want to:

- browse a short, curated list of places;
- search by place name, dish, district, or intent words such as `kopi`, `kerja`, `alam`, or `batik`, with some English aliases such as `coffee`;
- compare places by category, city or regency, opening status, and facilities;
- open a route in Google Maps;
- save places in the current browser;
- recommend another place through the report form.

The repository is also a starting point for developers who need to understand the current rendering, data, and browser-storage model.

## What the current version offers

- A catalog with grid, list, and map views.
- Search and filter controls in the catalog header.
- A detail page for every visible spot.
- Opening status calculated in the browser from weekly schedules.
- Saved spots, recent searches, and report submissions stored in `localStorage`.
- Metadata, sitemap, robots, manifest, and Open Graph image routes.
- A short introductory overlay with reduced-motion handling and scroll locking.

## What the current version does not do

- It does not load data from a database.
- It does not send report submissions to a server.
- It does not provide accounts, admin moderation, or cross-device sync.
- It does not provide a full offline copy of a place or an offline map.
- It does not provide a vibe filter, district filter, or distance sort in the catalog.
- It does not provide a multi-image gallery.

The 28 records and their images are sample content. The application displays a curator-verification label in the detail header, but the repository does not contain an external verification record for those claims.

## Next documents

- Review the actual feature inventory in [Current features](FEATURES.md).
- Follow the screens in [User flows](user-flows.md).
- See [Data model](data-model.md) for the sample data structure.
- Plan future work in [Roadmap](roadmap.md).

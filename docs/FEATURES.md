# Current Features

This page describes the features that exist in the repository as of 18 October 2026. The catalog data is prototype content.

## Feature summary

| Capability | Status | What it does |
| --- | --- | --- |
| Catalog | Implemented | Shows the 28 sample spots in a responsive card grid. |
| Grid, list, and map views | Implemented | Switches the catalog presentation without leaving the page. |
| Smart search | Implemented | Searches names, signature dishes, districts, descriptions, categories, and intent words in the browser. |
| Category filter | Implemented | Limits the catalog to one of four categories. |
| City or regency filter | Implemented | Limits results to Kota Pekalongan or Kabupaten Pekalongan. |
| Open-now filter | Implemented | Filters by the current opening status calculated in the WIB timezone. |
| Saved-spots filter | Implemented | Shows spots bookmarked in the current browser. |
| Pagination | Implemented | Loads nine catalog cards at a time. |
| Detail page | Implemented | Shows a place narrative, schedule, facilities, status, price range, and related places. |
| Google Maps route link | Implemented | Opens the Google Maps directions URL built from the spot coordinates. |
| Instagram link | Implemented when data exists | Opens the recorded Instagram account. |
| Google Maps review link | Implemented when data exists | Opens a Maps search URL recorded in the sample data. |
| Share action | Implemented | Uses the Web Share API when available, otherwise falls back to clipboard copy. |
| Bookmarks | Implemented, local only | Stores saved spot slugs in `localStorage`. |
| Recent searches | Implemented, local only | Stores up to five recent search strings in `localStorage`. |
| Report form | UI only | Saves a recommendation in the current browser and shows a success state. |
| About page | Implemented | Explains the product direction and curation themes. |
| Intro overlay | Implemented | Plays a logo reveal and releases the page after a timer, Escape, or a failsafe. |
| SEO routes | Implemented | Provides metadata, sitemap, robots, manifest, and Open Graph images. |
| Vibe filter | Not implemented | A `VibePills` component and tag list exist, but no route imports the component and no spot has tag relations. |
| District filter | Not implemented | The filter type accepts a district, but the catalog and repository do not filter by it. |
| Distance sort | Not implemented | The map shows a distance in the preview card, but the catalog is not sorted by distance. |
| Offline guide | Not implemented | The detail page shows static logistics guidance for some places. It does not download a guide. |
| Multi-image gallery | Not implemented | The detail view receives one gallery item built from the cover image. |
| Server-side report storage | Not implemented | The form does not call an API. |
| Full PWA offline mode | Not implemented | A web manifest exists, but there is no service worker or offline route cache. |

## Catalog behavior

The home page loads categories and spots on the server, then sends the full list to the client feed. The client applies filters and search without another request.

Search is handled by `searchSpotsSmart` in `src/lib/utils/smart-search.ts`. It scores direct name and dish matches, district and category matches, description matches, intent rules, and small spelling differences. It is useful for a small local list, not for a large remote dataset.

The category, city or regency, open-now, and saved controls are available from the header filter drawer. The grid, list, and map switch is visible above the results.

When no result matches, the empty state offers ways to remove the current filters. When the open-now filter is selected before the client clock is ready, the feed shows a temporary checking message.

## Map behavior

The map loads only when the user selects the map view. MapLibre GL renders one marker for each filtered spot. Selecting a marker opens a preview card with the spot name, category, district, status, price range, optional distance, a Google Maps route link, and a detail-page link.

The location button requests browser geolocation permission. It adds a user marker and can center the map when the user is within the approximate Pekalongan region. It does not reorder the catalog.

The map uses CARTO basemap tiles over the network. It is not an offline map.

## Detail behavior

The detail page shows:

- a cover image;
- category, regency, and district labels;
- the current opening status;
- the address and price range;
- Google Maps, Instagram, and review actions when their data exists;
- a share action;
- bookmark controls;
- the curator narrative and signature dish;
- the best time to visit;
- the weekly schedule with Friday break notes when present;
- facility labels;
- logistics guidance for some highland or nature spots;
- three related spots selected by category, distance, shared facilities, and price similarity.

## Browser storage

The application uses three storage keys:

| Key | Data | Written by |
| --- | --- | --- |
| `vp_bookmarked_spots` | An array of saved spot slugs | Bookmark buttons |
| `vp_recent_searches` | Up to five recent search strings | Search field |
| `vp_spot_submissions` | An array of report-form submissions | Report form |

Clearing site data removes these values. They do not sync between browsers or devices.

## Explicit limits

- The 28 spot records are sample data.
- The four category groups each contain seven sample records.
- The detail header says the place is curator-verified. The repository does not contain the external verification record behind that label.
- The catalog sends every record to the client before filtering.
- The map, remote images, and Google Fonts need network access at the relevant runtime stage.

## Related documents

- [User flows](user-flows.md)
- [Architecture](architecture.md)
- [Data model](data-model.md)
- [Routes and SEO](routes-and-seo.md)

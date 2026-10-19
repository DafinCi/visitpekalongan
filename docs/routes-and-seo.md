# Routes and SEO

This page lists the current routes, URL parameters, metadata, and external actions.

## Routes

| Route          | Type                         | Purpose                                                                  |
| -------------- | ---------------------------- | ------------------------------------------------------------------------ |
| `/`            | Server page with client feed | Catalog, search, filters, saved-spot filter, and grid, list, or map view |
| `/spot/[slug]` | Dynamic server page          | Place detail, schedule, facilities, related places, and route actions    |
| `/about`       | Server page                  | Product explanation and curation themes                                  |
| `/lapor`       | Server page with client form | Recommendation form                                                      |
| Not found      | Global not-found page        | Missing page or missing spot                                             |

The application has no API routes.

## Catalog query parameters

| Parameter  | Values                   | Behavior                                                               |
| ---------- | ------------------------ | ---------------------------------------------------------------------- |
| `q`        | Text                     | Search query                                                           |
| `category` | Category slug or `all`   | Category filter                                                        |
| `regency`  | `kota` or `kabupaten`    | Regional filter                                                        |
| `openNow`  | Boolean                  | Show only places calculated as open                                    |
| `saved`    | Boolean                  | Show only bookmarked slugs                                             |
| `view`     | `grid`, `list`, or `map` | Catalog presentation                                                   |
| `spot`     | Spot identifier          | Exposed by the filter hook but not consumed by the current map or page |

The default category is `all`. The default view is `grid`.

## Page metadata

The root layout defines:

- `metadataBase` from the site URL resolver;
- the site title and description;
- the document language `id`;
- the root Open Graph image.

The spot page generates a title and description from the spot record. It also supplies an Open Graph title, description, image URL, and image dimensions.

The current metadata does not define canonical URLs, alternate language links, or a robots policy per page.

## Structured data

The spot detail page emits JSON-LD with:

- `FoodEstablishment` for food and coffee categories;
- `TouristAttraction` for other categories;
- name, description, image, address, coordinates, and a price range where applicable.

The JSON-LD is generated from the same local record used by the page.

## Sitemap

`src/app/sitemap.ts` returns:

- the home page (`/`);
- the about page (`/about`);
- the community recommendation page (`/lapor`);
- every visible spot detail page (`/spot/[slug]`).

Each entry uses the current date as `lastModified`, not the record's `updatedAt` date.

## Robots

`src/app/robots.ts` allows all user agents and points to `/sitemap.xml`.

## Manifest

`src/app/manifest.ts` defines:

- the application name and short name;
- the start URL;
- standalone display mode;
- the background and theme colors;
- application icon entries pointing to `/icon.svg` and `/logo.svg` (`image/svg+xml`).

The manifest alone does not make the application work offline. There is no service worker in the repository.

## Open Graph images

The root route uses `src/app/opengraph-image.tsx` to generate a 1200 by 630 image.

The spot route uses `src/app/spot/[slug]/opengraph-image.tsx` to generate a per-spot image. It uses the spot name, category, district, regency, description, price range, and cover image.

Image generation may need network access when the cover image is remote.

## External actions

### Google Maps route

The route URL is generated as:

```text
https://www.google.com/maps/dir/?api=1&destination={latitude},{longitude}
```

The link opens in a new tab with `noopener noreferrer`.

### Google Maps review

Some sample records contain a `googleMapsReviewUrl`. The detail page and card menu link to it only when the field exists.

### Instagram

Some records contain an `instagramAccount`. The UI builds `https://instagram.com/{account}` and opens it in a new tab.

### Share

The detail page and cards use the Web Share API when the browser supports it. If sharing is unavailable or cancelled, the detail page can copy the current URL. Availability depends on the browser and page context.

## Base URL resolution

`getBaseUrl` checks these values in order:

1. `NEXT_PUBLIC_SITE_URL`;
2. `VERCEL_PROJECT_PRODUCTION_URL`;
3. `VERCEL_URL`;
4. `https://visitpekalongan.vercel.app`.

The public site URL affects metadata, sitemap, and robots output.

## Related documents

- [Architecture](architecture.md)
- [User flows](user-flows.md)
- [References](references.md)

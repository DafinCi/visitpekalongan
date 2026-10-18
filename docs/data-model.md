# Data Model

The current application uses TypeScript types and a local array. It has no database schema, migration, or ORM.

## Source files

- `src/types/spot.ts` defines the domain types and data transfer objects.
- `src/data/spots.ts` contains categories, tags, and 28 sample spot records.
- `src/lib/repositories/spot-repository.ts` provides the local repository.

## Core types

### `SpotEntity`

`SpotEntity` is the full record stored in the sample data. It contains:

- identity and URL fields: `id`, `name`, `slug`;
- category and location fields: `categoryId`, `regency`, `district`, coordinates, address;
- editorial fields: `description`, `signatureDish`, `bestTimeToVisit`;
- operational fields: `openingHours`, `hasFridayPrayerBreak`, `lifecycleStatus`;
- contact and action fields: `googleMapsUrl`, `googleMapsReviewUrl`, `instagramAccount`;
- presentation fields: `priceRange`, `facilities`, `coverImageUrl`;
- curation flags: `isVerified`, `isFeatured`;
- timestamps: `createdAt`, `updatedAt`;
- optional `logisticsNotice`.

`googleMapsUrl` exists in the entity, but the repository builds the route action from latitude and longitude instead of using that field.

### Weekly opening hours

`WeeklyOpeningHours` maps each day to a `DaySchedule`:

```ts
interface TimeSlot {
  open: string;
  close: string;
}

interface DaySchedule {
  slots: TimeSlot[];
  is_closed: boolean;
}
```

The times use 24-hour `HH:mm` strings. A close time earlier than the open time represents a shift that crosses midnight.

### DTOs

| Type | Used by | Important fields |
| --- | --- | --- |
| `SpotListItemDTO` | Feed and map | Name, slug, category, district, image, coordinates, facilities, lifecycle status, opening hours, and route URL |
| `SpotDetailDTO` | Detail page | Adds description, address, weekly schedule, gallery items, review URL, and logistics notice |
| `SpotMapMarkerDTO` | Unused by the current map | A smaller marker shape with opening hours and Friday-break data |
| `SpotFilterParams` | Repository and filter types | Search, category, vibe, regency, district, open-now, view, and spot fields |

`SpotListItemDTO` does not store a server-provided `isOpenNow` or `statusLabel`. The client calculates status from the schedule.

## Repository contract

```ts
interface SpotRepository {
  getMapMarkers(filter?: SpotFilterParams): Promise<SpotMapMarkerDTO[]>;
  getSpots(filter?: SpotFilterParams): Promise<SpotListItemDTO[]>;
  getSpotBySlug(slug: string): Promise<SpotDetailDTO | null>;
  getCategories(): Promise<SpotCategory[]>;
}
```

`LocalSpotRepository` implements the interface with `SPOTS_DATA` and `CATEGORIES`.

The repository's private filter method currently handles:

- `q`;
- `category`;
- `regency`;
- verification and permanent-closure exclusion.

It does not handle `vibe`, `district`, `openNow`, `view`, or `spot`. The feed applies open-now and saved filters after receiving the list.

`getMapMarkers` is implemented but no current component calls it. The map receives the full list-item DTOs instead.

## Current tag and image types

- `SpotTag` and `VIBE_TAGS` exist, but no spot record has a tag relation.
- The repository synthesizes `vibeTags` from the category name and `Kota` or `Pegunungan`.
- `SpotImage` exists, but `SpotEntity` has no image collection.
- `getSpotBySlug` creates one gallery item from `coverImageUrl`.

## Prototype data inventory

As checked on 18 October 2026:

- 28 spot records;
- four categories with seven records each;
- 15 records assigned to `kota`;
- 13 records assigned to `kabupaten`;
- 28 records with `isVerified: true`;
- 28 records with `lifecycleStatus: "active"`;
- 12 records with `isFeatured: true`;
- 28 cover URLs using the `images.unsplash.com` host.

The records use these districts:

| District key | Count |
| --- | --- |
| `pekalongan_barat` | 8 |
| `petungkriyono` | 7 |
| `pekalongan_timur` | 4 |
| `doro` | 3 |
| `pekalongan_utara` | 3 |
| `kajen` | 1 |
| `kedungwuni` | 1 |
| `kesesi` | 1 |

The formatter also knows `pekalongan_selatan`, `wiradesa`, and `karanganyar`, but no current sample record uses those keys.

## Local persistence

The browser stores:

| Key | Value |
| --- | --- |
| `vp_bookmarked_spots` | Array of saved spot slugs |
| `vp_recent_searches` | Array of up to five recent searches |
| `vp_spot_submissions` | Array of report-form objects |

These values are local to one browser profile. The report form does not send its data to the application server.

## Data provenance

The 28 records are prototype material. The application displays a verification label, but the repository contains no source record, audit log, or moderation result for that label. Treat the content as sample data until the owner supplies verified production records.

## Related documents

- [Architecture](architecture.md)
- [Current features](FEATURES.md)
- [Routes and SEO](routes-and-seo.md)

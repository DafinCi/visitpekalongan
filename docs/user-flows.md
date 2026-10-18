# User Flows

This page follows the current screens in the order a visitor is likely to use them. It focuses on behavior, not implementation details.

## First visit

1. The browser requests `/`.
2. The server loads the categories and the 28 sample spots.
3. A short intro overlay appears over the page.
4. The overlay closes after its visual timeline, after a watchdog timer, or when the user presses Escape or clicks it.
5. The catalog becomes available with the grid view selected by default.

The overlay does not block the server-rendered content permanently. A `<noscript>` style hides it when JavaScript is unavailable.

## Browse the catalog

The catalog shows:

- a search field;
- a filter button;
- category, city or regency, open-now, and saved controls inside the filter drawer;
- a grid, list, and map selector;
- a result count;
- place cards with image, category, name, signature dish, district, price range, status, route action, and bookmark action.

The page initially displays nine cards. The user selects `Muat Lebih Banyak Tempat` to add another nine.

## Search

The search field updates the `q` URL parameter. The feed waits 250 ms after typing before applying the search value.

Search can match:

- place names;
- signature dishes;
- districts;
- descriptions;
- category words;
- common intent words such as `kerja`, `wfc`, `wifi`, `kopi`, `alam`, `batik`, or `murah`.

The search field also offers recent searches after the user focuses it. Enter or leaving the field with at least two characters adds the search to the local history. The history keeps five entries.

## Filter results

The filter drawer can:

- select one category or all categories;
- select Kota Pekalongan, Kabupaten Pekalongan, or all regions;
- show only places that are open now;
- show only places saved in the current browser;
- reset the drawer filters.

The feed applies the filters in the browser. The URL keeps the selected filters so the link can be shared. All current `nuqs` controls use replacement history, so each filter change does not create a separate browser back step.

When the result set is empty, the page offers actions to remove the active filters, clear the search, or reset everything.

## Change the view

The view selector offers:

- `Grid`: full cards in a responsive grid;
- `List`: compact horizontal cards;
- `Peta`: MapLibre GL map.

The selected view is stored in the `view` URL parameter as `grid`, `list`, or `map`.

## Use the map

1. Select `Peta`.
2. The map loads only after this selection.
3. Each filtered spot appears as a map marker.
4. Select a marker to open a preview card.
5. The preview card offers a Google Maps route and a detail-page link.
6. Use `Lokasi Saya` to request browser geolocation.

The location action places a blue user marker on the map. If the user is within the approximate Pekalongan region, the map centers on that position. The distance to the selected spot appears in the preview when a location is available.

The map does not reorder the catalog by distance.

## Open a detail page

From a card, list item, or map preview, the user opens `/spot/[slug]`.

The detail page shows:

- the cover image and place name;
- the current opening state in WIB;
- address, price range, and category;
- route, review, Instagram, share, and bookmark actions when available;
- the curator narrative and signature dish;
- the best-time suggestion;
- the weekly schedule and Friday break note;
- facility labels;
- logistics guidance for relevant highland or nature spots;
- three related places.

On mobile, a fixed bottom bar keeps route, bookmark, and share actions within reach.

## Save a place

The bookmark button stores the spot slug in `vp_bookmarked_spots` in the browser. The button changes to a saved state immediately.

The saved filter in the catalog reads the same key and shows only saved slugs that are still present in the loaded spot list.

Clearing browser site data removes the saved list. There is no account or server sync.

## Submit a recommendation

The `/lapor` page contains a form with:

- place name;
- category;
- city or regency;
- district or location reference;
- signature item or main attraction;
- reason for the recommendation;
- optional Instagram handle.

Submitting the form stores an object in `vp_spot_submissions` and shows a success state. The form does not send the object to a server, queue, email service, or moderation table.

## Read the about page

The `/about` page explains the product direction, the four curation themes, and the community-recommendation concept. It links to the report page.

## Current failure behavior

- If localStorage is blocked or full, the write is ignored and the page continues.
- If the browser cannot use geolocation, the map shows an error message.
- If the map tiles cannot load, there is no dedicated map error or retry state.
- If a slug is missing, the detail page uses the not-found page.
- If the open-now filter is selected before the client clock is ready, the feed shows a checking message.

## Related documents

- [Current features](FEATURES.md)
- [Routes and SEO](routes-and-seo.md)
- [Data model](data-model.md)

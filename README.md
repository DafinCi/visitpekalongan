<p align="center">
  <img src="public/logo.svg" alt="VisitPekalongan logo" width="96" height="96" />
</p>

# VisitPekalongan

VisitPekalongan is a platform for exploring curated food, coffee, nature, and heritage places in Pekalongan, Indonesia. The repository is a working prototype. It renders 28 sample spot records from a local TypeScript dataset.

The 28 records are prototype content. They are not verified production listings.

## Current status

- Framework: Next.js 16.4.2 with the App Router.
- UI: React 19.3 and Tailwind CSS 4.
- Data: a local TypeScript dataset in `src/data/spots.ts`.
- Persistence: browser `localStorage` for saved spots, recent searches, and submitted recommendations.
- Map: MapLibre GL with CARTO basemap tiles.
- Backend: no API routes, database, authentication, or admin workflow exist in this repository.
- Deployment target: no platform configuration is committed to the repository.

## Requirements

- Node.js 20.9.0 or newer.
- npm.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Environment variables are optional for local development. Copy `.env.example` to `.env.local` if you want to set the public site URL or a CARTO API key.

On Windows PowerShell, if `npm` is blocked by the execution policy, use `npm.cmd` with the same arguments.

## Environment variables

| Variable                    | Required | Purpose                                                                                                                            |
| --------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`      | No       | Sets the base URL used by metadata, sitemap, and robots files. The application falls back to `https://visitpekalongan.vercel.app`. |
| `NEXT_PUBLIC_CARTO_API_KEY` | No       | Adds a CARTO key to the map style URL. The map loads a CARTO basemap without it.                                                   |

Database and media-storage variables in `.env.example` are placeholders for future work. The current application does not read them.

## Scripts

| Command         | Purpose                                                                                |
| --------------- | -------------------------------------------------------------------------------------- |
| `npm run dev`   | Starts the Next.js development server.                                                 |
| `npm run build` | Creates a production build.                                                            |
| `npm start`     | Starts the production server after a build.                                            |
| `npm run lint`  | Runs ESLint repository-wide (ignores `.agents/**` and `public/**`).                     |
| `npm test`      | Runs the 6 Node test suites for core business logic, intro state machine, and scroll lock. |

## Documentation

Start with the [documentation index](docs/README.md). It separates product explanations, setup instructions, feature reference, architecture, data contracts, user flows, routes, testing, and references.

- [Product overview](docs/about.md)
- [Getting started](docs/getting-started.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Current features](docs/FEATURES.md)
- [Architecture](docs/architecture.md)
- [Data model](docs/data-model.md)
- [User flows](docs/user-flows.md)
- [Routes and SEO](docs/routes-and-seo.md)
- [Testing](docs/testing.md)
- [External references](docs/references.md)
- [Roadmap template](docs/roadmap.md)
- [Design system](DESIGN.md)

## Known limitations

- Filtering and search run in the browser over the 28 records already sent to the page.
- The report form does not send data to a server. It saves the submission in the current browser only.
- Saved spots store slugs, not a full offline copy of a spot.
- There is no user account or cross-device sync.
- The map needs network access for CARTO tiles.

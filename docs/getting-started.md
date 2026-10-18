# Getting Started

This guide runs the project locally. It does not require a database or an API key.

## Requirements

- Node.js 20.9.0 or newer.
- npm.
- Network access for remote images and CARTO map tiles when you use those features.

The installed Next.js package declares `node >=20.9.0` in its package metadata.

## Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

On Windows PowerShell, use `npm.cmd` if the `npm` wrapper is blocked by the execution policy:

```powershell
npm.cmd install
npm.cmd run dev
```

## Environment variables

The application works without a local environment file. Use `.env.example` as the reference if you need to set public URLs or a map key.

| Variable                    | Required | Behavior                                                                           |
| --------------------------- | -------- | ---------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`      | No       | Used for metadata base URLs. The fallback is `https://visitpekalongan.vercel.app`. |
| `NEXT_PUBLIC_CARTO_API_KEY` | No       | Appended to the CARTO style URL when present.                                      |

Database and media-storage entries in `.env.example` are future placeholders. The current code does not read them.

To create a local file on Windows:

```powershell
Copy-Item .env.example .env.local
```

Do not commit secrets to the repository.

## Available commands

| Command         | What it does                                        |
| --------------- | --------------------------------------------------- |
| `npm run dev`   | Starts the development server.                      |
| `npm run build` | Builds the application for production.              |
| `npm start`     | Starts the production server after a build.         |
| `npm run lint`  | Runs ESLint with the repository configuration.      |
| `npm test`      | Runs the intro state machine and scroll-lock tests. |

The build may need network access because the root layout uses `next/font/google` and the catalog uses remote images.

## Next documents

- [Architecture](architecture.md)
- [Data model](data-model.md)
- [Testing](testing.md)
- [Troubleshooting](troubleshooting.md)

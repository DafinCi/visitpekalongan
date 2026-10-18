# Database Status

The current repository has no database.

## What exists today

- Spot records live in `src/data/spots.ts`.
- The repository class reads that array in memory.
- Saved spots, recent searches, and report submissions use browser `localStorage`.
- There are no migrations, tables, ORM models, or database connection strings used by the running application.

## What this means for readers

Do not treat an earlier database design as implemented. The current data contracts are documented in [Data model](data-model.md).

## Future work

Database, API, moderation, and persistence work belongs in [Roadmap](roadmap.md). Add those items there before describing them as a project direction.

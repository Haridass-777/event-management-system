# TODO: Rewrite clubs.cjs and Create server.ts

## Information Gathered
- `backend/routes/clubs.cjs`: Uses PostgreSQL syntax ($1, $2) and missing affectedRows check in leave route.
- `backend/routes/clubs.js`: Already uses MySQL syntax as reference.
- `backend/server.js`: Empty file (0 bytes).
- `backend/package.json`: References `server.ts` in dev script, but file is missing.
- Database config in `database.ts` is set for MySQL.

## Plan
1. Rewrite `backend/routes/clubs.cjs`: Change all $1, $2, etc. to ?, add affectedRows check in leave route.
2. Create `backend/server.ts`: Express server setup with middleware, routes, error handling, and database connection test.

## Dependent Files to Edit/Create
- `backend/routes/clubs.cjs`
- `backend/server.ts` (new file)

## Changes Completed
- [x] Rewrite `backend/routes/clubs.cjs`
- [x] Create `backend/server.ts`

## Followup Steps
- [ ] Run `npm run build` in backend to compile TypeScript.
- [ ] Test the server with `npm run dev`.

# Cricket Auction Hub — App Description ✅

## Overview
**Cricket Auction Hub** is a web app for organizing local cricket tournaments with optional auction and captain-voting flows. Organizers can create tournaments, manage grounds, form teams, and run auctions; players can register, apply to tournaments, and (when enabled) vote for captains.

## Architecture & Tech Stack 🔧
- Frontend: React + TypeScript + Vite
- UI: shadcn/ui + Radix primitives, Tailwind CSS
- Backend / DB: Supabase (Postgres) via `src/integrations/supabase/client.ts`
- Authentication & roles handled in `AuthContext` (`src/contexts/AuthContext.tsx`)

## Core Concepts & Features ✨
- Tournament lifecycle flags: **is_active**, **is_auction_live**, **is_voting_live**
- Tournament types: `Normal`, `Auction`, `Auction with Voting`
- Organizer flows: create/edit tournaments, configure categories/timers, create teams & captains
- Player flows: register as player, apply to tournaments, view auction when live
- Auctions: currently UI-simulated (mock data). Real-time backend not implemented yet.

## Important Pages & Components (map) 🗺️
- `src/pages/Tournaments.tsx` — Browse tournaments (filters + list)
- `src/components/tournaments/TournamentCard.tsx` — Card with actions (view/edit/delete)
- `src/pages/TournamentDetail.tsx` — Tournament details + Quick Actions (Apply / Join Auction)
- `src/components/tournaments/TournamentActionMenu.tsx` — **Owner action menu**: includes **Create/View Teams** (routes to `/tournaments/:id/teams` or `/tournaments/:id/teams/create` depending on whether all teams exist), **Category Config** modal (`CategoryConfigModal.tsx`), **Bid Timer Config** modal (`BidTimerConfigModal.tsx`), and **Captain Voting** actions when enabled: **Create Captains**, **Start/Stop Voting** (toggles `is_voting_live` in Supabase and shows toast notifications; buttons show disabled state while the toggle is in progress), and **See Voting** (view results). These actions are organizer-only and update tournament flags in the database.
- `src/pages/CreateTournament.tsx` + `src/components/tournaments/TournamentForm.tsx` — Tournament creation/edit form
- `src/pages/EditTournament.tsx` — Edit page (reuses form)
- `src/pages/CreateTeams.tsx` & `src/pages/ViewTeams.tsx` — Team creation & listing
- `src/pages/CreateCaptains.tsx` & `src/pages/ViewCaptainVotes.tsx` — Captain creation & vote results
- `src/pages/LiveAuctions.tsx` & `src/pages/LiveAuction.tsx` — Live auctions (mocked UI)

## Database tables referenced 🧾
- `tournaments` — main metadata and flags
- `teams` — created by organizers, holds `budget_remaining`, `captain_id`
- `tournament_captain` — captains available for voting (has `votes`)
- `tournament_applications` — player applications to tournaments
- `profiles` — player/organizer profiles

The full DB type definitions are in `src/integrations/supabase/types.ts`.

## Typical user flow (Create Tournament -> Teams -> Auction) 🔁
1. Organizer creates a tournament (`/tournaments/create`) via the `TournamentForm` — form writes to `tournaments` table.
2. Organizer creates teams (`/tournaments/:id/teams/create`) that write to `teams` table.
3. Organizer configures auction settings, starts voting/auction using actions in `TournamentActionMenu` which update `tournaments` boolean flags.
4. Live Auction UI (`/auctions/:id`) currently simulates bidding; production would require a real-time backend.

## Setup & Run (dev) ▶️
- Install dependencies: `bun`/`npm`/`pnpm` (this repo uses Vite)
- Dev: `npm run dev` (uses `vite`)
- Supabase: set env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (see `.env`)

## Gaps & Suggested Next Steps ✅ / ⚠️
- Implement "Apply to Tournament" (submit to `tournament_applications`) — button exists in UI but submission is not implemented.
- Add player-side voting UI and vote recording logic (enforce `max_votes_per_player`).
- Implement real-time auction backend (Supabase Realtime / WebSocket / server-side timer + bid persistence).
- Add tests and integration flows for critical state transitions (create → team creation → start auction).

## Where to look for quick edits ✏️
- Supabase client: `src/integrations/supabase/client.ts`
- Tournament form: `src/components/tournaments/TournamentForm.tsx`
- Tournament actions: `src/components/tournaments/TournamentActionMenu.tsx` (see also `src/components/tournaments/CategoryConfigModal.tsx` and `src/components/tournaments/BidTimerConfigModal.tsx`)
- Types: `src/integrations/supabase/types.ts`

---

If you'd like, I can: 
- add a short `docs/flow-diagram.png` or a textual flow diagram, or
- implement the missing "Apply to Tournament" POST and UI, or
- scaffold a simple vote-casting endpoint and front-end UI.

Tell me which one you'd like me to do next.
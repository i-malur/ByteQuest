/*
# Create scores table for ByteQuest game (single-tenant, no auth)

1. New Tables
- `scores`
  - `id` (uuid, primary key)
  - `player_name` (text, default 'Player')
  - `score` (integer, not null)
  - `language` (text, which language category the score came from)
  - `created_at` (timestamp)
2. Security
- Enable RLS on `scores`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in screen).
*/

CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL DEFAULT 'Player',
  score integer NOT NULL DEFAULT 0,
  language text NOT NULL DEFAULT 'Python',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scores" ON scores;
CREATE POLICY "anon_select_scores" ON scores FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scores" ON scores;
CREATE POLICY "anon_insert_scores" ON scores FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scores" ON scores;
CREATE POLICY "anon_update_scores" ON scores FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scores" ON scores;
CREATE POLICY "anon_delete_scores" ON scores FOR DELETE
  TO anon, authenticated USING (true);

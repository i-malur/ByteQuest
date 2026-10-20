import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ScoreRow {
  id: string;
  player_name: string;
  score: number;
  language: string;
  created_at: string;
}

export async function saveScore(playerName: string, score: number, language: string) {
  try {
    const { data, error } = await supabase
      .from('scores')
      .insert({ player_name: playerName, score, language })
      .select()
      .maybeSingle();
    if (error) throw error;
    return data as ScoreRow | null;
  } catch (err) {
    console.warn('Failed to save score:', err);
    return null;
  }
}

export async function getTopScores(limit = 10): Promise<ScoreRow[]> {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as ScoreRow[];
  } catch (err) {
    console.warn('Failed to fetch scores:', err);
    return [];
  }
}

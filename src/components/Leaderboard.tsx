import { useEffect, useState } from 'react';
import { X, Trophy } from 'lucide-react';
import { getTopScores, type ScoreRow } from '../lib/supabase';
import { LANGUAGES } from '../data/challenges';

interface LeaderboardProps {
  open: boolean;
  onClose: () => void;
  currentScore: number;
}

export default function Leaderboard({ open, onClose, currentScore }: LeaderboardProps) {
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getTopScores(10).then((rows) => {
        setScores(rows);
        setLoading(false);
      });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border-2 border-cyan-500/40 bg-slate-950 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-slate-700">
          <div className="flex items-center gap-2 font-bold text-cyan-300">
            <Trophy size={20} />
            <span>Ranking ByteQuest</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="mb-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center">
            <div className="text-xs text-slate-400">A tua pontuação atual</div>
            <div className="text-2xl font-black text-cyan-300">{currentScore}</div>
          </div>

          {loading ? (
            <div className="text-center text-slate-400 py-8">A carregar...</div>
          ) : scores.length === 0 ? (
            <div className="text-center text-slate-500 py-8 text-sm">
              Ainda não há registos. Completa desafios para apareceres aqui!
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {scores.map((row, i) => {
                const lang = LANGUAGES.find((l) => l.name === row.language);
                return (
                  <div
                    key={row.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                      i === 0
                        ? 'bg-amber-500/15 border border-amber-500/30'
                        : 'bg-slate-800/60'
                    }`}
                  >
                    <span className={`w-6 text-center font-bold ${i < 3 ? 'text-amber-400' : 'text-slate-400'}`}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-slate-200">{row.player_name}</span>
                    {lang && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                        style={{ background: lang.color, color: lang.accent }}
                      >
                        {lang.short}
                      </span>
                    )}
                    <span className="text-sm font-bold text-cyan-300">{row.score}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

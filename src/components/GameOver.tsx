interface GameOverProps {
  open: boolean;
  score: number;
  completedCount: number;
  defeatedCount: number;
  onRestart: () => void;
}

export default function GameOver({ open, score, completedCount, defeatedCount, onRestart }: GameOverProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-2xl border-2 border-red-500/40 bg-slate-950 shadow-2xl p-6 text-center">
        <div className="text-4xl mb-3">🔋</div>
        <h2 className="text-xl font-bold text-red-400 mb-1">Energia Esgotada!</h2>
        <p className="text-sm text-slate-400 mb-4">O teu robô precisa de recarregar.</p>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="rounded-lg bg-slate-800/60 p-3">
            <div className="text-xl font-bold text-cyan-300">{score}</div>
            <div className="text-[10px] text-slate-400 uppercase">Pontos</div>
          </div>
          <div className="rounded-lg bg-slate-800/60 p-3">
            <div className="text-xl font-bold text-emerald-300">{completedCount}</div>
            <div className="text-[10px] text-slate-400 uppercase">Terminais</div>
          </div>
          <div className="rounded-lg bg-slate-800/60 p-3">
            <div className="text-xl font-bold text-red-300">{defeatedCount}</div>
            <div className="text-[10px] text-slate-400 uppercase">Bugs</div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition"
        >
          Reiniciar Jogo
        </button>
      </div>
    </div>
  );
}

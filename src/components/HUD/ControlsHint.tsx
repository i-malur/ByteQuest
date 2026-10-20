interface ControlsHintProps {
  onShowLeaderboard: () => void;
}

export default function ControlsHint({ onShowLeaderboard }: ControlsHintProps) {
  return (
    <div className="absolute left-4 bottom-4 z-20 pointer-events-none">
      <div className="bg-slate-900/85 rounded-xl border border-slate-600 px-4 py-3 shadow-xl max-w-xs">
        <div className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wide">Controlos</div>
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs text-slate-300">
          <Key>W A S D</Key>
          <span>Mover o robô</span>
          <Key>E</Key>
          <span>Interagir com terminal / bug</span>
          <Key>Scroll</Key>
          <span>Zoom da câmara</span>
          <Key>1-8</Key>
          <span>Selecionar linguagem</span>
        </div>
        <button
          onClick={onShowLeaderboard}
          className="sm:hidden mt-2 w-full text-xs py-1 rounded bg-slate-800 border border-slate-600 text-cyan-300 pointer-events-auto"
        >
          🏆 Ver Ranking
        </button>
      </div>
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-[10px] font-mono text-cyan-300 text-center min-w-[60px]">
      {children}
    </kbd>
  );
}

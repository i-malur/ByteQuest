import { useState } from 'react';
import { LANGUAGES, type LanguageId, challengeCount } from '../../data/challenges';

interface TopBarProps {
  score: number;
  energy: number;
  maxEnergy: number;
  completedTerminals: Set<string>;
  defeatedBugs: Set<string>;
  selectedLanguage: LanguageId | null;
  onSelectLanguage: (id: LanguageId) => void;
  onShowLeaderboard: () => void;
}

export default function TopBar({
  score,
  energy,
  maxEnergy,
  completedTerminals,
  defeatedBugs,
  selectedLanguage,
  onSelectLanguage,
  onShowLeaderboard,
}: TopBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-b from-slate-950/95 to-slate-900/70 backdrop-blur-sm border-b border-cyan-500/20">
        {/* Logo */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            ByteQuest
          </div>
          <span className="hidden sm:inline text-xs text-slate-400 font-mono">3D Code World</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 sm:gap-4 pointer-events-auto">
          <Stat label="Pontos" value={score} color="text-cyan-400" icon="◆" />
          <EnergyBar energy={energy} maxEnergy={maxEnergy} />
          <Stat label="Terminais" value={completedTerminals.size} color="text-emerald-400" icon="▣" />
          <Stat label="Bugs" value={defeatedBugs.size} color="text-red-400" icon="☠" />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onShowLeaderboard}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-sm text-slate-200 transition"
          >
            🏆 Ranking
          </button>

          {/* Language dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-cyan-500/40 text-sm text-cyan-300 font-semibold transition"
            >
              {selectedLanguage
                ? LANGUAGES.find((l) => l.id === selectedLanguage)?.icon + ' ' + LANGUAGES.find((l) => l.id === selectedLanguage)?.name
                : 'Linguagens'}
              <span className="text-xs">▾</span>
            </button>
            {open && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl z-40 overflow-hidden">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        onSelectLanguage(lang.id);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-800 transition ${
                        selectedLanguage === lang.id ? 'bg-slate-800' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded"
                          style={{ background: lang.color }}
                        />
                        {lang.icon} {lang.name}
                      </span>
                      <span className="text-xs text-slate-500">{challengeCount(lang.id)} desafios</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <div className="flex flex-col items-center min-w-[50px]">
      <div className={`text-sm font-bold ${color}`}>
        <span className="opacity-70">{icon}</span> {value}
      </div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function EnergyBar({ energy, maxEnergy }: { energy: number; maxEnergy: number }) {
  const pct = Math.max(0, Math.min(100, (energy / maxEnergy) * 100));
  const barColor = pct > 60 ? 'from-emerald-500 to-green-400' : pct > 30 ? 'from-yellow-500 to-amber-400' : 'from-red-500 to-rose-400';
  return (
    <div className="flex flex-col items-center min-w-[70px]">
      <div className="flex items-center gap-1 text-xs font-bold text-slate-200">
        ⚡ {energy}/{maxEnergy}
      </div>
      <div className="w-16 h-2 rounded-full bg-slate-700 overflow-hidden mt-0.5">
        <div
          className={`h-full bg-gradient-to-r ${barColor} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

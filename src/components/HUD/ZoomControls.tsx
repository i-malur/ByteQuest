import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { MIN_ZOOM, MAX_ZOOM } from '../three/CameraRig';

interface ZoomControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export default function ZoomControls({ zoomLevel, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  const pct = ((zoomLevel - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100;

  return (
    <div className="absolute right-4 bottom-4 z-20 flex flex-col items-center gap-2 pointer-events-auto">
      <div className="flex flex-col items-center gap-1 bg-slate-900/90 rounded-xl border border-slate-600 p-1.5 shadow-xl">
        <button
          onClick={onZoomIn}
          disabled={zoomLevel <= MIN_ZOOM}
          className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-cyan-600 border border-slate-600 hover:border-cyan-400 flex items-center justify-center text-slate-200 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          title="Aproximar"
        >
          <ZoomIn size={18} />
        </button>

        {/* Zoom level indicator */}
        <div className="w-9 h-16 flex items-center justify-center bg-slate-800/60 rounded-md relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/40 to-blue-500/40"
            style={{ height: `${pct}%` }}
          />
          <span className="relative text-[10px] font-mono text-cyan-300">
            {Math.round(100 - pct)}%
          </span>
        </div>

        <button
          onClick={onZoomOut}
          disabled={zoomLevel >= MAX_ZOOM}
          className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-cyan-600 border border-slate-600 hover:border-cyan-400 flex items-center justify-center text-slate-200 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          title="Afastar"
        >
          <ZoomOut size={18} />
        </button>
      </div>

      <button
        onClick={onReset}
        className="w-9 h-9 rounded-lg bg-slate-900/90 hover:bg-blue-600 border border-slate-600 hover:border-blue-400 flex items-center justify-center text-slate-300 hover:text-white transition shadow-xl"
        title="Repor câmara"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
}

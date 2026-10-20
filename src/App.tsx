import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import GameScene from './components/GameScene';
import ChallengeModal from './components/ChallengeModal';
import Leaderboard from './components/Leaderboard';
import GameOver from './components/GameOver';
import { TopBar, ZoomControls, ControlsHint } from './components/HUD';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LANGUAGES,
  getChallenges,
  type LanguageId,
} from './data/challenges';
import {
  TERMINALS,
  BUGS,
  WORLD_SIZE,
  PLAYER_SPEED,
  type TerminalNode,
  type BugNode,
} from './data/world';
import { MIN_ZOOM, MAX_ZOOM } from './components/three/CameraRig';
import { saveScore } from './lib/supabase';

const MAX_ENERGY = 100;
const SCORE_CORRECT = 10;
const SCORE_WRONG = -2;
const ENERGY_COST_WRONG = 15;

interface ActiveTarget {
  kind: 'terminal' | 'bug';
  node: TerminalNode | BugNode;
}

export default function App() {
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const keysRef = useRef<Record<string, boolean>>({});
  const frameTimeRef = useRef<number>(0);

  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>('python');

  const [completedTerminals, setCompletedTerminals] = useState<Set<string>>(new Set());
  const [defeatedBugs, setDefeatedBugs] = useState<Set<string>>(new Set());
  const [challengeIndex, setChallengeIndex] = useState(0);

  const [activeTarget, setActiveTarget] = useState<ActiveTarget | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const challengeLang: LanguageId = useMemo(() => {
    if (activeTarget) return activeTarget.node.language;
    return selectedLanguage;
  }, [activeTarget, selectedLanguage]);

  // --- Keyboard input ---
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;

      // Language hotkeys 1-8
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 8) {
        setSelectedLanguage(LANGUAGES[num - 1].id);
      }

      // Interact
      if (e.key.toLowerCase() === 'e' && activeTarget && !modalOpen) {
        openChallenge(activeTarget);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  });

  // --- Movement loop ---
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const pos = playerPosRef.current;

      let dx = 0;
      let dz = 0;
      if (keysRef.current['w'] || keysRef.current['arrowup']) dz -= 1;
      if (keysRef.current['s'] || keysRef.current['arrowdown']) dz += 1;
      if (keysRef.current['a'] || keysRef.current['arrowleft']) dx -= 1;
      if (keysRef.current['d'] || keysRef.current['arrowright']) dx += 1;

      if (dx !== 0 || dz !== 0) {
        const len = Math.hypot(dx, dz);
        dx /= len;
        dz /= len;
        pos.x += dx * PLAYER_SPEED * dt;
        pos.z += dz * PLAYER_SPEED * dt;
        const half = WORLD_SIZE / 2 - 1;
        pos.x = THREE.MathUtils.clamp(pos.x, -half, half);
        pos.z = THREE.MathUtils.clamp(pos.z, -half, half);
      }

      // Check proximity to interactive objects
      if (!modalOpen && !gameOver) {
        const all: ActiveTarget[] = [
          ...TERMINALS.filter((t) => !completedTerminals.has(t.id)).map((t) => ({ kind: 'terminal' as const, node: t as TerminalNode | BugNode })),
          ...BUGS.filter((b) => !defeatedBugs.has(b.id)).map((b) => ({ kind: 'bug' as const, node: b as TerminalNode | BugNode })),
        ];
        let nearest: ActiveTarget | null = null;
        let nearestDist = 3.0;
        for (const t of all) {
          const d = Math.hypot(pos.x - t.node.position[0], pos.z - t.node.position[2]);
          if (d < nearestDist) {
            nearestDist = d;
            nearest = t;
          }
        }
        setActiveTarget(nearest);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  });

  const openChallenge = useCallback((target: ActiveTarget) => {
    const langChallenges = getChallenges(target.node.language);
    const completed = target.kind === 'terminal' ? completedTerminals : defeatedBugs;
    const idx = completed.size % Math.max(langChallenges.length, 1);
    setChallengeIndex(idx);
    setActiveTarget(target);
    setModalOpen(true);
  }, [completedTerminals, defeatedBugs]);

  const handleTerminalInteract = useCallback((t: TerminalNode) => {
    openChallenge({ kind: 'terminal', node: t });
  }, [openChallenge]);

  const handleBugInteract = useCallback((b: BugNode) => {
    openChallenge({ kind: 'bug', node: b });
  }, [openChallenge]);

  const handleAnswer = useCallback((correct: boolean) => {
    if (correct) {
      setScore((s) => s + SCORE_CORRECT);
    } else {
      setScore((s) => Math.max(0, s + SCORE_WRONG));
      setEnergy((e) => {
        const next = e - ENERGY_COST_WRONG;
        if (next <= 0) {
          setGameOver(true);
          return 0;
        }
        return next;
      });
    }

    // Mark target as completed/defeated
    if (activeTarget) {
      if (activeTarget.kind === 'terminal') {
        setCompletedTerminals((prev) => new Set(prev).add(activeTarget.node.id));
      } else {
        setDefeatedBugs((prev) => new Set(prev).add(activeTarget.node.id));
      }
    }

    // Save score to leaderboard when all challenges done or on game over
    if (activeTarget) {
      const totalDone = completedTerminals.size + defeatedBugs.size + 1;
      if (totalDone >= TERMINALS.length + BUGS.length) {
        setGameOver(true);
      }
    }
  }, [activeTarget, completedTerminals, defeatedBugs]);

  // Save score on game over
  useEffect(() => {
    if (gameOver && score > 0) {
      saveScore('Player', score, LANGUAGES.find((l) => l.id === challengeLang)?.name ?? 'Python');
    }
  }, [gameOver, score, challengeLang]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleRestart = useCallback(() => {
    setScore(0);
    setEnergy(MAX_ENERGY);
    setCompletedTerminals(new Set());
    setDefeatedBugs(new Set());
    setChallengeIndex(0);
    setGameOver(false);
    setModalOpen(false);
    playerPosRef.current.set(0, 0, 0);
  }, []);

  const handleZoomIn = useCallback(() => setZoomLevel((z) => Math.max(MIN_ZOOM, z - 2)), []);
  const handleZoomOut = useCallback(() => setZoomLevel((z) => Math.min(MAX_ZOOM, z + 2)), []);
  const handleReset = useCallback(() => setZoomLevel(12), []);
  const handleScrollZoom = useCallback((delta: number) => {
    setZoomLevel((z) => THREE.MathUtils.clamp(z + delta, MIN_ZOOM, MAX_ZOOM));
  }, []);

  const activeTargetForScene: TerminalNode | BugNode | null = activeTarget?.node ?? null;

  return (
    <div className="fixed inset-0 bg-slate-950 overflow-hidden select-none">
      <Canvas
        shadows
        camera={{ position: [0, 14, 16], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0a1626']} />
        <fog attach="fog" args={['#0a1626', 30, 60]} />
        <GameScene
          playerPosRef={playerPosRef}
          zoomLevel={zoomLevel}
          onScrollZoom={handleScrollZoom}
          completedTerminals={completedTerminals}
          defeatedBugs={defeatedBugs}
          activeTarget={activeTargetForScene}
          onTerminalInteract={handleTerminalInteract}
          onBugInteract={handleBugInteract}
        />
      </Canvas>

      {/* HUD overlays */}
      <TopBar
        score={score}
        energy={energy}
        maxEnergy={MAX_ENERGY}
        completedTerminals={completedTerminals}
        defeatedBugs={defeatedBugs}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        onShowLeaderboard={() => setLeaderboardOpen(true)}
      />
      <ControlsHint onShowLeaderboard={() => setLeaderboardOpen(true)} />
      <ZoomControls
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />

      <ChallengeModal
        open={modalOpen}
        language={challengeLang}
        challengeIndex={challengeIndex}
        kind={activeTarget?.kind ?? 'terminal'}
        onClose={handleCloseModal}
        onAnswer={handleAnswer}
      />

      <Leaderboard
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        currentScore={score}
      />

      <GameOver
        open={gameOver}
        score={score}
        completedCount={completedTerminals.size}
        defeatedCount={defeatedBugs.size}
        onRestart={handleRestart}
      />
    </div>
  );
}

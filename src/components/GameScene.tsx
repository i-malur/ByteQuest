import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Ground, PlayerRobot, Terminal, BugRobot, Decorations, CameraRig } from './three';
import { TERMINALS, BUGS, type TerminalNode, type BugNode } from '../data/world';

interface GameSceneProps {
  playerPosRef: React.RefObject<THREE.Vector3 | null>;
  zoomLevel: number;
  onScrollZoom: (delta: number) => void;
  completedTerminals: Set<string>;
  defeatedBugs: Set<string>;
  activeTarget: TerminalNode | BugNode | null;
  onTerminalInteract: (t: TerminalNode) => void;
  onBugInteract: (b: BugNode) => void;
}

export default function GameScene({
  playerPosRef,
  zoomLevel,
  onScrollZoom,
  completedTerminals,
  defeatedBugs,
  activeTarget,
  onTerminalInteract,
  onBugInteract,
}: GameSceneProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 18, 8]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={['#87ceeb', '#1a2436', 0.4]} />

      <CameraRig playerRef={playerPosRef} zoomLevel={zoomLevel} onScrollZoom={onScrollZoom} />

      <Ground />
      <Decorations />

      <PlayerFollow playerPosRef={playerPosRef} />

      {TERMINALS.map((t) => (
        <Terminal
          key={t.id}
          terminal={t}
          isActive={activeTarget?.id === t.id}
          completed={completedTerminals.has(t.id)}
          onInteract={onTerminalInteract}
        />
      ))}

      {BUGS.map((b) => (
        <BugRobot
          key={b.id}
          bug={b}
          isActive={activeTarget?.id === b.id}
          defeated={defeatedBugs.has(b.id)}
          onInteract={onBugInteract}
        />
      ))}
    </>
  );
}

function PlayerFollow({ playerPosRef }: { playerPosRef: React.RefObject<THREE.Vector3 | null> }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current && playerPosRef.current) {
      groupRef.current.position.x = playerPosRef.current.x;
      groupRef.current.position.z = playerPosRef.current.z;
    }
  });
  return (
    <group ref={groupRef}>
      <PlayerRobot />
    </group>
  );
}

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { getLanguage } from '../../data/challenges';
import type { TerminalNode } from '../../data/world';

interface TerminalProps {
  terminal: TerminalNode;
  isActive: boolean;
  completed: boolean;
  onInteract: (terminal: TerminalNode) => void;
}

export default function Terminal({ terminal, isActive, completed, onInteract }: TerminalProps) {
  const group = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.MeshStandardMaterial>(null);
  const lang = getLanguage(terminal.language);
  const baseColor = new THREE.Color(lang.color);

  useFrame((state) => {
    if (screenRef.current) {
      const pulse = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      screenRef.current.emissiveIntensity = pulse;
    }
  });

  const bodyMat = new THREE.MeshStandardMaterial({ color: '#3b4a5f', roughness: 0.7 });
  const pillarMat = new THREE.MeshStandardMaterial({ color: '#2a3445', roughness: 0.8 });

  return (
    <group ref={group} position={[terminal.position[0], 0, terminal.position[2]]}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow material={pillarMat}>
        <boxGeometry args={[1.2, 0.3, 1.2]} />
      </mesh>
      {/* Pillar */}
      <mesh position={[0, 0.9, 0]} castShadow material={pillarMat}>
        <boxGeometry args={[1.0, 1.4, 1.0]} />
      </mesh>
      {/* Screen frame */}
      <mesh position={[0, 1.9, 0.51]} castShadow material={bodyMat}>
        <boxGeometry args={[1.1, 0.9, 0.08]} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 1.9, 0.56]}>
        <boxGeometry args={[0.95, 0.75, 0.02]} />
        <meshStandardMaterial
          ref={screenRef}
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Language label */}
      <Html position={[0, 2.6, 0]} center distanceFactor={10} occlude={false}>
        <div
          style={{
            background: lang.color,
            color: lang.accent,
            padding: '2px 10px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            border: `2px solid ${lang.accent}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            opacity: completed ? 0.6 : 1,
            textDecoration: completed ? 'line-through' : 'none',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {lang.icon} {terminal.label}
        </div>
      </Html>
      {/* Interaction prompt */}
      {isActive && (
        <Html position={[0, 0.6, 0]} center distanceFactor={8} occlude={false}>
          <div
            style={{
              background: 'rgba(15,23,42,0.92)',
              color: '#38bdf8',
              padding: '4px 12px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border: '1px solid #38bdf8',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={() => onInteract(terminal)}
          >
            Pressione [E] para interagir
          </div>
        </Html>
      )}
      {/* Completion marker */}
      {completed && (
        <Html position={[0, 0.45, 0]} center distanceFactor={8} occlude={false}>
          <div
            style={{
              fontSize: 22,
              userSelect: 'none',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
            }}
          >
            ✅
          </div>
        </Html>
      )}
    </group>
  );
}

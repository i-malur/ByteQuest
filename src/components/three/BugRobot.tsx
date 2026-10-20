import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { getLanguage } from '../../data/challenges';
import type { BugNode } from '../../data/world';

interface BugRobotProps {
  bug: BugNode;
  isActive: boolean;
  defeated: boolean;
  onInteract: (bug: BugNode) => void;
}

export default function BugRobot({ bug, isActive, defeated, onInteract }: BugRobotProps) {
  const group = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const lang = getLanguage(bug.language);
  const hoverRef = useRef(0);

  useFrame((state, delta) => {
    hoverRef.current += delta;
    if (group.current && !defeated) {
      group.current.position.y = 0.8 + Math.sin(hoverRef.current * 2) * 0.15;
      group.current.rotation.y = Math.sin(hoverRef.current * 0.8) * 0.3;
    }
    if (headRef.current && !defeated) {
      headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.1;
    }
  });

  const bugMat = new THREE.MeshStandardMaterial({ color: defeated ? '#4b5563' : '#ef4444', roughness: 0.5 });
  const darkMat = new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.6 });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: defeated ? '#6b7280' : '#fbbf24',
    emissive: defeated ? '#374151' : '#fbbf24',
    emissiveIntensity: 0.7,
  });

  if (defeated) {
    return (
      <group position={[bug.position[0], 0.2, bug.position[2]]}>
        <mesh material={darkMat}>
          <boxGeometry args={[0.8, 0.3, 0.8]} />
        </mesh>
        <Html position={[0, 0.5, 0]} center distanceFactor={10} occlude={false}>
          <div style={{ fontSize: 18, userSelect: 'none', pointerEvents: 'none' }}>💤</div>
        </Html>
      </group>
    );
  }

  return (
    <group ref={group} position={[bug.position[0], 0.8, bug.position[2]]}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 0.7, 0]} castShadow material={bugMat}>
        <boxGeometry args={[0.8, 0.7, 0.8]} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.18, 0.75, 0.41]} material={eyeMat}>
        <boxGeometry args={[0.14, 0.14, 0.04]} />
      </mesh>
      <mesh position={[0.18, 0.75, 0.41]} material={eyeMat}>
        <boxGeometry args={[0.14, 0.14, 0.04]} />
      </mesh>
      {/* Antennae */}
      <mesh position={[-0.25, 1.15, 0]} material={bugMat}>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
      </mesh>
      <mesh position={[0.25, 1.15, 0]} material={bugMat}>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
      </mesh>
      <mesh position={[-0.25, 1.4, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.25, 1.4, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow material={bugMat}>
        <boxGeometry args={[1.0, 0.8, 0.8]} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.6, -0.15, 0]} material={darkMat}>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
      </mesh>
      <mesh position={[0.6, -0.15, 0]} material={darkMat}>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
      </mesh>
      {/* Language tag */}
      <Html position={[0, 1.7, 0]} center distanceFactor={10} occlude={false}>
        <div
          style={{
            background: 'rgba(239,68,68,0.9)',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          🐛 {lang.short}
        </div>
      </Html>
      {/* Interaction prompt */}
      {isActive && (
        <Html position={[0, -0.7, 0]} center distanceFactor={8} occlude={false}>
          <div
            style={{
              background: 'rgba(127,29,29,0.92)',
              color: '#fca5a5',
              padding: '4px 12px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border: '1px solid #fca5a5',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={() => onInteract(bug)}
          >
            Pressione [E] para combater
          </div>
        </Html>
      )}
    </group>
  );
}

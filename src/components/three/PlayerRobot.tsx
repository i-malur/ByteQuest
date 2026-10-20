import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VoxelRobotProps {
  color?: string;
}

export default function PlayerRobot({ color = '#22d3ee' }: VoxelRobotProps) {
  const group = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);
  const bobRef = useRef(0);

  useFrame((_, delta) => {
    bobRef.current += delta * 3;
    if (group.current) {
      group.current.position.y = 0.9 + Math.sin(bobRef.current) * 0.06;
    }
    if (leftArm.current) {
      leftArm.current.rotation.x = Math.sin(bobRef.current * 1.5) * 0.18;
    }
    if (rightArm.current) {
      rightArm.current.rotation.x = Math.sin(bobRef.current * 1.5 + Math.PI) * 0.18;
    }
  });

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.5 }), [color]);
  const darkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1b2a3a', roughness: 0.6 }), []);

  return (
    <group ref={group} position={[0, 0.9, 0]}>
      {/* Head */}
      <mesh position={[0, 1.1, 0]} castShadow material={bodyMat}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.2, 1.15, 0.46]} material={darkMat}>
        <boxGeometry args={[0.18, 0.18, 0.05]} />
      </mesh>
      <mesh position={[0.2, 1.15, 0.46]} material={darkMat}>
        <boxGeometry args={[0.18, 0.18, 0.05]} />
      </mesh>
      {/* Mouth */}
      <mesh position={[0, 0.85, 0.46]} material={darkMat}>
        <boxGeometry args={[0.5, 0.08, 0.05]} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.2, 0]} castShadow material={bodyMat}>
        <boxGeometry args={[1.1, 1.0, 0.7]} />
      </mesh>
      {/* Chest panel */}
      <mesh position={[0, 0.25, 0.36]}>
        <boxGeometry args={[0.6, 0.5, 0.04]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} />
      </mesh>
      {/* Arms */}
      <mesh ref={leftArm} position={[-0.7, 0.3, 0]} castShadow material={bodyMat}>
        <boxGeometry args={[0.3, 0.9, 0.3]} />
      </mesh>
      <mesh ref={rightArm} position={[0.7, 0.3, 0]} castShadow material={bodyMat}>
        <boxGeometry args={[0.3, 0.9, 0.3]} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.3, -0.65, 0]} castShadow material={bodyMat}>
        <boxGeometry args={[0.35, 0.7, 0.35]} />
      </mesh>
      <mesh position={[0.3, -0.65, 0]} castShadow material={bodyMat}>
        <boxGeometry args={[0.35, 0.7, 0.35]} />
      </mesh>
    </group>
  );
}

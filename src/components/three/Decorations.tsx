import { useMemo } from 'react';
import * as THREE from 'three';

export default function Decorations() {
  const trees = useMemo(() => {
    const positions: { x: number; z: number; scale: number; color: string }[] = [];
    const colors = ['#1e8449', '#27ae60', '#229954', '#2ecc71'];
    const spots = [
      [-11, -5], [11, -5], [-11, 13], [11, 13],
      [-3, -5], [3, -5], [-7, 13], [7, 13],
    ];
    spots.forEach(([x, z], i) => {
      positions.push({ x, z, scale: 0.8 + (i % 3) * 0.2, color: colors[i % colors.length] });
    });
    return positions;
  }, []);

  const trunkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#6b4f3a', roughness: 0.8 }), []);
  const cloudMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#cbd5e1', transparent: true, opacity: 0.7 }), []);

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.scale}>
          <mesh position={[0, 0.5, 0]} castShadow material={trunkMat}>
            <boxGeometry args={[0.4, 1.0, 0.4]} />
          </mesh>
          <mesh position={[0, 1.4, 0]} castShadow>
            <boxGeometry args={[1.0, 0.8, 1.0]} />
            <meshStandardMaterial color={t.color} roughness={0.7} />
          </mesh>
          <mesh position={[0, 2.0, 0]} castShadow>
            <boxGeometry args={[0.7, 0.6, 0.7]} />
            <meshStandardMaterial color={t.color} roughness={0.7} />
          </mesh>
        </group>
      ))}
      {/* Floating clouds */}
      <mesh position={[-8, 8, -8]} material={cloudMat}>
        <boxGeometry args={[3, 0.8, 1.5]} />
      </mesh>
      <mesh position={[6, 9, 6]} material={cloudMat}>
        <boxGeometry args={[2.5, 0.7, 1.2]} />
      </mesh>
      <mesh position={[0, 10, 0]} material={cloudMat}>
        <boxGeometry args={[4, 1.0, 2]} />
      </mesh>
    </group>
  );
}

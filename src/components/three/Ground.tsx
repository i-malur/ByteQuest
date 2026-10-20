import { useMemo } from 'react';
import { WORLD_SIZE } from '../../data/world';

export default function Ground() {
  const tiles = useMemo(() => {
    const arr: { key: string; x: number; z: number; color: string }[] = [];
    const half = WORLD_SIZE / 2;
    for (let x = -half; x < half; x++) {
      for (let z = -half; z < half; z++) {
        const isEven = (x + z) % 2 === 0;
        const color = isEven ? '#2a3a52' : '#243247';
        arr.push({ key: `${x}_${z}`, x, z, color });
      }
    }
    return arr;
  }, []);

  return (
    <group>
      {tiles.map((t) => (
        <mesh key={t.key} position={[t.x + 0.5, 0, t.z + 0.5]} receiveShadow>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial color={t.color} />
        </mesh>
      ))}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[WORLD_SIZE, 1, WORLD_SIZE]} />
        <meshStandardMaterial color="#1a2436" />
      </mesh>
    </group>
  );
}

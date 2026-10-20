import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  playerRef: React.RefObject<THREE.Vector3 | null>;
  zoomLevel: number;
  onScrollZoom: (delta: number) => void;
}

const MIN_ZOOM = 6;
const MAX_ZOOM = 22;
const BASE_HEIGHT = 8;

export default function CameraRig({ playerRef, zoomLevel, onScrollZoom }: CameraRigProps) {
  const { camera, gl } = useThree();
  const currentZoom = useRef(zoomLevel);
  const currentAngle = useRef(0);

  useEffect(() => {
    const canvas = gl.domElement;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1.5 : -1.5;
      onScrollZoom(delta);
    };
    canvas.addEventListener('wheel', handler, { passive: false });
    return () => canvas.removeEventListener('wheel', handler);
  }, [gl, onScrollZoom]);

  useFrame((_, delta) => {
    currentZoom.current = THREE.MathUtils.lerp(currentZoom.current, zoomLevel, delta * 6);

    const target = playerRef.current ?? new THREE.Vector3(0, 0, 0);
    const zoom = currentZoom.current;
    const height = BASE_HEIGHT + zoom * 0.55;
    const horizontal = zoom * 0.9;

    const desired = new THREE.Vector3(
      target.x + horizontal * Math.cos(currentAngle.current),
      target.y + height,
      target.z + horizontal * Math.sin(currentAngle.current),
    );

    camera.position.lerp(desired, delta * 4);
    camera.lookAt(target.x, target.y + 1, target.z);
  });

  return null;
}

export { MIN_ZOOM, MAX_ZOOM };

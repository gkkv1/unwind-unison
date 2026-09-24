// ============================================================
// FloatingOrb — 3D glowing sphere for hero background
// ============================================================

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';

export default function FloatingOrb({ position = [0, 0, 0], color = '#a855f7', scale = 1 }) {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3;
    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.z = t * 0.07;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        distort={0.4}
        speed={2}
        roughness={0.1}
        metalness={0.2}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

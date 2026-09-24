// ============================================================
// HeroScene — React Three Fiber 3D Scene for Hero Section
// ============================================================

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Sparkles } from '@react-three/drei';
import FloatingOrb from './FloatingOrb';

// Mouse-reactive camera
function CameraRig({ mouse }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// Particle field
function ParticleField() {
  return (
    <Sparkles
      count={120}
      scale={12}
      size={1.5}
      speed={0.3}
      opacity={0.5}
      color="#a855f7"
    />
  );
}

function Scene({ mouse }) {
  return (
    <>
      <CameraRig mouse={mouse} />
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 4, 4]} intensity={2} color="#a855f7" />
      <pointLight position={[-4, -2, -4]} intensity={1} color="#ec4899" />
      <pointLight position={[0, 6, 2]} intensity={0.8} color="#38bdf8" />

      <Stars
        radius={80}
        depth={50}
        count={3000}
        factor={3}
        saturation={0.3}
        fade
        speed={0.5}
      />

      <ParticleField />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <FloatingOrb position={[2.5, 0, -2]} color="#a855f7" scale={1.6} />
      </Float>

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
        <FloatingOrb position={[-2.5, -0.5, -3]} color="#ec4899" scale={1} />
      </Float>

      <Float speed={1} rotationIntensity={0.8} floatIntensity={1}>
        <FloatingOrb position={[0, 2.5, -4]} color="#38bdf8" scale={0.7} />
      </Float>
    </>
  );
}

// Fallback for no WebGL
function FallbackScene() {
  return (
    <div className="hero-fallback-bg">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
    </div>
  );
}

export default function HeroScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile
    setIsMobile(window.innerWidth < 768);

    // Test WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebGLAvailable(false);
    } catch {
      setWebGLAvailable(false);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    setMouse({
      x: (clientX / window.innerWidth) * 2 - 1,
      y: -(clientY / window.innerHeight) * 2 + 1,
    });
  };

  if (!webGLAvailable || isMobile) {
    return <FallbackScene />;
  }

  return (
    <div
      className="hero-scene"
      onMouseMove={handleMouseMove}
      role="presentation"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}

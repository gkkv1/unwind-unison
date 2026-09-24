// ============================================================
// HeroScene — React Three Fiber 3D Scene for Hero Section
// ============================================================

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Sparkles } from '@react-three/drei';
import FloatingOrb from './FloatingOrb';

// Mouse-reactive or auto-drifting camera
function CameraRig({ mouse, isMobile }) {
  const { camera } = useThree();
  useFrame((state) => {
    if (isMobile) {
      const t = state.clock.elapsedTime;
      camera.position.x = Math.sin(t * 0.35) * 0.25;
      camera.position.y = Math.cos(t * 0.25) * 0.15;
    } else {
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05;
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// Particle field
function ParticleField({ count = 120 }) {
  return (
    <Sparkles
      count={count}
      scale={12}
      size={1.5}
      speed={0.3}
      opacity={0.5}
      color="#a855f7"
    />
  );
}

function Scene({ mouse, isMobile }) {
  return (
    <>
      <CameraRig mouse={mouse} isMobile={isMobile} />
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={2.5} color="#a855f7" />
      <pointLight position={[-3, -2, -3]} intensity={1.5} color="#ec4899" />
      <pointLight position={[0, 5, 2]} intensity={1} color="#38bdf8" />

      <Stars
        radius={isMobile ? 50 : 80}
        depth={isMobile ? 30 : 50}
        count={isMobile ? 800 : 2500}
        factor={3}
        saturation={0.3}
        fade
        speed={0.5}
      />

      <ParticleField count={isMobile ? 40 : 120} />

      {/* Main purple orb — beautifully centered & prominent on mobile */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <FloatingOrb
          position={isMobile ? [0, 0.4, -1] : [2.5, 0, -2]}
          color="#a855f7"
          scale={isMobile ? 1.4 : 1.6}
        />
      </Float>

      {/* Secondary pink orb */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
        <FloatingOrb
          position={isMobile ? [-1.4, -1.8, -2.5] : [-2.5, -0.5, -3]}
          color="#ec4899"
          scale={isMobile ? 0.8 : 1}
        />
      </Float>

      {/* Tertiary blue orb */}
      <Float speed={1} rotationIntensity={0.8} floatIntensity={1}>
        <FloatingOrb
          position={isMobile ? [1.3, 2.2, -3.2] : [0, 2.5, -4]}
          color="#38bdf8"
          scale={isMobile ? 0.6 : 0.7}
        />
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
    // Detect mobile viewport
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Test WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebGLAvailable(false);
    } catch {
      setWebGLAvailable(false);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    setMouse({
      x: (clientX / window.innerWidth) * 2 - 1,
      y: -(clientY / window.innerHeight) * 2 + 1,
    });
  };

  // Only fallback if WebGL is completely unsupported by the browser
  if (!webGLAvailable) {
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
        camera={{ position: [0, 0, isMobile ? 7 : 8], fov: isMobile ? 65 : 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}

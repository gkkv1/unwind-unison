// ============================================================
// App.jsx — Main application orchestration
// ============================================================

import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MemoryLane from './components/MemoryLane';
import EventReveal from './components/EventReveal';
import EventDetails from './components/EventDetails';
import VenueSection from './components/VenueSection';
import PriceSection from './components/PriceSection';
import MenuSection from './components/MenuSection';
import Timeline from './components/Timeline';
import RSVPSection from './components/RSVPSection';
import Footer from './components/Footer';

import { useEventConfig } from './hooks/useEventConfig';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // loadingComplete = the intro animation has finished playing
  const [loadingComplete, setLoadingComplete] = useState(false);
  const lenisRef = useRef(null);

  // Data loads in background — fallback is used immediately
  // so the app never waits on network
  const { config, menu, timeline, media } = useEventConfig();

  // ---- Lenis smooth scroll (init after loading screen exits) ----
  useEffect(() => {
    if (!loadingComplete) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Keep ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, [loadingComplete]);

  return (
    <>
      {/* Cinematic loading screen — always plays, then exits */}
      {!loadingComplete && (
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      )}

      {/* Main experience — rendered after loading animation exits */}
      {loadingComplete && (
        <div className="app" id="app-root">
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Navbar visible />

          <main id="main-content" role="main">
            <Hero config={config} />
            <MemoryLane media={media} />
            <EventReveal />
            <EventDetails config={config} />
            <VenueSection config={config} />
            <PriceSection config={config} />
            <MenuSection menu={menu} />
            <Timeline timeline={timeline} />
            <RSVPSection config={config} />
          </main>

          <Footer config={config} />
        </div>
      )}
    </>
  );
}

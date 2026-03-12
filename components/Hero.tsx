'use client';

import { useState, useRef, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import Modal from './Modal';

const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-abyssal-black">
      <div className="text-biolum-cyan font-mono text-sm animate-pulse tracking-widest">
        INITIALIZING SENSORS...
      </div>
    </div>
  ),
});

function clampVolume(vol: number) {
  return Math.max(0, Math.min(0.4, vol));
}

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const audio1Ref = useRef<HTMLAudioElement | null>(null);
  const audio2Ref = useRef<HTMLAudioElement | null>(null);
  const activeTrackRef = useRef<1 | 2>(1);
  const fadeRafRef = useRef<number | null>(null);

  const loadAudio = useCallback(() => {
    if (isLoaded) return;
    
    const a1 = new Audio('/audio/underwater-sample.mp3');
    const a2 = new Audio('/audio/underwater-sample.mp3');
    
    a1.loop = false;
    a2.loop = false;
    a1.volume = 0;
    a2.volume = 0;
    
    a1.onended = () => {
      if (isPlaying) {
        crossfadeToTrack(2);
      }
    };
    a2.onended = () => {
      if (isPlaying) {
        crossfadeToTrack(1);
      }
    };
    
    audio1Ref.current = a1;
    audio2Ref.current = a2;
    setIsLoaded(true);
  }, [isLoaded, isPlaying]);

  const crossfadeToTrack = useCallback((toTrack: 1 | 2) => {
    if (!audio1Ref.current || !audio2Ref.current) return;
    
    const fromTrack = activeTrackRef.current;
    const fromAudio = fromTrack === 1 ? audio1Ref.current : audio2Ref.current;
    const toAudio = toTrack === 1 ? audio1Ref.current : audio2Ref.current;
    
    toAudio.currentTime = 0;
    toAudio.volume = 0;
    
    const startTime = performance.now();
    const duration = 2000;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      fromAudio.volume = clampVolume(0.4 * (1 - progress));
      toAudio.volume = clampVolume(0.4 * progress);
      
      if (progress < 1) {
        fadeRafRef.current = requestAnimationFrame(animate);
      } else {
        fromAudio.pause();
        fromAudio.currentTime = 0;
        fromAudio.volume = 0;
        activeTrackRef.current = toTrack;
        toAudio.play();
      }
    };
    
    if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
    fadeRafRef.current = requestAnimationFrame(animate);
  }, []);

  const toggleAudio = useCallback(() => {
    if (!isLoaded) {
      loadAudio();
    }

    const currentAudio = activeTrackRef.current === 1 ? audio1Ref.current : audio2Ref.current;
    if (!currentAudio) return;

    if (isPlaying) {
      if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
      
      const startTime = performance.now();
      const duration = 500;
      const startVol = currentAudio.volume;
      
      const fadeOut = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        currentAudio.volume = clampVolume(startVol * (1 - progress));
        
        if (progress < 1) {
          fadeRafRef.current = requestAnimationFrame(fadeOut);
        } else {
          currentAudio.pause();
        }
      };
      
      fadeRafRef.current = requestAnimationFrame(fadeOut);
      setIsPlaying(false);
    } else {
      currentAudio.volume = 0;
      currentAudio.play();
      
      const startTime = performance.now();
      const duration = 1500;
      
      const fadeIn = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        currentAudio.volume = clampVolume(0.4 * progress);
        
        if (progress < 1) {
          fadeRafRef.current = requestAnimationFrame(fadeIn);
        }
      };
      
      fadeRafRef.current = requestAnimationFrame(fadeIn);
      setIsPlaying(true);
    }
  }, [isPlaying, isLoaded, loadAudio]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-abyssal-black">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-abyssal-black">
            <div className="text-biolum-cyan font-mono text-sm animate-pulse tracking-widest">
              INITIALIZING SENSORS...
            </div>
          </div>
        }>
          <Scene />
        </Suspense>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="text-center"
        >
          <h1
            className="text-5xl md:text-8xl lg:text-[10vw] font-bold text-white uppercase tracking-tighter leading-none mb-6 glitch-text"
            data-text="CONNECTING THE DEEP."
          >
            CONNECTING THE DEEP.
          </h1>
          <p className="text-gray-400 font-mono text-sm md:text-lg max-w-2xl mx-auto mb-12 tracking-widest uppercase">
            Subsea Fiber Optic Maintenance & Monitoring Hub
          </p>

          <button type="button" onClick={() => setActiveModal('contact')} className="pointer-events-auto group relative px-8 py-4 bg-transparent border border-biolum-cyan text-biolum-cyan font-mono uppercase tracking-widest overflow-hidden transition-all hover:text-abyssal-black hover:box-glow cursor-pointer">
            <span className="relative z-10">Initiate Contact</span>
            <div className="absolute inset-0 bg-biolum-cyan transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </button>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={toggleAudio}
        className="absolute bottom-8 right-8 z-20 text-gray-500 hover:text-biolum-cyan transition-colors cursor-pointer"
        aria-label={isPlaying ? 'Stop Audio' : 'Play Audio'}
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      <div className="absolute bottom-8 left-8 z-20 font-mono text-xs text-gray-500 tracking-widest">
        DEPTH: <span className="text-biolum-cyan">4,000m</span>
      </div>

      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        type={activeModal || ''}
      />
    </section>
  );
}
'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

const MAP_WIDTH = 1536;
const MAP_HEIGHT = 1024;

const cities = {
  // North America
  newYork: { x: 310, y: 285, name: 'New York' },
  miami: { x: 330, y: 400, name: 'Miami' },
  losAngeles: { x: 210, y: 340, name: 'Los Angeles' },
  seattle: { x: 190, y: 265, name: 'Seattle' },
  sanFrancisco: { x: 200, y: 320, name: 'San Francisco' },

  // South America
  fortaleza: { x: 440, y: 510, name: 'Fortaleza' },
  valparaiso: { x: 350, y: 630, name: 'Valparaiso' },
  saoPaulo: { x: 450, y: 590, name: 'São Paulo' },

  // Europe
  london: { x: 735, y: 270, name: 'London' },
  lisbon: { x: 700, y: 340, name: 'Lisbon' },
  marseille: { x: 760, y: 320, name: 'Marseille' },
  madrid: { x: 720, y: 340, name: 'Madrid' },
  paris: { x: 750, y: 295, name: 'Paris' },
  berlin: { x: 805, y: 280, name: 'Berlin' },

  // Africa
  lagos: { x: 745, y: 495, name: 'Lagos' },
  capeTown: { x: 790, y: 730, name: 'Cape Town' },
  johannesburg: { x: 840, y: 700, name: 'Johannesburg' },

  // Asia
  mumbai: { x: 1040, y: 440, name: 'Mumbai' },
  singapore: { x: 1170, y: 535, name: 'Singapore' },
  tokyo: { x: 1320, y: 325, name: 'Tokyo' },
  hongKong: { x: 1270, y: 420, name: 'Hong Kong' },
  shanghai: { x: 1300, y: 365, name: 'Shanghai' },
  beijing: { x: 1280, y: 305, name: 'Beijing' },
  dubai: { x: 1000, y: 405, name: 'Dubai' },

  // Oceania
  sydney: { x: 1360, y: 735, name: 'Sydney' },
  auckland: { x: 1480, y: 795, name: 'Auckland' },
  melbourne: { x: 1320, y: 780, name: 'Melbourne' },
};

// Generate smooth SVG path between two points using cubic bezier
const createCablePath = (from: { x: number; y: number }, to: { x: number; y: number }, controlPoints?: { cp1?: { x: number; y: number }; cp2?: { x: number; y: number } }): string => {
  const cp1 = controlPoints?.cp1 || { 
    x: from.x + (to.x - from.x) * 0.33, 
    y: from.y - 50 
  };
  const cp2 = controlPoints?.cp2 || { 
    x: from.x + (to.x - from.x) * 0.66, 
    y: to.y + 50 
  };
  return `M ${from.x} ${from.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${to.x} ${to.y}`;
};

const cables = [
  // === ATLANTIC ROUTES ===
  {
    id: 'transatlantic-north',
    name: 'Trans-Atlantic North',
    from: cities.newYork,
    to: cities.london,
    capacity: '500 Tbps',
    year: 2024,
    region: 'North Atlantic',
    path: createCablePath(cities.newYork, cities.london, {
      cp1: { x: 450, y: 240 },
      cp2: { x: 600, y: 235 }
    }),
    description: 'New York to London via North Atlantic'
  },
  {
    id: 'transatlantic-south',
    name: 'Trans-Atlantic South',
    from: cities.miami,
    to: cities.lisbon,
    capacity: '400 Tbps',
    year: 2023,
    region: 'Central Atlantic',
    path: createCablePath(cities.miami, cities.lisbon, {
      cp1: { x: 450, y: 360 },
      cp2: { x: 580, y: 335 }
    }),
    description: 'Miami to Lisbon via Central Atlantic'
  },
  {
    id: 'atlantic-south',
    name: 'South Atlantic Link',
    from: cities.fortaleza,
    to: cities.lagos,
    capacity: '300 Tbps',
    year: 2023,
    region: 'South Atlantic',
    path: createCablePath(cities.fortaleza, cities.lagos, {
      cp1: { x: 520, y: 490 },
      cp2: { x: 640, y: 475 }
    }),
    description: 'Brazil to Nigeria via South Atlantic'
  },
  {
    id: 'africa-europe',
    name: 'Africa-Europe Link',
    from: cities.capeTown,
    to: cities.london,
    capacity: '250 Tbps',
    year: 2024,
    region: 'Atlantic Ocean',
    path: createCablePath(cities.capeTown, cities.london, {
      cp1: { x: 700, y: 650 },
      cp2: { x: 750, y: 450 }
    }),
    description: 'Cape Town to London via West Africa'
  },

  // === PACIFIC ROUTES ===
  {
    id: 'pacific-north',
    name: 'North Pacific Link',
    from: cities.seattle,
    to: cities.tokyo,
    capacity: '600 Tbps',
    year: 2025,
    region: 'North Pacific',
    path: createCablePath(cities.seattle, cities.tokyo, {
      cp1: { x: 500, y: 220 },
      cp2: { x: 950, y: 250 }
    }),
    description: 'Seattle to Tokyo via North Pacific'
  },
  {
    id: 'pacific-central',
    name: 'Central Pacific Link',
    from: cities.losAngeles,
    to: cities.tokyo,
    capacity: '450 Tbps',
    year: 2024,
    region: 'Pacific Ocean',
    path: createCablePath(cities.losAngeles, cities.tokyo, {
      cp1: { x: 550, y: 340 },
      cp2: { x: 950, y: 320 }
    }),
    description: 'Los Angeles to Tokyo via Hawaii'
  },
  {
    id: 'pacific-south',
    name: 'South Pacific Link',
    from: cities.losAngeles,
    to: cities.sydney,
    capacity: '350 Tbps',
    year: 2024,
    region: 'South Pacific',
    path: createCablePath(cities.losAngeles, cities.sydney, {
      cp1: { x: 500, y: 550 },
      cp2: { x: 1000, y: 650 }
    }),
    description: 'Los Angeles to Sydney via South Pacific'
  },
  {
    id: 'americas-pacific',
    name: 'Americas Pacific Link',
    from: cities.losAngeles,
    to: cities.valparaiso,
    capacity: '200 Tbps',
    year: 2023,
    region: 'Pacific Ocean',
    path: createCablePath(cities.losAngeles, cities.valparaiso, {
      cp1: { x: 250, y: 450 },
      cp2: { x: 290, y: 550 }
    }),
    description: 'Los Angeles to Valparaiso via Pacific coast'
  },

  // === INDIAN OCEAN ROUTES ===
  {
    id: 'indian-ocean-east',
    name: 'East Indian Link',
    from: cities.mumbai,
    to: cities.singapore,
    capacity: '400 Tbps',
    year: 2024,
    region: 'Indian Ocean',
    path: createCablePath(cities.mumbai, cities.singapore, {
      cp1: { x: 1080, y: 440 },
      cp2: { x: 1120, y: 480 }
    }),
    description: 'Mumbai to Singapore via Bay of Bengal'
  },
  {
    id: 'indian-ocean-south',
    name: 'South Indian Link',
    from: cities.capeTown,
    to: cities.mumbai,
    capacity: '300 Tbps',
    year: 2023,
    region: 'Indian Ocean',
    path: createCablePath(cities.capeTown, cities.mumbai, {
      cp1: { x: 950, y: 600 },
      cp2: { x: 1000, y: 480 }
    }),
    description: 'Cape Town to Mumbai via Indian Ocean'
  },

  // === INTER-REGIONAL ===
  {
    id: 'asia-east-west',
    name: 'Asia East-West',
    from: cities.tokyo,
    to: cities.singapore,
    capacity: '550 Tbps',
    year: 2025,
    region: 'Asia Pacific',
    path: createCablePath(cities.tokyo, cities.singapore, {
      cp1: { x: 1300, y: 380 },
      cp2: { x: 1220, y: 450 }
    }),
    description: 'Tokyo to Singapore via Hong Kong'
  },
  {
    id: 'asia-global',
    name: 'Global Asia Ring',
    from: cities.singapore,
    to: cities.capeTown,
    capacity: '400 Tbps',
    year: 2024,
    region: 'Indian Ocean',
    path: createCablePath(cities.singapore, cities.capeTown, {
      cp1: { x: 1200, y: 580 },
      cp2: { x: 980, y: 650 }
    }),
    description: 'Singapore to Cape Town via Indian Ocean'
  },
];

export default function GlobalMap() {
  const [activeCable, setActiveCable] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleCableEnter = useCallback((cableId: string) => {
    setActiveCable(cableId);
  }, []);

  const handleCableLeave = useCallback(() => {
    setActiveCable(null);
  }, []);

  return (
    <section id="global-backbone" className="py-24 px-4 md:px-8 max-w-7xl mx-auto bg-abyssal-black border-y border-white/5 relative overflow-hidden">
      <div>
        {/* Header */}
        <div className="mb-16 relative z-10 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold font-sans text-white mb-4 uppercase tracking-tighter">
            Global Backbone
          </h2>
          <p className="font-mono text-gray-400 max-w-2xl text-sm md:text-base md:mx-0 mx-auto">
            Interactive visualization of {cables.length} submarine cable routes under active maintenance.
          </p>
        </div>

        {/* Map Container */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className="relative w-full aspect-[3/2] bg-deep-ocean/20 rounded-2xl border border-white/10 overflow-hidden cursor-crosshair"
        >
          {/* Map Background */}
          <div className="absolute inset-0">
            <Image
              src="/images/map.png"
              alt="World map"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-abyssal-black/20" />
          </div>

          {/* SVG Overlay */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="absolute inset-0 w-full h-full cursor-crosshair"
            preserveAspectRatio="xMidYMid meet"
            aria-label="Interactive submarine cable map"
          >
            <title>Global Submarine Cable Network Map</title>
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="cableGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.1" /><stop offset="50%" stopColor="#00F0FF" stopOpacity="0.8" /><stop offset="100%" stopColor="#00F0FF" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Cable Routes */}
            {cables.map((cable) => (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <g key={cable.id}>
                {/* Invisible hit area for easier hovering */}
                <motion.path
                  d={cable.path}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="25"
                  onMouseEnter={() => handleCableEnter(cable.id)}
                  onMouseLeave={handleCableLeave}
                />

                {/* Base cable line - dashed that transitions to solid */}
                <motion.path
                  d={cable.path}
                  fill="none"
                  stroke={activeCable === cable.id ? '#00F0FF' : '#64748b'}
                  strokeWidth={activeCable === cable.id ? 3 : 1.5}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "8 6", strokeOpacity: 0.6 }}
                  animate={{
                    strokeDasharray: activeCable === cable.id ? "0" : "8 6",
                    strokeOpacity: activeCable === cable.id ? 1 : 0.5,
                    stroke: activeCable === cable.id ? '#00F0FF' : '#64748b',
                  }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />

                {/* Glow effect when hovered */}
                <AnimatePresence>
                  {activeCable === cable.id && (
                    <motion.path
                      d={cable.path}
                      fill="none"
                      stroke="#00F0FF"
                      strokeWidth="8"
                      strokeLinecap="round"
                      filter="url(#softGlow)"
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ opacity: [0, 0.4, 0.6, 0.4], pathLength: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                {/* Data flow animation */}
                <motion.path
                  d={cable.path}
                  fill="none"
                  stroke="url(#cableGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="20 40"
                  className="pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCable === cable.id ? 1 : 0, strokeDashoffset: [0, -60] }}
                  transition={{ opacity: { duration: 0.3 }, strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" } }}
                />

                {/* City nodes - start and end points */}
                <motion.circle
                  cx={cable.from.x}
                  cy={cable.from.y}
                  r={activeCable === cable.id ? 5 : 3}
                  fill={activeCable === cable.id ? '#00F0FF' : '#64748b'}
                  animate={{
                    fill: activeCable === cable.id ? '#00F0FF' : '#64748b',
                    r: activeCable === cable.id ? 5 : 3,
                    scale: activeCable === cable.id ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 0.3,
                    scale: { repeat: activeCable === cable.id ? Infinity : 0, duration: 1.5 }
                  }}
                />
                <motion.circle
                  cx={cable.to.x}
                  cy={cable.to.y}
                  r={activeCable === cable.id ? 5 : 3}
                  fill={activeCable === cable.id ? '#00F0FF' : '#64748b'}
                  animate={{
                    fill: activeCable === cable.id ? '#00F0FF' : '#64748b',
                    r: activeCable === cable.id ? 5 : 3,
                    scale: activeCable === cable.id ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 0.3,
                    scale: { repeat: activeCable === cable.id ? Infinity : 0, duration: 1.5 }
                  }}
                />

                {/* City labels on hover */}
                <AnimatePresence>
                  {activeCable === cable.id && (
                    <>
                      <motion.text
                        x={cable.from.x}
                        y={cable.from.y - 10}
                        textAnchor="middle"
                        fill="#00F0FF"
                        fontSize="10"
                        fontFamily="monospace"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                      >
                        {cable.from.name}
                      </motion.text>
                      <motion.text
                        x={cable.to.x}
                        y={cable.to.y - 10}
                        textAnchor="middle"
                        fill="#00F0FF"
                        fontSize="10"
                        fontFamily="monospace"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                      >
                        {cable.to.name}
                      </motion.text>
                    </>
                  )}
                </AnimatePresence>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="absolute top-4 left-4 bg-abyssal-black/80 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-lg font-mono text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-biolum-cyan" />
                <span className="text-gray-400">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 border-b border-dashed border-gray-600" />
                <span className="text-gray-400">Route</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-biolum-cyan" />
                <span className="text-gray-400">Node</span>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="absolute top-4 right-4 bg-abyssal-black/80 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-lg font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between gap-6">
                <span className="text-gray-500">ROUTES:</span>
                <span className="text-white">{cables.length}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-gray-500">CAPACITY:</span>
                <span className="text-biolum-cyan">4.3 PB</span>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-80 bg-abyssal-black/95 backdrop-blur-md border border-white/10 p-4 rounded-xl font-mono text-sm">
            <AnimatePresence mode="wait">
              {activeCable ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key={activeCable}
                >
                  {cables.filter(c => c.id === activeCable).map(cable => (
                    <div key={cable.id}>
                      <div className="text-biolum-cyan font-bold mb-3 uppercase tracking-widest border-b border-white/10 pb-2">
                        {cable.name}
                      </div>
                      <div className="space-y-2 text-gray-400 text-xs">
                        <div className="flex justify-between">
                          <span>FROM:</span>
                           <span className="text-white">{cable.from.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>TO:</span>
                           <span className="text-white">{cable.to.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CAPACITY:</span>
                          <span className="text-white font-bold">{cable.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>INSTALLED:</span>
                          <span className="text-white">{cable.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>STATUS:</span>
                          <span className="text-biolum-cyan animate-pulse">ACTIVE</span>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-gray-500">
                          {cable.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-600 text-center py-6"
                >
                  <div className="mb-3 text-2xl opacity-30">
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 mx-auto" aria-label="Ocean icon">
                      <title>Ocean waves</title>
                      <path d="M2 12C2 12 5 8 8 8C11 8 13 12 16 12C19 12 22 12 22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M2 16C2 16 5 12 8 12C11 12 13 16 16 16C19 16 22 12 22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                    </svg>
                  </div>
                  <div className="text-gray-500 uppercase tracking-widest text-xs">
                    <div className="animate-pulse">Hover over cables</div>
                    <div className="text-xs mt-1 text-gray-600">to view route details</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';

const MAP_WIDTH = 1536;
const MAP_HEIGHT = 1024;

// Generate random delay for idle cable flashing
const getRandomFlareDelay = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return -(hash % 15) - 2;
};

const cities = {
  losAngeles: { x: 264, y: 412, name: 'Los Angeles' },
  newYork: { x: 465, y: 348, name: 'New York' },
  miami: { x: 249, y: 350, name: 'Miami' },
  seattle: { x: 185, y: 285, name: 'Seattle' },
  sanFrancisco: { x: 247, y: 380, name: 'San Francisco' },
  fortaleza: { x: 573, y: 576, name: 'Fortaleza' },
  valparaiso: { x: 447, y: 702, name: 'Valparaiso' },
  saoPaulo: { x: 548, y: 661, name: 'São Paulo' },
  london: { x: 726, y: 322, name: 'London' },
  lisbon: { x: 692, y: 382, name: 'Lisbon' },
  marseille: { x: 750, y: 365, name: 'Marseille' },
  madrid: { x: 713, y: 382, name: 'Madrid' },
  paris: { x: 733, y: 339, name: 'Paris' },
  berlin: { x: 775, y: 315, name: 'Berlin' },
  lagos: { x: 747, y: 534, name: 'Lagos' },
  capeTown: { x: 804, y: 698, name: 'Cape Town' },
  johannesburg: { x: 846, y: 660, name: 'Johannesburg' },
  mumbai: { x: 1029, y: 476, name: 'Mumbai' },
  singapore: { x: 1158, y: 553, name: 'Singapore' },
  tokyo: { x: 1297, y: 396, name: 'Tokyo' },
  hongKong: { x: 1204, y: 462, name: 'Hong Kong' },
  shanghai: { x: 1232, y: 433, name: 'Shanghai' },
  beijing: { x: 1168, y: 475, name: 'Beijing' },
  dubai: { x: 952, y: 454, name: 'Dubai' },
  sydney: { x: 1340, y: 702, name: 'Sydney' },
  auckland: { x: 1442, y: 724, name: 'Auckland' },
  melbourne: { x: 1318, y: 729, name: 'Melbourne' },
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
      cp1: { x: 595, y: 300 },
      cp2: { x: 650, y: 280 }
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
      cp1: { x: 470, y: 450 },
      cp2: { x: 580, y: 420 }
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
      cp1: { x: 660, y: 550 },
      cp2: { x: 700, y: 520 }
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
      cp1: { x: 650, y: 650 },
      cp2: { x: 600, y: 500 }
    }),
    description: 'Cape Town to London via West Africa'
  },

  // === PACIFIC ROUTES (wraparound - go off left edge, come back from right) ===
  {
    id: 'pacific-north',
    name: 'North Pacific Link',
    from: cities.seattle,
    to: cities.tokyo,
    capacity: '600 Tbps',
    year: 2025,
    region: 'North Pacific',
    path: `M ${cities.seattle.x} ${cities.seattle.y} C 100 250, -200 200, -100 200 M 1636 200, 1700 250, ${cities.tokyo.x} ${cities.tokyo.y}`,
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
    path: `M ${cities.losAngeles.x} ${cities.losAngeles.y} C 150 400, -200 350, -100 350 M 1636 350, 1700 400, ${cities.tokyo.x} ${cities.tokyo.y}`,
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
    path: `M ${cities.losAngeles.x} ${cities.losAngeles.y} C 180 550, 50 700, -50 750 M 1586 500, 1700 600, ${cities.sydney.x} ${cities.sydney.y}`,
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
      cp1: { x: 300, y: 500 },
      cp2: { x: 350, y: 600 }
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
      cp1: { x: 1080, y: 490 },
      cp2: { x: 1120, y: 520 }
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
      cp1: { x: 950, y: 580 },
      cp2: { x: 1000, y: 520 }
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
      cp1: { x: 1280, y: 420 },
      cp2: { x: 1220, y: 480 }
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
      cp1: { x: 1150, y: 600 },
      cp2: { x: 960, y: 680 }
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
        <div className="relative w-full aspect-[3/2] bg-deep-ocean/20 rounded-2xl border border-white/10 overflow-hidden cursor-crosshair">
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
            {cables.map((cable) => {
              const flareDelay = getRandomFlareDelay(cable.id);
              const isHovered = activeCable === cable.id;
              return (
              <g key={cable.id}>
                {/* Base cable line - dashed when idle, solid when hovered */}
                <motion.path
                  d={cable.path}
                  fill="none"
                  stroke={isHovered ? '#00F0FF' : '#64748b'}
                  strokeWidth={isHovered ? 3 : 1.5}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "8 6", strokeOpacity: 0.6 }}
                  animate={{
                    strokeDasharray: isHovered ? "0" : "8 6",
                    strokeOpacity: isHovered ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />

                {/* Rare discreet random flash - only on 3-4 cables at a time, very subtle */}
                {!isHovered && (
                  <motion.path
                    d={cable.path}
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ 
                      duration: 0.4, 
                      repeat: Infinity, 
                      repeatDelay: Math.abs(flareDelay) * 8,
                      ease: "easeInOut" 
                    }}
                  />
                )}

                {/* Glow effect when hovered */}
                <AnimatePresence>
                  {isHovered && (
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

                {/* Data flow animation - only when hovered */}
                {isHovered && (
                  <motion.path
                    d={cable.path}
                    fill="none"
                    stroke="url(#cableGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="20 40"
                    className="pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, strokeDashoffset: [0, -60] }}
                    transition={{ opacity: { duration: 0.3 }, strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" } }}
                  />
                )}

                {/* City nodes - start and end points */}
                <motion.circle
                  cx={cable.from.x}
                  cy={cable.from.y}
                  r={activeCable === cable.id ? 6 : 3}
                  fill={activeCable === cable.id ? '#00F0FF' : '#64748b'}
                  animate={{
                    fill: activeCable === cable.id ? '#00F0FF' : '#64748b',
                    r: activeCable === cable.id ? 6 : 3,
                    scale: activeCable === cable.id ? [1, 1.3, 1] : 1,
                  }}
                  transition={{
                    duration: 0.3,
                    scale: { repeat: activeCable === cable.id ? Infinity : 0, duration: 1.5 }
                  }}
                />
                <motion.circle
                  cx={cable.to.x}
                  cy={cable.to.y}
                  r={activeCable === cable.id ? 6 : 3}
                  fill={activeCable === cable.id ? '#00F0FF' : '#64748b'}
                  animate={{
                    fill: activeCable === cable.id ? '#00F0FF' : '#64748b',
                    r: activeCable === cable.id ? 6 : 3,
                    scale: activeCable === cable.id ? [1, 1.3, 1] : 1,
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
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <rect
                          x={cable.from.x - 35}
                          y={cable.from.y - 28}
                          width={70}
                          height={18}
                          rx={3}
                          fill="#020617"
                          stroke="#00F0FF"
                          strokeWidth={0.5}
                          opacity={0.9}
                        />
                        <motion.text
                          x={cable.from.x}
                          y={cable.from.y - 15}
                          textAnchor="middle"
                          fill="#00F0FF"
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {cable.from.name}
                        </motion.text>
                      </motion.g>
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <rect
                          x={cable.to.x - 35}
                          y={cable.to.y - 28}
                          width={70}
                          height={18}
                          rx={3}
                          fill="#020617"
                          stroke="#00F0FF"
                          strokeWidth={0.5}
                          opacity={0.9}
                        />
                        <motion.text
                          x={cable.to.x}
                          y={cable.to.y - 15}
                          textAnchor="middle"
                          fill="#00F0FF"
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {cable.to.name}
                        </motion.text>
                      </motion.g>
                    </>
                  )}
                </AnimatePresence>

                {/* Invisible hit area - LAST so it's on top for reliable hover */}
                <motion.path
                  d={cable.path}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="70"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => handleCableEnter(cable.id)}
                  onMouseLeave={handleCableLeave}
                />
              </g>
            )})}
          </svg>

          <div className="hidden md:block absolute top-4 left-4 bg-abyssal-black/80 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-lg font-mono text-xs">
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

          <div className="hidden md:block absolute top-4 right-4 bg-abyssal-black/80 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-lg font-mono text-xs">
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

          <div className="hidden md:block absolute bottom-4 left-4 w-80 bg-abyssal-black/95 backdrop-blur-md border border-white/10 p-4 rounded-xl font-mono text-sm">
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

        <div className="md:hidden bg-abyssal-black/80 backdrop-blur-sm border border-white/10 px-2 py-1.5 rounded-lg font-mono text-[10px]">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-biolum-cyan" />
              <span className="text-gray-400">Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 border-b border-dashed border-gray-600" />
              <span className="text-gray-400">Route</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-biolum-cyan" />
              <span className="text-gray-400">Node</span>
            </div>
          </div>
        </div>

        <div className="md:hidden bg-abyssal-black/80 backdrop-blur-sm border border-white/10 px-2 py-1.5 rounded-lg font-mono text-[10px]">
          <div className="flex items-center justify-center gap-3">
            <span className="text-gray-500">ROUTES: <span className="text-white">{cables.length}</span></span>
            <span className="text-gray-500">CAPACITY: <span className="text-biolum-cyan">4.3 PB</span></span>
          </div>
        </div>

        <div className="md:hidden bg-abyssal-black/95 backdrop-blur-md border border-white/10 p-3 rounded-xl font-mono text-xs">
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
                    <div className="text-biolum-cyan font-bold mb-2 uppercase tracking-widest border-b border-white/10 pb-1 text-[10px]">
                      {cable.name}
                    </div>
                    <div className="space-y-1 text-gray-400 text-[9px]">
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
                        <span>STATUS:</span>
                        <span className="text-biolum-cyan animate-pulse">ACTIVE</span>
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
                className="text-gray-600 text-center py-3"
              >
                <div className="mb-2 text-lg opacity-30">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 mx-auto" aria-label="Ocean icon">
                    <title>Ocean waves</title>
                    <path d="M2 12C2 12 5 8 8 8C11 8 13 12 16 12C19 12 22 12 22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M2 16C2 16 5 12 8 12C11 12 13 16 16 16C19 16 22 12 22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  </svg>
                </div>
                <div className="text-gray-500 uppercase tracking-widest text-[9px]">
                  <div className="animate-pulse">Hover over cables</div>
                  <div className="text-[9px] mt-0.5 text-gray-600">to view route details</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

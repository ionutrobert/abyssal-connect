'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Ship, MapPin, Activity, Clock } from 'lucide-react';
import { vessels, incidents } from '@/data/operations';

const MAP_WIDTH = 1536;
const MAP_HEIGHT = 1024;

function projectLatLongToXY(latitude: number, longitude: number): { x: number; y: number } {
  const x = ((longitude + 180) / 360) * MAP_WIDTH;
  const y = ((90 - latitude) / 180) * MAP_HEIGHT;
  return { x, y };
}

function createCablePath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const cp1 = {
    x: from.x + (to.x - from.x) * 0.33,
    y: from.y - 50
  };
  const cp2 = {
    x: from.x + (to.x - from.x) * 0.66,
    y: to.y + 50
  };
  return `M ${from.x} ${from.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${to.x} ${to.y}`;
}

const cities = {
  losAngeles: { x: 264, y: 412, name: 'Los Angeles', lat: 34.05, long: -118.24 },
  newYork: { x: 465, y: 348, name: 'New York', lat: 40.71, long: -74.01 },
  london: { x: 726, y: 322, name: 'London', lat: 51.51, long: -0.13 },
  singapore: { x: 1158, y: 553, name: 'Singapore', lat: 1.35, long: 103.82 },
  tokyo: { x: 1297, y: 396, name: 'Tokyo', lat: 35.68, long: 139.69 },
  mumbai: { x: 1029, y: 476, name: 'Mumbai', lat: 19.08, long: 72.88 },
  dubai: { x: 952, y: 454, name: 'Dubai', lat: 25.20, long: 55.27 },
  capeTown: { x: 804, y: 698, name: 'Cape Town', lat: -33.93, long: 18.42 },
  sydney: { x: 1340, y: 702, name: 'Sydney', lat: -33.87, long: 151.21 },
};

const cables = [
  { id: 'c1', from: cities.newYork, to: cities.london },
  { id: 'c2', from: cities.london, to: cities.capeTown },
  { id: 'c3', from: cities.capeTown, to: cities.mumbai },
  { id: 'c4', from: cities.mumbai, to: cities.singapore },
  { id: 'c5', from: cities.singapore, to: cities.tokyo },
  { id: 'c6', from: cities.losAngeles, to: cities.tokyo },
  { id: 'c7', from: cities.losAngeles, to: cities.sydney },
  { id: 'c8', from: cities.singapore, to: cities.sydney },
];

interface ShipMarkerProps {
  vessel: typeof vessels[0];
  incidents: typeof incidents;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

function ShipMarker({ vessel, incidents, isHovered, onHover }: ShipMarkerProps) {
  const position = useMemo(() => projectLatLongToXY(vessel.latitude, vessel.longitude), [vessel.latitude, vessel.longitude]);
  const vesselIncidents = useMemo(() => incidents.filter(i => i.vesselId === vessel.id), [incidents, vessel.id]);

  const getStatusColor = () => {
    switch (vessel.status) {
      case 'Active': return '#22c55e';
      case 'Maintenance': return '#eab308';
      case 'Docked': return '#64748b';
      default: return '#64748b';
    }
  };

  const getStatusGlowColor = () => {
    switch (vessel.status) {
      case 'Active': return '#22c55e40';
      case 'Maintenance': return '#eab30840';
      case 'Docked': return '#64748b40';
      default: return '#64748b40';
    }
  };

  return (
    <g>
      <motion.circle
        cx={position.x}
        cy={position.y}
        r={isHovered ? 20 : 12}
        fill={getStatusGlowColor()}
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
          opacity: isHovered ? 0.8 : 0.4,
        }}
        transition={{
          duration: 0.5,
          scale: isHovered ? { repeat: Infinity, duration: 2 } : {},
        }}
      />

      <g transform={`translate(${position.x - 10}, ${position.y - 10})`}>
        {/* eslint-disable jsx-a11y/no-static-element-interactions */}
        <circle
          cx={10}
          cy={10}
          r={55}
          fill="transparent"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => onHover(vessel.id)}
          onMouseLeave={() => onHover(null)}
        />

        {/* eslint-disable jsx-a11y/no-static-element-interactions */}
        <motion.g
          animate={{
            scale: isHovered ? 1.2 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <path
            d="M10 0 L20 10 L20 16 L12 16 L10 18 L8 16 L0 16 L0 10 Z"
            fill={getStatusColor()}
            stroke="white"
            strokeWidth={1}
          />
          <circle cx={10} cy={8} r={2} fill="white" opacity={0.8} />
        </motion.g>

        <motion.circle
          cx={18}
          cy={2}
          r={3}
          fill={getStatusColor()}
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            scale: isHovered ? { repeat: Infinity, duration: 1.5 } : {},
          }}
        />
      </g>

      <AnimatePresence>
        {isHovered && (
          <motion.g
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <rect
              x={position.x - 60}
              y={position.y - 45}
              width={120}
              height={35}
              rx={4}
              fill="#020617"
              stroke={getStatusColor()}
              strokeWidth={1}
              opacity={0.95}
            />
            <text
              x={position.x}
              y={position.y - 32}
              textAnchor="middle"
              fill="white"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {vessel.name}
            </text>
            <text
              x={position.x}
              y={position.y - 18}
              textAnchor="middle"
              fill={getStatusColor()}
              fontSize="9"
              fontFamily="monospace"
            >
              {vessel.status}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}

interface ShipInfoPanelProps {
  vessel: typeof vessels[0];
  incidents: typeof incidents;
}

function ShipInfoPanel({ vessel, incidents }: ShipInfoPanelProps) {
  const vesselIncidents = useMemo(() => incidents.filter(i => i.vesselId === vessel.id), [incidents, vessel.id]);

  const getStatusColor = () => {
    switch (vessel.status) {
      case 'Active': return 'text-green-400';
      case 'Maintenance': return 'text-yellow-400';
      case 'Docked': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-abyssal-black/95 backdrop-blur-md border border-white/10 p-4 rounded-xl font-mono text-sm">
      <div className={`${getStatusColor()} font-bold mb-3 uppercase tracking-widest border-b border-white/10 pb-2`}>
        {vessel.name}
      </div>
      <div className="space-y-2 text-gray-400 text-xs">
        <div className="flex justify-between items-center">
          <span>STATUS:</span>
          <span className={`font-bold ${getStatusColor()}`}>{vessel.status}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>LOCATION:</span>
          <span className="text-white">{vessel.location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>CURRENT TASK:</span>
          <span className="text-biolum-cyan">{vessel.task}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>COORDINATES:</span>
          <span className="text-white">{vessel.latitude.toFixed(2)}°N, {vessel.longitude.toFixed(2)}°{vessel.longitude >= 0 ? 'E' : 'W'}</span>
        </div>

        {vesselIncidents.length > 0 && (
          <>
            <div className="pt-2 border-t border-white/10 mt-2">
              <div className="text-gray-400 mb-2 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                CURRENT INCIDENTS
              </div>
              {vesselIncidents.map((incident) => (
                <div key={incident.id} className="bg-white/5 rounded p-2 mb-2 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-[10px]">{incident.id}</span>
                    <span className={`text-[9px] ${incident.severity === 'high' ? 'text-red-400' : incident.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-gray-400 text-[9px]">{incident.cable}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-biolum-cyan text-[9px]">{incident.status}</span>
                    <span className="text-gray-500 text-[8px] flex items-center gap-1">
                      <Clock className="w-2 h-2" />
                      ETA: {incident.eta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VesselTrackingMap() {
  const [activeVessel, setActiveVessel] = useState<string | null>(null);

  const activeVesselData = useMemo(() => {
    return vessels.find(v => v.id === activeVessel);
  }, [activeVessel]);

  return (
    <>
      <div className="relative w-full aspect-[3/2] bg-deep-ocean/20 rounded-2xl border border-white/10 overflow-hidden">
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

      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Vessel tracking map"
      >
        <title>Real-Time Vessel Tracking Map</title>
        <defs>
          <filter id="shipGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {cables.map((cable) => (
          <path
            key={cable.id}
            d={createCablePath(cable.from, cable.to)}
            fill="none"
            stroke="#334155"
            strokeWidth={1.5}
            strokeDasharray="8 4"
            opacity={0.3}
          />
        ))}

        {Object.entries(cities).map(([key, city]) => (
          <circle
            key={key}
            cx={city.x}
            cy={city.y}
            r={4}
            fill="#334155"
            opacity={0.5}
          />
        ))}

        {vessels.map((vessel) => (
          <ShipMarker
            key={vessel.id}
            vessel={vessel}
            incidents={incidents}
            isHovered={activeVessel === vessel.id}
            onHover={setActiveVessel}
          />
        ))}
      </svg>

      <div className="hidden md:block absolute top-4 left-4 bg-abyssal-black/80 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-lg font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-gray-400">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span className="text-gray-400">Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-500" />
            <span className="text-gray-400">Docked</span>
          </div>
        </div>
      </div>

      <div className="hidden md:block absolute top-4 right-4 bg-abyssal-black/80 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-lg font-mono text-xs">
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">FLEET:</span>
            <span className="text-white">{vessels.length}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">ACTIVE:</span>
            <span className="text-green-400">{vessels.filter(v => v.status === 'Active').length}</span>
          </div>
        </div>
      </div>

      <div className="hidden md:block absolute bottom-4 left-4 w-80 bg-abyssal-black/95 backdrop-blur-md border border-white/10 p-4 rounded-xl font-mono text-sm">
        <AnimatePresence mode="wait">
          {activeVesselData && <ShipInfoPanel vessel={activeVesselData} incidents={incidents} />}
        </AnimatePresence>
      </div>

      <div className="hidden md:block absolute bottom-4 left-4 w-80">
        <AnimatePresence mode="wait">
          {!activeVessel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-abyssal-black/95 backdrop-blur-md border border-white/10 p-4 rounded-xl font-mono text-sm text-gray-600 text-center py-6"
            >
              <div className="mb-3">
                <Ship className="w-8 h-8 mx-auto text-biolum-cyan/50" />
              </div>
              <div className="text-gray-500 uppercase tracking-widest text-xs">
                <div className="animate-pulse">Hover over ships</div>
                <div className="text-xs mt-1 text-gray-600">to view details</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

    <div className="md:hidden bg-abyssal-black/80 backdrop-blur-sm border border-white/10 px-2 py-1.5 rounded-lg font-mono text-[10px]">
      <div className="flex items-center justify-center gap-1.5">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-green-500" />
          <span className="text-gray-400">Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-yellow-500" />
          <span className="text-gray-400">Maint</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-gray-500" />
          <span className="text-gray-400">Docked</span>
        </div>
      </div>
    </div>

    <div className="md:hidden bg-abyssal-black/80 backdrop-blur-sm border border-white/10 px-2 py-1.5 rounded-lg font-mono text-[10px]">
      <div className="flex items-center justify-center gap-3">
        <span className="text-gray-500">FLEET: <span className="text-white">{vessels.length}</span></span>
        <span className="text-gray-500">ACTIVE: <span className="text-green-400">{vessels.filter(v => v.status === 'Active').length}</span></span>
      </div>
    </div>

    <div className="md:hidden bg-abyssal-black/95 backdrop-blur-md border border-white/10 p-3 rounded-xl font-mono text-xs">
      <AnimatePresence mode="wait">
        {activeVesselData ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key={activeVesselData.id}
          >
            <ShipInfoPanel vessel={activeVesselData} incidents={incidents} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-600 text-center py-3"
          >
            <div className="mb-2">
              <Ship className="w-6 h-6 mx-auto text-biolum-cyan/50" />
            </div>
            <div className="text-gray-500 uppercase tracking-widest text-[9px]">
              <div className="animate-pulse">Hover over ships</div>
              <div className="text-[9px] mt-0.5 text-gray-600">to view details</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}

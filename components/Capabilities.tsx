'use client';

import { motion } from 'motion/react';
import { Activity, Anchor, Globe2, Cpu, ShieldAlert, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const capabilities = [
  {
    title: "ROV Technology",
    description: "Autonomous subsea intervention with millimeter precision.",
    icon: <Cpu className="w-8 h-8 text-biolum-cyan" />,
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-1",
    hasImage: true,
    visual: (
      <div className="absolute inset-0" style={{ backgroundImage: "url('/images/rov-technology.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 flicker-hover" />
        <div className="absolute inset-0 bg-[#0d1f2d]/75" />
        <div className="lightning-bolt" />
      </div>
    )
  },
  {
    title: "Depth Rating",
    description: "Operational capacity exceeding 6,000 meters.",
    icon: <Anchor className="w-8 h-8 text-biolum-cyan" />,
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-2",
    mobileOrder: "order-last",
    visibleOnMobile: true,
    visual: (
      <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity">
        <span className="text-8xl font-bold font-mono text-biolum-cyan">6k</span>
      </div>
    )
  },
  {
    title: "Global Response",
    description: "Vessels stationed strategically for <24h deployment.",
    icon: <Globe2 className="w-8 h-8 text-biolum-cyan" />,
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
    hasImage: true,
    visual: (
      <div className="absolute inset-0" style={{ backgroundImage: "url('/images/ship.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 flicker-hover" />
        <div className="absolute inset-0 bg-[#0d1f2d]/75" />
        <div className="lightning-bolt" />
      </div>
    )
  },
  {
    title: "Cable Splicing",
    description: "Zero-loss fusion splicing in pressurized habitats.",
    icon: <Zap className="w-8 h-8 text-biolum-cyan" />,
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
    hasImage: true,
    visual: (
      <div className="absolute inset-0" style={{ backgroundImage: "url('/images/cable.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 flicker-hover cable-image" />
        <div className="absolute inset-0 bg-[#0d1f2d]/75" />
        <div className="lightning-bolt" />
      </div>
    )
  },
  {
    title: "Threat Detection",
    description: "Acoustic monitoring for anchor drag and seismic events.",
    icon: <ShieldAlert className="w-8 h-8 text-biolum-cyan" />,
    colSpan: "md:col-span-3",
    rowSpan: "md:row-span-1",
    visual: (
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-30 group-hover:opacity-50 transition-opacity">
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none" aria-label="Acoustic signal visualization">
          <motion.path
            d="M0,50 Q20,50 30,50 T50,50 T70,50 T90,50 T110,50 T130,30 T150,70 T170,40 T190,60 T210,50 T230,50 T250,45 T270,55 T290,50 T310,50 T330,40 T350,60 T370,50 T390,50 T400,50"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
              d: [
                "M0,50 Q20,50 30,50 T50,50 T70,50 T90,50 T110,50 T130,30 T150,70 T170,40 T190,60 T210,50 T230,50 T250,45 T270,55 T290,50 T310,50 T330,40 T350,60 T370,50 T390,50 T400,50",
                "M0,50 Q20,45 30,55 T50,45 T70,55 T90,50 T110,40 T130,50 T150,60 T170,45 T190,55 T210,40 T230,60 T250,50 T270,45 T290,55 T310,50 T330,40 T350,55 T370,45 T390,50 T400,50",
                "M0,50 Q20,50 30,50 T50,50 T70,50 T90,50 T110,50 T130,70 T150,30 T170,60 T190,40 T210,50 T230,50 T250,55 T270,45 T290,50 T310,50 T330,60 T350,40 T370,50 T390,50 T400,50",
                "M0,50 Q20,50 30,50 T50,50 T70,50 T90,50 T110,50 T130,30 T150,70 T170,40 T190,60 T210,50 T230,50 T250,45 T270,55 T290,50 T310,50 T330,40 T350,60 T370,50 T390,50 T400,50"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.33, 0.66, 1]
            }}
            style={{
              filter: 'drop-shadow(0 0 6px #00F0FF)',
            }}
          />
          <motion.path
            d="M0,50 Q20,50 30,50 T50,50 T70,50 T90,50 T110,50 T130,30 T150,70 T170,40 T190,60 T210,50 T230,50 T250,45 T270,55 T290,50 T310,50 T330,40 T350,60 T370,50 T390,50 T400,50"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="0.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>
    )
  }
];

export default function Capabilities() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto bg-abyssal-black">
      <div className="mb-16 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-bold font-sans text-white mb-4 uppercase tracking-tighter">
          Operational Capabilities
        </h2>
        <p className="font-mono text-gray-400 max-w-2xl text-sm md:text-base md:mx-0 mx-auto">
          Engineered for the harshest environments on Earth. Our technology stack ensures uninterrupted global connectivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px]">
        {capabilities.map((cap, i) => (
          <motion.div
            key={cap.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onHoverStart={() => setHoveredIndex(i)}
            onHoverEnd={() => setHoveredIndex(null)}
            className={`
              group relative overflow-hidden rounded-xl border border-white/10 bg-deep-ocean/50 p-8
              transition-all duration-500 ease-out
              ${cap.colSpan} ${cap.rowSpan}
              ${cap.mobileOrder ? `md:order-none order-last` : ''}
              ${hoveredIndex !== null && hoveredIndex !== i ? 'opacity-40 scale-[0.98]' : 'opacity-100'}
              hover:border-biolum-cyan/50 hover:box-glow
            `}
          >
            {/* Background Visual */}
            {cap.visual}

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="p-3 bg-abyssal-black/80 rounded-lg w-fit border border-white/5 backdrop-blur-sm">
                {cap.icon}
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold font-sans text-white mb-2 group-hover:text-biolum-cyan transition-colors">
                  {cap.title}
                </h3>
                <p className="font-mono text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {cap.description}
                </p>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-biolum-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-biolum-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
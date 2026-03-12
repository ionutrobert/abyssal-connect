'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const mockData = [
  "VESSEL-01: ACTIVE | DEPTH: 3,200m | STATUS: REPAIR",
  "LATENCY: 12ms | PACKET LOSS: 0.00%",
  "NODE-7A: ONLINE | TEMP: 2.4°C | PRESSURE: 412atm",
  "ROV-ALPHA: DEPLOYED | TETHER: 1,500m | POWER: 98%",
  "CABLE-ATLANTIC: SECURE | BANDWIDTH: 144Tbps",
];

export default function LiveStatus() {
  const tickerText = `${mockData.join(' // ')} // ${mockData.join(' // ')}`;

  return (
    <div className="w-full bg-black border-y border-biolum-cyan/30 py-2 overflow-hidden flex items-center">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
          className="font-mono text-biolum-cyan text-xs md:text-sm tracking-widest uppercase"
        >
          {tickerText}
        </motion.div>
      </div>
    </div>
  );
}

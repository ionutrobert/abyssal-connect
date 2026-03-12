'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: unknown & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-abyssal-black flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold text-biolum-cyan mb-4">SYSTEM ERROR</h2>
      <p className="font-mono text-gray-400 mb-6">Connection disrupted. Attempting recovery...</p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-6 py-3 border border-biolum-cyan text-biolum-cyan font-mono hover:bg-biolum-cyan hover:text-abyssal-black transition-colors"
      >
        RECONNECT
      </button>
    </div>
  );
}
'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-abyssal-black flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-biolum-cyan rounded-full animate-ping" />
        <span className="font-mono text-biolum-cyan text-sm tracking-widest animate-pulse">
          INITIALIZING...
        </span>
      </div>
    </div>
  );
}
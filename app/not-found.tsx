import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-abyssal-black flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold text-biolum-cyan mb-4 tracking-tighter">404</h1>
      <p className="font-mono text-gray-400 mb-8">Signal lost. Connection severed.</p>
      <Link
        href="/"
        className="px-8 py-3 border border-biolum-cyan text-biolum-cyan font-mono hover:bg-biolum-cyan hover:text-abyssal-black transition-colors"
      >
        REESTABLISH CONNECTION
      </Link>
    </main>
  );
}
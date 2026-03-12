import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LiveStatus from '@/components/LiveStatus';
import Capabilities from '@/components/Capabilities';
import GlobalMap from '@/components/GlobalMap';
import Footer from '@/components/Footer';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="min-h-screen bg-abyssal-black text-white selection:bg-biolum-cyan selection:text-abyssal-black">
      <Navbar />
      <Hero />
      <LiveStatus />
      <Capabilities />
      <GlobalMap />
      <Footer />
    </main>
  );
}

'use client';

import { useState } from 'react';
import { ShieldCheck, MapPin, Mail, Lock, ArrowRight } from 'lucide-react';
import Modal from './Modal';
import Image from 'next/image';

export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const footerLinks = [
    { label: 'Global Map', href: '/#global-backbone' },
    { label: 'Vessel Tracking', modal: 'vesselTracking' },
    { label: 'Incident Response', modal: 'incidents' },
    { label: 'Careers', modal: 'careers' },
    { label: 'Operations Portal', modal: 'portal' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', modal: 'privacy' },
    { label: 'Terms of Service', modal: 'terms' },
    { label: 'Security', modal: 'security' },
  ];

  return (
    <>
      <footer className="bg-abyssal-black border-t-4 border-biolum-cyan relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, #00F0FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 relative z-10">
          {/* Brand + Operations + Headquarters - stacked on mobile, single row on PC */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Brand section - centered on mobile */}
            <div className="text-center md:text-left md:w-1/3">
              <a href="/" className="inline-flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-lg overflow-hidden">
                  <Image
                    src="/images/logo.png"
                    alt="Abyssal Connect Logo"
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <span className="font-sans font-bold text-lg tracking-widest uppercase text-white">
                  Abyssal Connect
                </span>
              </a>
              <p className="font-mono text-gray-400 text-sm max-w-sm mx-auto md:mx-0 mb-6 leading-relaxed">
                Maintaining the physical infrastructure of the global internet. Deep sea engineering and monitoring solutions across 20+ major submarine cable systems.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-mono border border-gray-800 px-3 py-1 rounded">
                  <ShieldCheck size={14} /> ISO 27001
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs font-mono border border-gray-800 px-3 py-1 rounded">
                  <Lock size={14} /> SOC 2 TYPE II
                </div>
              </div>
            </div>

            {/* Operations and Headquarters - 2 columns on mobile, side-by-side on PC */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 px-4 md:gap-12 md:px-0 md:w-2/3">
              <div className="col-span-1">
              <h4 className="font-sans font-bold text-white uppercase tracking-widest mb-4 md:mb-6 text-sm">
                Operations
              </h4>
              <ul className="space-y-2 md:space-y-4 font-mono text-xs md:text-sm">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        className="flex items-center gap-2 text-gray-400 hover:text-biolum-cyan transition-colors group"
                      >
                        <ArrowRight size={12} className="text-gray-400 group-hover:text-biolum-cyan transition-colors" />
                        {link.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveModal(link.modal || null)}
                        className="flex items-center gap-2 text-gray-400 hover:text-biolum-cyan transition-colors group"
                      >
                        <ArrowRight size={12} className="text-gray-400 group-hover:text-biolum-cyan transition-colors" />
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-sans font-bold text-white uppercase tracking-widest mb-4 md:mb-6 text-sm">
                Headquarters
              </h4>
              <ul className="space-y-2 md:space-y-4 font-mono text-xs md:text-sm text-gray-400">
                <li className="flex items-start gap-2 md:gap-3">
                  <MapPin size={14} className="text-biolum-cyan shrink-0 mt-0.5" />
                  <span className="leading-tight">51°30′N 0°7′W<br />London, UK</span>
                </li>
                <li className="flex items-center gap-2 md:gap-3">
                  <Mail size={14} className="text-biolum-cyan shrink-0" />
                  <a href="mailto:info@abyssal-connect.com" className="hover:text-white transition-colors">info@abyssal-connect.com</a>
                </li>
                <li className="flex items-center gap-2 md:gap-3">
                  <ShieldCheck size={14} className="text-biolum-cyan shrink-0" />
                  <button type="button" onClick={() => setActiveModal('contact')} className="hover:text-white transition-colors">Support</button>
                </li>
              </ul>
            </div>
          </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs text-gray-600">
            <p>© 2026 Abyssal Connect Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              {legalLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => setActiveModal(link.modal)}
                  className="hover:text-gray-400 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        type={activeModal || ''}
      />
    </>
  );
}
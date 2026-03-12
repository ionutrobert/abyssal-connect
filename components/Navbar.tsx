'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import Modal from './Modal';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Capabilities', modal: 'capabilities' },
  { label: 'Global Map', href: '/#global-backbone' },
  { label: 'Careers', modal: 'careers' },
  { label: 'Operations Portal', modal: 'portal' },
  { label: 'Contact', modal: 'contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.modal) {
      setActiveModal(item.modal);
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center transition-all duration-500 ${
          scrolled
            ? 'bg-abyssal-black/80 backdrop-blur-md border-b border-white/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <a href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="Abyssal Connect Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="font-sans font-bold text-xl tracking-widest uppercase text-white">
            Abyssal Connect
          </span>
        </a>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-white hover:text-biolum-cyan transition-colors"
        >
          <Menu size={32} />
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-abyssal-black/95 backdrop-blur-md flex flex-col justify-center items-center"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 text-white hover:text-biolum-cyan transition-colors"
            >
              <X size={48} />
            </button>

            <ul className="flex flex-col gap-8 text-center">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-sans text-4xl md:text-6xl font-bold text-white hover:text-biolum-cyan hover:text-glow transition-all uppercase tracking-tighter block"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNavClick(item)}
                      className="font-sans text-4xl md:text-6xl font-bold text-white hover:text-biolum-cyan hover:text-glow transition-all uppercase tracking-tighter"
                    >
                      {item.label}
                    </button>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        type={activeModal || ''}
      />
    </>
  );
}
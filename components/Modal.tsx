'use client';

import { X, ArrowRight, Ship, Users, Shield, Clock, Wrench, MapPin, Mail, Phone, FileText, Briefcase, Globe, Activity, Lock as LockIcon, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { vessels, incidents, activeVesselsCount, activeIncidentsCount, pendingResolutionCount } from '@/data/operations';
import { useState, useRef } from 'react';
import VesselTrackingMap from './VesselTrackingMap';

function PortalForm() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Login credentials submitted (demo only - no actual authentication)');
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Password reset request submitted. Our team will review your ID and contact you at incidents@abyssal-connect.com');
    setShowForgotPassword(false);
    setFileName('');
  };

  if (showForgotPassword) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg md:rounded-2xl p-4 md:p-8 border border-white/20 text-center">
          <Shield className="w-10 h-10 md:w-16 md:h-16 text-biolum-cyan mx-auto mb-2 md:mb-4" />
          <h4 className="text-white font-bold text-base md:text-xl mb-1 md:mb-2">Password Reset</h4>
          <p className="text-gray-400 text-[10px] md:text-sm max-w-md mx-auto">Provide ID to reset password.</p>
        </div>
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-3 md:space-y-4 max-w-md mx-auto">
          <div>
            <label className="block text-gray-400 text-[10px] md:text-sm mb-1 md:mb-2">Subject</label>
            <input 
              type="text" 
              value="Password Reset Request - Operations Portal" 
              readOnly 
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-2 md:px-4 py-2 md:py-3 text-gray-300 cursor-not-allowed text-[10px] md:text-sm" 
            />
          </div>
          <div>
            <label className="block text-gray-400 text-[10px] md:text-sm mb-1 md:mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="your.email@company.com" 
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-2 md:px-4 py-2 md:py-3 text-white placeholder-gray-500 text-xs md:text-sm focus:outline-none focus:border-biolum-cyan" 
            />
          </div>
          <div>
            <label className="block text-gray-400 text-[10px] md:text-sm mb-1 md:mb-2">ID Upload</label>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden" 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              className="border-2 border-dashed border-white/20 rounded-lg p-4 md:p-8 text-center cursor-pointer hover:border-biolum-cyan/50 hover:bg-white/5 transition-all"
            >
              {fileName ? (
                <div className="flex items-center justify-center gap-2 text-biolum-cyan text-[10px] md:text-sm">
                  <Upload className="w-3 h-3 md:w-5 md:h-5" />
                  <span>{fileName}</span>
                </div>
              ) : (
                <div className="text-gray-400">
                  <Upload className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 opacity-50" />
                  <p className="text-[10px] md:text-sm">Click to upload ID</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 md:gap-3">
            <button 
              type="button"
              onClick={() => { setShowForgotPassword(false); setFileName(''); }}
              className="flex-1 bg-white/10 text-white font-bold py-2 md:py-3 rounded-lg hover:bg-white/20 transition-colors text-xs md:text-base"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-biolum-cyan text-abyssal-black font-bold py-2 md:py-3 rounded-lg hover:bg-cyan-400 transition-colors text-xs md:text-base"
            >
              Submit
            </button>
          </div>
        </form>
        <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/10">
          <p className="text-gray-400 text-[9px] md:text-xs text-center">Contact incidents@abyssal-connect.com for urgent matters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg md:rounded-2xl p-4 md:p-8 border border-white/20 text-center">
        <Shield className="w-10 h-10 md:w-16 md:h-16 text-biolum-cyan mx-auto mb-2 md:mb-4" />
        <h4 className="text-white font-bold text-base md:text-xl mb-1 md:mb-2">Secure Access</h4>
        <p className="text-gray-400 text-[10px] md:text-sm max-w-md mx-auto">Confidential operational data. Restricted access.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 max-w-md mx-auto">
        <input type="email" placeholder="Email address" className="w-full bg-white/10 border border-white/20 rounded-lg px-2 md:px-4 py-2 md:py-3 text-white placeholder-gray-500 text-xs md:text-sm focus:outline-none focus:border-biolum-cyan" />
        <input type="password" placeholder="Password" className="w-full bg-white/10 border border-white/20 rounded-lg px-2 md:px-4 py-2 md:py-3 text-white placeholder-gray-500 text-xs md:text-sm focus:outline-none focus:border-biolum-cyan" />
        <button type="submit" className="w-full bg-biolum-cyan text-abyssal-black font-bold py-2 md:py-3 rounded-lg hover:bg-cyan-400 transition-colors text-xs md:text-base">Access Portal</button>
      </form>
      <div className="flex justify-center text-[10px] md:text-sm">
        <button 
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-gray-400 hover:text-biolum-cyan transition-colors"
        >
          Forgot password?
        </button>
      </div>
      <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/10">
        <p className="text-gray-400 text-[9px] md:text-xs text-center">All access is logged and monitored.</p>
      </div>
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
}

const modalContent: Record<string, { title: string; subtitle: string; content: React.ReactNode }> = {
  capabilities: {
    title: 'Deep Sea Operations',
    subtitle: 'Subsea Engineering Excellence',
    content: (
      <div className="space-y-4 md:space-y-8">
        <div className="grid grid-cols-2 gap-2 md:gap-6">
          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-6 border border-white/10">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-biolum-cyan/20 rounded-lg flex items-center justify-center mb-2 md:mb-4">
              <Ship className="w-4 h-4 md:w-6 md:h-6 text-biolum-cyan" />
            </div>
            <h4 className="text-white font-bold text-xs md:text-base mb-1 md:mb-2">Vessel Deployment</h4>
            <p className="text-gray-400 text-[10px] md:text-sm leading-tight">Global fleet positioning with 24-hour response capability.</p>
          </div>
          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-6 border border-white/10">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-biolum-cyan/20 rounded-lg flex items-center justify-center mb-2 md:mb-4">
              <Wrench className="w-4 h-4 md:w-6 md:h-6 text-biolum-cyan" />
            </div>
            <h4 className="text-white font-bold text-xs md:text-base mb-1 md:mb-2">Cable Repair</h4>
            <p className="text-gray-400 text-[10px] md:text-sm leading-tight">Emergency fault localization and repair.</p>
          </div>
          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-6 border border-white/10">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-biolum-cyan/20 rounded-lg flex items-center justify-center mb-2 md:mb-4">
              <Globe className="w-4 h-4 md:w-6 md:h-6 text-biolum-cyan" />
            </div>
            <h4 className="text-white font-bold text-xs md:text-base mb-1 md:mb-2">Route Survey</h4>
            <p className="text-gray-400 text-[10px] md:text-sm leading-tight">Pre-lay survey and post-lay inspection.</p>
          </div>
          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-6 border border-white/10">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-biolum-cyan/20 rounded-lg flex items-center justify-center mb-2 md:mb-4">
              <Activity className="w-4 h-4 md:w-6 md:h-6 text-biolum-cyan" />
            </div>
            <h4 className="text-white font-bold text-xs md:text-base mb-1 md:mb-2">24/7 Monitoring</h4>
            <p className="text-gray-400 text-[10px] md:text-sm leading-tight">Real-time cable health monitoring.</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-biolum-cyan/10 to-transparent rounded-lg md:rounded-xl p-3 md:p-6 border border-biolum-cyan/30">
          <h4 className="text-biolum-cyan font-bold text-xs md:text-base mb-2 md:mb-3">Operational Coverage</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm">
            <div><span className="text-gray-500">Atlantic:</span> <span className="text-white">24/7</span></div>
            <div><span className="text-gray-500">Pacific:</span> <span className="text-white">24/7</span></div>
            <div><span className="text-gray-500">Indian:</span> <span className="text-white">12h</span></div>
            <div><span className="text-gray-500">Mediterran:</span> <span className="text-white">6h</span></div>
          </div>
        </div>
      </div>
    )
  },
  careers: {
    title: 'Join Our Team',
    subtitle: 'Build the Internet Beneath the Waves',
    content: (
      <div className="space-y-4 md:space-y-8">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {['Marine Eng.', 'ROV Ops', 'Cable Splicing', 'Survey', 'Project Mgmt'].map((tag) => (
            <span key={tag} className="px-2 py-1 md:px-4 md:py-2 bg-biolum-cyan/20 text-biolum-cyan rounded-full text-[10px] md:text-sm border border-biolum-cyan/30">{tag}</span>
          ))}
        </div>
        <div className="space-y-2 md:space-y-4">
          {[
            { title: 'Senior ROV Pilot', location: 'London, UK', type: 'Full-time', depth: '500m+', salary: '£75k - £95k' },
            { title: 'Subsea Cable Eng.', location: 'Singapore', type: 'Full-time', depth: '4000m+', salary: '$90k - $120k' },
            { title: 'Marine Surveyor', location: 'Houston, TX', type: 'Contract', depth: '3000m+', salary: '$80k - $100k' },
            { title: 'Fusion Splicing Tech', location: 'Mumbai', type: 'Full-time', depth: 'Shallow', salary: '₹12L - ₹18L' },
          ].map((job, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-5 border border-white/10 hover:border-biolum-cyan/50 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-2 md:mb-3">
                <div>
                  <h4 className="text-white font-bold text-xs md:text-base group-hover:text-biolum-cyan transition-colors">{job.title}</h4>
                  <p className="text-gray-400 text-[10px] md:text-sm flex items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                    <MapPin className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" /> {job.location}
                  </p>
                </div>
                <ArrowRight className="text-biolum-cyan opacity-0 group-hover:opacity-100 transition-opacity w-3.5 h-3.5 md:w-5 md:h-5" />
              </div>
              <div className="flex gap-2 md:gap-4 text-[9px] md:text-xs text-gray-500">
                <span>{job.depth}</span>
                <span>{job.salary}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-6 border border-white/10">
          <h4 className="text-white font-bold text-xs md:text-base mb-2 md:mb-4">Why Abyssal Connect?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-[10px] md:text-sm">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0"><Shield className="w-3 h-3 md:w-4 md:h-4 text-green-500" /></div>
              <div><p className="text-white font-medium">Training</p><p className="text-gray-400">Certification</p></div>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0"><Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-500" /></div>
              <div><p className="text-white font-medium">Rotation</p><p className="text-gray-400">4/4 schedule</p></div>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0"><Users className="w-3 h-3 md:w-4 md:h-4 text-purple-500" /></div>
              <div><p className="text-white font-medium">Global</p><p className="text-gray-400">200+ people</p></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  vessels: {
    title: 'Fleet Operations',
    subtitle: 'Real-Time Vessel Tracking',
    content: (
      <div className="space-y-4 md:space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {vessels.map((vessel) => (
            <motion.div key={vessel.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 rounded-lg md:rounded-xl p-2 md:p-5 border border-white/10">
              <div className="flex items-center justify-between mb-1 md:mb-3">
                <Ship className="w-4 h-4 md:w-8 md:h-8 text-biolum-cyan" />
                <span className={`px-1 md:px-2 py-0.5 md:py-1 rounded text-[8px] md:text-xs ${vessel.status === 'Active' ? 'bg-green-500/20 text-green-400' : vessel.status === 'Maintenance' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>{vessel.status}</span>
              </div>
              <h4 className="text-white font-bold text-[10px] md:text-base">{vessel.name}</h4>
              <p className="text-gray-400 text-[9px] md:text-sm mt-0.5 md:mt-1">{vessel.location}</p>
              <p className="text-biolum-cyan text-[8px] md:text-xs mt-1 md:mt-2">{vessel.task}</p>
            </motion.div>
          ))}
        </div>
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg md:rounded-2xl p-3 md:p-8 border border-white/20">
          <h4 className="text-white font-bold text-xs md:text-xl mb-3 md:mb-6 flex items-center gap-1 md:gap-2"><MapPin className="w-3 h-3 md:w-5 md:h-5 text-biolum-cyan" /> Live Fleet Map</h4>
          <div className="aspect-video bg-deep-ocean/30 rounded-lg md:rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #00F0FF 2px, transparent 2px), radial-gradient(circle at 70% 60%, #00F0FF 2px, transparent 2px), radial-gradient(circle at 50% 70%, #00F0FF 2px, transparent 2px)', backgroundSize: '100px 100px' }} />
            <div className="text-center p-2">
              <Globe className="w-8 h-8 md:w-16 md:h-16 text-biolum-cyan/50 mx-auto mb-2 md:mb-4" />
              <p className="text-gray-400 text-[10px] md:text-base">Login for real-time data</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
          <div className="bg-white/5 rounded-lg md:rounded-xl p-2 md:p-4 border border-white/10">
            <p className="text-lg md:text-3xl font-bold text-white">{activeVesselsCount}</p>
            <p className="text-gray-400 text-[9px] md:text-sm">Active</p>
          </div>
          <div className="bg-white/5 rounded-lg md:rounded-xl p-2 md:p-4 border border-white/10">
            <p className="text-lg md:text-3xl font-bold text-white">{activeIncidentsCount}</p>
            <p className="text-gray-400 text-[9px] md:text-sm">Incidents</p>
          </div>
          <div className="bg-white/5 rounded-lg md:rounded-xl p-2 md:p-4 border border-white/10">
            <p className="text-lg md:text-3xl font-bold text-white">{Math.round((activeVesselsCount / vessels.length) * 100)}%</p>
            <p className="text-gray-400 text-[9px] md:text-sm">Available</p>
          </div>
        </div>
      </div>
    )
  },
  incidents: {
    title: 'Incident Response',
    subtitle: '24/7 Fault Management Center',
    content: (
      <div className="space-y-4 md:space-y-8">
        <div className="flex gap-1 md:gap-4 mb-2 md:mb-6">
          <div className="flex-1 bg-green-500/20 rounded-lg md:rounded-xl p-2 md:p-4 border border-green-500/30">
            <p className="text-lg md:text-3xl font-bold text-green-400">{activeIncidentsCount}</p>
            <p className="text-gray-400 text-[9px] md:text-sm">Active</p>
          </div>
          <div className="flex-1 bg-yellow-500/20 rounded-lg md:rounded-xl p-2 md:p-4 border border-yellow-500/30">
            <p className="text-lg md:text-3xl font-bold text-yellow-400">{pendingResolutionCount}</p>
            <p className="text-gray-400 text-[9px] md:text-sm">Pending</p>
          </div>
          <div className="flex-1 bg-blue-500/20 rounded-lg md:rounded-xl p-2 md:p-4 border border-blue-500/30">
            <p className="text-lg md:text-3xl font-bold text-blue-400">{incidents.filter(i => i.status === 'Resolved').length}</p>
            <p className="text-gray-400 text-[9px] md:text-sm">Resolved</p>
          </div>
        </div>
        <div className="space-y-2 md:space-y-3">
          {incidents.map((incident, i) => (
            <motion.div key={incident.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/5 rounded-lg md:rounded-xl p-2 md:p-4 border border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-4">
                <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${incident.severity === 'high' ? 'bg-red-500' : incident.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <div>
                  <p className="text-white font-mono text-[10px] md:text-sm">{incident.id}</p>
                  <p className="text-gray-400 text-[9px] md:text-sm">{incident.cable}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-biolum-cyan text-[9px] md:text-sm">{incident.status}</p>
                <p className="text-gray-500 text-[8px] md:text-xs">ETA: {incident.eta}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-6 border border-white/10">
          <h4 className="text-white font-bold text-xs md:text-base mb-2 md:mb-4">Deployed Vessels</h4>
          <div className="space-y-1 md:space-y-2">
            {incidents.filter(i => i.vesselId).map(incident => {
              const vessel = vessels.find(v => v.id === incident.vesselId);
              return (
                <div key={incident.id} className="flex items-center justify-between text-[10px] md:text-sm">
                  <div className="flex items-center gap-1 md:gap-2">
                    <Ship className="w-3 h-3 md:w-4 md:h-4 text-biolum-cyan" />
                    <span className="text-white">{vessel?.name}</span>
                  </div>
                  <span className="text-gray-400 text-[8px] md:text-xs">{incident.id}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-6 border border-white/10">
          <h4 className="text-white font-bold text-xs md:text-base mb-2 md:mb-4">Emergency Contact</h4>
          <p className="text-gray-400 text-[10px] md:text-sm mb-2 md:mb-4">For immediate cable fault reporting.</p>
          <div className="flex flex-wrap gap-2 md:gap-4">
            <a href="tel:+442012345678" className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 bg-biolum-cyan/20 text-biolum-cyan rounded-lg border border-biolum-cyan/30 hover:bg-biolum-cyan/30 transition-colors text-[10px] md:text-sm">
              <Phone className="w-3 h-3 md:w-4 md:h-4" /> +44 20 7946 0958
            </a>
            <a href="mailto:fmoc@abyssal-connect.com" className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors text-[10px] md:text-sm">
              <Mail className="w-3 h-3 md:w-4 md:h-4" /> fmoc@abyssal-connect.com
            </a>
          </div>
        </div>
      </div>
    )
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'Global Support Network',
    content: (
      <div className="space-y-4 md:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-6 border border-white/10">
            <h4 className="text-white font-bold text-xs md:text-base mb-2 md:mb-4 flex items-center gap-1 md:gap-2"><MapPin className="w-3 h-3 md:w-5 md:h-5 text-biolum-cyan" /> London HQ</h4>
            <div className="space-y-1 md:space-y-3 text-gray-400 text-[10px] md:text-sm">
              <p>Maritime House</p>
              <p>London E1W 1AN</p>
              <p>United Kingdom</p>
            </div>
            <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-white/10">
              <p className="text-gray-500 text-[8px] md:text-xs">Main Office</p>
              <p className="text-white text-xs md:text-base">+44 20 7946 0950</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-6 border border-white/10">
            <h4 className="text-white font-bold text-xs md:text-base mb-2 md:mb-4 flex items-center gap-1 md:gap-2"><MapPin className="w-3 h-3 md:w-5 md:h-5 text-biolum-cyan" /> Singapore Hub</h4>
            <div className="space-y-1 md:space-y-3 text-gray-400 text-[10px] md:text-sm">
              <p>Oceanic Tower</p>
              <p>Singapore 018981</p>
            </div>
            <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-white/10">
              <p className="text-gray-500 text-[8px] md:text-xs">Asia Pacific</p>
              <p className="text-white text-xs md:text-base">+65 6622 8800</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <a href="mailto:info@abyssal-connect.com" className="bg-white/5 rounded-lg md:rounded-xl p-2 md:p-5 border border-white/10 hover:border-biolum-cyan/50 transition-all group text-center">
            <Mail className="w-4 h-4 md:w-8 md:h-8 text-biolum-cyan mx-auto mb-1 md:mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-bold text-[10px] md:text-base">Info</h4>
          </a>
          <a href="mailto:operations@abyssal-connect.com" className="bg-white/5 rounded-lg md:rounded-xl p-2 md:p-5 border border-white/10 hover:border-biolum-cyan/50 transition-all group text-center">
            <Shield className="w-4 h-4 md:w-8 md:h-8 text-biolum-cyan mx-auto mb-1 md:mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-bold text-[10px] md:text-base">Ops</h4>
          </a>
          <a href="mailto:careers@abyssal-connect.com" className="bg-white/5 rounded-lg md:rounded-xl p-2 md:p-5 border border-white/10 hover:border-biolum-cyan/50 transition-all group text-center">
            <Briefcase className="w-4 h-4 md:w-8 md:h-8 text-biolum-cyan mx-auto mb-1 md:mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-bold text-[10px] md:text-base">Careers</h4>
          </a>
        </div>
        <form className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-6 border border-white/10 space-y-2 md:space-y-4">
          <h4 className="text-white font-bold text-xs md:text-base">Send us a message</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <input type="text" placeholder="Your name" className="bg-white/10 border border-white/20 rounded-lg px-2 md:px-4 py-2 md:py-3 text-white placeholder-gray-500 text-xs md:text-sm focus:outline-none focus:border-biolum-cyan" />
            <input type="email" placeholder="Email address" className="bg-white/10 border border-white/20 rounded-lg px-2 md:px-4 py-2 md:py-3 text-white placeholder-gray-500 text-xs md:text-sm focus:outline-none focus:border-biolum-cyan" />
          </div>
          <select className="w-full bg-white/10 border border-white/20 rounded-lg px-2 md:px-4 py-2 md:py-3 text-white text-xs md:text-sm focus:outline-none focus:border-biolum-cyan [&>option]:bg-abyssal-black">
            <option>General Inquiry</option>
            <option>Commercial Services</option>
            <option>Technical Support</option>
            <option>Career Opportunity</option>
            <option>Media & Press</option>
          </select>
          <textarea placeholder="Your message" rows={3} className="w-full bg-white/10 border border-white/20 rounded-lg px-2 md:px-4 py-2 md:py-3 text-white placeholder-gray-500 text-xs md:text-sm focus:outline-none focus:border-biolum-cyan resize-none" />
          <button type="submit" className="w-full bg-biolum-cyan text-abyssal-black font-bold py-2 md:py-3 rounded-lg hover:bg-cyan-400 transition-colors text-xs md:text-base">Send Message</button>
        </form>
      </div>
    )
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Data Protection & Privacy',
    content: (
      <div className="space-y-6 text-gray-300 text-sm leading-relaxed max-h-96 overflow-y-auto pr-4">
        <p>Last updated: January 2026</p>
        <h4 className="text-white font-bold mt-4">1. Introduction</h4>
        <p>Abyssal Connect Ltd is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you visit our website or use our services.</p>
        <h4 className="text-white font-bold mt-4">2. Information We Collect</h4>
        <p>We may collect personal information including name, email address, phone number, and company details when you contact us or use our services. We also collect anonymous usage data through cookies and analytics.</p>
        <h4 className="text-white font-bold mt-4">3. How We Use Your Information</h4>
        <p>Your information is used to provide our services, communicate with you about cable operations, process job applications, and improve our website and services.</p>
        <h4 className="text-white font-bold mt-4">4. Data Security</h4>
        <p>We implement industry-standard security measures to protect your data. Our systems are ISO 27001 certified and undergo regular security audits.</p>
        <h4 className="text-white font-bold mt-4">5. Third-Party Disclosure</h4>
        <p>We do not sell or trade your personal information. We may share data with trusted service providers who assist in our operations, bound by confidentiality agreements.</p>
        <h4 className="text-white font-bold mt-4">6. Your Rights</h4>
        <p>You have the right to access, correct, or delete your personal information. Contact us at privacy@abyssal-connect.com to exercise these rights.</p>
      </div>
    )
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'Usage Agreement',
    content: (
      <div className="space-y-6 text-gray-300 text-sm leading-relaxed max-h-96 overflow-y-auto pr-4">
        <p>Last updated: January 2026</p>
        <h4 className="text-white font-bold mt-4">1. Acceptance of Terms</h4>
        <p>By accessing and using this website, you accept and agree to be bound by these terms of service. If you do not agree, please do not use this website.</p>
        <h4 className="text-white font-bold mt-4">2. Use of Content</h4>
        <p>All content on this website is the property of Abyssal Connect Ltd and is protected by copyright laws. You may not reproduce, distribute, or modify any content without our written consent.</p>
        <h4 className="text-white font-bold mt-4">3. Disclaimer</h4>
        <p>This website provides general information about our services. We make no warranties about the accuracy or completeness of this information. Actual services and capabilities may vary.</p>
        <h4 className="text-white font-bold mt-4">4. Limitation of Liability</h4>
        <p>Abyssal Connect shall not be liable for any damages arising from your use of this website or our services. This includes direct, indirect, incidental, and consequential damages.</p>
        <h4 className="text-white font-bold mt-4">5. Governing Law</h4>
        <p>These terms are governed by the laws of England and Wales. Any disputes shall be resolved in the courts of London.</p>
      </div>
    )
  },
  security: {
    title: 'Security Practices',
    subtitle: 'Information Security',
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <Shield className="w-10 h-10 text-biolum-cyan mb-4" />
            <h4 className="text-white font-bold mb-2">ISO 27001 Certified</h4>
            <p className="text-gray-400 text-sm">Our information security management system meets international standards for protecting corporate and customer data.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <LockIcon className="w-10 h-10 text-biolum-cyan mb-4" />
            <h4 className="text-white font-bold mb-2">SOC 2 Type II</h4>
            <p className="text-gray-400 text-sm">Annual audits verify our controls for security, availability, and confidentiality of customer data.</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="text-white font-bold mb-4">Security Measures</h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-start gap-3"><span className="text-biolum-cyan">✓</span> End-to-end encryption for all sensitive communications</li>
            <li className="flex items-start gap-3"><span className="text-biolum-cyan">✓</span> Multi-factor authentication for internal systems</li>
            <li className="flex items-start gap-3"><span className="text-biolum-cyan">✓</span> Regular penetration testing and vulnerability assessments</li>
            <li className="flex items-start gap-3"><span className="text-biolum-cyan">✓</span> 24/7 security monitoring and incident response</li>
            <li className="flex items-start gap-3"><span className="text-biolum-cyan">✓</span> Secure cable infrastructure with tamper-evident systems</li>
          </ul>
        </div>
        <div className="bg-gradient-to-r from-green-500/10 to-biolum-cyan/10 rounded-xl p-6 border border-green-500/30">
          <h4 className="text-white font-bold mb-2">Report a Security Concern</h4>
          <p className="text-gray-400 text-sm mb-4">If you believe you have discovered a security vulnerability, please contact our security team immediately.</p>
          <a href="mailto:security@abyssal-connect.com" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
            <Mail size={16} /> security@abyssal-connect.com
          </a>
        </div>
      </div>
    )
  },
  portal: {
    title: 'Operations Portal',
    subtitle: 'Authorized Personnel Only',
    content: <PortalForm />
  },
  vesselTracking: {
    title: 'Live Fleet Tracking',
    subtitle: 'Real-Time Vessel Map',
    content: (
      <div className="space-y-4 md:space-y-6">
        <div className="text-gray-300 text-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-biolum-cyan" />
            <p>Real-time positioning of fleet vessels mapped against incident locations.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-4 text-center mb-4">
            <div className="bg-white/5 rounded-lg p-2 md:p-3 border border-white/10">
              <p className="text-lg md:text-2xl font-bold text-green-400">{vessels.filter(v => v.status === 'Active').length}</p>
              <p className="text-gray-400 text-[9px] md:text-xs">Deployed</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 md:p-3 border border-white/10">
              <p className="text-lg md:text-2xl font-bold text-yellow-400">{vessels.filter(v => v.status === 'Maintenance').length}</p>
              <p className="text-gray-400 text-[9px] md:text-xs">Maintenance</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 md:p-3 border border-white/10">
              <p className="text-lg md:text-2xl font-bold text-gray-400">{vessels.filter(v => v.status === 'Docked').length}</p>
              <p className="text-gray-400 text-[9px] md:text-xs">Docked</p>
            </div>
          </div>
        </div>
        <VesselTrackingMap />
      </div>
    )
  }
};

export default function Modal({ isOpen, onClose, type }: ModalProps) {
  const content = modalContent[type];

  if (!content) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-abyssal-black/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden bg-abyssal-black/95 border border-white/20 rounded-2xl shadow-2xl flex flex-col"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 bg-abyssal-black/95 backdrop-blur-md z-10 border-b border-white/10 px-4 py-3 md:px-8 md:pt-6 md:pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-biolum-cyan text-xs md:text-sm font-mono uppercase tracking-widest mb-0.5 md:mb-1">{content.subtitle}</p>
                  <h2 className="text-xl md:text-3xl font-bold text-white">{content.title}</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors shrink-0">
                  <X className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </div>
            </div>
            {/* Scrollable Content */}
            <div className="overflow-y-auto p-4 md:p-8 pt-3 md:pt-6 flex-1">
              {content.content}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
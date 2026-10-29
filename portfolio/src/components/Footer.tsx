import React from 'react';
import { 
  Database, 
  ArrowUp, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Globe, 
  CheckCircle2,
  Heart
} from 'lucide-react';
import { personalInfo } from '../data/personalInfo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#02040a] border-t border-white/10 pt-16 pb-12 overflow-hidden text-xs font-mono">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-brand-purple/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-purple p-[1px]">
                <div className="w-full h-full bg-[#030712] rounded-[11px] flex items-center justify-center">
                  <Database className="w-5 h-5 text-brand-cyan" />
                </div>
              </div>
              <div>
                <span className="font-display font-bold text-base text-white tracking-tight">
                  Sudheer Kumar Reddy Ankireddypalli
                </span>
                <span className="block text-[11px] text-brand-cyan">
                  Aspiring Data Analyst • Freelance Analytics Consultant
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Helping businesses discover patterns, reduce margin leakages, and automate reporting using Python, SQL, Excel, and Power BI. Grounded in integrity, verifiable numbers, and transparent assumptions.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-brand-purple-light" />
              <span>Hyderabad, Telangana, India (IST UTC+5:30)</span>
            </div>
          </div>

          {/* Quick Nav Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#home" className="hover:text-brand-cyan transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-brand-cyan transition-colors">Professional About</a></li>
              <li><a href="#projects" className="hover:text-brand-cyan transition-colors">Verified Case Studies</a></li>
              <li><a href="#dashboard" className="hover:text-brand-cyan transition-colors">Interactive BI Dashboard</a></li>
              <li><a href="#services" className="hover:text-brand-cyan transition-colors">Analytics Services</a></li>
              <li><a href="#pricing" className="hover:text-brand-cyan transition-colors">Indicative Pricing</a></li>
              <li><a href="#process" className="hover:text-brand-cyan transition-colors">Delivery Process</a></li>
              <li><a href="#skills" className="hover:text-brand-cyan transition-colors">Applied Skills</a></li>
              <li><a href="#contact" className="hover:text-brand-cyan transition-colors">Contact &amp; Inquiries</a></li>
            </ul>
          </div>

          {/* Custom Domain & Verification (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Deployment &amp; Domain
            </div>
            
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Globe className="w-4 h-4 text-brand-cyan" />
                <span className="font-bold">{personalInfo.preferredDomain}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Configured for custom-domain deployment with SSL / HTTPS. Alternative: <span className="text-slate-300">{personalInfo.alternativeDomain}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={personalInfo.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={personalInfo.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${personalInfo.contact.email}`}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Strip: Dynamic Copyright & Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {currentYear} Sudheer Kumar Reddy Ankireddypalli. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Built with React, TypeScript &amp; Three.js</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

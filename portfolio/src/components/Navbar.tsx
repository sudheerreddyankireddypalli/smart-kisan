import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Database, ChevronRight } from 'lucide-react';
import { personalInfo } from '../data/personalInfo';

interface NavbarProps {
  onHireMeClick: () => void;
  onResumeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onHireMeClick, onResumeClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check current section
      const sections = ['home', 'about', 'projects', 'dashboard', 'services', 'pricing', 'process', 'skills', 'contact'];
      const scrollPosition = window.scrollY + 180;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Live BI Demo', href: '#dashboard' },
    { name: 'Services', href: '#services' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Process', href: '#process' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            className="group flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 rounded-lg p-1"
            aria-label="Sudheer Portfolio Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan via-brand-purple to-blue-600 p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-glow-cyan">
              <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                <Database className="w-5 h-5 text-brand-cyan group-hover:text-brand-purple-light transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                Sudheer <span className="text-brand-cyan font-mono text-sm">.data</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 -mt-0.5 tracking-wider uppercase">
                Analytics &amp; BI
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0b1329]/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-purple/30 to-brand-cyan/30 text-white font-semibold border border-brand-cyan/40 shadow-glow-cyan'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onResumeClick}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-white/10 hover:border-brand-purple/40 rounded-full transition-all duration-200 hover:bg-white/5 cursor-pointer"
            >
              Resume
            </button>
            <button
              onClick={onHireMeClick}
              className="relative group overflow-hidden px-4 py-2 rounded-full font-medium text-xs text-white bg-gradient-to-r from-brand-purple via-indigo-600 to-brand-cyan shadow-glow-purple hover:shadow-glow-mixed transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <span>Hire Me</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="sm:hidden bg-[#030712]/98 border-b border-white/10 px-4 pt-4 pb-6 space-y-2 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs text-emerald-400 font-mono">Available in Hyderabad / Remote</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link.href)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:text-white hover:bg-white/5 font-medium transition-colors text-left"
            >
              <span>{link.name}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          ))}

          <div className="pt-4 grid grid-cols-2 gap-2 border-t border-white/10">
            <button
              onClick={() => {
                setIsOpen(false);
                onResumeClick();
              }}
              className="w-full py-2.5 text-center text-xs font-medium text-slate-300 border border-white/15 rounded-lg hover:bg-white/5"
            >
              View Resume
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onHireMeClick();
              }}
              className="w-full py-2.5 text-center text-xs font-medium text-white bg-gradient-to-r from-brand-purple to-brand-cyan rounded-lg shadow-glow-cyan"
            >
              Hire Me
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

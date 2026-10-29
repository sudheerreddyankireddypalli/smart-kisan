import React from 'react';
import { 
  Sparkles, 
  Table, 
  Database, 
  Code, 
  LayoutDashboard, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { servicesData } from '../data/servicesData';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-brand-cyan" />;
      case 'Table': return <Table className="w-5 h-5 text-emerald-400" />;
      case 'Database': return <Database className="w-5 h-5 text-brand-purple-light" />;
      case 'Code': return <Code className="w-5 h-5 text-blue-400" />;
      case 'LayoutDashboard': return <LayoutDashboard className="w-5 h-5 text-amber-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-rose-400" />;
      default: return <Briefcase className="w-5 h-5 text-brand-cyan" />;
    }
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Practical Small Business Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Data Analytics Services for{' '}
            <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-pink-400 bg-clip-text text-transparent">
              Growing Businesses
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Targeted freelance analytics services designed to help local business owners, operators, and startup founders make confident, data-backed decisions.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="group rounded-3xl bg-[#081024]/85 border border-white/10 hover:border-brand-cyan/40 backdrop-blur-xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-brand-cyan/10 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIcon(service.icon)}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {service.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-display text-white group-hover:text-brand-cyan transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Business Value Box */}
                <div className="mt-5 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[11px] font-mono text-brand-purple-light uppercase tracking-wider font-semibold mb-1">
                    Why It Matters To Your Business
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {service.businessValue}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="mt-5 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Expected Deliverables:
                  </div>
                  {service.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer & Functional CTA */}
              <div className="mt-7 pt-5 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono text-slate-500">Indicative Scope</div>
                  <div className="text-xs font-mono font-bold text-slate-200">{service.basePrice}</div>
                </div>

                <button
                  onClick={() => onSelectService(service.title)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-cyan/20 to-blue-600/20 hover:from-brand-cyan hover:to-blue-600 border border-brand-cyan/40 hover:border-transparent text-xs font-mono font-bold text-brand-cyan hover:text-slate-950 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <span>Discuss Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#0c152e] to-[#070d1e] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-bold text-white font-display">Need a custom analytics workflow?</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Have a messy custom database or irregular spreadsheet structure? I can inspect a 10-row sample and recommend the exact analytical scope.
            </p>
          </div>
          <button
            onClick={() => onSelectService('Custom Scope Inquiry')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono font-bold text-white whitespace-nowrap transition-colors cursor-pointer"
          >
            Request Free Data Inspection
          </button>
        </div>

      </div>
    </section>
  );
};

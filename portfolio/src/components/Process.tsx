import React from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  FileCheck, 
  MessageSquare,
  Lock,
  Search,
  Sparkles
} from 'lucide-react';
import { processSteps, processGuarantees } from '../data/processData';

export const Process: React.FC = () => {
  return (
    <section id="process" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono mb-4">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Structured Client Engagement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Predictable 8-Step{' '}
            <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-pink-400 bg-clip-text text-transparent">
              Delivery Process
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            From initial business alignment to verified calculation handover. Every milestone is transparent, documented, and built on clear acceptance criteria.
          </p>
        </div>

        {/* 8-Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {processSteps.map((step) => (
            <div
              key={step.step}
              className="rounded-2xl bg-[#081024]/85 border border-white/10 hover:border-brand-purple/40 backdrop-blur-xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative"
            >
              {/* Step Number & Duration Indicator */}
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-purple text-slate-950 font-bold font-mono text-xs flex items-center justify-center">
                    0{step.step}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-purple-light" />
                    <span>{step.duration}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold font-display text-white group-hover:text-brand-cyan transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Tangible Output Deliverable */}
              <div className="mt-5 pt-3 border-t border-white/10">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                  Tangible Milestone:
                </div>
                <div className="text-xs font-mono text-emerald-400 flex items-start gap-1.5 leading-snug">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{step.deliverable}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* 4 Guarantees Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {processGuarantees.map((g, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs font-bold font-mono text-brand-cyan uppercase tracking-wide mb-1">
                {g.title}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {g.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { 
  Check, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  Clock, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { pricingPackages, pricingDisclaimer } from '../data/pricingData';

interface PricingProps {
  onSelectPackage: (packageName: string, budgetRange: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPackage }) => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-[#030712]/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple-light text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Indicative Packages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Clear, Realistic{' '}
            <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-pink-400 bg-clip-text text-transparent">
              Project Pricing
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Proposed starting rates for small business analytics projects. Grounded in transparent scope without hidden fees or synthetic guarantees.
          </p>
        </div>

        {/* 3 Main Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {pricingPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                pkg.highlighted
                  ? 'bg-gradient-to-b from-[#0c152e] to-[#080d1e] border-2 border-brand-purple shadow-2xl shadow-brand-purple/20 -translate-y-2'
                  : 'bg-[#081024]/85 border border-white/10 hover:border-white/25'
              }`}
            >
              {/* Highlight badge for Business Insights */}
              {pkg.highlighted && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-brand-purple to-indigo-600 text-white text-[11px] font-mono font-bold px-4 py-1 rounded-bl-xl shadow-md">
                  Most Popular Scope
                </div>
              )}

              <div>
                {/* Package Name & Price */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold font-display text-white">{pkg.name}</h3>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                      {pkg.priceRange}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/ project</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-cyan mt-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 pb-5 border-b border-white/10 leading-relaxed">
                  {pkg.tagline}
                </p>

                {/* Best For */}
                <div className="my-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                  <span className="font-mono text-slate-400 font-bold block mb-0.5">Best For:</span>
                  {pkg.bestFor}
                </div>

                {/* Features List */}
                <div className="space-y-2.5 my-6">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    What's Included:
                  </div>
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => onSelectPackage(pkg.name, pkg.priceRange)}
                  className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    pkg.highlighted
                      ? 'bg-gradient-to-r from-brand-purple to-brand-cyan hover:from-purple-500 hover:to-cyan-400 text-white shadow-glow-purple'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  <span>Select {pkg.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Transparent Pricing Disclaimer Card */}
        <div className="rounded-2xl bg-[#091124] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <h4 className="text-base font-bold font-display text-white">
              {pricingDisclaimer.heading}
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
            {pricingDisclaimer.points.map((point, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0 mt-1.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

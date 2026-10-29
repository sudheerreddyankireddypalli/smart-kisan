import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  LineChart, 
  PieChart, 
  Lightbulb, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Terminal, 
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { personalInfo } from '../data/personalInfo';

export const About: React.FC = () => {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);

  const workflowSteps = [
    {
      id: 1,
      title: "Learn",
      icon: Compass,
      color: "from-blue-500 to-cyan-500",
      accent: "text-cyan-400",
      subtitle: "Understand The Business Context",
      details: "Before writing any code or query, I meet with stakeholders to identify the business objective, define critical KPIs, understand current bottlenecks, and set clear success criteria."
    },
    {
      id: 2,
      title: "Explore",
      icon: Search,
      color: "from-cyan-500 to-teal-500",
      accent: "text-teal-400",
      subtitle: "Audit Data Quality & Distributions",
      details: "I inspect raw records for missing fields, inconsistent data types, duplicates, and outliers using Python (Pandas) and SQL. I formulate an audit roadmap before touching numbers."
    },
    {
      id: 3,
      title: "Analyze",
      icon: LineChart,
      color: "from-teal-500 to-purple-500",
      accent: "text-purple-400",
      subtitle: "Rigorous Statistical & SQL Queries",
      details: "Applying aggregations, multi-table joins, window functions, and hypothesis tests to investigate specific business questions and uncover underlying drivers of performance."
    },
    {
      id: 4,
      title: "Visualize",
      icon: PieChart,
      color: "from-purple-500 to-fuchsia-500",
      accent: "text-fuchsia-400",
      subtitle: "Design Executive Dashboards",
      details: "Building intuitive visual interfaces in Power BI and Excel with interactive slicers, clean star-schema data models, and clear charts that replace 20-page static spreadsheets."
    },
    {
      id: 5,
      title: "Recommend",
      icon: Lightbulb,
      color: "from-fuchsia-500 to-amber-500",
      accent: "text-amber-400",
      subtitle: "Synthesize Plain-English Insights",
      details: "Translating statistical findings into commercial actions: identifying margin leaks, inventory staging opportunities, and customer retention strategies."
    },
    {
      id: 6,
      title: "Deliver",
      icon: CheckCircle,
      color: "from-amber-500 to-emerald-500",
      accent: "text-emerald-400",
      subtitle: "Handover With Full Documentation",
      details: "Delivering clean, documented code, reproducible datasets, and conducting a live walkthrough so the client team can maintain and understand every calculation."
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple-light text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Professional Profile &amp; Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Practical Analytics Grounded in{' '}
            <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-pink-400 bg-clip-text text-transparent">
              Integrity &amp; Impact
            </span>
          </h2>
        </div>

        {/* Core Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          
          {/* Main Statement Box */}
          <div className="lg:col-span-8 rounded-2xl bg-[#091124]/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-purple p-[1px]">
                  <div className="w-full h-full bg-[#030712] rounded-[11px] flex items-center justify-center font-display font-bold text-lg text-white">
                    SKR
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Sudheer Kumar Reddy Ankireddypalli</h3>
                  <p className="text-xs font-mono text-brand-cyan">Aspiring Data Analyst • Hyderabad, India</p>
                </div>
              </div>

              {/* Exact user requested professional introduction */}
              <blockquote className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal border-l-2 border-brand-cyan pl-4 py-1 italic bg-white/[0.02] rounded-r-lg">
                &ldquo;{personalInfo.aboutIntro}&rdquo;
              </blockquote>

              <p className="text-sm text-slate-400 leading-relaxed">
                As an entry-level analyst, I build credible end-to-end projects with public benchmark datasets and offer practical data analytics services to small and medium businesses. I believe in complete transparency: I never invent achievements, credentials, or metrics. Every number I present is backed by verifiable code and reproducible methodologies.
              </p>
            </div>

            {/* Core Values Strip */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Data Confidentiality</div>
                  <div className="text-[11px] text-slate-400">Strict privacy &amp; NDAs respected for all client numbers.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Terminal className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">100% Reproducible</div>
                  <div className="text-[11px] text-slate-400">Clean Python scripts &amp; SQL queries with clear explanations.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Action-Driven</div>
                  <div className="text-[11px] text-slate-400">Focus on commercial decisions rather than vanity charts.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Facts Sidebar Card */}
          <div className="lg:col-span-4 rounded-2xl bg-gradient-to-b from-[#0c152e] to-[#070d1e] border border-brand-purple/20 p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-mono text-brand-purple-light uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-cyan" />
                <span>Operating Profile</span>
              </h4>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <div className="text-slate-400 text-[11px]">Primary Location</div>
                  <div className="text-white font-medium text-sm mt-0.5">Hyderabad, Telangana, India</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">Timezone: IST (UTC +5:30)</div>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <div className="text-slate-400 text-[11px]">Work Arrangement</div>
                  <div className="text-white font-medium text-sm mt-0.5">Remote &amp; Freelance Ready</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">Collaborating via Git, Zoom &amp; Slack</div>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <div className="text-slate-400 text-[11px]">Primary Core Toolkit</div>
                  <div className="text-slate-200 font-medium text-xs mt-1 flex flex-wrap gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">Python</span>
                    <span className="px-1.5 py-0.5 rounded bg-brand-purple/20 text-brand-purple-light">SQL</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Excel</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Power BI</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-cyan/40 transition-all"
              >
                Start a Discussion
              </a>
            </div>
          </div>

        </div>

        {/* Animated 6-Step Workflow Section */}
        <div className="rounded-3xl bg-[#070d1e]/90 border border-white/10 p-6 sm:p-10 backdrop-blur-xl relative">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/10 gap-4">
            <div>
              <div className="text-xs font-mono text-brand-cyan uppercase tracking-wider mb-1">
                Standard Operating Procedure
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                My End-to-End Analytics Workflow
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              A structured, repeatable 6-step lifecycle that guarantees data integrity from first meeting to final executive handover.
            </p>
          </div>

          {/* Interactive Steps Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              const isActive = activeWorkflowStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveWorkflowStep(step.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-b from-white/10 to-white/5 border-brand-cyan/60 shadow-glow-cyan'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-brand-cyan' : 'text-slate-500'}`}>
                      0{step.id}
                    </span>
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-cyan' : 'text-slate-400 group-hover:text-white'}`} />
                  </div>
                  <div className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {step.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {step.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Showcase Box */}
          {(() => {
            const current = workflowSteps.find(s => s.id === activeWorkflowStep) || workflowSteps[0];
            const Icon = current.icon;
            return (
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${current.color} p-[1px] shrink-0`}>
                    <div className="w-full h-full bg-[#030712] rounded-[15px] flex items-center justify-center">
                      <Icon className={`w-7 h-7 ${current.accent}`} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                        Phase 0{current.id}
                      </span>
                      <h4 className="text-lg font-bold text-white font-display">
                        {current.title} — {current.subtitle}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                      {current.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    disabled={activeWorkflowStep === 1}
                    onClick={() => setActiveWorkflowStep(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ← Prev
                  </button>
                  <button
                    disabled={activeWorkflowStep === 6}
                    onClick={() => setActiveWorkflowStep(prev => Math.min(6, prev + 1))}
                    className="px-3 py-1.5 rounded-lg border border-brand-cyan/40 text-xs font-mono text-brand-cyan hover:bg-brand-cyan/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            );
          })()}

        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Download, 
  Briefcase, 
  TrendingUp, 
  Database, 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Layers,
  BarChart3,
  Terminal,
  Activity
} from 'lucide-react';
import { personalInfo } from '../data/personalInfo';

interface HeroProps {
  onExploreProjects: () => void;
  onHireMe: () => void;
  onDownloadResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreProjects,
  onHireMe,
  onDownloadResume
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'sql' | 'python'>('sql');

  return (
    <section 
      id="home" 
      className="relative min-h-[95vh] pt-32 pb-20 flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Personal Brand & Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Status Beacon & Location Pill */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
                </span>
                <span>Open for Freelance &amp; Full-time Roles</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 text-xs">
                <MapPin className="w-3.5 h-3.5 text-brand-purple" />
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>

            {/* Name & Title */}
            <div>
              <h2 className="text-sm uppercase tracking-widest font-mono text-brand-purple-light font-semibold mb-2">
                Sudheer Kumar Reddy Ankireddypalli
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-400 max-w-xl mx-auto lg:mx-0">
                Aspiring Data Analyst <span className="text-brand-cyan">|</span> Business Intelligence <span className="text-brand-cyan">|</span> Freelance Analytics Consultant
              </p>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-[1.12]">
              Turning Raw Data Into{' '}
              <span className="bg-gradient-to-r from-brand-cyan via-brand-purple-light to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
                Business Decisions.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {personalInfo.heroSupportingText}
            </p>

            {/* Concise Skills Line Bar */}
            <div className="pt-1">
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Stack:</span>
                {['Python', 'SQL', 'Excel', 'Power BI', 'Business Analytics'].map((skill, index, arr) => (
                  <React.Fragment key={skill}>
                    <span className="text-xs font-semibold text-slate-200 hover:text-brand-cyan transition-colors">
                      {skill}
                    </span>
                    {index < arr.length - 1 && (
                      <span className="text-slate-600 text-xs">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExploreProjects}
                className="group px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-glow-cyan transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore My Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onHireMe}
                className="group px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-purple transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-purple-200" />
                <span>Hire Me for a Project</span>
              </button>

              <button
                onClick={onDownloadResume}
                className="px-5 py-3.5 rounded-xl font-medium text-sm text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-white/15 hover:border-brand-purple/40 transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                <span>Download My Resume</span>
              </button>
            </div>

            {/* Value Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center lg:text-left">
                <div className="text-lg font-bold text-white font-mono">100%</div>
                <div className="text-[11px] text-slate-400 leading-tight">Reproducible Code</div>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center lg:text-left">
                <div className="text-lg font-bold text-white font-mono">₹4.82M+</div>
                <div className="text-[11px] text-slate-400 leading-tight">Sample Data Modeled</div>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-center lg:text-left">
                <div className="text-lg font-bold text-brand-cyan font-mono">Actionable</div>
                <div className="text-[11px] text-slate-400 leading-tight">Business Findings</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Holographic Business Intelligence Command Deck */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-cyan/20 via-brand-purple/20 to-blue-600/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>

              {/* Central Glassmorphic Command Panel */}
              <div className="relative rounded-2xl bg-[#091124]/90 border border-white/15 backdrop-blur-xl shadow-2xl p-5 overflow-hidden">
                
                {/* Header bar */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2">analytics_engine.py</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                    <Activity className="w-3 h-3 animate-pulse" />
                    <span>ENGINE_ONLINE</span>
                  </div>
                </div>

                {/* Floating Metric 1: Real-time Revenue & Margin Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 mb-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-slate-400">Total Analyzed Retail Sales</div>
                      <div className="text-2xl font-bold font-mono text-white mt-1">₹48,22,500</div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono">
                        <TrendingUp className="w-3 h-3" />
                        <span>+14.8% YoY</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">Margin: 23.4%</div>
                    </div>
                  </div>

                  {/* Animated Sparkline Graphic */}
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-end justify-between h-10 gap-1.5">
                    {[38, 45, 42, 58, 62, 55, 72, 85, 78, 92, 88, 100].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group/bar">
                        <div
                          className="w-full bg-gradient-to-t from-brand-purple to-brand-cyan rounded-t transition-all duration-500 hover:brightness-125"
                          style={{ height: `${val}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>Q1 Jan</span>
                    <span>Q2 Apr</span>
                    <span>Q3 Jul</span>
                    <span>Q4 Dec Surge</span>
                  </div>
                </div>

                {/* Interactive Code Viewer (SQL / Python Tab) */}
                <div className="rounded-xl bg-[#030712]/95 border border-white/10 p-3.5 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveCodeTab('sql')}
                        className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                          activeCodeTab === 'sql'
                            ? 'bg-brand-cyan/20 text-brand-cyan font-bold border border-brand-cyan/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        SQL Query
                      </button>
                      <button
                        onClick={() => setActiveCodeTab('python')}
                        className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                          activeCodeTab === 'python'
                            ? 'bg-brand-purple/20 text-brand-purple-light font-bold border border-brand-purple/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Python Pipeline
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500">Live Sample</span>
                  </div>

                  {activeCodeTab === 'sql' ? (
                    <div className="text-slate-300 leading-relaxed overflow-x-auto text-[11px] space-y-1">
                      <p><span className="text-purple-400">SELECT</span> region, category,</p>
                      <p className="pl-4"><span className="text-cyan-400">ROUND</span>(<span className="text-purple-400">SUM</span>(weekly_sales), <span className="text-amber-300">2</span>) <span className="text-purple-400">AS</span> gross_sales,</p>
                      <p className="pl-4"><span className="text-cyan-400">ROUND</span>(<span className="text-purple-400">AVG</span>(profit_margin_pct), <span className="text-amber-300">2</span>) <span className="text-purple-400">AS</span> avg_margin</p>
                      <p><span className="text-purple-400">FROM</span> retail_transactions</p>
                      <p><span className="text-purple-400">GROUP BY</span> <span className="text-amber-300">1</span>, <span className="text-amber-300">2</span> <span className="text-purple-400">ORDER BY</span> gross_sales <span className="text-purple-400">DESC</span>;</p>
                    </div>
                  ) : (
                    <div className="text-slate-300 leading-relaxed overflow-x-auto text-[11px] space-y-1">
                      <p><span className="text-purple-400">import</span> pandas <span className="text-purple-400">as</span> pd</p>
                      <p>df = pd.read_csv(<span className="text-emerald-400">'sales_log.csv'</span>)</p>
                      <p>df[<span className="text-emerald-400">'margin_pct'</span>] = (df[<span className="text-emerald-400">'profit'</span>] / df[<span className="text-emerald-400">'sales'</span>]) * <span className="text-amber-300">100</span></p>
                      <p>kpis = df.groupby(<span className="text-emerald-400">'region'</span>)[<span className="text-emerald-400">'sales'</span>].agg([<span className="text-emerald-400">'sum'</span>, <span className="text-emerald-400">'mean'</span>])</p>
                      <p className="text-slate-500"># Output: Verified Regional Cohorts</p>
                    </div>
                  )}
                </div>

                {/* Bottom Interactive Feature Chips */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 text-brand-cyan">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Real-world Public Datasets</span>
                  </div>
                  <span className="text-slate-500">Zero Synthetic Claims</span>
                </div>

              </div>

              {/* Floating Orbiting Badge 1 */}
              <div className="hidden sm:flex absolute -bottom-5 -left-6 items-center gap-2 px-3 py-2 rounded-xl bg-[#0c152e]/95 border border-brand-purple/40 shadow-glow-purple backdrop-blur-md text-xs font-mono text-white animate-float-slow">
                <div className="w-7 h-7 rounded-lg bg-brand-purple/20 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-brand-purple-light" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">BI Dashboard</div>
                  <div className="font-bold text-brand-purple-light">Power BI &amp; DAX</div>
                </div>
              </div>

              {/* Floating Orbiting Badge 2 */}
              <div className="hidden sm:flex absolute -top-5 -right-4 items-center gap-2 px-3 py-2 rounded-xl bg-[#0c152e]/95 border border-brand-cyan/40 shadow-glow-cyan backdrop-blur-md text-xs font-mono text-white animate-float-reverse">
                <div className="w-7 h-7 rounded-lg bg-brand-cyan/20 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-brand-cyan" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Clean EDA</div>
                  <div className="font-bold text-brand-cyan">Pandas &amp; SQL</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

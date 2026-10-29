import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Code, 
  LineChart, 
  FileText, 
  Copy, 
  Check, 
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { CaseStudyData } from '../types';

interface CaseStudyModalProps {
  project: CaseStudyData | null;
  onClose: () => void;
  onOpenLiveDashboard?: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ 
  project, 
  onClose,
  onOpenLiveDashboard 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cleaning' | 'methodology' | 'findings' | 'code' | 'gallery'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!project) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
    >
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#070d1e] border border-white/15 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0c152e] to-[#070d1e] border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Case Study"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{project.statusBadge}</span>
            </span>
            {project.isConcept && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Prototype / Not Commercially Launched</span>
              </span>
            )}
          </div>

          <h2 id="case-study-title" className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white tracking-tight">
            {project.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-3xl">
            {project.subtitle}
          </p>

          {/* Action Links */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Inspect Code Repository</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {project.liveDemoUrl && (
              <button
                onClick={() => {
                  onClose();
                  if (onOpenLiveDashboard) onOpenLiveDashboard();
                  const el = document.getElementById('dashboard');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-mono font-bold text-white shadow-glow-purple transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Interactive Dashboard</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 sm:px-8 border-b border-white/10 bg-[#050a17] flex items-center gap-2 overflow-x-auto py-2 shrink-0">
          {[
            { id: 'overview', label: 'Problem & Scope' },
            { id: 'cleaning', label: 'Data Cleaning & Audit' },
            { id: 'methodology', label: 'Methodology & Questions' },
            { id: 'findings', label: 'Verified Findings & Actions' },
            { id: 'code', label: 'SQL & Python Code' },
            ...(project.galleryImages && project.galleryImages.length > 0 ? [{ id: 'gallery', label: 'UI & Charts Gallery' }] : [])
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-xs font-mono rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-brand-cyan/20 text-brand-cyan font-bold border border-brand-cyan/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 text-slate-300 text-sm">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-mono text-brand-cyan uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>The Business Challenge</span>
                </h3>
                <p className="text-base text-slate-200 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  {project.businessProblem}
                </p>
              </div>

              {/* Dataset Source Card */}
              <div className="rounded-xl bg-[#0c152e]/80 border border-white/10 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-white font-bold font-display">
                    <Database className="w-4 h-4 text-brand-purple" />
                    <span>Dataset Provenance &amp; Verification</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    Public &amp; Reproducible
                  </span>
                </div>
                <div className="text-sm text-slate-300 font-medium">{project.datasetSource.name}</div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{project.datasetSource.description}</p>
                
                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <span className="text-slate-500">Volume: </span>
                    <span className="text-slate-200 font-bold">{project.datasetSource.rowCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Attributes: </span>
                    <span className="text-slate-200">{project.datasetSource.featuresCount}</span>
                  </div>
                </div>
              </div>

              {/* Tools Used Matrix */}
              <div>
                <h3 className="text-sm font-mono text-brand-purple-light uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  <span>Tools &amp; Implementation Role</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {project.toolsUsed.map((t, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="font-mono text-xs font-bold text-white text-brand-cyan">{t.tool}</div>
                      <div className="text-xs text-slate-400 mt-1">{t.purpose}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA CLEANING */}
          {activeTab === 'cleaning' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-mono text-brand-cyan uppercase tracking-wider mb-2">
                  Data Cleaning &amp; Preprocessing Methodology
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Real-world datasets are never pristine. Below is the systematic audit and cleaning protocol executed before performing calculations:
                </p>
                <div className="space-y-3">
                  {project.dataCleaningSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="w-6 h-6 rounded-lg bg-brand-cyan/20 text-brand-cyan flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: METHODOLOGY & ANALYTICAL QUESTIONS */}
          {activeTab === 'methodology' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-mono text-brand-cyan uppercase tracking-wider mb-3">
                  Core Analytical Questions Addressed
                </h3>
                <div className="space-y-2.5">
                  {project.analyticalQuestions.map((q, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#0c152e]/60 border border-white/10 flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-brand-purple-light shrink-0 mt-0.5">Q{idx + 1}:</span>
                      <p className="text-sm font-medium text-slate-200">{q}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-mono text-brand-purple-light uppercase tracking-wider mb-3">
                  Analytical Methodology
                </h3>
                <div className="space-y-2.5">
                  {project.methodology.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-300 leading-relaxed">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FINDINGS & RECOMMENDATIONS */}
          {activeTab === 'findings' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-mono text-brand-cyan uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Empirical Findings (Verified on Data)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.findings.map((f, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10">
                      <div className="text-2xl font-bold font-mono text-brand-cyan">{f.metric}</div>
                      <div className="text-xs font-bold font-mono text-white mt-1 uppercase tracking-wide">{f.label}</div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-mono text-brand-purple-light uppercase tracking-wider mb-4">
                  Evidence-Based Business Recommendations
                </h3>
                <div className="space-y-3">
                  {project.recommendations.map((r, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#0c152e]/70 border border-brand-purple/20">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-white">{r.title}</div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {r.impact}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        <strong className="text-slate-100 font-mono">Recommended Action: </strong>
                        {r.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CODE SNIPPETS */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              {project.sqlSnippets && project.sqlSnippets.map((sql, idx) => (
                <div key={idx} className="rounded-xl bg-[#030712] border border-white/10 overflow-hidden">
                  <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-brand-cyan">SQL Query: </span>
                      <span className="text-xs font-mono text-slate-300">{sql.title}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(sql.query, `sql-${idx}`)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
                    >
                      {copiedCode === `sql-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{sql.query}</code>
                  </pre>
                  <div className="px-4 py-2 bg-white/[0.02] border-t border-white/5 text-[11px] text-slate-400 font-mono">
                    {sql.explanation}
                  </div>
                </div>
              ))}

              {project.pythonSnippets && project.pythonSnippets.map((py, idx) => (
                <div key={idx} className="rounded-xl bg-[#030712] border border-white/10 overflow-hidden">
                  <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-brand-purple-light">Python Pipeline: </span>
                      <span className="text-xs font-mono text-slate-300">{py.title}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(py.code, `py-${idx}`)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
                    >
                      {copiedCode === `py-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{py.code}</code>
                  </pre>
                  <div className="px-4 py-2 bg-white/[0.02] border-t border-white/5 text-[11px] text-slate-400 font-mono">
                    {py.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: GALLERY (Smart Kisan Real Screenshots) */}
          {activeTab === 'gallery' && project.galleryImages && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan">
                <ImageIcon className="w-4 h-4" />
                <span>Actual Prototype Screenshots from Working Codebase</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.galleryImages.map((imgSrc, idx) => (
                  <div key={idx} className="rounded-xl bg-black/50 border border-white/10 overflow-hidden group">
                    <img
                      src={imgSrc}
                      alt={`Prototype view ${idx + 1}`}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="p-3 bg-slate-900/90 text-xs font-mono text-slate-300 flex justify-between items-center">
                      <span>Prototype View {idx + 1}</span>
                      <span className="text-emerald-400 text-[10px]">Authentic Workspace Capture</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 sm:px-8 bg-[#050a17] border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            Repository: <span className="text-white">{project.githubUrl.replace('https://github.com/', '')}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

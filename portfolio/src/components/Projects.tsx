import React, { useState, useMemo } from 'react';
import { 
  FolderGit2, 
  Search, 
  ExternalLink, 
  Github, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Filter,
  BarChart2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { projectsData } from '../data/projectsData';
import { CaseStudyData, ProjectCategory } from '../types';

interface ProjectsProps {
  onSelectProject: (project: CaseStudyData) => void;
  onOpenLiveDashboard: () => void;
}

export const Projects: React.FC<ProjectsProps> = ({ 
  onSelectProject, 
  onOpenLiveDashboard 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: ProjectCategory[] = [
    'All',
    'Python & EDA',
    'Power BI & Dashboards',
    'Agri-Tech Concept'
  ];

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.businessProblem.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono mb-4">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Verifiable Portfolio Codebases</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
              Featured Analytics{' '}
              <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-pink-400 bg-clip-text text-transparent">
                Case Studies
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Authentic investigations using public benchmark data, reproducible Python scripts, rigorous SQL queries, and interactive BI models.
            </p>
          </div>

          {/* Quick CTA to Live Dashboard */}
          <button
            onClick={onOpenLiveDashboard}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono font-bold shadow-glow-purple flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Launch Live Interactive BI Demo</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#091124]/90 border border-white/10 backdrop-blur-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-cyan/20 text-brand-cyan font-bold border border-brand-cyan/50 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by tool, topic, or metric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/60 font-mono transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-3xl bg-[#081024]/80 border border-white/10 hover:border-brand-cyan/40 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-brand-cyan/10 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Subtle Ambient Hover Light */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-purple/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-brand-cyan/20 transition-all duration-500" />

              <div>
                {/* Header Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                    {project.category}
                  </span>
                  
                  {project.isConcept ? (
                    <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Agri Concept</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Benchmark</span>
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-brand-cyan transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {project.subtitle}
                </p>

                {/* Key Findings Metric Pill Strip */}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {project.findings.slice(0, 2).map((finding, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-lg font-bold font-mono text-brand-cyan">{finding.metric}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">{finding.label}</div>
                    </div>
                  ))}
                </div>

                {/* Technology Tags */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-slate-300 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectProject(project)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/10 hover:border-brand-cyan/40 text-xs font-mono font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Deep Dive Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-cyan group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                    title="View GitHub Repository"
                    aria-label={`GitHub Repository for ${project.title}`}
                  >
                    <Github className="w-4 h-4" />
                  </a>

                  {project.id === 'interactive-sales-dashboard' && (
                    <button
                      onClick={onOpenLiveDashboard}
                      className="p-2 rounded-lg bg-brand-purple/20 hover:bg-brand-purple/30 border border-brand-purple/40 text-brand-purple-light transition-colors cursor-pointer"
                      title="Launch Live BI Demo"
                      aria-label="Launch Live BI Demo"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="text-slate-400 font-mono text-sm">No case studies match your query "{searchQuery}".</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-lg bg-brand-cyan/20 text-brand-cyan text-xs font-mono font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

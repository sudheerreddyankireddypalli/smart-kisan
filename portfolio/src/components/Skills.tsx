import React, { useState } from 'react';
import { 
  Terminal, 
  Database, 
  FileSpreadsheet, 
  LineChart, 
  Cpu, 
  GitBranch, 
  Code, 
  Sparkles,
  Layers,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { skillsData } from '../data/skillsData';

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...skillsData.map(c => c.category)];

  const displayedCategories = selectedCategory === 'All' 
    ? skillsData 
    : skillsData.filter(c => c.category === selectedCategory);

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-[#050a17]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Tools &amp; Analytics{' '}
            <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-pink-400 bg-clip-text text-transparent">
              Proficiencies
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Applied competencies across programming, relational databases, data manipulation, and executive visualization. Transparently defined through real-world applications.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-cyan/20 text-brand-cyan font-bold border border-brand-cyan/50 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Categories & Skills Display */}
        <div className="space-y-12">
          {displayedCategories.map((group) => (
            <div key={group.category} className="space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                    <span>{group.category}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">{group.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-2xl bg-[#081024]/80 border border-white/10 hover:border-brand-purple/40 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                  >
                    <div>
                      {/* Skill Name */}
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-bold font-display text-white group-hover:text-brand-cyan transition-colors">
                          {skill.name}
                        </h4>
                      </div>

                      {/* Applied Capability Description */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {skill.levelDescription}
                      </p>

                      {/* Concrete Use Case */}
                      <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] font-mono text-brand-purple-light uppercase tracking-wider mb-1">
                          Applied In Practice:
                        </div>
                        <p className="text-xs text-slate-400 leading-snug">
                          {skill.useCase}
                        </p>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                      {skill.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

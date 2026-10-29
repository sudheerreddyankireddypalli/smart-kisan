import React, { useState } from 'react';
import { ThreeBackground } from './components/ThreeBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { CaseStudyModal } from './components/CaseStudyModal';
import { InteractiveDashboard } from './components/InteractiveDashboard';
import { Services } from './components/Services';
import { Pricing } from './components/Pricing';
import { Process } from './components/Process';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';
import { CaseStudyData } from './types';

export function App() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudyData | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [contactServicePreselect, setContactServicePreselect] = useState<string>('');
  const [contactBudgetPreselect, setContactBudgetPreselect] = useState<string>('');

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHireMe = () => {
    scrollToSection('contact');
  };

  const handleServiceSelect = (serviceTitle: string) => {
    setContactServicePreselect(serviceTitle);
    scrollToSection('contact');
  };

  const handlePackageSelect = (packageName: string, budgetRange: string) => {
    setContactServicePreselect(packageName);
    setContactBudgetPreselect(budgetRange);
    scrollToSection('contact');
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 relative selection:bg-brand-cyan/20 selection:text-brand-cyan">
      {/* 3D WebGL Particle Network Background */}
      <ThreeBackground />

      {/* Sticky Glassmorphic Navbar */}
      <Navbar 
        onHireMeClick={handleHireMe}
        onResumeClick={() => setIsResumeOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero 
          onExploreProjects={() => scrollToSection('projects')}
          onHireMe={handleHireMe}
          onDownloadResume={() => setIsResumeOpen(true)}
        />

        <About />

        <Projects 
          onSelectProject={(project) => setSelectedCaseStudy(project)}
          onOpenLiveDashboard={() => scrollToSection('dashboard')}
        />

        <InteractiveDashboard />

        <Services 
          onSelectService={handleServiceSelect}
        />

        <Pricing 
          onSelectPackage={handlePackageSelect}
        />

        <Process />

        <Skills />

        <Contact 
          preselectedService={contactServicePreselect}
          preselectedBudget={contactBudgetPreselect}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Dedicated Modals */}
      <CaseStudyModal 
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        onOpenLiveDashboard={() => scrollToSection('dashboard')}
      />

      <ResumeModal 
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}

export default App;

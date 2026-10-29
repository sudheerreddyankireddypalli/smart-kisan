import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Info, 
  Sparkles,
  FileUp,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { personalInfo } from '../data/personalInfo';
import { projectsData } from '../data/projectsData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomResumeChange?: (fileName: string | null) => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ 
  isOpen, 
  onClose,
  onCustomResumeChange 
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'upload'>('preview');
  const [uploadedResume, setUploadedResume] = useState<{
    name: string;
    size: string;
    dataUrl: string;
    uploadedAt: string;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom resume from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sudheer_custom_resume');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUploadedResume(parsed);
        if (onCustomResumeChange) onCustomResumeChange(parsed.name);
      }
    } catch {
      // Ignore storage errors in private browsing
    }
  }, []);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (uploadedResume) {
      const link = document.createElement('a');
      link.href = uploadedResume.dataUrl;
      link.download = uploadedResume.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'Sudheer_Kumar_Reddy_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const processFile = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    // Validate type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const isDocx = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc');

    if (!isPdf && !isDocx && !validTypes.includes(file.type)) {
      setUploadError('Please select a valid PDF or DOCX resume document.');
      return;
    }

    // Validate size (max 12MB)
    if (file.size > 12 * 1024 * 1024) {
      setUploadError('File size exceeds 12MB. Please select an optimized PDF.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const resumeObj = {
        name: file.name,
        size: formattedSize,
        dataUrl: result,
        uploadedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      try {
        localStorage.setItem('sudheer_custom_resume', JSON.stringify(resumeObj));
      } catch (err) {
        console.warn('Storage limit reached, cached in session only');
      }

      setUploadedResume(resumeObj);
      setUploadSuccess(`Successfully loaded "${file.name}" as your active resume!`);
      if (onCustomResumeChange) onCustomResumeChange(file.name);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.5 }
        });
      } catch {
        // Fallback gracefully
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveCustomResume = () => {
    try {
      localStorage.removeItem('sudheer_custom_resume');
    } catch {}
    setUploadedResume(null);
    setUploadSuccess(null);
    setUploadError(null);
    if (onCustomResumeChange) onCustomResumeChange(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#091124] border border-white/15 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Control Bar */}
        <div className="p-4 sm:p-6 bg-[#0c152e] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 id="resume-title" className="text-lg font-bold font-display text-white">
              Resume &amp; Credentials
            </h2>
            {uploadedResume ? (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Custom File: {uploadedResume.name}</span>
              </span>
            ) : (
              <span className="text-xs font-mono text-brand-cyan bg-brand-cyan/10 px-2.5 py-0.5 rounded border border-brand-cyan/20">
                Verified Candidate Profile
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View / Upload Tabs */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-brand-cyan text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Profile View
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'upload'
                    ? 'bg-brand-purple text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PDF</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="hidden sm:flex px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white items-center gap-1.5 transition-colors cursor-pointer"
              title="Print formatted resume or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-brand-cyan hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-glow-cyan cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Resume"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: UPLOAD CUSTOM RESUME */}
        {activeTab === 'upload' && (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-[#050a17]">
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 text-brand-purple-light flex items-center justify-center mx-auto">
                  <FileUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">Upload Your Resume</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Select or drop your actual resume file (<strong className="text-brand-cyan font-mono">.pdf</strong> or <strong className="text-brand-cyan font-mono">.docx</strong>). It will instantly become your active downloadable resume across the portfolio!
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 sm:p-12 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 ${
                  isDragging
                    ? 'border-brand-cyan bg-brand-cyan/10 scale-[1.01]'
                    : 'border-white/15 bg-white/[0.02] hover:border-brand-purple/50 hover:bg-white/[0.04]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-cyan to-brand-purple p-[1px]">
                  <div className="w-full h-full bg-[#030712] rounded-[15px] flex items-center justify-center">
                    <Upload className="w-7 h-7 text-brand-cyan" />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    Click to browse or drag and drop your resume file here
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    Supports PDF, DOCX (Up to 12MB)
                  </p>
                </div>

                <button
                  type="button"
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white transition-colors"
                >
                  Choose File From Computer
                </button>
              </div>

              {/* Feedback messages */}
              {uploadError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs font-mono text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs font-mono text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              {/* Currently Active Resume Card */}
              {uploadedResume && (
                <div className="p-5 rounded-2xl bg-[#091124] border border-brand-purple/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 text-brand-cyan flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                          <span>{uploadedResume.name}</span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                            ACTIVE
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Size: {uploadedResume.size} • Loaded on {uploadedResume.uploadedAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-brand-cyan border border-white/10 transition-colors"
                        title="Download uploaded file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleRemoveCustomResume}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                        title="Remove custom file and revert to default"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Workspace Permanent Sync Instructions */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-mono text-slate-400 space-y-2">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-brand-cyan" />
                  <span>Permanent Git Deployment Instructions:</span>
                </div>
                <p className="leading-relaxed">
                  For your resume to persist permanently when deployed to Vercel/Netlify/GitHub, copy your resume into:
                </p>
                <div className="p-2 rounded bg-black/60 text-brand-cyan text-[11px] break-all border border-white/10">
                  portfolio/public/resume.pdf
                </div>
                <p className="text-[11px] text-slate-500">
                  Once placed in that directory, run <code className="text-slate-300">npm run portfolio:build</code> and commit to GitHub.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: PROFILE PREVIEW (PRINTABLE RESUME) */}
        {activeTab === 'preview' && (
          <div className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-[#050a17] text-slate-300 text-xs sm:text-sm print:bg-white print:text-black">
            
            {/* Header */}
            <div className="border-b border-white/10 pb-6 print:border-black/20">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white print:text-black">
                {personalInfo.fullName}
              </h1>
              <p className="text-sm font-mono text-brand-cyan print:text-black font-semibold mt-1">
                {personalInfo.title}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400 print:text-slate-700 font-mono">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-purple-light" />
                  <span>{personalInfo.location}</span>
                </span>
                <a href={`mailto:${personalInfo.contact.email}`} className="flex items-center gap-1.5 hover:text-white">
                  <Mail className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>{personalInfo.contact.email}</span>
                </a>
                <a href={personalInfo.contact.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white">
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  <span>github.com/sudheerkumarreddy</span>
                </a>
                <a href={personalInfo.contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white">
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  <span>linkedin.com/in/sudheerkumarreddy</span>
                </a>
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <h2 className="text-xs font-mono font-bold text-brand-cyan print:text-black uppercase tracking-wider mb-2">
                Professional Summary
              </h2>
              <p className="text-slate-300 print:text-slate-800 leading-relaxed text-xs sm:text-sm">
                {personalInfo.resumeDetails.summary}
              </p>
            </div>

            {/* Technical Toolkit */}
            <div>
              <h2 className="text-xs font-mono font-bold text-brand-cyan print:text-black uppercase tracking-wider mb-3">
                Technical Competencies &amp; Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 print:border-black/10">
                  <span className="font-bold text-white print:text-black font-mono">Languages &amp; Querying: </span>
                  <span className="text-slate-300 print:text-slate-700">Python, SQL, MySQL</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 print:border-black/10">
                  <span className="font-bold text-white print:text-black font-mono">Data Manipulation: </span>
                  <span className="text-slate-300 print:text-slate-700">Pandas, NumPy, Data Cleaning, Wrangling, Feature Engineering</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 print:border-black/10">
                  <span className="font-bold text-white print:text-black font-mono">Visualization &amp; BI: </span>
                  <span className="text-slate-300 print:text-slate-700">Power BI (DAX, Star-schema), Microsoft Excel (Pivot, XLOOKUP), Matplotlib, Seaborn</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 print:border-black/10">
                  <span className="font-bold text-white print:text-black font-mono">Analytics &amp; Methodology: </span>
                  <span className="text-slate-300 print:text-slate-700">Exploratory Data Analysis (EDA), Hypothesis Testing, Statistical Analysis, KPI Modeling</span>
                </div>
              </div>
            </div>

            {/* Featured Analytics Projects */}
            <div>
              <h2 className="text-xs font-mono font-bold text-brand-cyan print:text-black uppercase tracking-wider mb-4">
                Featured Verifiable Projects
              </h2>
              <div className="space-y-4">
                {projectsData.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 print:border-black/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-bold text-white print:text-black text-sm">
                        {proj.title}
                      </h3>
                      <span className="text-[11px] font-mono text-brand-purple-light print:text-slate-600">
                        {proj.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 print:text-slate-700 mt-1 leading-relaxed">
                      {proj.subtitle}
                    </p>
                    <div className="mt-2 text-xs text-slate-400 print:text-slate-600">
                      <strong className="text-slate-200 print:text-black font-mono">Key Metric: </strong>
                      {proj.findings[0]?.label} — {proj.findings[0]?.metric} ({proj.findings[0]?.description})
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1 font-mono text-[10px]">
                      {proj.tags.map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 print:text-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-mono font-bold text-brand-cyan print:text-black uppercase tracking-wider mb-3">
                Education
              </h2>
              {personalInfo.resumeDetails.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 print:border-black/10 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white print:text-black text-sm">{edu.degree}</h3>
                    <div className="text-xs text-brand-purple-light print:text-slate-700">{edu.institution}</div>
                    <p className="text-xs text-slate-400 print:text-slate-600 mt-1">{edu.highlights}</p>
                  </div>
                  <div className="text-xs font-mono text-slate-400 print:text-slate-600">{edu.period}</div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

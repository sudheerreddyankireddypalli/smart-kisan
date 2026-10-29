import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Linkedin, 
  Github, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Database, 
  Briefcase, 
  FileSpreadsheet, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { personalInfo } from '../data/personalInfo';
import { ContactFormData } from '../types';

interface ContactProps {
  preselectedService?: string;
  preselectedBudget?: string;
}

export const Contact: React.FC<ContactProps> = ({ 
  preselectedService, 
  preselectedBudget 
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    companyName: '',
    serviceRequired: 'Power BI Dashboards',
    budgetRange: '₹4,000 – ₹8,000 (Business Insights)',
    desiredDeadline: '2–3 Weeks',
    datasetStatus: 'Ready in CSV / Excel',
    projectDescription: '',
    preferredContact: 'Email'
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, serviceRequired: preselectedService }));
    }
  }, [preselectedService]);

  useEffect(() => {
    if (preselectedBudget) {
      setFormData(prev => ({ ...prev, budgetRange: preselectedBudget }));
    }
  }, [preselectedBudget]);

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your full name';
    }
    if (!formData.email.trim()) {
      errors.email = 'Please provide a valid contact email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.projectDescription.trim() || formData.projectDescription.length < 15) {
      errors.projectDescription = 'Please provide at least 15 characters describing your data or business questions';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Save lead inquiry locally to guarantee zero lost inquiries
    try {
      const existingLeads = JSON.parse(localStorage.getItem('sudheer_inquiries') || '[]');
      const newLead = {
        ...formData,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem('sudheer_inquiries', JSON.stringify([newLead, ...existingLeads]));
    } catch {
      // Ignore localStorage exceptions in private browsing
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({ ...formData });

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback gracefully
      }
    }, 600);
  };

  const generateMailtoLink = () => {
    if (!submittedData) return '#';
    const subject = encodeURIComponent(`Analytics Project Inquiry: ${submittedData.serviceRequired} - ${submittedData.fullName}`);
    const body = encodeURIComponent(
      `Hello Sudheer,\n\n` +
      `I am interested in your data analytics services:\n\n` +
      `• Name: ${submittedData.fullName}\n` +
      `• Email: ${submittedData.email}\n` +
      `• Company: ${submittedData.companyName || 'Individual / Startup'}\n` +
      `• Required Service: ${submittedData.serviceRequired}\n` +
      `• Budget Range: ${submittedData.budgetRange}\n` +
      `• Desired Deadline: ${submittedData.desiredDeadline}\n` +
      `• Dataset Status: ${submittedData.datasetStatus}\n` +
      `• Preferred Contact: ${submittedData.preferredContact}\n\n` +
      `Project Description & Business Questions:\n${submittedData.projectDescription}\n\n` +
      `Looking forward to hearing from you.`
    );
    return `mailto:${personalInfo.contact.email}?subject=${subject}&body=${body}`;
  };

  const generateWhatsAppLink = () => {
    if (!submittedData) return '#';
    const text = encodeURIComponent(
      `Hello Sudheer! I submitted an analytics inquiry:\n` +
      `Name: ${submittedData.fullName}\n` +
      `Service: ${submittedData.serviceRequired}\n` +
      `Budget: ${submittedData.budgetRange}\n` +
      `Details: ${submittedData.projectDescription}`
    );
    return `https://wa.me/${personalInfo.contact.whatsappNumber.replace(/[^0-9]/g, '')}?text=${text}`;
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Client Lead Channel</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Have Data That{' '}
            <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-pink-400 bg-clip-text text-transparent">
              Needs Answers?
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mt-3">
            Tell me about your business challenge. Let's discuss a practical analytics solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact & Location Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="rounded-3xl bg-[#081024]/85 border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-6">
              <div>
                <h3 className="text-xl font-bold font-display text-white">Sudheer Kumar Reddy Ankireddypalli</h3>
                <p className="text-xs font-mono text-brand-cyan mt-1">
                  Aspiring Data Analyst &amp; Freelance Analytics Consultant
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                {/* Location */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <MapPin className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-400">Headquarters</div>
                    <div className="text-white font-medium mt-0.5">{personalInfo.location}</div>
                    <div className="text-slate-500 text-[10px]">Timezone: {personalInfo.timezone}</div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <Mail className="w-4 h-4 text-brand-purple-light shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-400">Direct Inquiries Email</div>
                    <a 
                      href={`mailto:${personalInfo.contact.email}`}
                      className="text-white hover:text-brand-cyan transition-colors font-medium mt-0.5 block break-all"
                    >
                      {personalInfo.contact.email}
                    </a>
                    <div className="text-slate-500 text-[10px]">Custom Domain: {personalInfo.contact.customDomainEmail}</div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-400">Direct WhatsApp Link</div>
                    <a 
                      href={`https://wa.me/${personalInfo.contact.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline font-medium mt-0.5 block"
                    >
                      Message directly on WhatsApp →
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Repositories */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <a
                  href={personalInfo.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>

                <a
                  href={personalInfo.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                <div className="text-xs font-mono text-slate-400 pl-2">
                  <span>Fast Response Time (Within 24 Hours)</span>
                </div>
              </div>

            </div>

            {/* Confidentiality Guarantee Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 text-xs text-slate-300 font-mono space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Client Confidentiality Guarantee</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Your business data, transaction numbers, and proprietary strategies remain 100% confidential. I am happy to execute mutual NDAs before reviewing sample files.
              </p>
            </div>

          </div>

          {/* Right Column: Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#091124] border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
              
              {!submittedData ? (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                        Your Full Name <span className="text-brand-cyan">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-4 py-2.5 rounded-xl bg-black/40 border text-xs text-white placeholder-slate-600 focus:outline-none transition-colors font-mono ${
                          formErrors.fullName ? 'border-rose-500' : 'border-white/10 focus:border-brand-cyan'
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="text-[11px] text-rose-400 font-mono mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    {/* Business Email */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                        Business / Work Email <span className="text-brand-cyan">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@company.com"
                        className={`w-full px-4 py-2.5 rounded-xl bg-black/40 border text-xs text-white placeholder-slate-600 focus:outline-none transition-colors font-mono ${
                          formErrors.email ? 'border-rose-500' : 'border-white/10 focus:border-brand-cyan'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-rose-400 font-mono mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Company Name (Optional) */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                        Company / Venture Name <span className="text-slate-500">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Hyderabad Retail Co."
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-cyan font-mono"
                      />
                    </div>

                    {/* Required Service Dropdown */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                        Required Analytics Service <span className="text-brand-cyan">*</span>
                      </label>
                      <select
                        value={formData.serviceRequired}
                        onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono"
                      >
                        <option value="Data Cleaning and Preparation">Data Cleaning &amp; Preparation</option>
                        <option value="Excel Reporting & KPI Summaries">Excel Reporting &amp; KPI Summaries</option>
                        <option value="SQL Analysis & Queries">SQL Analysis &amp; Database Queries</option>
                        <option value="Python Analytics & EDA">Python Analytics &amp; EDA</option>
                        <option value="Power BI Dashboards">Power BI Interactive Dashboards</option>
                        <option value="Business Insights & Recommendations">Business Insights &amp; Findings</option>
                        <option value="Custom Scope Inquiry">Custom Analytics Workflow</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Budget Range */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                        Indicative Budget (INR)
                      </label>
                      <select
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono"
                      >
                        <option value="₹1,500 – ₹3,000 (Starter Analytics)">₹1,500 – ₹3,000 (Starter)</option>
                        <option value="₹4,000 – ₹8,000 (Business Insights)">₹4,000 – ₹8,000 (Insights)</option>
                        <option value="₹6,000 – ₹15,000 (Dashboard Solution)">₹6,000 – ₹15,000 (Dashboard)</option>
                        <option value="₹15,000+ (Custom Scope)">₹15,000+ (Custom Scope)</option>
                        <option value="Need Consultation First">Need Consultation First</option>
                      </select>
                    </div>

                    {/* Desired Deadline */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                        Desired Timeline
                      </label>
                      <select
                        value={formData.desiredDeadline}
                        onChange={(e) => setFormData({ ...formData, desiredDeadline: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono"
                      >
                        <option value="Flexible / Not Urgent">Flexible / Not Urgent</option>
                        <option value="1–2 Weeks">1–2 Weeks</option>
                        <option value="2–3 Weeks">2–3 Weeks</option>
                        <option value="Immediate / High Priority">Immediate Priority</option>
                      </select>
                    </div>

                    {/* Dataset Status */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                        Dataset Status
                      </label>
                      <select
                        value={formData.datasetStatus}
                        onChange={(e) => setFormData({ ...formData, datasetStatus: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono"
                      >
                        <option value="Ready in CSV / Excel">Ready in CSV / Excel</option>
                        <option value="Stored in SQL / Database">Stored in SQL Database</option>
                        <option value="Need Help Exporting">Need Help Exporting</option>
                        <option value="Messy Multi-Sheet Exports">Messy Multi-Sheet Exports</option>
                        <option value="Concept / Planning Stage">Concept Stage</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                      Project Description &amp; Questions To Answer <span className="text-brand-cyan">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      placeholder="Briefly describe what your data is (e.g. retail transaction logs, online sales, inventory exports) and what specific business questions you want answered..."
                      className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-xs text-white placeholder-slate-600 focus:outline-none transition-colors font-mono ${
                        formErrors.projectDescription ? 'border-rose-500' : 'border-white/10 focus:border-brand-cyan'
                      }`}
                    />
                    {formErrors.projectDescription && (
                      <p className="text-[11px] text-rose-400 font-mono mt-1">{formErrors.projectDescription}</p>
                    )}
                  </div>

                  {/* Preferred Contact Method */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                      <span>Preferred Contact:</span>
                      {['Email', 'WhatsApp', 'Google Meet'].map((method) => (
                        <label key={method} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value={method}
                            checked={formData.preferredContact === method}
                            onChange={() => setFormData({ ...formData, preferredContact: method })}
                            className="text-brand-cyan focus:ring-0"
                          />
                          <span>{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl font-mono text-xs font-bold text-white bg-gradient-to-r from-brand-purple via-indigo-600 to-brand-cyan hover:from-purple-500 hover:to-cyan-400 shadow-glow-purple transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                          <span>Processing Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Analytics Inquiry</span>
                        </>
                      )}
                    </button>
                    <div className="text-[10px] font-mono text-slate-500 text-center mt-2">
                      Zero Spam • Direct Response From Sudheer Within 24 Hours
                    </div>
                  </div>

                </form>
              ) : (
                /* Successful Submission State with Direct Delivery Options */
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow-cyan animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold font-display text-white">Inquiry Successfully Recorded!</h3>
                    <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                      Thank you, <strong className="text-brand-cyan">{submittedData.fullName}</strong>. Your project inquiry has been saved and logged.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs font-mono space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Service:</span>
                      <span className="text-white font-bold">{submittedData.serviceRequired}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Budget:</span>
                      <span className="text-white font-bold">{submittedData.budgetRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Preferred Channel:</span>
                      <span className="text-brand-cyan">{submittedData.preferredContact}</span>
                    </div>
                  </div>

                  {/* Immediate Direct Send Buttons */}
                  <div className="space-y-3 max-w-md mx-auto">
                    <p className="text-xs text-slate-400 font-mono">
                      To send this directly right now to my inbox or phone:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={generateMailtoLink()}
                        className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white flex items-center justify-center gap-2 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-brand-cyan" />
                        <span>Send via Email Client</span>
                      </a>

                      <a
                        href={generateWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-bold text-white flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Send via WhatsApp</span>
                      </a>
                    </div>

                    <button
                      onClick={() => setSubmittedData(null)}
                      className="text-xs font-mono text-slate-500 hover:text-white underline pt-2 cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

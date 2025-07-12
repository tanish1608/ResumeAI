import React, { useState, lazy, Suspense } from 'react';
import { Download, Upload, FileText, Eye } from 'lucide-react';
import { ResumeData } from './types/Resume';
import { defaultResumeData } from './data/defaultResume';
import { HomePage } from './components/HomePage';
import { PersonalInfoEditor } from './components/PersonalInfoEditor';
import { EducationEditor } from './components/EducationEditor';
import { ExperienceEditor } from './components/ExperienceEditor';
import { ProjectsEditor } from './components/ProjectsEditor';
import { SkillsEditor } from './components/SkillsEditor';
import { AchievementsEditor } from './components/AchievementsEditor';
import { ResumePreview } from './components/ResumePreview';
import { exportToPDF } from './utils/pdfExport';
import { exportResumeData, importResumeData } from './utils/dataExport';
import { optimizeResumeWithAI } from './utils/aiOptimization';

const CoverLetterEditor = lazy(() => import('./components/CoverLetterEditor'));

type Page = 'home' | 'resume' | 'cover-letter';
type Section = 'personal' | 'education' | 'experience' | 'projects' | 'skills' | 'achievements';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportName, setExportName] = useState('');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState<string[]>([]);
  
  // Cover Letter State
  const [coverLetterJobDescription, setCoverLetterJobDescription] = useState('');
  const [coverLetterContent, setCoverLetterContent] = useState('');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [showCoverLetterDialog, setShowCoverLetterDialog] = useState(false);
  const [coverLetterRequirements, setCoverLetterRequirements] = useState('');
  const [coverLetterHeader, setCoverLetterHeader] = useState({
    applicantName: 'Tanish Vardhineni',
    degree: 'MS in Software Engineering',
    university: 'New York University – Tandon School of Engineering',
    email: 'tv2291@nyu.edu',
    date: 'Jul 10 2025',
    recipientCompany: 'NYU College of Dentistry',
    recipientLocation: 'New York, NY',
    salutation: 'Dear Dr. Kim and Professor Eid,'
  });
  const [coverLetterFooter, setCoverLetterFooter] = useState({
    closing: 'Thank you for considering my application.',
    signOff: 'Warm regards,',
    signature: 'Tanish Vardhineni'
  });

  const sections: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: 'personal', label: 'Personal Info', icon: <FileText className="w-4 h-4" /> },
    { key: 'education', label: 'Education', icon: <FileText className="w-4 h-4" /> },
    { key: 'experience', label: 'Experience', icon: <FileText className="w-4 h-4" /> },
    { key: 'projects', label: 'Projects', icon: <FileText className="w-4 h-4" /> },
    { key: 'skills', label: 'Skills', icon: <FileText className="w-4 h-4" /> },
    { key: 'achievements', label: 'Achievements', icon: <FileText className="w-4 h-4" /> }
  ];

  const handleExportClick = () => {
    setExportName('resume');
    setShowExportDialog(true);
  };

  const handleExportConfirm = async () => {
    if (!exportName.trim()) return;
    
    setIsExporting(true);
    setShowExportDialog(false);
    
    const fileName = exportName.trim();
    
    // Export PDF
    const pdfSuccess = await exportToPDF(resumeData, `${fileName}.pdf`);
    
    // Export JSON
    const jsonSuccess = exportResumeData(resumeData, `${fileName}.json`);
    
    const success = pdfSuccess && jsonSuccess;
    
    if (success) {
      console.log('Resume and data exported successfully!');
    } else {
      alert('Error exporting files. Please try again.');
    }
    setIsExporting(false);
  };

  const handleExportCancel = () => {
    setShowExportDialog(false);
    setExportName('');
  };

  const handleAIOptimizeClick = () => {
    setJobDescription('');
    setShowAIDialog(true);
  };

  const handleAIOptimizeConfirm = async () => {
    if (!jobDescription.trim()) return;
    
    setIsOptimizing(true);
    setShowAIDialog(false);
    setOptimizationProgress([]);
    
    try {
      // Add progress updates
      setOptimizationProgress(['🤖 Analyzing job description...']);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOptimizationProgress(prev => [...prev, '📝 Optimizing experience descriptions...']);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOptimizationProgress(prev => [...prev, '🛠️ Enhancing technical skills...']);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOptimizationProgress(prev => [...prev, '🚀 Updating project descriptions...']);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOptimizationProgress(prev => [...prev, '✨ Finalizing optimization...']);
      
      const optimizedData = await optimizeResumeWithAI(resumeData, jobDescription);
      setResumeData(optimizedData);
      
      setOptimizationProgress(prev => [...prev, '✅ Resume optimization completed successfully!']);
      
      // Auto-hide after 2 seconds
      setTimeout(() => {
        setOptimizationProgress([]);
      }, 2000);
    } catch (error) {
      setOptimizationProgress(['❌ Error optimizing resume. Please check your API key and try again.']);
      setTimeout(() => {
        setOptimizationProgress([]);
      }, 3000);
      console.error('AI optimization error:', error);
    }
    
    setIsOptimizing(false);
  };

  const handleAIOptimizeCancel = () => {
    setShowAIDialog(false);
    setJobDescription('');
  };

  const handleNavigateToResume = () => {
    setCurrentPage('resume');
  };

  const handleNavigateToCoverLetter = () => {
    setCurrentPage('cover-letter');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleGenerateCoverLetter = () => {
    setCoverLetterJobDescription('');
    setCoverLetterRequirements('');
    setShowCoverLetterDialog(true);
  };

  const handleCoverLetterGenerate = async () => {
    if (!coverLetterJobDescription.trim() && !coverLetterRequirements.trim()) return;
    
    setIsGeneratingCoverLetter(true);
    setShowCoverLetterDialog(false);
    
    try {
      const { generateCoverLetter } = await import('./utils/coverLetterGeneration');
      const generatedContent = await generateCoverLetter(
        resumeData, 
        coverLetterJobDescription, 
        coverLetterRequirements
      );
      setCoverLetterContent(generatedContent);
    } catch (error) {
      alert('Error generating cover letter. Please check your API key and try again.');
      console.error('Cover letter generation error:', error);
    }
    
    setIsGeneratingCoverLetter(false);
  };

  const handleCoverLetterCancel = () => {
    setShowCoverLetterDialog(false);
    setCoverLetterJobDescription('');
    setCoverLetterRequirements('');
  };

  // Show home page
  if (currentPage === 'home') {
    return (
      <HomePage 
        onNavigateToResume={handleNavigateToResume}
        onNavigateToCoverLetter={handleNavigateToCoverLetter}
      />
    );
  }

  // Show cover letter page
  if (currentPage === 'cover-letter') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Cover Letter Editor...</p>
        </div>
      </div>}>
        <CoverLetterEditor
          resumeData={resumeData}
          coverLetterContent={coverLetterContent}
          coverLetterRequirements={coverLetterRequirements}
          coverLetterHeader={coverLetterHeader}
          coverLetterFooter={coverLetterFooter}
          onContentChange={setCoverLetterContent}
          onRequirementsChange={setCoverLetterRequirements}
          onHeaderChange={setCoverLetterHeader}
          onFooterChange={setCoverLetterFooter}
          onGenerateCoverLetter={handleGenerateCoverLetter}
          onBackToHome={handleBackToHome}
          isGenerating={isGeneratingCoverLetter}
        />
      </Suspense>
    );
  }
  // Show resume editor
  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await importResumeData(file);
      setResumeData(importedData);
      alert('Resume data loaded successfully!');
    } catch (error) {
      alert('Error loading resume data. Please check the file format.');
    }
    
    // Reset the input
    event.target.value = '';
  };

  const renderEditor = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <PersonalInfoEditor
            personalInfo={resumeData.personalInfo}
            onChange={(personalInfo) => setResumeData({ ...resumeData, personalInfo })}
          />
        );
      case 'education':
        return (
          <EducationEditor
            education={resumeData.education}
            onChange={(education) => setResumeData({ ...resumeData, education })}
          />
        );
      case 'experience':
        return (
          <ExperienceEditor
            experience={resumeData.experience}
            onChange={(experience) => setResumeData({ ...resumeData, experience })}
          />
        );
      case 'projects':
        return (
          <ProjectsEditor
            projects={resumeData.projects}
            onChange={(projects) => setResumeData({ ...resumeData, projects })}
          />
        );
      case 'skills':
        return (
          <SkillsEditor
            skills={resumeData.skills}
            onChange={(skills) => setResumeData({ ...resumeData, skills })}
          />
        );
      case 'achievements':
        return (
          <AchievementsEditor
            achievements={resumeData.achievements || []}
            onChange={(achievements) => setResumeData({ ...resumeData, achievements })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <button
                onClick={handleBackToHome}
                className="text-blue-600 hover:text-blue-800 transition-colors mb-1">
                ← Back to Home
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Editor</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Mobile Preview Toggle */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{showPreview ? 'Edit' : 'Preview'}</span>
              </button>

              {/* Import Data */}
              <label className={`flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-md transition-colors ${
                isOptimizing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600 cursor-pointer'
              }`}>
                <Upload className="w-4 h-4" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  disabled={isOptimizing}
                  className="hidden"
                />
              </label>

              {/* Export PDF */}
              <button
                onClick={handleGenerateCoverLetter}
                disabled={isOptimizing}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <span>🤖</span>
                <span>{isOptimizing ? 'Optimizing...' : 'AI Optimize'}</span>
              </button>

              <button
                onClick={handleExportClick}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className={`bg-white rounded-lg shadow-md ${showPreview ? 'hidden lg:block' : ''}`}>
            {/* Section Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap">
                {sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeSection === section.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {section.icon}
                    <span className="hidden sm:inline">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Editor Content */}
            <div className="p-6">
              {renderEditor()}
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`bg-gray-100 rounded-lg p-4 ${!showPreview ? 'hidden xl:block' : ''}`}>
            <div className="sticky top-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Live Preview
              </h2>
              <div className="bg-white rounded-lg shadow-lg overflow-auto" style={{ 
                transform: 'scale(0.6)',
                transformOrigin: 'top left',
                width: '166.67%'
              }}>
                <ResumePreview resumeData={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Optimization Progress */}
      {optimizationProgress.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4 max-w-sm z-50">
          <div className="space-y-2">
            {optimizationProgress.map((step, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span>{step}</span>
                {index === optimizationProgress.length - 1 && !step.includes('✅') && !step.includes('❌') && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cover Letter Generation Dialog */}
      {showCoverLetterDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Generate Cover Letter</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={coverLetterJobDescription}
                onChange={(e) => setCoverLetterJobDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={8}
                placeholder="Paste the complete job description here..."
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements (Optional)
              </label>
              <textarea
                value={coverLetterRequirements}
                onChange={(e) => setCoverLetterRequirements(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Any specific requirements, tone, or focus areas for the cover letter..."
              />
              <p className="text-xs text-gray-500 mt-2">
                AI will generate a personalized cover letter based on your resume, job description, and any additional requirements.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCoverLetterCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCoverLetterGenerate}
                disabled={!coverLetterJobDescription.trim() && !coverLetterRequirements.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                Generate Cover Letter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Resume</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Name
              </label>
              <input
                type="text"
                value={exportName}
                onChange={(e) => setExportName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="resume"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Will export as "{exportName || 'resume'}.pdf" and "{exportName || 'resume'}.json"
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleExportCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExportConfirm}
                disabled={!exportName.trim()}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Optimization Dialog */}
      {showAIDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Resume Optimization</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={12}
                placeholder="Paste the complete job description here..."
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                AI will optimize your resume content, skills, and project descriptions to match this job description while keeping your experience companies intact.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleAIOptimizeCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAIOptimizeConfirm}
                disabled={!jobDescription.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                Optimize Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { Download, FileText, Wand2, Eye, Edit3 } from 'lucide-react';
import { ResumeData } from '../types/Resume';
import { CoverLetterPreview } from './CoverLetterPreview';
import { exportCoverLetterToPDF } from '../utils/coverLetterPdfExport';

interface CoverLetterHeader {
  applicantName: string;
  degree: string;
  university: string;
  email: string;
  date: string;
  recipientCompany: string;
  recipientLocation: string;
  salutation: string;
}

interface CoverLetterFooter {
  closing: string;
  signOff: string;
  signature: string;
}

interface CoverLetterEditorProps {
  resumeData: ResumeData;
  coverLetterContent: string;
  coverLetterRequirements: string;
  coverLetterHeader: CoverLetterHeader;
  coverLetterFooter: CoverLetterFooter;
  onContentChange: (content: string) => void;
  onRequirementsChange: (requirements: string) => void;
  onHeaderChange: (header: CoverLetterHeader) => void;
  onFooterChange: (footer: CoverLetterFooter) => void;
  onGenerateCoverLetter: () => void;
  onBackToHome: () => void;
  isGenerating: boolean;
}

const CoverLetterEditor: React.FC<CoverLetterEditorProps> = ({
  resumeData,
  coverLetterContent,
  coverLetterHeader,
  coverLetterFooter,
  onContentChange,
  onRequirementsChange,
  onHeaderChange,
  onFooterChange,
  onBackToHome,
  isGenerating
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [editingSection, setEditingSection] = useState<'header' | 'footer' | null>(null);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportCoverLetterToPDF(
        coverLetterContent, 
        coverLetterHeader,
        coverLetterFooter,
        'cover-letter.pdf'
      );
    } catch (error) {
      alert('Error exporting cover letter. Please try again.');
      console.error('Export error:', error);
    }
    setIsExporting(false);
  };

  const handleHeaderChange = (field: keyof CoverLetterHeader, value: string) => {
    onHeaderChange({
      ...coverLetterHeader,
      [field]: value
    });
  };

  const handleFooterChange = (field: keyof CoverLetterFooter, value: string) => {
    onFooterChange({
      ...coverLetterFooter,
      [field]: value
    });
  };

  const handleGenerateCoverLetter = () => {
    setJobDescription('');
    setRequirements('');
    setShowGenerateDialog(true);
  };

  const handleGenerateConfirm = async () => {
    if (!jobDescription?.trim() && !requirements?.trim()) {
      alert('Please enter either a job description or requirements');
      return;
    }
    
    setShowGenerateDialog(false);
    
    try {
      const { generateCoverLetter } = await import('../utils/coverLetterGeneration');
      const generatedContent = await generateCoverLetter(
        resumeData, 
        jobDescription, 
        requirements
      );
      onContentChange(generatedContent);
      onRequirementsChange(requirements);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error generating cover letter: ${errorMessage}`);
      console.error('Cover letter generation error:', error);
    }
  };

  const handleGenerateCancel = () => {
    setShowGenerateDialog(false);
    setJobDescription('');
    setRequirements('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <button
                onClick={onBackToHome}
                className="text-blue-600 hover:text-blue-800 transition-colors mb-1">
                ← Back to Home
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cover Letter Editor</h1>
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

              {/* Generate Cover Letter */}
              <button
                onClick={handleGenerateCoverLetter}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'AI Generate'}</span>
              </button>

              {/* Export PDF */}
              <button
                onClick={handleExport}
                disabled={isExporting || !coverLetterContent.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Generate Cover Letter Dialog */}
      {showGenerateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Generate Cover Letter</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={8}
                placeholder="Paste the complete job description here..."
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={6}
                placeholder="Specify how you want the cover letter to be written:
- Tone (professional, enthusiastic, technical, etc.)
- Focus areas (specific skills, experiences, achievements)
- Length preferences
- Any specific points to emphasize or avoid
- Writing style preferences"
              />
              <p className="text-xs text-gray-500 mt-2">
                <strong>Important:</strong> These requirements will be prioritized by the AI when generating your cover letter.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleGenerateCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateConfirm}
                disabled={!jobDescription.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                Generate Cover Letter
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className={`bg-white rounded-lg shadow-md ${showPreview ? 'hidden lg:block' : ''}`}>
            <div className="p-6 space-y-6">
              {/* Header Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Header Information
                  </h3>
                  <button
                    onClick={() => setEditingSection(editingSection === 'header' ? null : 'header')}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{editingSection === 'header' ? 'Done' : 'Edit'}</span>
                  </button>
                </div>

                {editingSection === 'header' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={coverLetterHeader.applicantName}
                        onChange={(e) => handleHeaderChange('applicantName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                      <input
                        type="text"
                        value={coverLetterHeader.degree}
                        onChange={(e) => handleHeaderChange('degree', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                      <input
                        type="text"
                        value={coverLetterHeader.university}
                        onChange={(e) => handleHeaderChange('university', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={coverLetterHeader.email}
                        onChange={(e) => handleHeaderChange('email', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="text"
                        value={coverLetterHeader.date}
                        onChange={(e) => handleHeaderChange('date', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Company</label>
                      <input
                        type="text"
                        value={coverLetterHeader.recipientCompany}
                        onChange={(e) => handleHeaderChange('recipientCompany', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Location</label>
                      <input
                        type="text"
                        value={coverLetterHeader.recipientLocation}
                        onChange={(e) => handleHeaderChange('recipientLocation', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salutation</label>
                      <input
                        type="text"
                        value={coverLetterHeader.salutation}
                        onChange={(e) => handleHeaderChange('salutation', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>{coverLetterHeader.applicantName}</strong></p>
                    <p>{coverLetterHeader.degree}</p>
                    <p>{coverLetterHeader.university}</p>
                    <p>{coverLetterHeader.email}</p>
                    <p className="mt-3">{coverLetterHeader.date}</p>
                    <p className="mt-3">{coverLetterHeader.recipientCompany}</p>
                    <p>{coverLetterHeader.recipientLocation}</p>
                    <p className="mt-3">{coverLetterHeader.salutation}</p>
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Cover Letter Body
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter Body (Edit as needed)
                  </label>
                  <textarea
                    value={coverLetterContent}
                    onChange={(e) => onContentChange(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={12}
                    placeholder="Type your cover letter content here or click 'AI Generate' to create personalized content based on a job description..."
                  />
                  
                  <p className="text-xs text-gray-500 mt-2">
                    The header and footer are automatically added. Edit the body content as needed.
                  </p>
                </div>
              </div>

              {/* Footer Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Footer Information
                  </h3>
                  <button
                    onClick={() => setEditingSection(editingSection === 'footer' ? null : 'footer')}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{editingSection === 'footer' ? 'Done' : 'Edit'}</span>
                  </button>
                </div>

                {editingSection === 'footer' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Closing Statement</label>
                      <input
                        type="text"
                        value={coverLetterFooter.closing}
                        onChange={(e) => handleFooterChange('closing', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sign Off</label>
                      <input
                        type="text"
                        value={coverLetterFooter.signOff}
                        onChange={(e) => handleFooterChange('signOff', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Signature</label>
                      <input
                        type="text"
                        value={coverLetterFooter.signature}
                        onChange={(e) => handleFooterChange('signature', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{coverLetterFooter.closing}</p>
                    <p className="mt-3">{coverLetterFooter.signOff}</p>
                    <p><strong>{coverLetterFooter.signature}</strong></p>
                  </div>
                )}
              </div>
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
                <CoverLetterPreview 
                  resumeData={resumeData} 
                  content={coverLetterContent}
                  header={coverLetterHeader}
                  footer={coverLetterFooter}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4 max-w-sm z-50">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-sm font-medium">Generating personalized cover letter...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterEditor;
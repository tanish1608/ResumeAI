import React from 'react';
import { ResumeData } from '../types/Resume';

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

interface CoverLetterPreviewProps {
  resumeData: ResumeData;
  content: string;
  header: CoverLetterHeader;
  footer: CoverLetterFooter;
}

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ 
  resumeData, 
  content,
  header,
  footer
}) => {
  return (
    <div 
      id="cover-letter-preview" 
      className="bg-white mx-auto shadow-lg"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        fontSize: '11pt',
        lineHeight: '1.6',
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20pt' }}>
        <div style={{ textAlign: 'left', marginBottom: '16pt' }}>
          <h1 style={{ 
            fontSize: '14pt', 
            fontWeight: 'bold', 
            margin: '0 0 4pt 0',
            lineHeight: '1.2'
          }}>
            {header.applicantName}
          </h1>
          <p style={{ 
            fontSize: '11pt', 
            margin: '0 0 2pt 0',
            lineHeight: '1.4'
          }}>
            {header.degree},
          </p>
          <p style={{ 
            fontSize: '11pt', 
            margin: '0 0 2pt 0',
            lineHeight: '1.4'
          }}>
            {header.university}
          </p>
          <p style={{ 
            fontSize: '11pt', 
            margin: '0 0 16pt 0',
            lineHeight: '1.4'
          }}>
            {header.email}
          </p>
        </div>

        <div style={{ marginBottom: '16pt' }}>
          <p style={{ 
            fontSize: '11pt', 
            margin: '0 0 16pt 0',
            lineHeight: '1.4'
          }}>
            {header.date}
          </p>
        </div>

        <div style={{ marginBottom: '16pt' }}>
          <p style={{ 
            fontSize: '11pt', 
            margin: '0 0 2pt 0',
            lineHeight: '1.4'
          }}>
            {header.recipientCompany}
          </p>
          <p style={{ 
            fontSize: '11pt', 
            margin: '0 0 16pt 0',
            lineHeight: '1.4'
          }}>
            {header.recipientLocation}
          </p>
        </div>

        <p style={{ 
          fontSize: '11pt', 
          margin: '0 0 16pt 0',
          lineHeight: '1.4'
        }}>
          {header.salutation}
        </p>
      </div>

      {/* Body Content */}
      <div style={{ 
        marginBottom: '20pt',
        minHeight: '200pt'
      }}>
        {content ? (
          <div style={{ 
            fontSize: '11pt', 
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}>
            {content}
          </div>
        ) : (
          <div style={{ 
            fontSize: '11pt', 
            lineHeight: '1.6',
            color: '#666666',
            fontStyle: 'italic'
          }}>
            [Cover letter content will appear here after generation]
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: 'auto',
        paddingTop: '20pt'
      }}>
        <p style={{ 
          fontSize: '11pt', 
          margin: '0 0 16pt 0',
          lineHeight: '1.4'
        }}>
          {footer.closing}
        </p>
        
        <p style={{ 
          fontSize: '11pt', 
          margin: '0 0 16pt 0',
          lineHeight: '1.4'
        }}>
          {footer.signOff}
        </p>
        
        <p style={{ 
          fontSize: '11pt', 
          margin: '0',
          lineHeight: '1.4',
          fontWeight: 'bold'
        }}>
          {footer.signature}
        </p>
      </div>
    </div>
  );
};
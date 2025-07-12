import jsPDF from 'jspdf';
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

export const exportCoverLetterToPDF = async (
  resumeData: ResumeData, 
  content: string,
  header: CoverLetterHeader,
  footer: CoverLetterFooter,
  filename: string = 'cover-letter.pdf'
) => {
  try {
    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Page dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    let currentY = margin;
    const lineHeight = 2;
    const paragraphSpacing = 2;

    // Helper functions
    const addText = (text: string, x: number, y: number, fontSize: number = 11, style: string = 'normal', align: 'left' | 'center' | 'right' = 'left') => {
      pdf.setFontSize(fontSize);
      pdf.setFont('times', style);
      pdf.text(text, x, y, { align });
    };

    const wrapText = (text: string, maxWidth: number, fontSize: number = 11) => {
      pdf.setFontSize(fontSize);
      return pdf.splitTextToSize(text, maxWidth);
    };

    // Header
    addText(header.applicantName, margin, currentY, 14, 'bold');
    currentY += lineHeight + 2;
    
    addText(`${header.degree},`, margin, currentY, 11, 'normal');
    currentY += lineHeight;
    
    addText(header.university, margin, currentY, 11, 'normal');
    currentY += lineHeight;
    
    addText(header.email, margin, currentY, 11, 'normal');
    currentY += paragraphSpacing + 8;

    // Date
    addText(header.date, margin, currentY, 11, 'normal');
    currentY += paragraphSpacing + 8;

    // Recipient
    addText(header.recipientCompany, margin, currentY, 11, 'normal');
    currentY += lineHeight;
    
    addText(header.recipientLocation, margin, currentY, 11, 'normal');
    currentY += paragraphSpacing + 8;

    // Salutation
    addText(header.salutation, margin, currentY, 11, 'normal');
    currentY += paragraphSpacing + 8;

    // Body Content
    if (content) {
      const contentLines = wrapText(content, contentWidth, 11);
      contentLines.forEach((line: string) => {
        if (currentY > pageHeight - margin - 60) { // Leave space for footer
          pdf.addPage();
          currentY = margin;
        }
        addText(line, margin, currentY, 11, 'normal');
        currentY += lineHeight;
      });
    }

    // Ensure we have space for footer
    if (currentY > pageHeight - margin - 40) {
      pdf.addPage();
      currentY = margin;
    } else {
      currentY += paragraphSpacing + 8;
    }

    // Footer
    addText(footer.closing, margin, currentY, 11, 'normal');
    currentY += paragraphSpacing + 8;
    
    addText(footer.signOff, margin, currentY, 11, 'normal');
    currentY += paragraphSpacing + 8;
    
    addText(footer.signature, margin, currentY, 11, 'bold');

    // Save the PDF
    pdf.save(filename);
    return true;
    
  } catch (error) {
    console.error('Error exporting cover letter to PDF:', error);
    return false;
  }
};
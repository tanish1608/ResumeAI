import jsPDF from 'jspdf';

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
  content: string,
  header: CoverLetterHeader,
  footer: CoverLetterFooter,
  filename: string = 'cover-letter.pdf'
) => {
  try {
    // Validate input data
    if (!header?.applicantName?.trim()) {
      throw new Error('Applicant name is required for cover letter export');
    }

    if (!content?.trim()) {
      throw new Error('Cover letter content is required for export');
    }

    if (!filename || filename.trim() === '') {
      filename = 'cover-letter.pdf';
    }

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
    const lineHeight = 5;
    const paragraphSpacing = 6;

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

    const checkPageBreak = (neededSpace: number) => {
      if (currentY + neededSpace > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
        return true;
      }
      return false;
    };

    // Header Section
    addText(header.applicantName, margin, currentY, 14, 'bold');
    currentY += lineHeight + 2;
    
    addText(header.degree, margin, currentY, 11, 'normal');
    currentY += lineHeight;
    
    addText(header.university, margin, currentY, 11, 'normal');
    currentY += lineHeight;
    
    if (header.email?.trim()) {
      addText(header.email, margin, currentY, 11, 'normal');
    }
    currentY += paragraphSpacing + 4;

    // Date
    if (header.date?.trim()) {
      addText(header.date, margin, currentY, 11, 'normal');
    }
    currentY += paragraphSpacing + 4;

    // Recipient
    if (header.recipientCompany?.trim()) {
      addText(header.recipientCompany, margin, currentY, 11, 'normal');
    }
    currentY += lineHeight;
    
    if (header.recipientLocation?.trim()) {
      addText(header.recipientLocation, margin, currentY, 11, 'normal');
    }
    currentY += paragraphSpacing + 4;

    // Salutation
    if (header.salutation?.trim()) {
      addText(header.salutation, margin, currentY, 11, 'normal');
    }
    currentY += paragraphSpacing + 4;

    // Body Content
    if (content && content.trim()) {
      // Split content into paragraphs
      const paragraphs = content.split('\n\n').filter(p => p.trim());
      
      paragraphs.forEach((paragraph, index) => {
        checkPageBreak(20); // Check if we need a new page
        
        const paragraphLines = wrapText(paragraph.trim(), contentWidth, 11);
        
        paragraphLines.forEach((line: string) => {
          checkPageBreak(lineHeight + 2);
          addText(line, margin, currentY, 11, 'normal');
          currentY += lineHeight;
        });
        
        // Add spacing between paragraphs (except for the last one)
        if (index < paragraphs.length - 1) {
          currentY += paragraphSpacing;
        }
      });
    }

    // Ensure we have space for footer
    checkPageBreak(40);
    currentY += paragraphSpacing + 4;

    // Footer Section
    if (footer.closing?.trim()) {
      addText(footer.closing, margin, currentY, 11, 'normal');
    }
    currentY += paragraphSpacing + 4;
    
    if (footer.signOff?.trim()) {
      addText(footer.signOff, margin, currentY, 11, 'normal');
    }
    currentY += paragraphSpacing + 4;
    
    if (footer.signature?.trim()) {
      addText(footer.signature, margin, currentY, 11, 'bold');
    }

    // Save the PDF
    pdf.save(filename);
    return true;
    
  } catch (error) {
    console.error('Error exporting cover letter to PDF:', error);
    return false;
  }
};
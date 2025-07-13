import jsPDF from 'jspdf';
import { ResumeData } from '../types/Resume';

export const exportToPDF = async (resumeData: ResumeData, filename: string = 'resume.pdf') => {
  try {
    // Validate input data
    if (!resumeData || !resumeData.personalInfo) {
      throw new Error('Invalid resume data provided');
    }

    if (!filename || filename.trim() === '') {
      filename = 'resume.pdf';
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
    const margin = 8; // Reduced top margin to prevent overlap
    const contentWidth = pageWidth - (margin * 2);
    
    let currentY = margin;
    const lineHeight = 4.5;
    const sectionSpacing = 6;
    const entrySpacing = 6;

    // Helper functions
    const addText = (text: string, x: number, y: number, fontSize: number = 11, style: string = 'normal', align: 'left' | 'center' | 'right' = 'left') => {
      pdf.setFontSize(fontSize);
      pdf.setFont('times', style);
      pdf.text(text, x, y, { align });
    };

    const addLine = (y: number) => {
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);
    };

    const checkPageBreak = (neededSpace: number) => {
      if (currentY + neededSpace > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
        return true;
      }
      return false;
    };

    const wrapText = (text: string, maxWidth: number, fontSize: number = 11) => {
      pdf.setFontSize(fontSize);
      return pdf.splitTextToSize(text, maxWidth);
    };

    // Header - Name and Contact Info
    const { personalInfo } = resumeData;
    
    // Name
    addText(personalInfo.fullName, pageWidth / 2, currentY + 6, 18, 'bold', 'center');
    currentY += 12;
    
    const iconMap = {
      linkedin: 'Lln:', // or use '\u{f08c}' if using a font like Font Awesome
      github: 'Ghub: ',
      website: 'Polio: '
    };
    
    // Combine contact info
    const contactItems = [personalInfo.email, personalInfo.phone, personalInfo.address].filter(Boolean);
    
    // Validate required personal info
    if (!personalInfo.fullName?.trim()) {
      throw new Error('Full name is required for PDF export');
    }

    // Format links with icons instead of text labels
    const linkItems = [];
    const linkMeta = []; // store positions for linking
    
    [personalInfo.linkedin, personalInfo.github, personalInfo.website].forEach((link) => {
      if (!link) return;
    
      let icon = '🔗'; // fallback
      if (link.includes('linkedin.com')) icon = iconMap.linkedin;
      else if (link.includes('github.com')) icon = iconMap.github;
      else icon = iconMap.website;
    
      const text = link
        .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')
        .replace(/^https?:\/\/(www\.)?github\.com\//, '')
        .replace(/^https?:\/\/(www\.)?/, '');
    
      const display = `${icon} ${text}`;
      linkItems.push(display);
      linkMeta.push({ text: display, url: link.startsWith('http') ? link : `https://${link}` });
    });
    
    // Combine all for final display
    const allItems = [...contactItems, ...linkItems];
    const finalLine = allItems.join(' | ');
    
    // Draw centered text
    addText(finalLine, pageWidth / 2, currentY, 10, 'normal', 'center');
    
    // Set up clickable link areas
    let startX = (pageWidth - pdf.getTextWidth(finalLine)) / 2;
    
    allItems.forEach((item, index) => {
      const itemWidth = pdf.getTextWidth(item);
      
      if (index >= contactItems.length) {
        const linkIndex = index - contactItems.length;
        const url = linkMeta[linkIndex].url;
        pdf.link(startX, currentY - 3, itemWidth, lineHeight, { url });
      }
    
      // Add spacing for ' | ' unless it's the last item
      startX += itemWidth;
      if (index < allItems.length - 1) {
        startX += pdf.getTextWidth(' | ');
      }
    });

    currentY += sectionSpacing + 5;

    // Education Section
    if (resumeData.education.length > 0) {
      checkPageBreak(20);
      addText('EDUCATION', margin, currentY, 12, 'bold');
      currentY += 2;
      addLine(currentY);
      currentY += sectionSpacing;

      resumeData.education.forEach((edu) => {
        if (!edu.school?.trim() || !edu.degree?.trim()) {
          return; // Skip incomplete education entries
        }

        checkPageBreak(25);
        
        // University name in bold, then degree and GPA in normal
        addText(edu.school, margin, currentY, 11, 'bold');
        const schoolWidth = pdf.getTextWidth(edu.school);
        
        const degreeText = `, ${edu.degree}`;
        const degreeWidth = pdf.getTextWidth(edu.degree);
        let gpa = '';
        if (edu.gpa) {
          gpa = `, GPA: ${edu.gpa}`;
        }
        addText(degreeText, margin + schoolWidth, currentY, 11, 'normal');
        addText(gpa || '', margin + schoolWidth + degreeWidth, currentY, 11, 'italic')
        addText(edu.graduationDate, pageWidth - margin, currentY, 11, 'normal', 'right');
        currentY += lineHeight;

        if (edu.relevantCoursework) {
          addText('Relevant Coursework: ', margin, currentY, 10, 'bold');
          const courseworkLines = wrapText(edu.relevantCoursework, contentWidth - 40, 10);
          courseworkLines.forEach((line: string, index: number) => {
            addText(line, margin + (index === 0 ? 35 : 0), currentY, 10, 'normal');
            if (index < courseworkLines.length - 1) currentY += lineHeight;
          });
          currentY += lineHeight;
        }

        currentY += entrySpacing;
      });
    }

    // Technical Skills Section
    if (resumeData.skills.length > 0) {
      checkPageBreak(20);
      addText('TECHNICAL SKILLS', margin, currentY, 12, 'bold');
      currentY += 2;
      addLine(currentY);
      currentY += sectionSpacing;

      resumeData.skills.forEach((skill) => {
        if (!skill.category?.trim() || !skill.items?.length) {
          return; // Skip incomplete skill entries
        }

        checkPageBreak(10);
        const categoryText = `${skill.category}:`;
        const skillsText = ` ${skill.items.join(', ')}`;
        
        pdf.setFontSize(11);
        pdf.setFont('times', 'bold');
        const categoryWidth = pdf.getTextWidth(categoryText);
        
        pdf.setFont('times', 'normal');
        const availableWidth = contentWidth - categoryWidth;
        const skillsLines = wrapText(skillsText, availableWidth, 11);
        
        // First line: category + first line of skills
        addText(categoryText, margin, currentY, 11, 'bold');
        addText(skillsLines[0], margin + categoryWidth, currentY, 11, 'normal');
        currentY += lineHeight;
        
        // Remaining lines: just skills with proper indentation
        for (let i = 1; i < skillsLines.length; i++) {
          checkPageBreak(6);
          addText(skillsLines[i], margin + categoryWidth, currentY, 11, 'normal');
          currentY += lineHeight;
        }
        
        currentY += 1; // Small spacing between categories
      });
      currentY += entrySpacing;
    }

    // Professional Experience Section
    if (resumeData.experience.length > 0) {
      checkPageBreak(20);
      addText('PROFESSIONAL EXPERIENCE', margin, currentY, 12, 'bold');
      currentY += 2;
      addLine(currentY);
      currentY += sectionSpacing;

      resumeData.experience.forEach((exp) => {
        if (!exp.title?.trim() || !exp.company?.trim()) {
          return; // Skip incomplete experience entries
        }

        checkPageBreak(30);
        
        // Role in bold, then company and location in normal
        addText(exp.title, margin, currentY, 11, 'bold');
        const titleWidth = pdf.getTextWidth(exp.title);
        
        const companyNameText = `, ${exp.company}`;
        const companyNameWidth = pdf.getTextWidth(exp.company)
        addText(companyNameText, margin + titleWidth, currentY, 11, 'normal');

        const companyLocationText = `, ${exp.location}`
        addText(companyLocationText, margin + titleWidth + companyNameWidth, currentY, 11, 'italic');

        
        const dateText = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
        addText(dateText, pageWidth - margin, currentY, 11, 'normal', 'right');
        currentY += lineHeight + 2;

        // Description bullets
        exp.description.forEach((desc) => {
          if (desc.trim()) {
            checkPageBreak(8);
            addText('•', margin + 3, currentY, 11, 'normal');
            const descLines = wrapText(desc, contentWidth - 10, 11);
            descLines.forEach((line: string, index: number) => {
              addText(line, margin + 8, currentY, 11, 'normal');
              if (index < descLines.length - 1) currentY += lineHeight;
            });
            currentY += lineHeight;
          }
        });

        currentY += entrySpacing;
      });
    }

    // Academic Projects Section
    if (resumeData.projects.length > 0) {
      checkPageBreak(20);
      addText('ACADEMIC PROJECTS', margin, currentY, 12, 'bold');
      currentY += 2;
      addLine(currentY);
      currentY += sectionSpacing;

      resumeData.projects.forEach((proj) => {
        if (!proj.title?.trim()) {
          return; // Skip incomplete project entries
        }

        checkPageBreak(30);
        
        // Project title with GitHub icon if link exists
        let titleText = proj.title;
        if (proj.link) {
          titleText = `${proj.title}`;  // Using bullet as GitHub icon substitute
          const linkUrl = proj.link.startsWith('http') ? proj.link : `https://${proj.link}`;
          addText(titleText, margin, currentY, 11, 'bold');
          // Make title clickable
          const titleWidth = pdf.getTextWidth(titleText);
          pdf.link(margin, currentY - 3, titleWidth, lineHeight, { url: linkUrl });
        } else {
          addText(titleText, margin, currentY, 11, 'bold');
        }
        
        if (proj.date) {
          addText(proj.date, pageWidth - margin, currentY, 11, 'normal', 'right');
        }
        currentY += lineHeight;
        
        // Technologies
        addText(proj.technologies, margin, currentY, 10, 'normal');
        currentY += lineHeight + 2;

        // Description bullets
        proj.description.forEach((desc) => {
          if (desc.trim()) {
            checkPageBreak(8);
            addText('•', margin + 3, currentY, 11, 'normal');
            const descLines = wrapText(desc, contentWidth - 10, 11);
            descLines.forEach((line: string, index: number) => {
              addText(line, margin + 8, currentY, 11, 'normal');
              if (index < descLines.length - 1) currentY += lineHeight;
            });
            currentY += lineHeight;
          }
        });

        currentY += entrySpacing;
      });
    }

    // Achievements Section
    if (resumeData.achievements && resumeData.achievements.length > 0) {
      checkPageBreak(20);
      addText('ACHIEVEMENTS', margin, currentY, 12, 'bold');
      currentY += 2;
      addLine(currentY);
      currentY += sectionSpacing;

      resumeData.achievements.forEach((achievement) => {
        if (achievement.trim()) {
          checkPageBreak(8);
          addText('•', margin + 3, currentY, 11, 'normal');
          const achievementLines = wrapText(achievement, contentWidth - 10, 11);
          achievementLines.forEach((line: string, index: number) => {
            addText(line, margin + 8, currentY, 11, 'normal');
            if (index < achievementLines.length - 1) currentY += lineHeight;
          });
          currentY += lineHeight;
        }
      });
    }

    // Save the PDF
    pdf.save(filename);
    return true;
    
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};
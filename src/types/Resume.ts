export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  relevantCoursework?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Project {
  id: string;
  title: string;
  technologies: string;
  date?: string;
  description: string[];
  link?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  professionalSummary?: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  achievements?: string[];
}

// Validation schemas
export const validatePersonalInfo = (info: PersonalInfo): string[] => {
  const errors: string[] = [];

  if (!info.fullName?.trim()) {
    errors.push("Full name is required");
  }

  if (!info.email?.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    errors.push("Please enter a valid email address");
  }

  if (!info.phone?.trim()) {
    errors.push("Phone number is required");
  }

  if (!info.address?.trim()) {
    errors.push("Address is required");
  }

  return errors;
};

export const validateResumeData = (data: ResumeData): string[] => {
  const errors: string[] = [];

  // Validate personal info
  errors.push(...validatePersonalInfo(data.personalInfo));

  // Validate professional summary (optional but recommended)
  if (data.professionalSummary && data.professionalSummary.trim().length < 50) {
    errors.push(
      "Professional summary should be at least 50 characters long for better impact"
    );
  }

  // Validate education
  if (!data.education || data.education.length === 0) {
    errors.push("At least one education entry is required");
  } else {
    data.education.forEach((edu, index) => {
      if (!edu.degree?.trim()) {
        errors.push(`Education ${index + 1}: Degree is required`);
      }
      if (!edu.school?.trim()) {
        errors.push(`Education ${index + 1}: School is required`);
      }
    });
  }

  // Validate skills
  if (!data.skills || data.skills.length === 0) {
    errors.push("At least one skill category is required");
  } else {
    data.skills.forEach((skill, index) => {
      if (!skill.category?.trim()) {
        errors.push(`Skill ${index + 1}: Category is required`);
      }
      if (!skill.items || skill.items.length === 0) {
        errors.push(`Skill ${index + 1}: At least one skill item is required`);
      }
    });
  }

  return errors;
};

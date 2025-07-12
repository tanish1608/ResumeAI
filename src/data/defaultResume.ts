import { ResumeData } from '../types/Resume';

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "Tanish Vardhineni",
    email: "tv2291@nyu.edu",
    phone: "+91 7981228844",
    address: "New York City, New York",
    linkedin: "http://linkedin.com/in/tanish00",
    github: "http://github.com/tanish1608",
    website: "https://tanishdev.netlify.app/"
  },
  education: [
    {
      id: "edu1",
      degree: "Master of Science in Computer Engineering",
      school: "New York University",
      location: "New York City",
      graduationDate: "May 2027",
      gpa: "3.9/4.0",
      relevantCoursework: "Data Structures, Algorithms, Machine Learning, Database Systems, Software Architecture, Image Processing, NLP"
    },
    {
      id: "edu2",
      degree: "Bachelor of Science in Computer Science",
      school: "Anurag University",
      location: "Hyderbad, India",
      graduationDate: "May 2025",
      gpa: "3.8/4.0"
    }
  ],
  experience: [
    {
      id: "exp1",
      title: "Software Developer",
      company: "Thunder Client",
      location: "Dublin, Ireland",
      startDate: "Apr 2023",
      current: true,
      description: [
        "Created a Swagger conversion tool for automated API documentation generation, reducing conversion time from hours to a single click",
        "Introduced an intelligent autocomplete feature, optimizing API interactions and cutting manual entry time by approximately 30%",
        "Developed a high-performance gRPC testing interface, enabling seamless automated test integration into CI/CD pipelines.",
      ]
    },
    {
      id: "exp2",
      title: "Software Developer Intern",
      company: "HSBC Software Developement India",
      location: "Pune, India",
      startDate: "January 2025",
      endDate: "March 2025",
      current: true,
      description: [
        "Led the creation of two internal tools that streamlined workflow efficiency and enhanced stakeholder visibility.",
        "Designed and implemented a real-time transaction monitoring and management system, improving anomaly detection and operational insights.",
        "Engineered an automated GitHub commit tracker featuring dynamic dashboards and analytics, driving enhanced productivity and code review efficiency.", 
      ]
    }
  ],
  projects: [
    {
      id: "proj1",
      title: "Traffic Management Using AI",
      technologies: "Python, Machine Learning, Computer Vision",
      description: [
        "Developed an automated traffic light system that adjusts signals based on real-time lane density data from Existing CCTV cameras.",
        "the system analyzes traffic footage to optimize green signals for congested lane drastically reduction current traffic inefficiencies.",
      ],
      link: "https://github.com/tanish1608/AI-Traffic-Lights.git"
    },
    {
      id: "proj2",
      title: "Buildbot AI",
      technologies: "Python, TensorFlow, Pandas, NumPy, llama3.1/qwen2.0",
      description: [
        "it an application which generates complete full stack websites, with all the dependencies with just a single prompt.",
        "Completely running locally with llama3.1/qwen2.0 Coder using ollama.",
      ],
      link: "https://github.com/tanish1608/AI-Developer-v2.git"
    }
  ],
  skills: [
    {
      category: "Programming Languages",
      items: ["C/C++", "Java", "Python", "TypeScript", "SQL"]
    },
    {
      category: "Technologies",
      items: ["React", "Node.js", "HTML/CSS", "Express.js", "MongoDB", "Git", "Docker", "AWS", "Linux", "TensorFlow"]
    }
  ],
  achievements: [
    "Patented Invention on Automated Modular Chair Positioning System with Deep Learning",
    "Won HSBC AI hackathon among 4,700 applications and secured an internship at HSBC Technology India (HTI)",
    "Published research paper in IEEE Conference on Machine Learning - 2023"
  ]
};
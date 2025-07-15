import { ResumeData } from '../types/Resume';

export const defaultResumeData: ResumeData = {
  "personalInfo": {
    "fullName": "Tanish Vardhineni",
    "email": "tv2291@nyu.edu",
    "phone": "+91 7981228844",
    "address": "New York City, New York",
    "linkedin": "http://linkedin.com/in/tanish00",
    "github": "http://github.com/tanish1608",
    "website": "https://tanishdev.netlify.app/"
  },
  "education": [
    {
      "id": "edu1",
      "degree": "Master of Science in Computer Engineering",
      "school": "New York University",
      "location": "New York City",
      "graduationDate": "May 2027",
      "gpa": "",
      "relevantCoursework": "Data Structures & Algorithms, Machine Learning, Database Systems, Computer Networks, Software Architecture, NLP, Operating Systems, Image Processing"
    },
    {
      "id": "edu2",
      "degree": "Bachelor of Science in Computer Science",
      "school": "Anurag University",
      "location": "Hyderbad, India",
      "graduationDate": "May 2025",
      "gpa": "3.8/4.0",
      "relevantCoursework": "Advanced Data Structures, Object-Oriented Design, Distributed Systems, IoT & Embedded Systems, Compiler Design"
    }
  ],
  "experience": [
    {
      "id": "exp1",
      "title": "Software Developer Intern",
      "company": "Thunder Client",
      "location": "Dublin, Ireland",
      "startDate": "Apr 2023",
      "endDate": "Aug 2025",
      "current": false,
      "description": [
        "Implemented SSO integration and mock transaction server to simulate financial API environments.",
        "Developed a Swagger-to-OpenAPI converter, slashing API documentation time by over 90%.",
        "Led development of a gRPC testing interface and intelligent API autocompletion, improving developer speed by 30%.",
        "Stack: TypeScript, Node.js, MongoDB, Docker, React, OAuth2, RestAPI"
      ]
    },
    {
      "id": "exp2",
      "title": "Software Developer Intern",
      "company": "HSBC Software Developement India",
      "location": "Pune, India",
      "startDate": "January 2025",
      "endDate": "March 2025",
      "current": false,
      "description": [
        "Engineered an automated transaction monitoring platform for real-time anomaly detection and operational transparency using Python, SQL, and Docker.",
        "Built scalable data pipelines to collect and process financial transaction logs for internal analytics tools.",
        "Developed a GitHub productivity dashboard with dynamic visualizations using React, boosting developer feedback loops."
      ]
    }
  ],
  "projects": [
    {
      "id": "proj1",
      "title": "BuildBot AI – LLM-Powered Full-Stack Generator",
      "technologies": "Python, Llama 3.1, Ollama, React, Node.js",
      "description": [
        "Built a fully offline system to generate full-stack web apps from a single prompt using LLMs.",
        "Integrated model selection with Qwen2.0 and vector store querying for memory. Focused on self-contained and scalable architecture with Docker-based deployment."
      ],
      "link": "https://github.com/tanish1608/AI-Developer-v2.git"
    },
    {
      "id": "proj2",
      "title": "Traffic Management System",
      "technologies": "Python, OpenCV, YOLOv8, TensorFlow",
      "description": [
        "Designed a real-time computer vision pipeline to detect congestion via CCTV feeds and dynamically adjust green light timing.",
        "Achieved up to 60% reduction in idle wait times during peak traffic. Deployed on embedded boards for low-power, edge inference use cases."
      ],
      "link": "https://github.com/tanish1608/AI-Traffic-Lights.git"
    }
  ],
  "skills": [
    {
      "category": "Programming Languages",
      "items": [
        "C/C++",
        "Java",
        "Python",
        "TypeScript",
        "SQL"
      ]
    },
    {
      "category": "Technologies",
      "items": [
        "React",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Docker",
        "AWS",
        "Git",
        "gRPC",
        "REST",
        "TensorFlow",
        "PyTorch",
        "Kafka"
      ]
    },
    {
      "category": "Systems & Platforms",
      "items": [
        "Linux",
        "CI/CD",
        "Ollama",
        "Swagger",
        "Postman",
        "VSCode",
        "Jupyter",
        "MySQL",
        "Redis"
      ]
    }
  ],
  "achievements": [
    "Patent Holder: “AI-based Modular Chair Positioning System” using Deep Learning and Sensor Fusion",
    "Winner, HSBC AI Hackathon – Selected from 4700+ entries, awarded internship offer",
    "IEEE ML 2023 Paper: Presented research on lightweight deep learning models for real-time posture correction"
  ]
}
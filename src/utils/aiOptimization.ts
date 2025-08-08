import { ResumeData } from '../types/Resume';

const AI_OPTIMIZATION_PROMPT = `{
   "role": "You are a world-class Resume Optimization Engine specialized in ATS (Applicant Tracking Systems) matching, technical resume writing, and strategic positioning for competitive roles. Your job is to surgically rewrite key resume sections to maximize alignment with a given job description — embedding keywords, showcasing impactful outcomes, and preserving authenticity. Quality output must be human-readable, technically accurate, and tailored for software engineering/technical roles.",

  "optimize_sections": ["summary","relevantCourses", "skills", "experience", "projects", "summary"],

  "objectives": [
    "Match and mirror specific technologies, skills, and job responsibilities from the job description",
    "Infuse keyword-rich content to boost ATS ranking while maintaining natural language flow",
    "Add measurable outcomes, quantifiable success metrics, or technical performance indicators wherever possible",
    "Remove or rewrite vague, generic, or misaligned content; replace with technically rich and job-aligned material",
    "Ensure alignment with seniority level, language proficiency, and domain expertise implied by the job"
  ],

  "rewriting_rules": {
    "Summary": "Craft a 2–3 sentence technical summary tailored to the job role. Mention experience, key domains, and standout technologies, matching JD language, easy to read and understand at a glance.",
    "Relevant Courses": "Include only courses directly aligned with technologies or methodologies required in the JD. Prefer advanced, hands-on, or specialization topics; highlight those that show domain depth.",
    "Skills Section": "Revise to include high-value, job-matching tools, frameworks, protocols, environments, and soft/technical skills. Group into subcategories: e.g., Programming Languages, Frameworks, Tools, Cloud & DevOps, etc.",
    "Experience Content": "Rewrite each experience bullet to reflect one of the core competencies, challenges, or domain applications highlighted in the JD. Use a clear action-impact format. Quantify improvements and outcome where possible.",
    "Projects": "Retain only domain-relevant projects. Each project must include: context/problem, approach, technologies used, and measurable impact. You may reasonably extrapolate technical complexity or scale to match job expectations.",
  },

  "optimization_rules": {
    "Keyword Embedding": "Use exact phrases from the JD (technical skills, verbs, domain terms). Also use common synonyms or related technologies.",
    "Technical Depth": "Demonstrate advanced understanding — include systems design, CI/CD, containerization, ML model lifecycle, cloud infra, DB optimization, etc., when fitting.",
    "Quantification": "Prioritize metrics — throughput, latency, cost reduction, data processed, speedup ratios, revenue lifted, etc.",
    "Business Impact Framing": "Frame technical work in terms of business value: improved efficiency, lower costs, better performance, faster delivery.",
    "Scalability Language": "Use enterprise keywords: 'production-grade', 'real-time', 'scalable distributed system', 'high availability', 'containerized microservices', etc.",
    "Conciseness & Flow": "Reduce wordiness. Use assertive, professional tone. Each bullet should contain ACTION + TECH + QUANTIFIED OUTCOME."
  },

  "style": {
    "Tone": "Sharp, confident, results-driven. Written like a high-performing systems/software/data engineer.",
    "Language": "Simple, clear, and formal but technical. Easy to parse for both ATS bots and hiring managers.",
    "Action Verbs": [
      "Architected", "Engineered", "Designed", "Optimized", "Built", "Deployed",
      "Refactored", "Scaled", "Streamlined", "Automated", "Enhanced", "Reduced",
      "Accelerated", "Integrated", "Monitored", "Debugged", "Delivered"
    ]
  },

  "output_format": {
    "type": "JSON",
    "format": "ResumeData (matches the structure of input resumeData, with updated sections merged in)"
  },

  "input_data": {
    "resumeData": "{resumeData}",
    "jobDescription": "{jobDescription}"
  }
}`;

export const optimizeResumeWithAI = async (resumeData: ResumeData, jobDescription: string): Promise<ResumeData> => {
  try {
    // Check if OpenAI API key is available
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim();
    
    if (!apiKey || apiKey === '') {
      throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }

    if (!jobDescription?.trim()) {
      throw new Error('Job description is required for optimization.');
    }
    
    const prompt = AI_OPTIMIZATION_PROMPT
      .replace('{resumeData}', JSON.stringify(resumeData, null, 2))
      .replace('{jobDescription}', jobDescription);

    // Call OpenAI API
    const optimizedData = await callOpenAI(prompt, apiKey);
    
    return {
      ...resumeData,
      skills: optimizedData.skills,
      experience: optimizedData.experience,
      projects: optimizedData.projects
    };
  } catch (error) {
    console.error('AI optimization failed:', error);
    throw error;
  }
};

// OpenAI API integration
const callOpenAI = async (prompt: string, apiKey: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

  try {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    signal: controller.signal,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer and ATS optimization specialist. You must respond with ONLY valid JSON containing the optimized skills, experience, and projects arrays. Do not include any other text, explanations, or formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    let errorMessage = `OpenAI API error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage += ` - ${errorData.error?.message || 'Unknown error'}`;
    } catch {
      errorMessage += ' - Unable to parse error response';
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content received from OpenAI API');
  }

  try {
    // Parse the JSON response
    const optimizedData = JSON.parse(content);
    
    // Validate the response structure
    if (!optimizedData.skills || !optimizedData.experience || !optimizedData.projects) {
      throw new Error('Invalid response structure from AI');
    }
    
    return optimizedData;
  } catch (parseError) {
    console.error('Failed to parse AI response:', content);
    throw new Error('Invalid JSON response from AI: ' + parseError);
  }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
};
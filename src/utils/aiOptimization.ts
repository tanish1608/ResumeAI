import { ResumeData } from '../types/Resume';

const AI_OPTIMIZATION_PROMPT = `{
  "role": "You are an elite resume strategist and ATS optimization expert with deep experience tailoring resumes to specific job descriptions. Your mission is to transform the candidate's resume to achieve maximum match score with the job posting, while maintaining human readability and technical credibility.",
  
  "objectives": [
    "Dynamically align all experience, skills, and projects with the job description",
    "Maximize keyword match for ATS (Applicant Tracking System) parsing",
    "Showcase measurable impact, technical depth, and relevant domain expertise"
  ],

  "rules": {
    "Preserve Only": ["company name", "employment dates", "education entries"],
    "Rewrite Job Titles": "Match the target role while keeping titles plausible within context",
    "Skills Overhaul": "change the skills according to jd",
    "Experience Rewrite": "Quantify achievements aligned with job keywords and responsibilities",
    "Project Replacement": "Keep only projects with highly relevant stack/domain or replace with imagined, complex ones",
    "Quantification": "Embed strong metrics (%, $, KPIs, latency, volume, etc.)",
    "Keyword Density": "Embed exact job phrases and synonyms naturally across all sections",
    "Modern Practices": "Reflect modern workflows (CI/CD, Agile, MLOps, Microservices, etc.)",
    "Scalability": "Use terms like 'production-grade', 'enterprise-level', 'real-time', 'distributed', where relevant",
    "Formatting": "Return result as a JSON object only — containing skills, experience, and projects arrays"
  },

  "style_guide": {
    "Tone": "Confident, data-driven, technically rich",
    "Language": "Active voice, specific, clear — not flowery",
    "Preferred Verbs": ["Developed", "Engineered", "Optimized", "Scaled", "Reduced", "Led", "Built", "Analyzed", "Shipped", "Architected"]
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
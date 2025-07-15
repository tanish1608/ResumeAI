import { ResumeData } from '../types/Resume';

const AI_OPTIMIZATION_PROMPT = `{
  "role": "You are a top-tier ATS optimization engine and resume strategist. Your task is to rewrite specific sections of a candidate's resume to ensure maximum match with a given job description, while maintaining technical accuracy and human readability.",

  "optimize_sections": ["relevantCourses", "skills", "experience", "projects"],

  "objectives": [
    "Align all rewritten content with the exact technologies, responsibilities, and domain focus in the job description",
    "Embed keywords and technical concepts to maximize ATS keyword ranking",
    "Highlight measurable impact and outcomes (e.g., performance, latency, throughput, accuracy)",
    "Replace unrelated or weak content with highly relevant, technically complex descriptions"
  ],

  "rewriting_rules": {
    "Relevant Courses": "Replace or re-order based on most applicable technical topics in the job posting",
    "Skills Section": "Rebuild with job-specific tools, libraries, protocols, methodologies, and languages",
    "Experience Content": "Completely rewrite to reflect technical achievements aligned with the JD’s core responsibilities. Include measurable results and technologies used",
    "Projects": "Retain only those directly related to the job domain and tech stack. Replace the rest with technically strong, job-matching projects (even if fictional complex projects). All projects should include: problem solved, tools/tech used, metrics/impact, scalability"
  },

  "optimization_rules": {
    "Keyword Embedding": "Use exact terms and synonyms from the job description across all rewritten sections",
    "Technical Depth": "Reflect modern systems (e.g., distributed systems, data pipelines, ML models, CI/CD, cloud, Linux)",
    "Quantification": "Use numbers wherever possible — throughput, latency, cost saved, model accuracy, etc.",
    "Real-World Framing": "Make all rewritten content read like real work (not academic descriptions)",
    "Scalability Terms": "Include phrases like 'production-grade', 'low-latency', 'enterprise-scale', 'real-time', 'high-throughput', 'parallelized', etc.",
    "Conciseness": "Avoid fluff. Focus on action + outcome in each sentence"
  },

  "style": {
    "Tone": "Confident, engineering-focused, metrics-driven",
    "Language": "Clear, active, technical, easy to parse by ATS and humans",
    "Action Verbs": ["Developed", "Optimized", "Engineered", "Built", "Automated", "Deployed", "Scaled", "Architected", "Reduced", "Accelerated"]
  },
  "output_format": {
    "type": "JSON", 
    "format": "ResumeData(same as input json)",
}
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
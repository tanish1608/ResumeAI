import { ResumeData } from '../types/Resume';

const COVER_LETTER_PROMPT = `{
  "role": "You are a world-class cover letter strategist specializing in technical and engineering fields. Your task is to craft concise, impactful, and tailored cover letters that succinctly showcase the applicant's strongest fit for the target role. Every sentence must serve a clear purpose and connect applicant strengths to the company's needs.",

  "goal": "Write a brief, compelling, and fully customized cover letter that immediately demonstrates why the applicant is an outstanding match — blending relevant achievements, motivation, and alignment with the team's unique mission and culture.",

  "critical_instructions": "You must strictly incorporate ALL additional user requirements in structure, language, and content. User requirements always take precedence.",

  "structure": {
    "Opening": "Grab attention: state the specific job title and company. Express genuine enthusiasm and connect your motivation to the company mission or recent achievement.",
    "Body (1-2 concise paragraphs)": [
      "Spotlight the 1–2 most impressive, job-relevant achievements — use quantifiable results and concrete technologies.",
      "Explain domain/tech stack fit. Reference exact skills and tools from the job description.",
      "Display knowledge of/interest in the company (e.g., projects, mission, recent growth, values).",
      "If relevant, connect a personal or academic project directly to the company's work or challenges."
    ],
    "Closing": "Thank the reader, express openness to further discussion, and clearly state your availability for interviews."
  },

  "tone": "Direct, technical, positive, and confident. Use natural, active language — avoid filler or generic compliments.",

  "length": "Target 150–220 words. Prioritize brevity and substance.",

  "personalization": {
    "Company Values": "Reference actual mission, projects, goals, or news about the company whenever feasible.",
    "Tailored Project Mention": "If possible, briefly link a personal/academic project to current company initiatives or challenges."
  },

  "optimization_rules": {
    "Keyword Embedding": "Integrate exact technical language and soft skills from the job description, including synonyms, without disrupting natural flow.",
    "Action & Outcome": "Focus on tangible impact and results in each example (use metrics, scope, speed, or business value).",
    "ATS Compliance": "Write in a way that remains parseable for ATS by using clear, standard job terms and company-specific keywords.",
    "No Fluff": "Exclude generic stories or irrelevant history. Each sentence must advance your candidacy."
  },

  "output_format": "Return only the cover letter text with no commentary, explanation, or markdown formatting.",

  "input_data": {
    "resumeData": "{resumeData}",
    "jobDescription": "{jobDescription}",
    "additionalRequirements": "{additionalRequirements}"
  }
}`;

export const generateCoverLetter = async (resumeData: ResumeData, jobDescription: string, additionalRequirements: string = ''): Promise<string> => {
  try {
    // Check if OpenAI API key is available
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim();
    
    if (!apiKey || apiKey === '') {
      throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }

    if (!jobDescription?.trim() && !additionalRequirements?.trim()) {
      throw new Error('Either job description or additional requirements must be provided.');
    }
    
    const prompt = COVER_LETTER_PROMPT
      .replace('{resumeData}', JSON.stringify(resumeData, null, 2))
      .replace('{jobDescription}', jobDescription)
      .replace('{additionalRequirements}', additionalRequirements);

    // Call OpenAI API
    const coverLetterContent = await callOpenAI(prompt, apiKey);
    
    return coverLetterContent;
  } catch (error) {
    console.error('Cover letter generation failed:', error);
    throw error;
  }
};

// OpenAI API integration
const callOpenAI = async (prompt: string, apiKey: string): Promise<string> => {
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
          content: 'You are an expert cover letter writer. You must respond with ONLY the cover letter body text. Do not include any headers, footers, dates, addresses, or salutations as these will be added automatically. Do not include any other text, explanations, or formatting. CRITICAL: If additional requirements are provided, they take HIGHEST PRIORITY and must be strictly followed while maintaining professional quality. Adapt the structure, tone, length, and content according to these requirements.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
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

  return content.trim();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
};
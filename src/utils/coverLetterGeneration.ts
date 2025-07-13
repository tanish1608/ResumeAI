import { ResumeData } from '../types/Resume';

const COVER_LETTER_PROMPT = `{
  "role": "You are an expert career cover letter strategist. who write human like and talks point to point no unwanted stories",
  
  "goal": "Craft a short, compelling, customized cover letter that showcases the applicant's alignment with the target job, demonstrating  expertise, motivation, and fit with the team's mission.",

  "critical_instructions": "IMPORTANT: You must strictly follow any additional requirements provided by the user. These requirements take HIGHEST PRIORITY and must be incorporated into the cover letter structure, tone, and content.",
  "structure": {
    "Opening": "A sharp hook — briefly mention role + a reason you're excited about it (align passion and company/team values)",
    "Body (1-2 Paragraphs)": [
      "Highlight top 1-2 accomplishments relevant to the job",
      "Mention tech stack/domain alignment clearly",
      "Demonstrate interest in the company/team's mission, culture, or innovations"
    ],
    "Closing": "Politely invite the reader to continue the conversation. Mention availability and thank them"
  },

  "tone": "Genuine, technical, confident — not overly formal",
  "length": "150–250 words",
  "personalization": {
    "Company Values": "Reference the company's goals, breakthroughs, or team culture when possible",
    "Project Mention": "Link a personal or academic project to the company's work if applicable"
  },

  "input_data": {
    "resumeData": "{resumeData}",
    "jobDescription": "{jobDescription}",
    "additionalRequirements": "{additionalRequirements}"
  },

  "output_format": "Return only the cover letter text with no commentary or explanation."
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
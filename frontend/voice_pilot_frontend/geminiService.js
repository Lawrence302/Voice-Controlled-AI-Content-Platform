
import { GoogleGenAI } from "@google/genai";
const  GEMINI_MODEL_NAME  = 'gemini-2.5-flash-preview-04-17'

// Ensure API_KEY is available from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set in environment variables.");
  // In a real app, you might throw an error or handle this more gracefully
  // For this example, we'll let it proceed and fail during API call if key is missing.
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Provide a fallback to avoid immediate crash if undefined

const PROMPT_TEMPLATE = (topic) => `Generate a blog post based on the topic: "${topic}".
The post should be engaging and informative.
Please provide:
1. A unique and catchy title (string).
2. A concise summary of about 30-50 words (string).
3. The main content for the blog post (string, plain text, which can include multiple paragraphs typically separated by newline characters).

Format the output STRICTLY as a JSON object with three keys: "title", "summary", and "content".
Example JSON:
{
  "title": "Example Title",
  "summary": "This is an example summary of the blog post.",
  "content": "This is the first paragraph of the example content.\\n\\nThis is the second paragraph."
}`;


export const generateBlogPostContent = async (topic) => {
  if (!API_KEY) {
    // Simulate an error if API key is missing to prevent actual API call
    return Promise.reject(new Error("Gemini API Key is not configured. Please set the API_KEY environment variable."));
  }
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: PROMPT_TEMPLATE(topic),
      config: {
        responseMimeType: "application/json",
        temperature: 0.7, 
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);

    if (
      typeof parsedData.title === 'string' &&
      typeof parsedData.summary === 'string' &&
      typeof parsedData.content === 'string'
    ) {
      return {
        title: parsedData.title,
        summary: parsedData.summary,
        content: parsedData.content,
      };
    } else {
      console.error("Invalid JSON structure received from AI:", parsedData);
      throw new Error('Received invalid data structure from AI. Expected { title: string, summary: string, content: string }');
    }
  } catch (error) {
    console.error('Error generating blog post:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate blog post: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating the blog post.');
  }
};
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Make sure you've installed `@google/generative-ai`

@Injectable()
export class GeminiExtractorService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY ?? (() => { throw new Error('GEMINI_API_KEY is not defined in the environment variables'); })();
    this.genAI = new GoogleGenerativeAI(apiKey); // Store this key in your .env file
  }

  async extractAndCategorize(description: string): Promise<any> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
    You are an intelligent assistant designed to extract structured data from issue descriptions. The essence of this platform is to allow users to report issues related to public services or infrastructure. Your task is to categorize and extract details from the description. 

    The platform supports reporting for the following categories:
    - Water
    - Electricity
    - Road
    - Sanitation
    - Security
    - Health
    - Education
    - Traffic

    If the description is not related to any of these categories, the message field  states: "Sorry, we can't help with this."

    Given a description of a reported issue, extract the following fields in a structured JSON format:
    - category (choose from: ["Water", "Electricity", "Road", "Sanitation", "Security", "Health", "Education", "Traffic"])
    - address (include street names or landmarks)
    - city (name of the city or town)
    - state (name of the state or region)
    - country (name of the country)
    - latitude (a numerical value if provided or inferred)
    - longitude (a numerical value if provided or inferred)
    - priority (Low, Medium, High based on urgency)
    - summary (a brief summary of the issue in one or two sentences)
    - action_title (a project title description summarizing the issue and required action)
    - estimated_cost (an estimated cost based on the description of the issue, such as repair cost, materials, etc.)


    If any of the fields above — *excluding address field, latitude, and longitude* — cannot be confidently extracted, tell the user what specific details they did not provide in the "message" field, and the "status" field should be "false"
    
    ### Example:
    Description: "There’s a large pothole at the corner of 5th Avenue and Elm Street in downtown Lagos. Cars are swerving dangerously to avoid it."
    
    Output:
    {
      "category": "Road",
      "address": "5th Avenue and Elm Street",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "latitude": 6.5244,
      "longitude": 3.3792,
      "priority": "High",
      "summary": "Large pothole at the corner of 5th Avenue and Elm Street causing dangerous swerving by vehicles.",
      "action_title": "Fix Pothole at 5th Avenue and Elm Street to Prevent Accidents",
      "missing": [],
      "message": ""
      "status": ""
      "estimated_cost": 5000,
    }
    
    Now extract for the following:
    
    Description: "${description}"
    
    Return only a valid JSON object.
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response.text();

      // Clean the response by removing any Markdown or unwanted characters
      const cleanedResponse = response.replace(/```json|```|```/g, '').trim();  // Remove backticks or code block markers

      try {
        return JSON.parse(cleanedResponse); // Try to parse the cleaned response
      } catch (error) {
        // If the cleaned response still isn't valid JSON, log the error and return default
        console.error('Error parsing cleaned response as JSON:', error);
        console.error('Cleaned response:', cleanedResponse);
        return {
          category: 'Other',
          address: '',
          city: '',
          state: '',
          country: '',
          latitude: 0,
          longitude: 0,
          priority: 'Low',
        };
      }
    } catch (error) {
      // Catch and log any issues during the request to the AI model
      console.error('Error generating content from AI model:', error);
      return {
        category: 'Other',
        address: '',
        city: '',
        state: '',
        country: '',
        latitude: 0,
        longitude: 0,
        priority: 'Low',
      };
    }
  }
}

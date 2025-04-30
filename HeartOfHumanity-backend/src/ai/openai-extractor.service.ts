// File: ai/openai-extractor.service.ts
import { Injectable } from '@nestjs/common';
import { AiExtractor } from './ai-extractor.interface';
import OpenAI from 'openai';
import { CreateIssueDto } from '../issues/dto/create-issue.dto';

@Injectable()
export class OpenAiExtractorService implements AiExtractor {
    private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    async extractAndCategorize(description: string): Promise<Partial<CreateIssueDto>> {
        const prompt = `
            Extract the following fields from the issue description:
            - category (Water, Electricity, Medical, Food, Other)
            - address (free text)
            - city
            - state
            - country
            - priority (Low, Medium, High)
            
            Respond in JSON format:
            
            Description: "${description}"
        `;

        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            });

            const content = response.choices[0]?.message?.content ?? '{}';
            const extractedData = JSON.parse(content);

            // Type check to ensure we receive valid data
            const issueData: Partial<CreateIssueDto> = {
                category: extractedData.category || 'Other',  // Default to 'Other' if not found
                address: extractedData.address || '',
                city: extractedData.city || '',
                state: extractedData.state || '',
                country: extractedData.country || '',
                priority: extractedData.priority || 'Low', // Default to 'Low' if not found
            };

            return issueData;
        } catch (error) {
            console.error('Error extracting details:', error);
            // Return default values or an empty object
            return {
                category: 'Other',
                address: '',
                city: '',
                state: '',
                country: '',
                priority: 'Low',
            };
        }
    }
}

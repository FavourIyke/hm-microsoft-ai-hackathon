// File: ai/ai.module.ts
import { Module } from '@nestjs/common';
import { OpenAiExtractorService } from './openai-extractor.service';

@Module({
  providers: [OpenAiExtractorService],
  exports: [OpenAiExtractorService],  // Export OpenAiExtractorService so it can be used in other modules
})
export class AiModule {}

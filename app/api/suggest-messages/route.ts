import { generateText } from 'ai';
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt:
        'Generate 3 interesting, fun, and open-ended questions that someone might ask a stranger anonymously. Separate each question with "||" and nothing else. Keep each question under 100 characters. Only output the questions with no numbering or extra text.',
    });
    return Response.json({ success: true, messages: text });
  } catch (error) {
    return Response.json({
      success: false,
      message: 'Failed to generate suggestions',
      messages:
        'What is your biggest dream? || What is one thing most people do not know about you? || If you could relive one day, what would it be?',
    });
  }
}
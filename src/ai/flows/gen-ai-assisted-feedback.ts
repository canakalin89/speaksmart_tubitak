
'use server';

/**
 * @fileOverview Provides AI-powered feedback on a student's spoken English by directly analyzing audio.
 * It assesses rapport, organisation, delivery, language use, and creativity, and also provides a transcription.
 *
 * - genAiAssistedFeedback - A function that handles the process of generating feedback for student's speech.
 * - GenAiAssistedFeedbackInput - The input type for the genAiAssistedFeedback function.
 * - GenAiAssistedFeedbackOutput - The return type for the genAiAssistedFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenAiAssistedFeedbackInputSchema = z.object({
  audio: z
    .string()
    .describe(
      "A base64 encoded audio file with a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  taskDescription: z
    .string()
    .describe('The description of the speaking task the student completed.'),
  language: z.enum(['tr', 'en']).describe('The language for the feedback response.'),
});
export type GenAiAssistedFeedbackInput = z.infer<typeof GenAiAssistedFeedbackInputSchema>;

const GenAiAssistedFeedbackOutputSchema = z.object({
  transcribedText: z.string().describe('The transcription of the spoken audio.'),
  
  rapportFeedback: z.string().describe('Feedback on the student’s rapport with the audience (based on tone, engagement).'),
  rapportScore: z.number().describe('A score from 0-100 for the student\'s rapport.'),

  organisationFeedback: z.string().describe('Feedback on the student’s organisation (clarity of beginning, middle, end, and flow of ideas).'),
  organisationScore: z.number().describe('A score from 0-100 for the student\'s organisation.'),
  
  deliveryFeedback: z.string().describe('Feedback on the student’s delivery (pace, intonation, clarity, and pronunciation).'),
  deliveryScore: z.number().describe('A score from 0-100 for the student\'s delivery.'),

  languageUseFeedback: z.string().describe('Feedback on the student’s language use (grammar and vocabulary).'),
  languageUseScore: z.number().describe('A score from 0-100 for the student\'s language use.'),

  creativityFeedback: z.string().describe('Feedback on the student’s creativity (originality of ideas, vivid language).'),
  creativityScore: z.number().describe('A score from 0-100 for the student\'s creativity.'),

  overallFeedback: z.string().describe('Overall feedback on the student’s speaking performance.'),
  overallScore: z.number().describe('An overall score from 0-100 for the student\'s performance.'),
});
export type GenAiAssistedFeedbackOutput = z.infer<typeof GenAiAssistedFeedbackOutputSchema>;

export async function genAiAssistedFeedback(input: GenAiAssistedFeedbackInput): Promise<GenAiAssistedFeedbackOutput> {
  const result = await genAiAssistedFeedbackFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'genAiAssistedFeedbackPrompt',
  input: {schema: GenAiAssistedFeedbackInputSchema.extend({ languageFullName: z.string() })},
  output: {schema: GenAiAssistedFeedbackOutputSchema},
  model: 'googleai/gemini-2.5-pro',
  prompt: `You are an AI-powered English language tutor providing feedback to students on their spoken English.
  Your task is to analyze the provided audio recording directly. Since you are only analyzing audio, you must infer criteria like 'eye contact' or 'visual aids' from the speaker's tone, vocal energy, and descriptive language.

  First, transcribe the spoken words in the audio file accurately.

  Then, based on the audio and the provided task description, provide feedback on the following 5 criteria:

  1. Rapport with the Audience:
      - Demonstrates understanding of the subject (Is the speaker knowledgeable and confident?).
      - Provides additional relevant details when needed (Does the speaker elaborate on points effectively?).
      - Note: Since there are no live questions, evaluate this based on how well the speaker anticipates audience interest and provides comprehensive information.
      Provide a score from 0-100 for this category and detailed feedback on how to improve.

  2. Organisation:
      - The presentation has a clear beginning, middle, and end.
      - The flow of the ideas is sequenced well.
      Provide a score from 0-100 and detailed feedback on how to improve.
      
  3. Delivery:
      - Speaks with a strong and clear voice.
      - Pronunciation is clear and accurate.
      - Effectively manages presentation time (Based on the length of the audio, does the speech feel rushed or too slow for the task?).
      - Note: For 'Maintains eye contact', evaluate the speaker's vocal energy and engagement. A confident and engaging tone can serve as an audio-based proxy for good eye contact.
      Provide a score from 0-100 and detailed feedback on how to improve.

  4. Language Use:
      - Uses accurate and appropriate grammar.
      - Vocabulary is relevant to the topic.
      - Note: You cannot check spelling and punctuation. Base your evaluation only on spoken grammar and vocabulary.
      Provide a score from 0-100 and detailed feedback on how to improve.

  5. Creativity:
      - The presentation is original and interesting.
      - The language is vivid and imaginative, helping to paint a picture in the listener's mind.
      - Note: Instead of 'visual aids', evaluate how well the speaker uses descriptive language to create "mental visuals" for the audience.
      Provide a score from 0-100 and detailed feedback on how to improve.

  Finally, provide overall feedback on the student's speaking performance, summarizing their strengths and weaknesses, and offering actionable advice for improvement. Then, provide an overall score as the average of the other five scores.

  Task Description: {{{taskDescription}}}
  Audio for analysis: {{media url=audio}}

  Respond in {{languageFullName}}.
  The scores should be numbers between 0-100.
  Each feedback text should clearly state the mistakes and offer concrete suggestions for improvement.
  `,
});

const genAiAssistedFeedbackFlow = ai.defineFlow(
  {
    name: 'genAiAssistedFeedbackFlow',
    inputSchema: GenAiAssistedFeedbackInputSchema,
    outputSchema: GenAiAssistedFeedbackOutputSchema,
  },
  async input => {
    const languageFullName = input.language === 'tr' ? 'Turkish' : 'English';
    const {output} = await prompt({...input, languageFullName: languageFullName});
    return output!;
  }
);

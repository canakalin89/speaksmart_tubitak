
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
import {z} from 'genkit';

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
  return genAiAssistedFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'genAiAssistedFeedbackPrompt',
  input: {schema: GenAiAssistedFeedbackInputSchema},
  output: {schema: GenAiAssistedFeedbackOutputSchema},
  prompt: `You are an AI-powered English language tutor providing feedback to students on their spoken English.
  Your task is to analyze the provided audio recording directly.

  First, transcribe the spoken words in the audio file accurately.

  Then, based on the audio and the provided task description, provide feedback on the following 5 criteria:

  1.  Rapport with the audience: From the audio and transcribed text, analyze the speaker's connection with the audience.
      - Demonstrates understanding of the subject.
      - Answers class questions accurately.
      - Provides additional relevant details when needed.
      Provide a score from 0-100 for this category.

  2.  Organisation: Analyze the structure of the speech.
      - The presentation has a clear beginning, middle, and end.
      - The flow of the ideas is sequenced well.
      Provide a score from 0-100.
  3.  Delivery: Analyze the delivery from the audio. 
      - Speaks with a strong and clear voice.
      - Pronunciation is clear and accurate.
      - Comment on pace and intonation. Is the voice strong and clear? 
      Provide a score from 0-100.
  4.  Language use: Analyze the grammar and vocabulary from the transcribed text. 
      - Uses accurate and appropriate grammar.
      - Vocabulary is relevant to the topic.
      Provide a score from 0-100.
  5.  Creativity: Analyze the originality of the ideas and the language used. 
      - Is the approach to the topic unique? 
      - Is the language vivid and imaginative? 
      Provide a score from 0-100.

  Finally, provide overall feedback on the student's speaking performance, summarizing their strengths and weaknesses, and offering actionable advice for improvement. Then, provide an overall score as the average of the other five scores.

  Task Description: {{{taskDescription}}}
  Audio for analysis: {{media url=audio}}

  Respond in {{#if language}}{{#ifeq language "tr"}}Turkish{{else}}English{{/ifeq}}{{else}}Turkish{{/if}}.
  The scores should be numbers between 0-100.
  `,
});

const genAiAssistedFeedbackFlow = ai.defineFlow(
  {
    name: 'genAiAssistedFeedbackFlow',
    inputSchema: GenAiAssistedFeedbackInputSchema,
    outputSchema: GenAiAssistedFeedbackOutputSchema,
    model: 'googleai/gemini-2.5-pro'
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


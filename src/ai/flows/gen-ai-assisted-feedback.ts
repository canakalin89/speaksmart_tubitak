
'use server';

/**
 * @fileOverview Provides AI-powered feedback on a student's spoken English by directly analyzing audio.
 * It assesses organisation, delivery, and language use, and also provides a transcription.
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
});
export type GenAiAssistedFeedbackInput = z.infer<typeof GenAiAssistedFeedbackInputSchema>;

const GenAiAssistedFeedbackOutputSchema = z.object({
  transcribedText: z.string().describe('The transcription of the spoken audio.'),
  organisationFeedback: z.string().describe('Feedback on the student’s organisation based on the audio (clarity of beginning, middle, end, and flow of ideas).'),
  organisationScore: z.number().describe('A score from 0-100 for the student\'s organisation.'),
  deliveryFeedback: z.string().describe('Feedback on the student’s delivery based on the audio (strong/clear voice, pronunciation).'),
  deliveryScore: z.number().describe('A score from 0-100 for the student\'s delivery.'),
  languageUseFeedback: z.string().describe('Feedback on the student’s language use based on the transcribed text (grammar and vocabulary).'),
  languageUseScore: z.number().describe('A score from 0-100 for the student\'s language use.'),
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

  Then, based on the audio and the provided task description, provide feedback on the following aspects:

  1.  Organisation: Analyze the structure of the speech. Does it have a clear beginning, middle, and end? Is the flow of ideas well-sequenced? Provide a score from 0-100.
  2.  Delivery: Analyze the delivery from the audio. Is the voice strong and clear? Is the pronunciation clear and accurate? Comment on pace and rhythm. Provide a score from 0-100.
  3.  Language Use: Review the grammar and vocabulary of the transcribed text. Is the grammar accurate? Is the vocabulary relevant and varied? Provide a score from 0-100.
  4.  Overall: Provide overall feedback on the student's speaking performance, summarizing their strengths and weaknesses, and offering actionable advice for improvement. Then, provide an overall score as the average of the other three scores.

  Task Description: {{{taskDescription}}}
  Audio for analysis: {{media url=audio}}

  Respond in Turkish.
  The scores should be numbers between 0 and 100.
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

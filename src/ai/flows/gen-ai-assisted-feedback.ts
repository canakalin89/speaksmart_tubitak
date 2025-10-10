
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
  
  organisationFeedback: z.string().describe('Feedback on the student’s organisation (clarity of beginning, middle, end, and flow of ideas).'),
  organisationScore: z.number().describe('A score from 0-100 for the student\'s organisation.'),
  
  contentFeedback: z.string().describe('Feedback on the content of the speech (relevance, depth, and accuracy).'),
  contentScore: z.number().describe('A score from 0-100 for the content.'),

  deliveryFeedback: z.string().describe('Feedback on the student’s delivery (pace, intonation, clarity, and pronunciation).'),
  deliveryScore: z.number().describe('A score from 0-100 for the student\'s delivery.'),

  grammarFeedback: z.string().describe('Feedback on the student\'s grammar usage.'),
  grammarScore: z.number().describe('A score from 0-100 for the student\'s grammar.'),

  vocabularyFeedback: z.string().describe('Feedback on the student\'s vocabulary usage (range and accuracy).'),
  vocabularyScore: z.number().describe('A score from 0-100 for the student\'s vocabulary.'),

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

  1.  Organisation: Analyze the structure of the speech. Does it have a clear beginning, middle, and end? Is the flow of ideas well-sequenced? Provide a score from 0-100.
  2.  Content: Analyze the content of the speech. How relevant, deep, and accurate is the content in relation to the task? Provide a score from 0-100.
  3.  Delivery: Analyze the delivery from the audio. Comment on pace, intonation, clarity and pronunciation. Is the voice strong and clear? Provide a score from 0-100.
  4.  Grammar: Review the grammar of the transcribed text. Is it accurate? Are sentence structures correct? Provide a score from 0-100.
  5.  Vocabulary: Review the vocabulary of the transcribed text. Is it relevant, varied, and used accurately? Provide a score from 0-100.

  Finally, provide overall feedback on the student's speaking performance, summarizing their strengths and weaknesses, and offering actionable advice for improvement. Then, provide an overall score as the average of the other five scores.

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

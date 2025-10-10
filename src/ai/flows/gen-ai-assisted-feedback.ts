
'use server';

/**
 * @fileOverview Provides AI-powered feedback on a student's spoken English by directly analyzing audio.
 * It assesses pronunciation, fluency, and grammar, and also provides a transcription.
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
  pronunciationFeedback: z.string().describe('Feedback on the student’s pronunciation based on the audio.'),
  pronunciationScore: z.number().describe('A score from 0-100 for the student\'s pronunciation.'),
  fluencyFeedback: z.string().describe('Feedback on the student’s fluency based on the audio.'),
  fluencyScore: z.number().describe('A score from 0-100 for the student\'s fluency.'),
  grammarFeedback: z.string().describe('Feedback on the student’s grammar based on the transcribed text.'),
  grammarScore: z.number().describe('A score from 0-100 for the student\'s grammar.'),
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

  1.  Pronunciation: Directly analyze the student's pronunciation from the audio. Highlight any mispronounced words or sounds. Suggest ways to improve their pronunciation. Then, provide a score for their pronunciation on a scale of 0 to 100.
  2.  Fluency: Assess the student's fluency from the audio, commenting on their pace, rhythm, and use of pauses. Provide tips on how to speak more fluently. Then, provide a score for their fluency on a scale of 0 to 100.
  3.  Grammar: Review the grammar of the transcribed text, pointing out any errors and suggesting corrections. Explain the grammatical rules involved. Then, provide a score for their grammar on a scale of 0 to 100.
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

    
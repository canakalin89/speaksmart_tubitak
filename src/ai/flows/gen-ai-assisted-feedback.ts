'use server';

/**
 * @fileOverview Provides AI-powered feedback on a student's spoken English, focusing on pronunciation, fluency, and grammar.
 *
 * - genAiAssistedFeedback - A function that handles the process of generating feedback for student's speech.
 * - GenAiAssistedFeedbackInput - The input type for the genAiAssistedFeedback function.
 * - GenAiAssistedFeedbackOutput - The return type for the genAiAssistedFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenAiAssistedFeedbackInputSchema = z.object({
  spokenText: z
    .string()
    .describe("The student's spoken text in English."),
  taskDescription: z
    .string()
    .describe('The description of the speaking task the student completed.'),
});
export type GenAiAssistedFeedbackInput = z.infer<typeof GenAiAssistedFeedbackInputSchema>;

const GenAiAssistedFeedbackOutputSchema = z.object({
  pronunciationFeedback: z.string().describe('Feedback on the student’s pronunciation.'),
  fluencyFeedback: z.string().describe('Feedback on the student’s fluency.'),
  grammarFeedback: z.string().describe('Feedback on the student’s grammar.'),
  overallFeedback: z.string().describe('Overall feedback on the student’s speaking performance.'),
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

  Based on the student's spoken text and the task description, provide feedback on the following aspects:

  1.  Pronunciation: Provide specific feedback on the student's pronunciation, highlighting any mispronounced words or sounds. Suggest ways to improve their pronunciation.
  2.  Fluency: Assess the student's fluency, commenting on their pace, rhythm, and use of pauses. Provide tips on how to speak more fluently.
  3.  Grammar: Review the student's grammar, pointing out any errors and suggesting corrections. Explain the grammatical rules involved.
  4.  Overall: Provide overall feedback on the student's speaking performance, summarizing their strengths and weaknesses, and offering actionable advice for improvement.

  Task Description: {{{taskDescription}}}
  Student's Spoken Text: {{{spokenText}}}

  Respond in Turkish.
  `,
});

const genAiAssistedFeedbackFlow = ai.defineFlow(
  {
    name: 'genAiAssistedFeedbackFlow',
    inputSchema: GenAiAssistedFeedbackInputSchema,
    outputSchema: GenAiAssistedFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

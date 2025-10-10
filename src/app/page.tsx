'use client';

import { useState, useRef, FormEvent } from 'react';
import {
  genAiAssistedFeedback,
  GenAiAssistedFeedbackOutput,
} from '@/ai/flows/gen-ai-assisted-feedback';
import { speechToText } from '@/ai/flows/speech-to-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Loader2, Languages, Milestone, MessageCircle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [taskDescription, setTaskDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<GenAiAssistedFeedbackOutput | null>(
    null
  );
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();


  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = handleStopRecording;

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setFeedback(null);
      setTranscribedText(null);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access the microphone. Please check your browser permissions.",
      });
    }
  };

  const handleStopRecording = async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsLoading(true);

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

    // Stop all media tracks to turn off the microphone indicator
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;

      try {
        // Step 1: Speech-to-text
        toast({ title: 'Transcribing your speech...', description: 'Please wait.' });
        const sttResult = await speechToText({ audio: base64Audio });
        setTranscribedText(sttResult.text);

        if (!sttResult.text) {
          throw new Error('Transcription failed. The returned text is empty.');
        }

        // Step 2: Get feedback
        toast({ title: 'Generating feedback...', description: 'Our AI is analyzing your speech.' });
        const feedbackResult = await genAiAssistedFeedback({
          spokenText: sttResult.text,
          taskDescription,
        });
        setFeedback(feedbackResult);
        toast({
          title: 'Feedback Ready!',
          description: 'Your AI-powered feedback has been generated.',
        });

      } catch (error: any) {
        console.error('Error during AI processing:', error);
        toast({
          variant: 'destructive',
          title: 'An Error Occurred',
          description: error.message || 'Failed to get feedback from the AI. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };
  };

  const toggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const canSubmit = taskDescription.trim().length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <header className="py-6 px-4 md:px-8 border-b border-border">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold text-primary">AI English Tutor</h1>
            <p className="mt-2 text-lg text-muted-foreground">Improve your spoken English with AI-powered feedback.</p>
          </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Your Speaking Task</CardTitle>
              <CardDescription>Describe the task and record your response.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="E.g., 'Introduce yourself in a job interview' or 'Describe your last vacation.'"
                value={taskDescription}
                onChange={e => setTaskDescription(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <Button
                onClick={toggleRecording}
                disabled={!canSubmit || isLoading}
                className="w-full flex items-center justify-center gap-2"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : isRecording ? (
                  <>
                    <MicOff /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic /> Start Recording
                  </>
                )}
              </Button>
               {isRecording && (
                <div className="flex items-center justify-center text-sm text-red-500 animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  Recording...
                </div>
              )}
            </CardContent>
          </Card>

          <div className="md:col-span-2 lg:col-span-2 space-y-8">
            {isLoading && !feedback && (
               <Card className="flex flex-col items-center justify-center p-8 h-full">
                  <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
                  <p className="text-lg text-muted-foreground">Analyzing your speech... Please wait.</p>
               </Card>
            )}

            {transcribedText && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Languages/> Your Spoken Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="italic text-muted-foreground">{transcribedText}</p>
                </CardContent>
              </Card>
            )}

            {feedback && (
              <div className="space-y-6">
                 <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star /> Overall Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feedback.overallFeedback}</p>
                  </CardContent>
                </Card>
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><Milestone /> Pronunciation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{feedback.pronunciationFeedback}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><Milestone /> Fluency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{feedback.fluencyFeedback}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><MessageCircle /> Grammar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{feedback.grammarFeedback}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
             {!isLoading && !feedback && !transcribedText && (
              <Card className="flex flex-col items-center justify-center p-8 h-full text-center">
                  <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
                  <p className="text-muted-foreground">
                    1. Describe your speaking task in the box on the left.
                  </p>
                  <p className="text-muted-foreground">
                    2. Click "Start Recording" and speak into your microphone.
                  </p>
                  <p className="text-muted-foreground">
                    3. Click "Stop Recording" to get your instant AI feedback!
                  </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

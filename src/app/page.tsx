'use client';

import { useState, useRef, FormEvent } from 'react';
import {
  genAiAssistedFeedback,
  GenAiAssistedFeedbackOutput,
} from '@/ai/flows/gen-ai-assisted-feedback';
import { speechToText } from '@/ai/flows/speech-to-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Loader2, Languages, GraduationCap, Zap, BrainCircuit, Speech } from 'lucide-react';
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
        title: "Mikrofon Hatası",
        description: "Mikrofona erişilemedi. Lütfen tarayıcı izinlerinizi kontrol edin.",
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

    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;

      try {
        toast({ title: 'Konuşmanız metne dönüştürülüyor...', description: 'Lütfen bekleyin.' });
        const sttResult = await speechToText({ audio: base64Audio });
        setTranscribedText(sttResult.text);

        if (!sttResult.text) {
          throw new Error('Metne dönüştürme başarısız. Dönen metin boş.');
        }
        
        toast({ title: 'Geri bildirim oluşturuluyor...', description: 'Yapay zeka konuşmanızı analiz ediyor.' });
        const feedbackResult = await genAiAssistedFeedback({
          spokenText: sttResult.text,
          taskDescription,
        });
        setFeedback(feedbackResult);
        toast({
          title: 'Geri Bildirim Hazır!',
          description: 'Yapay zeka destekli geri bildiriminiz oluşturuldu.',
        });

      } catch (error: any) {
        console.error('Yapay zeka işleme sırasında hata:', error);
        toast({
          variant: 'destructive',
          title: 'Bir Hata Oluştu',
          description: error.message || 'Yapay zekadan geri bildirim alınamadı. Lütfen tekrar deneyin.',
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
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 md:px-8 border-b border-border shadow-sm">
          <div className="container mx-auto text-center">
            <div className="flex justify-center items-center gap-4 mb-2">
              <GraduationCap className="w-12 h-12 text-primary"/>
              <h1 className="text-4xl font-bold text-primary tracking-tight">AI İngilizce Eğitmeni</h1>
            </div>
            <p className="mt-2 text-lg text-muted-foreground">
              <span className="font-semibold">Türkiye Yüzyılı Maarif Modeli</span> ile İngilizce konuşma becerilerinizi geliştirin.
            </p>
            <p className="mt-2 text-md text-muted-foreground">
              Aziz Sancar Anadolu Lisesi - TÜBİTAK 4006-B Projesi
            </p>
          </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>1. Görevinizi Tanımlayın</CardTitle>
              <CardDescription>Konuşma görevinizi açıklayın ve kayda başlayın.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Örn: 'Bir iş görüşmesinde kendinizi tanıtın' veya 'Son tatilinizi anlatın.'"
                value={taskDescription}
                onChange={e => setTaskDescription(e.target.value)}
                rows={4}
                className="resize-none text-base"
              />
              <Button
                onClick={toggleRecording}
                disabled={!canSubmit || isLoading}
                className="w-full flex items-center justify-center gap-2 transition-all duration-300"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : isRecording ? (
                  <>
                    <MicOff /> Kaydı Durdur
                  </>
                ) : (
                  <>
                    <Mic /> 2. Kayda Başla
                  </>
                )}
              </Button>
               {isRecording && (
                <div className="flex items-center justify-center text-sm text-red-500 animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-ping"></div>
                  Kayıt yapılıyor...
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-8">
            {isLoading && !feedback && (
               <Card className="flex flex-col items-center justify-center p-8 h-full min-h-[400px]">
                  <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
                  <h3 className="text-2xl font-semibold text-primary mb-2">Analiz Ediliyor...</h3>
                  <p className="text-lg text-muted-foreground">Yapay zeka konuşmanızı değerlendiriyor, lütfen bekleyin.</p>
               </Card>
            )}

            {!isLoading && !feedback && !transcribedText && (
              <Card className="flex flex-col items-center justify-center p-8 h-full min-h-[400px] text-center border-dashed">
                  <Zap className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Başlamaya Hazır mısınız?</h3>
                  <p className="text-muted-foreground max-w-md">
                    Görevinizi tanımlayın, kayda başlayın ve yapay zeka destekli anında geri bildirim alarak İngilizce konuşmanızı mükemmelleştirin!
                  </p>
              </Card>
            )}

            {(transcribedText || feedback) && (
              <Card>
                <CardHeader>
                  <CardTitle>3. Sonuçlar ve Geri Bildirim</CardTitle>
                  <CardDescription>Konuşmanızın analizi ve gelişim önerileri.</CardDescription>
                </CardHeader>
                <CardContent>
                  {transcribedText && (
                    <div className="space-y-4 mb-6">
                       <h4 className="font-semibold flex items-center gap-2"><Languages/> Konuşmanızın Metni</h4>
                       <p className="italic text-muted-foreground bg-secondary/50 p-4 rounded-md">{transcribedText}</p>
                    </div>
                  )}

                  {feedback && (
                    <Tabs defaultValue="overall" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overall">Genel</TabsTrigger>
                        <TabsTrigger value="pronunciation">Telaffuz</TabsTrigger>
                        <TabsTrigger value="fluency">Akıcılık</TabsTrigger>
                        <TabsTrigger value="grammar">Dil Bilgisi</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overall" className="mt-4">
                        <Card>
                          <CardHeader>
                             <CardTitle className="flex items-center gap-2"><BrainCircuit /> Genel Değerlendirme</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{feedback.overallFeedback}</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="pronunciation" className="mt-4">
                         <Card>
                          <CardHeader>
                             <CardTitle className="flex items-center gap-2"><Speech /> Telaffuz Geri Bildirimi</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{feedback.pronunciationFeedback}</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="fluency" className="mt-4">
                         <Card>
                          <CardHeader>
                             <CardTitle className="flex items-center gap-2"><Zap /> Akıcılık Geri Bildirimi</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{feedback.fluencyFeedback}</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                       <TabsContent value="grammar" className="mt-4">
                         <Card>
                          <CardHeader>
                             <CardTitle className="flex items-center gap-2"><GraduationCap /> Dil Bilgisi Geri Bildirimi</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{feedback.grammarFeedback}</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <footer className="py-4 px-4 md:px-8 border-t border-border mt-8">
        <p className="text-center text-sm text-muted-foreground">
          Firebase Studio ile ❤️ ile geliştirildi.
        </p>
      </footer>
    </div>
  );
}

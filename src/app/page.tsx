'use client';

import { useState, useRef, useEffect } from 'react';
import {
  genAiAssistedFeedback,
  GenAiAssistedFeedbackOutput,
} from '@/ai/flows/gen-ai-assisted-feedback';
import { speechToText } from '@/ai/flows/speech-to-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from '@/components/ui/textarea';
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Loader2, Languages, GraduationCap, Zap, BrainCircuit, Speech, FileUp, School, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Mascot, MascotLoading } from '@/components/mascot';

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();


  const handleAudioAnalysis = async (base64Audio: string) => {
    setIsLoading(true);
    setFeedback(null);
    setTranscribedText(null);
    
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
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        setIsRecording(false);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          handleAudioAnalysis(base64Audio);
        };
      };

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

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Audio = e.target?.result as string;
        if (base64Audio) {
          handleAudioAnalysis(base64Audio);
        }
      };
      reader.readAsDataURL(file);
    }
     // Reset file input to allow uploading the same file again
     if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const ScoreDisplay = ({ score, label }: { score: number, label: string }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      // Animate progress bar on load
      const timer = setTimeout(() => setProgress(score), 300);
      return () => clearTimeout(timer);
    }, [score]);
    
    // Determine color based on score
    const getScoreColor = (score: number) => {
      if (score < 50) return 'red';
      if (score < 75) return 'yellow';
      return 'green';
    }
    
    const color = getScoreColor(score);
    
    const indicatorColorClass = {
        'red': 'bg-red-500',
        'yellow': 'bg-yellow-500',
        'green': 'bg-green-500'
    }[color];
    
    const textColorClass = {
        'red': 'text-red-500',
        'yellow': 'text-yellow-500',
        'green': 'text-green-500'
    }[color];


    return (
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="font-medium">{label}</span>
          <span className={`text-xl font-bold ${textColorClass}`}>{score} / 100</span>
        </div>
        <Progress value={progress} indicatorClassName={indicatorColorClass} />
      </div>
    );
  };

  const canSubmit = taskDescription.trim().length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
       <header className="py-6 px-4 md:px-8 bg-secondary text-secondary-foreground shadow-lg">
          <div className="container mx-auto text-center">
            <div className="flex justify-center items-center gap-4 mb-2">
              <School className="w-12 h-12 text-primary"/>
              <div>
                 <h1 className="text-4xl font-bold text-primary tracking-tight">AI İngilizce Eğitmeni</h1>
                 <p className="text-lg text-secondary-foreground/80">
                   Aziz Sancar Anadolu Lisesi - TÜBİTAK 4006-B Projesi
                 </p>
              </div>
            </div>
            <p className="mt-4 text-lg text-secondary-foreground/90">
              <span className="font-semibold">Türkiye Yüzyılı Maarif Modeli</span> ile İngilizce konuşma becerilerinizi geliştirin.
            </p>
          </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <GraduationCap className="text-primary" />
                    TÜBİTAK 4006-B Bilim Fuarı Projesi
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">
                    Bu proje, Aziz Sancar Anadolu Lisesi öğrencileri tarafından TÜBİTAK 4006-B Bilim Fuarı için geliştirilmiştir. Amacımız, Türkiye Yüzyılı Maarif Modeli hedefleri doğrultusunda, yapay zeka teknolojisini kullanarak İngilizce konuşma becerilerini geliştirmeye yönelik yenilikçi ve interaktif bir araç sunmaktır.
                </p>
                <a href="http://azizsancaranadolu.meb.k12.tr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                    <Button variant="outline">
                        <LinkIcon />
                        Okul Web Sitesini Ziyaret Et
                    </Button>
                </a>
            </CardContent>
        </Card>


        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>1. Görevinizi Tanımlayın</CardTitle>
              <CardDescription>Konuşma görevinizi açıklayın ve başlayın.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Örn: 'Bir iş görüşmesinde kendinizi tanıtın' veya 'Son tatilinizi anlatın.'"
                value={taskDescription}
                onChange={e => setTaskDescription(e.target.value)}
                rows={4}
                className="resize-none text-base"
              />
              <div className="space-y-4">
                <p className="text-center text-sm font-medium text-muted-foreground">2. Analiz için Ses Ekleyin</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={toggleRecording}
                    disabled={!canSubmit || isLoading}
                    className="w-full flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    {isLoading && !isRecording ? (
                      <Loader2 className="animate-spin" />
                    ) : isRecording ? (
                      <>
                        <MicOff /> Kaydı Durdur
                      </>
                    ) : (
                      <>
                        <Mic /> Kayıt Yap
                      </>
                    )}
                  </Button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="audio/*" />
                   <Button
                    onClick={triggerFileSelect}
                    disabled={!canSubmit || isLoading || isRecording}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                     {isLoading && !isRecording ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <FileUp /> Dosya Yükle
                      </>
                    )}
                  </Button>
                </div>
              </div>
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
                  <MascotLoading />
                  <h3 className="text-2xl font-semibold text-primary mb-2 mt-6">Analiz Ediliyor...</h3>
                  <p className="text-lg text-muted-foreground">Yapay zeka konuşmanızı değerlendiriyor, lütfen bekleyin.</p>
               </Card>
            )}

            {!isLoading && !feedback && !transcribedText && (
              <Card className="flex flex-col items-center justify-center p-8 h-full min-h-[400px] text-center border-dashed">
                  <Mascot />
                  <h3 className="text-xl font-semibold mb-2 mt-4">Başlamaya Hazır mısınız?</h3>
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
                       <p className="italic text-muted-foreground bg-muted p-4 rounded-md">{transcribedText}</p>
                    </div>
                  )}

                  {feedback && (
                    <>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 border rounded-lg">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-lg font-medium text-muted-foreground">Genel Puan</span>
                          <p className="text-6xl font-bold text-primary">{feedback.overallScore}</p>
                        </div>
                        <div className="space-y-4">
                          <ScoreDisplay score={feedback.pronunciationScore} label="Telaffuz" />
                          <ScoreDisplay score={feedback.fluencyScore} label="Akıcılık" />
                          <ScoreDisplay score={feedback.grammarScore} label="Dil Bilgisi" />
                        </div>
                      </div>
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
                    </>
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
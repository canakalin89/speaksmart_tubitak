
'use client';

import { useState, useRef, useEffect } from 'react';
import {
  genAiAssistedFeedback,
  GenAiAssistedFeedbackOutput,
} from '@/ai/flows/gen-ai-assisted-feedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from '@/components/ui/textarea';
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Loader2, Languages, GraduationCap, Zap, BrainCircuit, Speech, FileUp, School, Link as LinkIcon, Instagram, Twitter, Youtube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Mascot, MascotLoading } from '@/components/mascot';
import { ScrollArea } from '@/components/ui/scroll-area';


export default function Home() {
  const [taskDescription, setTaskDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<GenAiAssistedFeedbackOutput | null>(
    null
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();


  const handleAudioAnalysis = async (base64Audio: string) => {
    setIsLoading(true);
    setFeedback(null);
    
    try {
      toast({ title: 'Geri bildirim oluşturuluyor...', description: 'Yapay zeka konuşmanızı analiz ediyor.' });
      const feedbackResult = await genAiAssistedFeedback({
        audio: base64Audio,
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
       <header className="py-2 px-4 md:px-8 bg-secondary text-secondary-foreground shadow-lg">
          <div className="container mx-auto text-center">
            <div className="flex justify-center items-center gap-3">
              <School className="w-6 h-6 text-primary"/>
              <div>
                 <h1 className="text-xl font-bold text-primary tracking-tight">AI İngilizce Eğitmeni</h1>
                 <p className="text-xs text-secondary-foreground/80">
                   Aziz Sancar Anadolu Lisesi - TÜBİTAK 4006-B Projesi
                 </p>
              </div>
            </div>
          </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 flex-grow">
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
                <div className="flex flex-wrap items-center gap-4">
                  <a href="http://azizsancaranadolu.meb.k12.tr" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline">
                          <LinkIcon />
                          Okul Web Sitesi
                      </Button>
                  </a>
                  <div className="flex items-center gap-2">
                      <a href="https://www.instagram.com/asalkapakli2019/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                          <Button variant="ghost" size="icon">
                              <Instagram className="h-5 w-5" />
                          </Button>
                      </a>
                      <a href="https://x.com/asalkapakli2019" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                          <Button variant="ghost" size="icon">
                              <Twitter className="h-5 w-5" />
                          </Button>
                      </a>
                      <a href="https://www.youtube.com/@AzizSancarAnadoluLisesi" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                          <Button variant="ghost" size="icon">
                              <Youtube className="h-5 w-5" />
                          </Button>
                      </a>
                  </div>
                </div>
            </CardContent>
        </Card>


        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>1. Görevinizi Tanımlayın ve Konuşun</CardTitle>
              <CardDescription>Konuşma görevinizi açıklayın ve sesinizi kaydedin veya yükleyin.</CardDescription>
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

          <Card className="flex flex-col h-full">
             <CardHeader>
                <CardTitle>3. Sonuçlar ve Geri Bildirim</CardTitle>
                <CardDescription>Konuşmanızın analizi ve gelişim önerileri.</CardDescription>
             </CardHeader>
             <CardContent className="flex-grow flex flex-col">
                 {isLoading && !feedback && (
                   <div className="flex-grow flex flex-col items-center justify-center p-8">
                      <MascotLoading />
                      <h3 className="text-2xl font-semibold text-primary mb-2 mt-6">Analiz Ediliyor...</h3>
                      <p className="text-lg text-muted-foreground">Yapay zeka konuşmanızı değerlendiriyor, lütfen bekleyin.</p>
                   </div>
                )}

                {!isLoading && !feedback && (
                  <div className="flex-grow flex flex-col items-center justify-center p-8 text-center border-dashed border-2 rounded-lg">
                      <Mascot />
                      <h3 className="text-xl font-semibold mb-2 mt-4">Başlamaya Hazır mısınız?</h3>
                      <p className="text-muted-foreground max-w-md">
                        Görevinizi tanımlayın, kayda başlayın ve yapay zeka destekli anında geri bildirim alarak İngilizce konuşmanızı mükemmelleştirin!
                      </p>
                  </div>
                )}

                {feedback && (
                   <div className='flex flex-col h-full'>
                      {feedback.transcribedText && (
                        <div className="space-y-4 mb-6">
                          <h4 className="font-semibold flex items-center gap-2"><Languages/> Konuşmanızın Metni</h4>
                          <ScrollArea className="h-24 md:h-28">
                             <p className="italic text-muted-foreground bg-muted p-4 rounded-md">{feedback.transcribedText}</p>
                          </ScrollArea>
                        </div>
                      )}

                      {feedback && (
                        <div className="flex-grow">
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
                             <ScrollArea className="h-48 md:h-56 mt-4">
                                <TabsContent value="overall">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2"><BrainCircuit /> Genel Değerlendirme</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p>{feedback.overallFeedback}</p>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                <TabsContent value="pronunciation">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2"><Speech /> Telaffuz Geri Bildirimi</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p>{feedback.pronunciationFeedback}</p>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                <TabsContent value="fluency">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2"><Zap /> Akıcılık Geri Bildirimi</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p>{feedback.fluencyFeedback}</p>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                <TabsContent value="grammar">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2"><GraduationCap /> Dil Bilgisi Geri Bildirimi</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p>{feedback.grammarFeedback}</p>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                             </ScrollArea>
                          </Tabs>
                        </div>
                      )}
                    </div>
                )}
             </CardContent>
          </Card>
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

    
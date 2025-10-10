
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
import { Mic, MicOff, Loader2, Languages, GraduationCap, Zap, BrainCircuit, Speech, FileUp, School, Link as LinkIcon, Instagram, Twitter, Youtube, Users, Atom, CreativeCommons, MessageCircle, Bot } from 'lucide-react';
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
     if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const ScoreDisplay = ({ score, label }: { score: number, label: string }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => setProgress(score), 300);
      return () => clearTimeout(timer);
    }, [score]);
    
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
          <span className="font-medium text-sm text-foreground/80">{label}</span>
          <span className={`text-base font-bold ${textColorClass}`}>{score}</span>
        </div>
        <Progress value={progress} indicatorClassName={indicatorColorClass} className="h-2" />
      </div>
    );
  };
  
  const OverallScoreIndicator = ({ score } : {score: number}) => {
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center w-32 h-32">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-secondary"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className="text-primary"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.5s ease-out',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%'
            }}
          />
        </svg>
        <span className="text-3xl font-bold text-primary">{score}</span>
      </div>
    );
  };


  const canSubmit = taskDescription.trim().length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <BrainCircuit className="w-8 h-8 text-primary"/>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Yapay Zeka İngilizce Eğitmeni</h1>
            </div>
            <p className="text-sm text-gray-500 hidden md:block">Türkiye Yüzyılı Maarif Modeli ile İngilizce konuşma pratiği yapın.</p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">1</span><span>Görevinizi Tanımlayın ve Konuşun</span></CardTitle>
                <CardDescription>Konuşma görevinizi açıklayın ve sesinizi kaydedin veya yükleyin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Örn: 'Bir iş görüşmesinde kendinizi tanıtın' veya 'Son tatilinizi anlatın.'"
                  value={taskDescription}
                  onChange={e => setTaskDescription(e.target.value)}
                  className="text-base"
                  rows={3}
                />
                 <div className="flex items-center gap-4">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="text-xs text-gray-400">VEYA</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={toggleRecording}
                    disabled={!canSubmit || isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isRecording ? (
                      <><MicOff className="mr-2"/> Kaydı Durdur</>
                    ) : (
                      <><Mic className="mr-2"/> Kayda Başla</>
                    )}
                  </Button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="audio/*" />
                  <Button 
                    onClick={triggerFileSelect} 
                    disabled={!canSubmit || isLoading || isRecording} 
                    variant="outline" 
                    size="lg"
                    className="w-full"
                  >
                    <FileUp className="mr-2"/> Ses Yükle
                  </Button>
                </div>
                {isRecording && (
                    <div className="flex items-center justify-center text-sm text-red-500 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-ping"></div>
                        Kayıt yapılıyor...
                    </div>
                )}
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Nasıl Çalışır?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                    <p>1. Değerlendirilmesini istediğiniz konuşma görevini yukarıdaki metin alanına yazın.</p>
                    <p>2. Sesinizi kaydedin veya bir ses dosyası yükleyin.</p>
                    <p>3. Yapay zeka, konuşmanızı analiz ederek size telaffuz, akıcılık ve dilbilgisi üzerine detaylı geri bildirimler sunsun.</p>
                </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">2</span><span>Sonuçları İnceleyin</span></CardTitle>
                <CardDescription>Yapay zeka tarafından oluşturulan analiz ve gelişim önerileri.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center">

                {isLoading && !feedback && (
                   <div className="text-center space-y-4">
                     <MascotLoading />
                     <h3 className="text-xl font-semibold text-primary">Analiz Ediliyor...</h3>
                     <p className="text-muted-foreground">Yapay zeka konuşmanızı değerlendiriyor, lütfen bekleyin.</p>
                  </div>
                )}

                {!isLoading && !feedback && (
                  <div className="text-center space-y-4">
                    <Mascot />
                    <h3 className="text-xl font-semibold">Başlamaya Hazır mısınız?</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">Görevinizi tanımlayıp konuşmaya başladıktan sonra analiz sonuçlarınız burada görünecek.</p>
                  </div>
                )}
                
                {feedback && (
                 <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-6">
                      <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Genel Puan</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                            <OverallScoreIndicator score={feedback.overallScore} />
                        </CardContent>
                      </Card>
                      <Card className="flex-grow">
                        <CardHeader>
                            <CardTitle className="text-lg">Detaylı Puanlar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ScoreDisplay score={feedback.rapportScore} label="Dinleyici ile Bağ Kurma" />
                            <ScoreDisplay score={feedback.organisationScore} label="Organizasyon" />
                            <ScoreDisplay score={feedback.deliveryScore} label="Sunum" />
                            <ScoreDisplay score={feedback.languageUseScore} label="Dil Kullanımı" />
                            <ScoreDisplay score={feedback.creativityScore} label="Yaratıcılık" />
                        </CardContent>
                      </Card>
                   </div>
                   <div className="flex flex-col gap-6">
                      <Card>
                        <CardHeader><CardTitle className="text-lg">Konuşma Metni</CardTitle></CardHeader>
                        <CardContent>
                          <ScrollArea className="h-28">
                              <p className="italic text-muted-foreground">{feedback.transcribedText}</p>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                      <Card className="flex-grow">
                        <CardHeader><CardTitle className="text-lg">Geri Bildirim</CardTitle></CardHeader>
                        <CardContent>
                           <Tabs defaultValue="overall" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="overall">Genel Değerlendirme</TabsTrigger>
                                <TabsTrigger value="details">Detaylar</TabsTrigger>
                            </TabsList>
                             <ScrollArea className="h-56 mt-4">
                                <TabsContent value="overall">
                                    <p className="text-sm">{feedback.overallFeedback}</p>
                                </TabsContent>
                                <TabsContent value="details">
                                    <div className="space-y-4 text-sm">
                                      <div><h4 className="font-semibold">Dinleyici ile Bağ Kurma</h4><p className="text-muted-foreground">{feedback.rapportFeedback}</p></div>
                                      <div><h4 className="font-semibold">Organizasyon</h4><p className="text-muted-foreground">{feedback.organisationFeedback}</p></div>
                                      <div><h4 className="font-semibold">Sunum</h4><p className="text-muted-foreground">{feedback.deliveryFeedback}</p></div>
                                      <div><h4 className="font-semibold">Dil Kullanımı</h4><p className="text-muted-foreground">{feedback.languageUseFeedback}</p></div>
                                      <div><h4 className="font-semibold">Yaratıcılık</h4><p className="text-muted-foreground">{feedback.creativityFeedback}</p></div>
                                    </div>
                                </TabsContent>
                              </ScrollArea>
                            </Tabs>
                        </CardContent>
                      </Card>
                   </div>
                 </div>
              )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500">
            <p className="text-sm">&copy; {new Date().getFullYear()} Yapay Zeka İngilizce Eğitmeni. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}

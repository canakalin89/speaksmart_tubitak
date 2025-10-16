'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  genAiAssistedFeedback,
  GenAiAssistedFeedbackOutput,
} from '@/ai/flows/gen-ai-assisted-feedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Languages, FileUp, History, Atom, Link as LinkIcon, Building, LayoutDashboard, LogOut, PanelLeft, MailWarning, Send, Users, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Mascot, MascotLoading } from '@/components/mascot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth, useUser, useCollection, useMemoFirebase, useFirestore, useFirebase } from '@/firebase';
import { collection, serverTimestamp, addDoc, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { sendEmailVerification } from 'firebase/auth';

const content = {
  tr: {
    title: 'SpeakSmart',
    subtitle: 'Yapay Zekâ Destekli Konuşma Asistanı',
    step1: 'Görevinizi Seçin ve Konuşun',
    step1Desc: 'Aşağıdaki görevlerden birini seçin, ardından sesinizi kaydedin veya yükleyin.',
    taskSelectPlaceholder: 'Bir konuşma görevi seçin...',
    or: 'VEYA',
    startRecording: 'Kayda Başla',
    stopRecording: 'Kaydı Durdur',
    uploadAudio: 'Ses Yükle',
    recording: 'Kayıt yapılıyor...',
    step2: 'Sonuçları İnceleyin',
    step2Desc: 'Yapay zeka tarafından oluşturulan analiz ve gelişim önerileri.',
    analyzing: 'Analiz Ediliyor...',
    analyzingDesc: 'Yapay zeka konuşmanızı değerlendiriyor, lütfen bekleyin.',
    readyToStart: 'Başlamaya Hazır mısınız?',
    readyToStartDesc: 'Görevinizi seçip konuşmaya başladıktan sonra analiz sonuçlarınız burada görünecek.',
    overallScore: 'Genel Puan',
    detailedScores: 'Detaylı Puanlar',
    rapport: 'Dinleyici ile Bağ Kurma',
    organisation: 'Organizasyon',
    delivery: 'Sunum',
    languageUse: 'Dil Kullanımı',
    creativity: 'Yaratıcılık',
    transcript: 'Konuşma Metni',
    improvementAreas: 'Gelişim Önerileri',
    overallFeedback: 'Genel Öneri',
    detailedAnalysis: 'Detaylı Analiz',
    toastGenerating: 'Geri bildirim oluşturuluyor...',
    toastGeneratingDesc: 'Yapay zeka konuşmanızı analiz ediyor.',
    toastReady: 'Geri Bildirim Hazır!',
    toastReadyDesc: 'Yapay zeka destekli geri bildiriminiz oluşturuldu.',
    toastError: 'Bir Hata Oluştu',
    toastErrorDesc: 'Yapay zekadan geri bildirim alınamadı. Lütfen tekrar deneyin.',
    toastMicError: 'Mikrofon Hatası',
    toastMicErrorDesc: 'Mikrofona erişilemedi. Lütfen tarayıcı izinlerinizi kontrol edin.',
    footerRights: 'Tüm hakları saklıdır.',
    tubitak: 'TÜBİTAK 4006-B Projesi',
    tubitakDesc: 'Bu proje, Tekirdağ Kapaklı Aziz Sancar Anadolu Lisesi tarafından TÜBİTAK 4006-B Bilim Fuarları Destekleme Programı kapsamında geliştirilmiştir.',
    projectTeam: 'Proje Ekibi',
    teacher: 'Danışman Öğretmen: Can AKALIN',
    students: 'Proje Öğrencileri: [Öğrenci İsimleri Buraya Gelecek]',
    supporters: 'Destekleyen Kurumlar',
    social: 'Sosyal Medya',
    usefulLinks: 'Faydalı Linkler',
    kapakliMeb: 'Kapaklı İlçe Milli Eğitim Müdürlüğü',
    continueAsGuest: 'Misafir Olarak Devam Et',
    welcomeGuest: 'Hoş Geldin, Misafir!',
    loginToSave: 'İlerlemenizi kaydetmek için giriş yapın veya kaydolun.',
    welcome: 'Hoş Geldin',
    pastResults: 'Geçmiş Denemelerim',
    noPastResults: 'Henüz bir deneme yapmadınız.',
    viewResult: 'Görüntüle',
    logout: 'Çıkış Yap',
    dashboard: 'Kontrol Paneli',
    verifyEmailTitle: 'E-postanızı Doğrulayın',
    verifyEmailDesc: 'Uygulamayı kullanmaya başlamadan önce e-posta adresinizi doğrulamanız gerekmektedir. Lütfen gelen kutunuzu kontrol edin.',
    resendVerification: 'Doğrulama E-postasını Tekrar Gönder',
    verificationSent: 'Doğrulama e-postası gönderildi!',
    verificationFailed: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.',
    deleteAttempt: 'Denemeyi Sil',
    clearAll: 'Tümünü Temizle',
    deleteConfirmTitle: 'Emin misiniz?',
    deleteConfirmDesc: 'Bu işlem geri alınamaz. Bu denemeyi kalıcı olarak silmek istediğinizden emin misiniz?',
    clearAllConfirmDesc: 'Bu işlem geri alınamaz. Tüm geçmiş denemelerinizi kalıcı olarak silmek istediğinizden emin misiniz?',
    cancel: 'İptal',
    delete: 'Sil',
    deletedToast: 'Deneme silindi.',
    clearedToast: 'Tüm denemeler silindi.'
  },
  en: {
    title: 'SpeakSmart',
    subtitle: 'AI-Powered Speaking Assistant',
    step1: 'Select Your Task and Speak',
    step1Desc: 'Choose a task from the list below, then record or upload your audio.',
    taskSelectPlaceholder: 'Select a speaking task...',
    or: 'OR',
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    uploadAudio: 'Upload Audio',
    recording: 'Recording...',
    step2: 'Review Your Results',
    step2Desc: 'Analysis and improvement suggestions generated by the AI.',
    analyzing: 'Analyzing...',
    analyzingDesc: 'The AI is evaluating your speech, please wait.',
    readyToStart: 'Ready to Start?',
    readyToStartDesc: 'Your analysis results will appear here after you select your task and start speaking.',
    overallScore: 'Overall Score',
    detailedScores: 'Detailed Scores',
    rapport: 'Rapport with Audience',
    organisation: 'Organisation',
    delivery: 'Delivery',
    languageUse: 'Language Use',
    creativity: 'Creativity',
    transcript: 'Speech Transcript',
    improvementAreas: 'Improvement Areas',
    overallFeedback: 'Overall Feedback',
    detailedAnalysis: 'Detailed Analysis',
    toastGenerating: 'Generating feedback...',
    toastGeneratingDesc: 'The AI is analyzing your speech.',
    toastReady: 'Feedback Ready!',
    toastReadyDesc: 'Your AI-powered feedback has been generated.',
    toastError: 'An Error Occurred',
    toastErrorDesc: 'Could not get feedback from the AI. Please try again.',
    toastMicError: 'Microphone Error',
    toastMicErrorDesc: 'Could not access the microphone. Please check your browser permissions.',
    footerRights: 'All rights reserved.',
    tubitak: 'TÜBİTAK 4006-B Project',
    tubitakDesc: 'This project was developed by Tekirdağ Kapaklı Aziz Sancar Anatolian High School within the scope of the TÜBİTAK 4006-B Science Fairs Support Program.',
    projectTeam: 'Project Team',
    teacher: 'Supervising Teacher: Can AKALIN',
    students: 'Project Students: [Student Names Will Be Here]',
    supporters: 'Supporters',
    social: 'Social Media',
    usefulLinks: 'Useful Links',
    kapakliMeb: 'Kapaklı District Directorate of National Education',
    continueAsGuest: 'Continue as Guest',
    welcomeGuest: 'Welcome, Guest!',
    loginToSave: 'Log in or sign up to save your progress.',
    welcome: 'Welcome',
    pastResults: 'Past Attempts',
    noPastResults: 'You haven\'t made any attempts yet.',
    viewResult: 'View',
    logout: 'Log Out',
    dashboard: 'Dashboard',
    verifyEmailTitle: 'Verify Your Email',
    verifyEmailDesc: 'You need to verify your email address before you can start using the application. Please check your inbox.',
    resendVerification: 'Resend Verification Email',
    verificationSent: 'Verification email sent!',
    verificationFailed: 'Failed to send email. Please try again later.',
    deleteAttempt: 'Delete Attempt',
    clearAll: 'Clear All',
    deleteConfirmTitle: 'Are you sure?',
    deleteConfirmDesc: 'This action cannot be undone. Are you sure you want to permanently delete this attempt?',
    clearAllConfirmDesc: 'This action cannot be undone. Are you sure you want to permanently delete all your past attempts?',
    cancel: 'Cancel',
    delete: 'Delete',
    deletedToast: 'Attempt deleted.',
    clearedToast: 'All attempts cleared.'
  }
};

const predefinedTasks = {
  tr: [
    { id: 'task-free', text: 'Serbest Konuşma (İstediğiniz bir konu hakkında konuşun)' },
    { id: 'task-16', text: 'Ülkeni ve ziyaretçilerini tanıt. (Başkent, insanlar, dil, kutlamalar vb.)' },
    { id: 'task-17', text: 'Kendini, yeni okulunu ve yeni arkadaşlarını tanıt.' },
    { id: 'task-1', text: 'Kendini ve Türkiye\'deki okul hayatını tanıt.' },
    { id: 'task-2', text: 'Ülkendeki milli bayramlardan ve turistik bir yerden bahset.' },
    { id: 'task-3', text: 'Günlük ve ders çalışma rutinini anlat.' },
    { id: 'task-4', text: 'Kendi günlük rutinini bir arkadaşınınkiyle karşılaştır.' },
    { id: 'task-5', text: 'Hayranlık duyduğun bir kişiden bahset. Dış görünüşünü ve kişiliğini tarif et.' },
    { id: 'task-6', text: 'Aile üyelerini ve mesleklerini tanıt.' },
    { id:'task-7', text: 'Evini ve mahallenizi tarif et.' },
    { id: 'task-8', text: 'Evde ne yapmaktan hoşlandığından bahset.' },
    { id: 'task-9', text: 'Şehirde ve kırsalda yaşamaktan bahset.' },
    { id: 'task-10', text: 'Şehrindeki yerel bir yiyecekten veya bir festivalden bahset.' },
    { id: 'task-11', text: 'Nesli tükenmekte olan bir hayvan seç ve yaşam alanını tarif et.' },
    { id: 'task-12', text: 'Nesli tükenmekte olan hayvanları nasıl koruyabileceğimizi açıkla.' },
    { id: 'task-13', text: 'Gelecekle ilgili en sevdiğin filmden bahset.' },
    { id: 'task-14', text: '2050 yılında insanların ne tür teknolojiler kullanabileceğini anlat.' },
    { id: 'task-15', text: 'Tüm temaları birleştiren "Ben ve Dünyam" başlıklı kısa bir konuşma hazırla.' }
  ],
  en: [
    { id: 'task-free', text: 'Freestyle (Talk about any topic you want)' },
    { id: 'task-16', text: 'Talk about your country and its visitors. (Capital, people, language, celebrations etc.)' },
    { id: 'task-17', text: 'Introduce yourself, your new school, and your new friends.' },
    { id: 'task-1', text: 'Introduce yourself and your school life in Türkiye.' },
    { id: 'task-2', text: 'Talk about national celebrations and a tourist attraction in your country.' },
    { id: 'task-3', text: 'Describe your daily and study routine.' },
    { id: 'task-4', text: 'Compare your daily routine with your friend’s routine.' },
    { id: 'task-5', text: 'Talk about a person you admire. Describe their appearance and personality.' },
    { id: 'task-6', text: 'Introduce your family members and their jobs.' },
    { id: 'task-7', text: 'Describe your house and neighbourhood.' },
    { id: 'task-8', text: 'Talk about what you like doing at home.' },
    { id: 'task-9', text: 'Talk about living in a city and in the countryside.' },
    { id: 'task-10', text: 'Mention local food or a festival in your city.' },
    { id: 'task-11', text: 'Choose an endangered animal and describe its habitat.' },
    { id: 'task-12', text: 'Explain how we can protect endangered animals.' },
    { id: 'task-13', text: 'Talk about your favourite film about the future.' },
    { id: 'task-14', text: 'Describe what kind of technology people might use in 2050.' },
    { id: 'task-15', text: 'Prepare a short talk titled “Me and My World” combining all themes.' }
  ]
};

const ScoreDisplay = ({ score, label }: { score: number, label: string }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(score), 300);
    return () => clearTimeout(timer);
  }, [score]);
  
  const getScoreColor = (score: number) => {
    if (score < 50) return 'hsl(var(--destructive))';
    if (score < 75) return 'hsl(var(--accent))';
    return 'hsl(var(--primary))';
  }
  
  const color = getScoreColor(score);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <p className="font-medium text-sm text-foreground/80">{label}</p>
        <p className="text-base font-bold" style={{ color }}>{score}</p>
      </div>
      <Progress value={progress} indicatorClassName="bg-primary" style={{backgroundColor: color}}/>
    </div>
  );
};

const OverallScoreIndicator = ({ score } : {score: number}) => {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
      const timer = setTimeout(() => {
          setOffset(circumference - (score / 100) * circumference);
      }, 300);
      return () => clearTimeout(timer);
  }, [score, circumference]);

  const getScoreColor = (score: number) => {
    if (score < 50) return 'hsl(var(--destructive))';
    if (score < 75) return 'hsl(var(--accent))';
    return 'hsl(var(--primary))';
  }
  const color = getScoreColor(score);

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-muted/50"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          strokeWidth="10"
          stroke={color}
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.8s ease-out',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%'
          }}
        />
      </svg>
      <span className="text-4xl font-bold" style={{color: color}}>{score}</span>
    </div>
  );
};

function DashboardLayout() {
  const [taskDescription, setTaskDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<GenAiAssistedFeedbackOutput | null>(null);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const { auth, user, firestore } = useFirebase();

  const t = content[language];
  const tasks = predefinedTasks[language];
  const { setOpenMobile } = useSidebar();
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const progressCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'progress');
  }, [firestore, user?.uid]);

  const { data: progressData } = useCollection<any>(progressCollectionRef);

  const sortedProgressData = useMemo(() => {
    if (!progressData) return [];
    return [...progressData].sort((a: any, b: any) => {
        const dateA = a.createdAt?.toDate?.() || 0;
        const dateB = b.createdAt?.toDate?.() || 0;
        return dateB - dateA;
    });
  }, [progressData]);

  const handleAudioAnalysis = async (base64Audio: string) => {
    setIsLoading(true);
    setFeedback(null);
    
    try {
      toast({ title: t.toastGenerating, description: t.toastGeneratingDesc });
      const currentTask = tasks.find(task => task.id === taskDescription) || { id: `custom-${Date.now()}`, text: taskDescription };
      
      const feedbackResult = await genAiAssistedFeedback({
        audio: base64Audio,
        taskDescription: currentTask.text,
        language: language,
      });
      setFeedback(feedbackResult);

      if (user?.uid && progressCollectionRef) {
        addDoc(progressCollectionRef, {
            userId: user.uid,
            taskId: currentTask.id,
            taskDescription: currentTask.text,
            completionStatus: 'completed',
            attempts: 1, // This could be incremented in a more complex scenario
            feedback: JSON.stringify(feedbackResult), // Storing the full feedback
            createdAt: serverTimestamp(),
            ...feedbackResult
        }).catch(error => {
          console.error("Error writing progress to Firestore:", error);
        });
      }

      toast({
        title: t.toastReady,
        description: t.toastReadyDesc,
      });

    } catch (error: any) {
      console.error('AI processing error:', error);
      toast({
        variant: 'destructive',
        title: t.toastError,
        description: error.message || t.toastErrorDesc,
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
        title: t.toastMicError,
        description: t.toastMicErrorDesc,
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
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
  }

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
  
  const handleSetFeedback = (item: any) => {
    const feedbackData = typeof item.feedback === 'string' ? JSON.parse(item.feedback) : item;
    setFeedback(feedbackData);
    setTaskDescription(''); // Clear task selection when viewing past results
    setOpenMobile(false);
  }

  const handleResendVerification = async () => {
    if (user) {
      setIsSendingVerification(true);
      try {
        await sendEmailVerification(user);
        toast({ title: t.verificationSent });
      } catch (error) {
        toast({ variant: 'destructive', title: t.verificationFailed });
        console.error(error);
      } finally {
        setIsSendingVerification(false);
      }
    }
  };
  
  const canSubmit = taskDescription.trim().length > 0;

  const handleDeleteAttempt = async (attemptId: string) => {
    if (!progressCollectionRef) return;
    try {
      await deleteDoc(doc(progressCollectionRef, attemptId));
      toast({ title: t.deletedToast });
      if (feedback && sortedProgressData.find(d => d.id === attemptId)) {
        setFeedback(null);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete attempt.' });
    }
  };

  const handleClearAllAttempts = async () => {
    if (!progressCollectionRef || !progressData) return;
    try {
      const batch = writeBatch(firestore);
      progressData.forEach((attempt) => {
        batch.delete(doc(progressCollectionRef, attempt.id));
      });
      await batch.commit();
      setFeedback(null);
      toast({ title: t.clearedToast });
    } catch (error) {
      console.error("Error clearing all attempts:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not clear all attempts.' });
    }
  };

  if (user && !user.emailVerified && !user.isAnonymous) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <MailWarning className="w-8 h-8 text-primary" />
              {t.verifyEmailTitle}
            </CardTitle>
            <CardDescription>{t.verifyEmailDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground">
              Doğrulama e-postasını <strong>{user.email}</strong> adresine gönderdik.
            </p>
            <Button onClick={handleResendVerification} disabled={isSendingVerification} className="w-full">
              {isSendingVerification ? "Gönderiliyor..." : <><Send className="mr-2 h-4 w-4" />{t.resendVerification}</>}
            </Button>
            <Button variant="outline" onClick={() => auth.signOut()} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              {t.logout}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Image src="https://azizsancaranadolu.meb.k12.tr/meb_iys_dosyalar/59/11/765062/resimler/2025_06/03222921_logolar3.jpg" alt="Okul Logosu" width={40} height={40} className="rounded-full object-contain bg-white p-1" />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold tracking-tight text-sidebar-foreground">{t.title}</h1>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <LayoutDashboard />
                {t.dashboard}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarGroup>
               <SidebarGroupLabel className="flex items-center justify-between">
                <span className="flex items-center gap-2"><History className="w-4 h-4"/>{t.pastResults}</span>
                {sortedProgressData && sortedProgressData.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-1 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-red-500">
                        {t.clearAll}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                        <AlertDialogDescription>{t.clearAllConfirmDesc}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAllAttempts} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t.delete}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {sortedProgressData && sortedProgressData.length > 0 ? (
                  <div className="space-y-1">
                    {sortedProgressData.map((item) => (
                       <div key={item.id} className="group relative w-full text-left p-2 rounded-md hover:bg-sidebar-accent transition-colors flex items-center justify-between">
                         <button onClick={() => handleSetFeedback(item)} className="flex-grow overflow-hidden mr-2 text-left">
                           <p className="font-semibold truncate text-sm">{item.taskDescription}</p>
                           <p className="text-xs text-sidebar-foreground/70">
                            { item.createdAt ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true, locale: language === 'tr' ? tr : enUS }) : ''}
                           </p>
                         </button>
                         <div className="flex-shrink-0 font-bold text-lg text-sidebar-primary pr-8">{item.overallScore}</div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-sidebar-foreground/60 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-opacity">
                               <Trash2 className="w-4 h-4"/>
                             </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                              <AlertDialogDescription>{t.deleteConfirmDesc}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAttempt(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t.delete}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                       </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-sidebar-foreground/60 p-4">{t.noPastResults}</p>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => auth.signOut()}>
                  <LogOut />
                  {t.logout}
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden">
                  <PanelLeft />
                </SidebarTrigger>
                <div>
                   <p className="text-sm text-muted-foreground">
                    {user && (user.isAnonymous ? t.welcomeGuest : `${t.welcome}, ${user.email || 'Kullanıcı'}`)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Change language">
                  <Languages className="w-5 h-5"/>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              <div className="xl:col-span-2 flex flex-col gap-8">
                 <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3"><span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-base font-bold">1</span><span>{t.step1}</span></CardTitle>
                      <CardDescription>{t.step1Desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Select onValueChange={setTaskDescription} value={taskDescription}>
                        <SelectTrigger className="text-base py-6">
                          <SelectValue placeholder={t.taskSelectPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {tasks.map(task => (
                            <SelectItem key={task.id} value={task.id} className="py-2 text-base">{task.text}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
    
                       <div className="flex items-center gap-4">
                          <div className="flex-grow border-t"></div>
                          <span className="text-xs text-muted-foreground tracking-wider">{t.or}</span>
                          <div className="flex-grow border-t"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={toggleRecording}
                          disabled={!canSubmit || isLoading}
                          className="w-full py-6 text-base"
                          size="lg"
                        >
                          {isRecording ? (
                            <><MicOff className="mr-2"/> {t.stopRecording}</>
                          ) : (
                            <><Mic className="mr-2"/> {t.startRecording}</>
                          )}
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="audio/*" />
                        <Button 
                          onClick={triggerFileSelect} 
                          disabled={!canSubmit || isLoading || isRecording} 
                          variant="outline" 
                          className="w-full py-6 text-base"
                           size="lg"
                        >
                          <FileUp className="mr-2"/> {t.uploadAudio}
                        </Button>
                      </div>
                      {isRecording && (
                          <div className="flex items-center justify-center text-sm text-red-500 animate-pulse font-medium">
                              <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-ping"></div>
                              {t.recording}
                          </div>
                      )}
                    </CardContent>
                  </Card>
              </div>
              <div className="xl:col-span-3">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3"><span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-base font-bold">2</span><span>{t.step2}</span></CardTitle>
                    <CardDescription>{t.step2Desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex items-center justify-center">
                    {isLoading && !feedback && (
                       <div className="text-center space-y-4">
                         <MascotLoading />
                         <h3 className="text-xl font-semibold text-primary">{t.analyzing}</h3>
                         <p className="text-muted-foreground">{t.analyzingDesc}</p>
                      </div>
                    )}
  
                    {!isLoading && !feedback && (
                      <div className="text-center space-y-4 flex flex-col items-center">
                        <Mascot />
                        <h3 className="text-2xl font-semibold">{t.readyToStart}</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">{t.readyToStartDesc}</p>
                      </div>
                    )}
                    
                    {feedback && (
                     <div className="w-full flex flex-col gap-6">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                           <Card className="shadow-sm">
                             <CardHeader>
                                 <CardTitle className="text-lg">{t.overallScore}</CardTitle>
                             </CardHeader>
                             <CardContent className="flex items-center justify-center pt-4">
                                 <OverallScoreIndicator score={feedback.overallScore} />
                             </CardContent>
                           </Card>
                           <Card className="flex-grow shadow-sm">
                             <CardHeader>
                                 <CardTitle className="text-lg">{t.detailedScores}</CardTitle>
                             </CardHeader>
                             <CardContent className="space-y-3 pt-1">
                                 <ScoreDisplay score={feedback.rapportScore} label={t.rapport} />
                                 <ScoreDisplay score={feedback.organisationScore} label={t.organisation} />
                                 <ScoreDisplay score={feedback.deliveryScore} label={t.delivery} />
                                 <ScoreDisplay score={feedback.languageUseScore} label={t.languageUse} />
                                 <ScoreDisplay score={feedback.creativityScore} label={t.creativity} />
                             </CardContent>
                           </Card>
                        </div>
                        <Card className="flex-grow shadow-sm">
                             <CardContent className="p-4">
                                <Tabs defaultValue="overall" className="w-full">
                                 <TabsList className="grid w-full grid-cols-3">
                                     <TabsTrigger value="overall">{t.overallFeedback}</TabsTrigger>
                                     <TabsTrigger value="details">{t.detailedAnalysis}</TabsTrigger>
                                     <TabsTrigger value="transcript">{t.transcript}</TabsTrigger>
                                 </TabsList>
                                  <ScrollArea className="h-64 mt-4 pr-4">
                                     <TabsContent value="overall">
                                         <p className="text-sm leading-relaxed">{feedback.overallFeedback}</p>
                                     </TabsContent>
                                     <TabsContent value="details">
                                         <div className="space-y-4 text-sm">
                                           <div><h4 className="font-semibold">{t.rapport}</h4><p className="text-muted-foreground leading-relaxed">{feedback.rapportFeedback}</p></div>
                                           <div><h4 className="font-semibold">{t.organisation}</h4><p className="text-muted-foreground leading-relaxed">{feedback.organisationFeedback}</p></div>
                                           <div><h4 className="font-semibold">{t.delivery}</h4><p className="text-muted-foreground leading-relaxed">{feedback.deliveryFeedback}</p></div>
                                           <div><h4 className="font-semibold">{t.languageUse}</h4><p className="text-muted-foreground leading-relaxed">{feedback.languageUseFeedback}</p></div>
                                           <div><h4 className="font-semibold">{t.creativity}</h4><p className="text-muted-foreground leading-relaxed">{feedback.creativityFeedback}</p></div>
                                         </div>
                                     </TabsContent>
                                      <TabsContent value="transcript">
                                       <p className="italic text-muted-foreground leading-relaxed">{feedback.transcribedText}</p>
                                     </TabsContent>
                                   </ScrollArea>
                                 </Tabs>
                             </CardContent>
                           </Card>
                     </div>
                  )}
                  </CardContent>
                </Card>
              </div>
           </div>
        </main>
        
        <footer className="bg-card mt-12 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
                  <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center justify-center md:justify-start gap-2"><Atom className="w-5 h-5 text-primary"/> {t.tubitak}</h3>
                      <p className="text-sm text-muted-foreground">{t.tubitakDesc}</p>
                  </div>
                  <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center justify-center md:justify-start gap-2"><Users className="w-5 h-5 text-primary"/> {t.projectTeam}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                          <p className="font-semibold">{t.teacher}</p>
                          <p>{t.students}</p>
                      </div>
                  </div>
                  <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center justify-center md:justify-start gap-2"><Building className="w-5 h-5 text-primary"/> {t.supporters}</h3>
                       <div className="flex justify-center md:justify-start gap-6 items-center">
                          <a href="https://www.meb.gov.tr/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-opacity hover:opacity-80">
                             <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Milli_E%C4%9Fitim_Bakanl%C4%B1%C4%9F%C4%B1_Logo.svg/1200px-Milli_E%C4%9Fitim_Bakanl%C4%B1%C4%9F%C4%B1_Logo.svg.png" alt="Milli Eğitim Bakanlığı Logo" width={80} height={80} />
                          </a>
                          <a href="https://www.tubitak.gov.tr/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-opacity hover:opacity-80">
                             <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/T%C3%9CB%C4%B0TAK_logo.svg/1848px-T%C3%9CB%C4%B0TAK_logo.svg.png" alt="TÜBİTAK Logo" width={140} height={40} />
                          </a>
                      </div>
                  </div>
                  <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center justify-center md:justify-start gap-2"><LinkIcon className="w-5 h-5 text-primary"/>{t.usefulLinks}</h3>
                      <div className="flex flex-col items-center md:items-start space-y-2">
                          <div className="flex justify-center md:justify-start gap-4 mb-2">
                              <a href="https://www.instagram.com/asalkapakli2019/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Image src="https://img.icons8.com/fluent/48/000000/instagram-new.png" width={24} height={24} alt="Instagram" /></a>
                              <a href="https://x.com/asalkapakli2019" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Image src="https://img.icons8.com/fluent/48/000000/twitterx.png" width={24} height={24} alt="Twitter" /></a>
                              <a href="https://www.youtube.com/@AzizSancarAnadoluLisesi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Image src="https://img.icons8.com/fluent/48/000000/youtube-play.png" width={24} height={24} alt="Youtube" /></a>
                          </div>
                          <a href="https://kapakli.meb.gov.tr/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                              {t.kapakliMeb}
                          </a>
                      </div>
                  </div>
              </div>
               <div className="border-t mt-8 pt-6 text-center text-muted-foreground">
                  <p className="text-sm">&copy; {new Date().getFullYear()} {t.title}. {t.footerRights}</p>
              </div>
          </div>
        </footer>
      </SidebarInset>
    </>
  );
}

export default function Home() {
  const { isUserLoading, user } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-screen text-center space-y-4">
        <MascotLoading />
        <h3 className="text-xl font-semibold text-primary">Yükleniyor...</h3>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <DashboardLayout />
    </SidebarProvider>
  );
}

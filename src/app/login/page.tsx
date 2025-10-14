'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';
import { useFirebase } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { auth, user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleAnonymousSignIn = async () => {
    initiateAnonymousSignIn(auth);
  };

  if (isUserLoading || user) {
    return <div className="flex h-screen items-center justify-center">Yönlendiriliyor...</div>;
  }

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Giriş Yap</h1>
            <p className="text-balance text-muted-foreground">
              Devam etmek için e-postanızı girin
            </p>
          </div>
          <LoginForm />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Veya
              </span>
            </div>
          </div>
           <Button variant="outline" onClick={handleAnonymousSignIn}>
            Misafir Olarak Devam Et (Demo)
          </Button>
          <div className="mt-4 text-center text-sm">
            Hesabın yok mu?{' '}
            <Link href="/signup" className="underline">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex lg:flex-col lg:items-center lg:justify-center p-10">
         <div className="text-center">
            <div className="relative mx-auto mb-4 w-40 h-40">
              <Image src="http://azizsancaranadolu.meb.k12.tr/meb_iys_dosyalar/59/11/765062/resimler/2025_06/03222921_logolar3.jpg" alt="SpeakSmart Logo" fill className="object-contain" />
            </div>
            <h2 className="text-4xl font-bold">SpeakSmart</h2>
            <p className="text-xl text-muted-foreground mt-2">Yapay Zekâ Destekli Konuşma Asistanı</p>
             <div className="relative mx-auto my-6 w-24 h-24">
              <Image src="http://azizsancaranadolu.meb.k12.tr/meb_iys_dosyalar/59/11/765062/resimler/2025_06/03222921_logolar3.jpg" alt="Okul Logosu" fill className="object-contain rounded-full bg-white p-2" />
            </div>
            <p className="text-sm text-muted-foreground max-w-md mt-4">
                Bu platform, Tekirdağ Kapaklı Aziz Sancar Anadolu Lisesi öğrenci ve öğretmenlerinin bir araya gelerek, TÜBİTAK 4006-B Bilim Fuarları Destekleme Programı'nın vizyonuyla hayata geçirdiği bir projedir. Amacımız, dil eğitiminde teknolojinin sınırlarını zorlayarak yenilikçi bir çözüm sunmaktır.
             </p>
         </div>
      </div>
    </div>
  );
}

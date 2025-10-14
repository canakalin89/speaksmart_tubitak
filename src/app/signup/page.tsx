'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignUpForm } from '@/components/auth/signup-form';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Mascot } from '@/components/mascot';

export default function SignUpPage() {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
     return <div className="flex h-screen items-center justify-center">Yönlendiriliyor...</div>;
  }

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
        <div className="flex items-center justify-center py-12">
            <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Kayıt Ol</CardTitle>
                <CardDescription>
                Hesap oluşturmak için bilgilerinizi girin
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignUpForm />
                <div className="mt-4 text-center text-sm">
                    Zaten bir hesabın var mı?{' '}
                    <Link href="/login" className="underline">
                        Giriş Yap
                    </Link>
                </div>
            </CardContent>
            </Card>
        </div>
        <div className="hidden bg-muted lg:flex lg:flex-col lg:items-center lg:justify-center p-10">
         <div className="text-center">
            <Image src="http://azizsancaranadolu.meb.k12.tr/meb_iys_dosyalar/59/11/765062/resimler/2025_06/03222921_logolar3.jpg" alt="Okul Logosu" width={120} height={120} className="rounded-full object-contain bg-white p-2 mx-auto mb-4" />
            <h2 className="text-4xl font-bold">SpeakSmart</h2>
            <p className="text-xl text-muted-foreground mt-2">Yapay Zekâ Destekli Konuşma Asistanı</p>
            <Mascot />
             <p className="text-sm text-muted-foreground max-w-md mt-6">
                Bu proje, Tekirdağ Kapaklı Aziz Sancar Anadolu Lisesi tarafından TÜBİTAK 4006-B Bilim Fuarları Destekleme Programı kapsamında geliştirilmiştir.
             </p>
         </div>
      </div>
    </div>
  );
}

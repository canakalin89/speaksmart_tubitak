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

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'SpeakSmart: Yapay Zekâ Destekli Konuşma Asistanı',
  description:
    'Türkiye Yüzyılı Maarif Modeli ile İngilizce konuşma pratiği yapın.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="https://azizsancaranadolu.meb.k12.tr/meb_iys_dosyalar/59/11/765062/resimler/2025_06/03222921_logolar3.jpg" type="image/x-icon" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <main>
            {children}
            <Toaster />
          </main>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

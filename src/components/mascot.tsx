'use client';
import Image from 'next/image';

const videoUrl = 'https://azizsancaranadolu.meb.k12.tr/meb_iys_dosyalar/59/11/765062/dosyalar/2025_10/14225159_social_u6212943116_bir_maskot_tasarlayacak_olsaydm_ad_lexi_olan_tekn_e86b296bfb7d4fa0bef163b6d354440f_2.mp4';

export function Mascot() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-lg">
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        data-ai-hint="animated mascot video"
      />
    </div>
  );
}

export function MascotLoading() {
    return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-lg">
        <style jsx>{`
        .pulsing-video {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover pulsing-video"
        data-ai-hint="animated mascot video"
      />
    </div>
  )
}

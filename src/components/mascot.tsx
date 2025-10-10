'use client';
import Image from 'next/image';

const illustrationUrl = 'https://picsum.photos/seed/education-concept/600/400';

export function Mascot() {
  return (
    <div className="relative w-64 h-48 md:w-80 md:h-60">
      <Image
        src={illustrationUrl}
        alt="AI English Tutor Illustration"
        fill
        className="object-contain"
        data-ai-hint="illustration person speaking"
        priority
      />
    </div>
  );
}

export function MascotLoading() {
  return (
    <div className="relative w-64 h-48 md:w-80 md:h-60">
       <style jsx>{`
        .pulsing-image {
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
      <Image
        src={illustrationUrl}
        alt="AI English Tutor Illustration - Analyzing"
        fill
        className="object-contain pulsing-image"
        data-ai-hint="illustration person speaking"
      />
    </div>
  )
}

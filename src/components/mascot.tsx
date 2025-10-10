'use client';
import { cn } from '@/lib/utils';

export function Mascot() {
  return (
    <div className="relative w-48 h-48 animate-float">
       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full transform transition-transform duration-500 hover:scale-110"
      >
        {/* Shadow */}
        <ellipse cx="100" cy="185" rx="45" ry="8" fill="hsl(var(--primary))" opacity="0.2" className="animate-shadow-pulse" />

        {/* Body */}
        <path d="M50 170 C 50 110, 150 110, 150 170 C 125 180, 75 180, 50 170" fill="hsl(var(--secondary))" />
        
        {/* Face */}
        <path d="M60 140 C 60 70, 140 70, 140 140 C 120 155, 80 155, 60 140" fill="hsl(var(--background))" />
        
        {/* Tummy Patch */}
         <path d="M80 145 C 80 125, 120 125, 120 145 C 110 150, 90 150, 80 145" fill="hsl(var(--background) / 0.5)" />

        {/* Eyes */}
        <g className="animate-eye-blink">
          <circle cx="80" cy="115" r="12" fill="white" />
          <circle cx="82" cy="118" r="5" fill="hsl(25, 20%, 20%)" />
          <circle cx="120" cy="115" r="12" fill="white" />
          <circle cx="118" cy="118" r="5" fill="hsl(25, 20%, 20%)" />
        </g>
        
        {/* Beak */}
        <path d="M95 125 L 105 125 L 100 135 Z" fill="hsl(var(--primary))" />
        
        {/* Ear tufts */}
        <path d="M60 75 L 80 50 L 90 70 Z" fill="hsl(var(--secondary))" />
        <path d="M140 75 L 120 50 L 110 70 Z" fill="hsl(var(--secondary))" />


        <style jsx>{`
          @keyframes eye-blink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          .animate-eye-blink {
            animation: eye-blink 4s infinite;
            transform-origin: center 115px;
          }
          @keyframes float {
             0%, 100% { transform: translateY(0px); }
             50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
           @keyframes shadow-pulse {
             0%, 100% { transform: scaleX(1); opacity: 0.2; }
             50% { transform: scaleX(0.9); opacity: 0.1; }
          }
          .animate-shadow-pulse {
            animation: shadow-pulse 4s ease-in-out infinite;
            transform-origin: center;
          }
        `}</style>
      </svg>
    </div>
  );
}

export function MascotLoading() {
  return (
     <div className="relative w-48 h-48">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
      >
        {/* Body */}
        <path d="M50 170 C 50 110, 150 110, 150 170 C 125 180, 75 180, 50 170" fill="hsl(var(--secondary))" />
        
        {/* Face */}
        <path d="M60 140 C 60 70, 140 70, 140 140 C 120 155, 80 155, 60 140" fill="hsl(var(--background))" />
        
        {/* Tummy Patch */}
        <path d="M80 145 C 80 125, 120 125, 120 145 C 110 150, 90 150, 80 145" fill="hsl(var(--background) / 0.5)" />

        {/* Loading Eyes */}
        <g>
            <circle cx="80" cy="115" r="12" fill="white" />
            <circle cx="120" cy="115" r="12" fill="white" />
            <path
                d="M 72 115 A 8 8 0 0 1 88 115"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                fill="none"
                className="animate-eye-load-left"
            />
             <path
                d="M 112 115 A 8 8 0 0 1 128 115"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                fill="none"
                className="animate-eye-load-right"
            />
        </g>
        
        {/* Beak */}
        <path d="M95 125 L 105 125 L 100 135 Z" fill="hsl(var(--primary))" />
        
        {/* Ear tufts */}
        <path d="M60 75 L 80 50 L 90 70 Z" fill="hsl(var(--secondary))" />
        <path d="M140 75 L 120 50 L 110 70 Z" fill="hsl(var(--secondary))" />

        <style jsx>{`
           @keyframes eye-load-left {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-eye-load-left {
            animation: eye-load-left 1.2s linear infinite;
            transform-origin: 80px 115px;
          }
           @keyframes eye-load-right {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          .animate-eye-load-right {
            animation: eye-load-right 1.2s linear infinite;
            transform-origin: 120px 115px;
          }
        `}</style>
      </svg>
    </div>
  )
}

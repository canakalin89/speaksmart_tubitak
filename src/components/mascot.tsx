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
        <path d="M70,120 Q100,110 130,120 L140,170 L60,170 Z" fill="hsl(var(--secondary))" />
        <path d="M90,120 L110,120 L100,135 Z" fill="hsl(var(--primary))" />
        
        {/* Head */}
        <circle cx="100" cy="85" r="40" fill="hsl(25, 60%, 80%)" />
        
        {/* Hair */}
        <path d="M70,75 Q100,45 130,75 L130,85 L70,85 Z" fill="hsl(25, 20%, 20%)" />

        {/* Eyes */}
        <g className="animate-eye-blink">
          <circle cx="85" cy="85" r="5" fill="white" />
          <circle cx="85" cy="85" r="2" fill="hsl(25, 20%, 20%)" />
          <circle cx="115" cy="85" r="5" fill="white" />
          <circle cx="115" cy="85" r="2" fill="hsl(25, 20%, 20%)" />
        </g>

        {/* Smile */}
        <path d="M90,100 Q100,110 110,100" stroke="hsl(25, 20%, 20%)" strokeWidth="2" fill="none" />

        <style jsx>{`
          @keyframes eye-blink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          .animate-eye-blink {
            animation: eye-blink 4s infinite;
            transform-origin: center;
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
        <path d="M70,120 Q100,110 130,120 L140,170 L60,170 Z" fill="hsl(var(--secondary))" />
        <path d="M90,120 L110,120 L100,135 Z" fill="hsl(var(--primary))" />
        
        {/* Head */}
        <circle cx="100" cy="85" r="40" fill="hsl(25, 60%, 80%)" />
        
        {/* Hair */}
        <path d="M70,75 Q100,45 130,75 L130,85 L70,85 Z" fill="hsl(25, 20%, 20%)" />

        {/* Eyes - loading effect */}
        <g className="animate-spin-slow" style={{ transformOrigin: '100px 85px' }}>
          <path d="M85 80 A 15 15 0 0 1 115 80" fill="none" stroke="white" strokeWidth="4" />
           <path d="M115 90 A 15 15 0 0 1 85 90" fill="none" stroke="white" strokeWidth="4" />
        </g>
        
        {/* Smile */}
        <path d="M95,105 C100,108 105,108 105,105" stroke="hsl(25, 20%, 20%)" strokeWidth="2" fill="none" className="animate-pulse-fast"/>


        <style jsx>{`
           @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 1.2s linear infinite;
          }
          @keyframes pulse-fast {
             0%, 100% { opacity: 1; }
             50% { opacity: 0.5; }
          }
          .animate-pulse-fast {
            animation: pulse-fast 1s ease-in-out infinite;
          }
        `}</style>
      </svg>
    </div>
  )
}

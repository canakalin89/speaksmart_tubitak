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
        <ellipse cx="100" cy="175" rx="40" ry="8" fill="hsl(var(--primary))" opacity="0.2" className="animate-shadow-pulse" />

        {/* Head */}
        <path d="M50,100 C50,60 150,60 150,100 L150,150 L50,150 Z" fill="hsl(var(--primary))" />
        
        {/* Eye */}
        <circle cx="100" cy="105" r="20" fill="white" />
        <circle cx="100" cy="105" r="8" fill="hsl(var(--secondary))" className="animate-eye-blink" />

        {/* Antenna */}
        <path d="M100,60 Q110,40 120,45" stroke="hsl(var(--primary))" strokeWidth="5" fill="none" />
        <circle cx="122" cy="45" r="8" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="3" />

        <style jsx>{`
          @keyframes eye-blink {
            0%, 80%, 100% { transform: scaleY(1); }
            82% { transform: scaleY(0.1); }
            84% { transform: scaleY(1); }
          }
          .animate-eye-blink {
            animation: eye-blink 5s infinite;
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
             50% { transform: scaleX(0.8); opacity: 0.1; }
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
        {/* Head */}
        <path d="M50,100 C50,60 150,60 150,100 L150,150 L50,150 Z" fill="hsl(var(--primary))" />

        {/* Eye - loading effect */}
        <g className="animate-spin-slow" style={{ transformOrigin: '100px 105px' }}>
          <path d="M100 85 A 20 20 0 0 1 120 105" fill="none" stroke="white" strokeWidth="6" />
        </g>
        <circle cx="100" cy="105" r="14" fill="hsl(var(--primary))" />

        {/* Antenna */}
        <path d="M100,60 Q110,40 120,45" stroke="hsl(var(--primary))" strokeWidth="5" fill="none" />
        <circle cx="122" cy="45" r="8" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="3" className="animate-pulse-fast"/>

        <style jsx>{`
           @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 1.2s linear infinite;
          }
          @keyframes pulse-fast {
             0%, 100% { transform: scale(1); }
             50% { transform: scale(1.2); }
          }
          .animate-pulse-fast {
            animation: pulse-fast 1.2s ease-in-out infinite;
          }
        `}</style>
      </svg>
    </div>
  )
}

'use client';
import { cn } from '@/lib/utils';

export function Mascot() {
  return (
    <div className="relative w-48 h-48 animate-pulse-slow">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full transform transition-transform duration-500 hover:scale-110"
      >
        {/* Head */}
        <rect
          x="50"
          y="50"
          width="100"
          height="80"
          rx="15"
          fill="hsl(var(--primary))"
        />
        {/* Eye */}
        <circle cx="100" cy="90" r="25" fill="white" />
        <circle cx="100" cy="90" r="10" fill="hsl(var(--primary))" className="animate-eye-blink" />
        {/* Antenna */}
        <line
          x1="100"
          y1="50"
          x2="100"
          y2="30"
          stroke="hsl(var(--primary))"
          strokeWidth="5"
        />
        <circle cx="100" cy="25" r="8" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="3" />
        {/* Body */}
        <rect
          x="65"
          y="130"
          width="70"
          height="40"
          rx="10"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
        <style jsx>{`
          @keyframes eye-blink {
            0%, 70%, 100% { transform: scaleY(1); }
            72% { transform: scaleY(0.1); }
            74% { transform: scaleY(1); }
          }
          .animate-eye-blink {
            animation: eye-blink 4s infinite;
            transform-origin: center;
          }
          @keyframes pulse-slow {
             0%, 100% { opacity: 1; transform: scale(1); }
             50% { opacity: 0.8; transform: scale(1.02); }
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
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
        <rect
          x="50"
          y="50"
          width="100"
          height="80"
          rx="15"
          fill="hsl(var(--primary))"
        />
        {/* Eye - loading effect */}
        <g className="animate-spin-slow" style={{ transformOrigin: '100px 90px' }}>
          <path d="M100 65 A 25 25 0 0 1 125 90" fill="none" stroke="white" strokeWidth="8" />
        </g>
         <circle cx="100" cy="90" r="17" fill="hsl(var(--primary))" />

        {/* Antenna */}
        <line
          x1="100"
          y1="50"
          x2="100"
          y2="30"
          stroke="hsl(var(--primary))"
          strokeWidth="5"
        />
        <circle cx="100" cy="25" r="8" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="3" />
        {/* Body */}
        <rect
          x="65"
          y="130"
          width="70"
          height="40"
          rx="10"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
        <style jsx>{`
           @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 1.5s linear infinite;
          }
        `}</style>
      </svg>
    </div>
  )
}
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
        <g transform="translate(0 -10)" className="animate-body-flip">
          <rect x="70" y="100" width="60" height="70" rx="15" fill="hsl(var(--secondary))" />
          {/* Screen */}
          <rect x="80" y="110" width="40" height="30" rx="5" fill="hsl(var(--background))" />
          {/* Eyes on screen */}
          <g className="animate-eye-blink">
            <circle cx="90" cy="125" r="3" fill="hsl(var(--secondary))" />
            <circle cx="110" cy="125" r="3" fill="hsl(var(--secondary))" />
          </g>
          {/* Antenna */}
          <line x1="100" y1="100" x2="100" y2="80" stroke="hsl(var(--secondary))" strokeWidth="2" />
          <circle cx="100" cy="75" r="5" fill="hsl(var(--primary))" className="animate-antenna-pulse" />
        </g>
        
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
             0% { transform: translateY(0px); }
             50% { transform: translateY(-20px); }
             100% { transform: translateY(0px); }
          }
           @keyframes body-flip {
            0% { transform: rotate(0deg) translateY(0); }
            25% { transform: rotate(5deg) translateY(-15px); }
            70% { transform: rotate(-5deg) translateY(-10px); }
            90%, 100% { transform: rotate(360deg) translateY(0); }
           }
          .animate-body-flip {
             animation: body-flip 5s ease-in-out infinite;
             transform-origin: center 135px;
          }
          .animate-float {
            animation: float 2.5s ease-in-out infinite;
          }
           @keyframes shadow-pulse {
             0%, 100% { transform: scaleX(1); opacity: 0.2; }
             50% { transform: scaleX(0.8); opacity: 0.1; }
          }
          .animate-shadow-pulse {
            animation: shadow-pulse 2.5s ease-in-out infinite;
            transform-origin: center;
          }
          @keyframes antenna-pulse {
            0%, 100% { box-shadow: 0 0 3px 1px hsl(var(--primary)); }
            50% { box-shadow: 0 0 8px 3px hsl(var(--primary)); }
          }
          .animate-antenna-pulse {
             animation: antenna-pulse 2s ease-in-out infinite;
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
        <g transform="translate(0 -10)">
            <rect x="70" y="100" width="60" height="70" rx="15" fill="hsl(var(--secondary))" />
            {/* Screen */}
            <rect x="80" y="110" width="40" height="30" rx="5" fill="hsl(var(--background))" />
            {/* Loading symbol on screen */}
            <g>
                <path
                    d="M 90 125 A 8 8 0 0 1 110 125"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    fill="none"
                    className="animate-eye-load-left"
                />
            </g>
            {/* Antenna */}
            <line x1="100" y1="100" x2="100" y2="80" stroke="hsl(var(--secondary))" strokeWidth="2" />
            <circle cx="100" cy="75" r="5" fill="hsl(var(--primary))" className="animate-pulse" />
        </g>

        <style jsx>{`
           @keyframes eye-load-left {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-eye-load-left {
            animation: eye-load-left 1.2s linear infinite;
            transform-origin: 100px 125px;
          }
        `}</style>
      </svg>
    </div>
  )
}

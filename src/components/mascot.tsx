'use client';
import { cn } from '@/lib/utils';

export function Mascot() {
  return (
    <div className="relative w-64 h-48">
      <svg
        viewBox="0 0 250 200"
        className="w-full h-full"
      >
        <defs>
            <clipPath id="teacher-clip">
                <rect x="30" y="80" width="60" height="90" rx="10"/>
            </clipPath>
            <clipPath id="student-clip">
                <rect x="160" y="80" width="60" height="90" rx="10"/>
            </clipPath>
        </defs>
        
        {/* Ground */}
        <line x1="10" y1="170" x2="240" y2="170" stroke="hsl(var(--border))" strokeWidth="2" />

        {/* Teacher */}
        <g className="animate-teacher-idle">
            <rect x="30" y="80" width="60" height="90" rx="10" fill="hsl(var(--secondary))" />
            <circle cx="70" cy="105" r="18" fill="hsl(var(--background))" stroke="hsl(var(--secondary))" strokeWidth="2"/>
            <circle cx="78" cy="100" r="2" fill="hsl(var(--foreground))" />
             <path d="M 65 120 q 5 5 10 0" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
        </g>
        
        {/* Student */}
        <g>
            <rect x="160" y="80" width="60" height="90" rx="10" fill="hsl(var(--primary))" fillOpacity="0.8" />
             <circle cx="180" cy="105" r="18" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" strokeOpacity="0.8"/>
            <circle cx="172" cy="100" r="2" fill="hsl(var(--foreground))" />
            <path d="M 175 120 q 5 0 10 0" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
        </g>

        {/* Speech Bubble animation for student */}
        <g className="animate-speech-bubble">
            <path d="M 210 90 a 15 15 0 1 1 0.1 0 Z" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1.5" />
            <circle cx="210" cy="90" r="1.5" fill="hsl(var(--muted-foreground))" />
            <circle cx="218" cy="90" r="1.5" fill="hsl(var(--muted-foreground))" />
            <circle cx="202" cy="90" r="1.5" fill="hsl(var(--muted-foreground))" />
        </g>

        <style jsx>{`
          @keyframes teacher-idle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .animate-teacher-idle {
            animation: teacher-idle 4s ease-in-out infinite;
          }

          @keyframes speech-bubble {
            0%, 60%, 100% { opacity: 0; transform: scale(0.5) translate(10px, -10px); }
            70% { opacity: 1; transform: scale(1) translate(0, 0); }
            95% { opacity: 1; transform: scale(1) translate(0, 0); }
          }
          .animate-speech-bubble {
            animation: speech-bubble 5s ease-in-out infinite;
            transform-origin: 210px 90px;
          }
        `}</style>
      </svg>
    </div>
  );
}

export function MascotLoading() {
  return (
     <div className="relative w-64 h-48">
      <svg
        viewBox="0 0 250 200"
        className="w-full h-full"
      >
        {/* Ground */}
        <line x1="10" y1="170" x2="240" y2="170" stroke="hsl(var(--border))" strokeWidth="2" />

        {/* Teacher */}
        <g>
            <rect x="30" y="80" width="60" height="90" rx="10" fill="hsl(var(--secondary))" />
            <circle cx="70" cy="105" r="18" fill="hsl(var(--background))" stroke="hsl(var(--secondary))" strokeWidth="2"/>
            <circle cx="78" cy="100" r="2" fill="hsl(var(--foreground))" className="animate-teacher-eye-scan"/>
            {/* Pencil */}
            <g className="animate-writing">
              <rect x="80" y="120" width="5" height="25" rx="2" fill="hsl(var(--accent))" transform="rotate(-20 82.5 132.5)" />
               <polygon points="78,142 82.5,148 87,142" fill="hsl(var(--foreground))" transform="rotate(-20 82.5 145)" />
            </g>
        </g>
        
        {/* Student (speaking) */}
        <g>
            <rect x="160" y="80" width="60" height="90" rx="10" fill="hsl(var(--primary))" fillOpacity="0.8" />
             <circle cx="180" cy="105" r="18" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" strokeOpacity="0.8"/>
            <circle cx="172" cy="100" r="2" fill="hsl(var(--foreground))" />
            {/* Mouth open */}
            <ellipse cx="180" cy="122" rx="4" ry="2" fill="hsl(var(--foreground))" className="animate-student-mouth" />
        </g>
        
        {/* Audio wave from student to teacher */}
        <path d="M 210,110 C 170,110 160,90 120,90" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeDasharray="5" className="animate-wave"/>

        <style jsx>{`
            @keyframes student-mouth {
                0%, 100% { transform: scaleY(0.2); }
                50% { transform: scaleY(1); }
            }
            .animate-student-mouth {
                animation: student-mouth 1s ease-in-out infinite;
                transform-origin: center;
            }

            @keyframes wave {
                to { stroke-dashoffset: -10; }
            }
            .animate-wave {
                animation: wave 0.5s linear infinite;
            }

            @keyframes writing {
                0%, 100% { transform: rotate(-20deg) translateY(0); }
                25% { transform: rotate(-15deg) translateY(2px); }
                75% { transform: rotate(-25deg) translateY(-2px); }
            }
            .animate-writing {
                animation: writing 1.5s ease-in-out infinite;
                transform-origin: 80px 120px;
            }
            @keyframes teacher-eye-scan {
                0%, 100% { transform: translateX(0); }
                40% { transform: translateX(0); }
                50% { transform: translateX(-5px); }
                90% { transform: translateX(-5px); }
            }
            .animate-teacher-eye-scan {
                 animation: teacher-eye-scan 3s ease-in-out infinite;
            }
        `}</style>
      </svg>
    </div>
  )
}

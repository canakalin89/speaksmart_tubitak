'use client';
import { cn } from '@/lib/utils';

export function Mascot() {
  return (
    <div className="relative w-64 h-48">
      <style jsx>{`
        .robot-body {
            fill: hsl(var(--secondary));
            stroke: hsl(var(--secondary-foreground));
            stroke-width: 2;
        }
        .robot-eye {
            fill: white;
        }
        .robot-pupil {
            fill: hsl(var(--foreground));
        }
        .robot-antenna {
            stroke: hsl(var(--secondary-foreground));
            stroke-width: 1.5;
        }
        .antenna-light {
            fill: hsl(var(--primary));
        }
        .floating {
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0% { transform: translatey(0px); }
            50% { transform: translatey(-10px); }
            100% { transform: translatey(0px); }
        }
        .eye-blink {
            animation: blink 3s ease-in-out infinite;
        }
        @keyframes blink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
        }
      `}</style>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
      >
        <g className="floating">
            {/* Body */}
            <rect className="robot-body" x="65" y="80" width="70" height="70" rx="15" />

            {/* Head */}
            <rect className="robot-body" x="50" y="50" width="100" height="40" rx="10" />

            {/* Eyes */}
            <g className="eye-blink">
                <circle className="robot-eye" cx="80" cy="70" r="8" />
                <circle className="robot-pupil" cx="82" cy="70" r="3" />
                <circle className="robot-eye" cx="120" cy="70" r="8" />
                <circle className="robot-pupil" cx="122" cy="70" r="3" />
            </g>

            {/* Antenna */}
            <line className="robot-antenna" x1="100" y1="50" x2="100" y2="30" />
            <circle className="antenna-light" cx="100" cy="25" r="5" />

             {/* Shadow */}
            <ellipse cx="100" cy="165" rx="30" ry="5" fill="black" fillOpacity="0.1" />
        </g>
      </svg>
    </div>
  );
}

export function MascotLoading() {
  return (
     <div className="relative w-64 h-48">
      <style jsx>{`
        .robot-body {
            fill: hsl(var(--secondary));
            stroke: hsl(var(--secondary-foreground));
            stroke-width: 2;
        }
        .robot-eye {
            fill: white;
        }
        .robot-pupil {
            fill: hsl(var(--foreground));
        }
        .robot-antenna {
            stroke: hsl(var(--secondary-foreground));
            stroke-width: 1.5;
        }
        .antenna-light-loading {
            fill: hsl(var(--primary));
            animation: pulse 1.5s ease-in-out infinite;
        }
         .screen {
            fill: hsl(var(--background));
        }
        .data-line {
            stroke: hsl(var(--primary));
            stroke-width: 2;
            animation: data-scroll 1s linear infinite;
        }
        .floating {
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0% { transform: translatey(0px); }
            50% { transform: translatey(-10px); }
            100% { transform: translatey(0px); }
        }
        @keyframes pulse {
            0% { r: 5px; opacity: 1; }
            50% { r: 7px; opacity: 0.7; }
            100% { r: 5px; opacity: 1; }
        }
        @keyframes data-scroll {
            from { transform: translateY(-8px); opacity: 0; }
            to { transform: translateY(8px); opacity: 1; }
        }
      `}</style>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
      >
        <g className="floating">
            {/* Body */}
            <rect className="robot-body" x="50" y="50" width="100" height="100" rx="20" />

            {/* Screen on body */}
            <rect className="screen" x="65" y="80" width="70" height="40" rx="5" />
            <g clipPath="url(#screen-clip)">
                <line className="data-line" x1="75" y1="85" x2="125" y2="85" style={{animationDelay: '0s'}} />
                <line className="data-line" x1="75" y1="95" x2="125" y2="95" style={{animationDelay: '0.3s'}}/>
                <line className="data-line" x1="75" y1="105" x2="125" y2="105" style={{animationDelay: '0.6s'}}/>
            </g>
            <defs>
                <clipPath id="screen-clip">
                    <rect x="65" y="80" width="70" height="40" rx="5" />
                </clipPath>
            </defs>
            
            {/* Head */}
            <rect className="robot-body" x="75" y="30" width="50" height="20" rx="5" />
            
            {/* Eyes */}
            <circle className="robot-eye" cx="90" cy="40" r="4" />
            <circle className="robot-eye" cx="110" cy="40" r="4" />
            
            {/* Antenna */}
            <line className="robot-antenna" x1="100" y1="30" x2="100" y2="15" />
            <circle className="antenna-light-loading" cx="100" cy="12" r="5" />

            {/* Shadow */}
            <ellipse cx="100" cy="165" rx="30" ry="5" fill="black" fillOpacity="0.1" />
        </g>
      </svg>
    </div>
  )
}

    
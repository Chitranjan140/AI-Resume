'use client'

export const WaveBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
      
      <svg className="absolute w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)">
              <animate attributeName="stop-opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="rgba(147, 51, 234, 0.4)">
              <animate attributeName="stop-opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.2)">
              <animate attributeName="stop-opacity" values="0.2;0.5;0.2" dur="5s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.2)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.2)" />
          </linearGradient>
        </defs>
        
        <path fill="url(#wave1)" opacity="0.7">
          <animate attributeName="d" 
            values="M0,300 Q300,200 600,300 T1200,300 L1200,800 L0,800 Z;
                    M0,350 Q300,250 600,350 T1200,350 L1200,800 L0,800 Z;
                    M0,300 Q300,200 600,300 T1200,300 L1200,800 L0,800 Z"
            dur="8s" repeatCount="indefinite" />
        </path>
        
        <path fill="url(#wave2)" opacity="0.5">
          <animate attributeName="d" 
            values="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z;
                    M0,450 Q300,350 600,450 T1200,450 L1200,800 L0,800 Z;
                    M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z"
            dur="6s" repeatCount="indefinite" />
        </path>
      </svg>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  )
}
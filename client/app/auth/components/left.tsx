import Image from "next/image";

export default function LeftSide() {
  return (
    <div className="flex-1 relative overflow-hidden" style={{ background: '#CC90DA' }}>
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='2' viewBox='0 0 2 2'%3E%3Crect width='1' height='1' fill='%23000000'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          opacity: 0.25,
        }}
      />
      {/* Logo at top left */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <Image
          src="/assets/logo.png"
          alt="MIS MATCHED logo"
          width={82}
          height={100}
          className="mt-2"
          priority
        />
        <span className="text-white text-[30px] font-normal capitalize leading-[100%] px-2 self-center font-marcellus">
          <span className="text-white">MIS</span>
          <span className="text-[#FF99FF]">MATCHED</span>
        </span>
      </div>



      {/* Main Content */}
      <div className="flex items-center justify-center h-full px-12">
        <div className="text-center max-w-2xl">
          {/* Main Heading */}
          <h1 className="text-black text-[48px] font-bold leading-tight mb-16 font-fjalla-one">
            "Your Love Story Begins Here.<br />
            Let's Make It Unforgettable."
          </h1>

          {/* Glassmorphic Card */}
          <div className="relative">
            <div 
              className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl px-8 py-6 shadow-xl"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              <div className="flex items-center justify-center gap-4">
                <span className="text-white text-2xl font-medium">
                  Find Your Soulmate With Us
                </span>
               
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Elements - Airplane and Dotted Path */}
      <div className="absolute bottom-16 left-10 flex items-end">
        {/* Plane Image */}
        <Image
          src="/assets/plane.png"
          alt="plane icon"
          width={600}
          height={600}
          className="relative z-10 -rotate-6"
          style={{ transform: 'scaleX(-1) rotate(6deg)', filter: 'brightness(0) saturate(100%)' }}
          priority
        />
      </div>
      

      {/* Cat illustration placeholder - will add actual image later */}
      <div className="absolute bottom-0 right-0 ">
        {/* Cat Image */}
        <Image
          src="/assets/cats/6.png"
          alt="Cat at boundary"
          width={600}
          height={600}
          className="object-contain z-20 relative"
          priority
        />
      </div>

      {/* Floating Hearts */}
      {/* Heart 1 */}
      <svg
        className="absolute top-16 left-28 animate-pulse"
        width="72"
        height="72"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heartGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d79dfc" />
          </linearGradient>
        </defs>
        <path
          d="M12 21s-4.35-2.54-7.2-5.3C2 13 1 10.54 1 8.5 1 5.42 3.42 3 6.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18.58 3 21 5.42 21 8.5c0 2.04-1 4.5-3.8 7.2C16.35 18.46 12 21 12 21z"
          fill="url(#heartGrad1)"
        />
      </svg>

      {/* Heart 2 */}
      <svg
        className="absolute top-24 right-24 animate-pulse"
        width="60"
        height="60"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heartGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d79dfc" />
          </linearGradient>
        </defs>
        <path
          d="M12 21s-4.35-2.54-7.2-5.3C2 13 1 10.54 1 8.5 1 5.42 3.42 3 6.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18.58 3 21 5.42 21 8.5c0 2.04-1 4.5-3.8 7.2C16.35 18.46 12 21 12 21z"
          fill="url(#heartGrad2)"
        />
      </svg>

      {/* Heart 3 */}
      <svg
        className="absolute top-56 left-16 animate-pulse"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heartGrad3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d79dfc" />
          </linearGradient>
        </defs>
        <path
          d="M12 21s-4.35-2.54-7.2-5.3C2 13 1 10.54 1 8.5 1 5.42 3.42 3 6.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18.58 3 21 5.42 21 8.5c0 2.04-1 4.5-3.8 7.2C16.35 18.46 12 21 12 21z"
          fill="url(#heartGrad3)"
        />
      </svg>

      {/* Heart 4 */}
      <svg
        className="absolute top-64 right-48 animate-pulse"
        width="52"
        height="52"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heartGrad4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d79dfc" />
          </linearGradient>
        </defs>
        <path
          d="M12 21s-4.35-2.54-7.2-5.3C2 13 1 10.54 1 8.5 1 5.42 3.42 3 6.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18.58 3 21 5.42 21 8.5c0 2.04-1 4.5-3.8 7.2C16.35 18.46 12 21 12 21z"
          fill="url(#heartGrad4)"
        />
      </svg>

      {/* Heart 5 */}
      <svg
        className="absolute bottom-48 left-24 animate-pulse"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heartGrad5" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d79dfc" />
          </linearGradient>
        </defs>
        <path
          d="M12 21s-4.35-2.54-7.2-5.3C2 13 1 10.54 1 8.5 1 5.42 3.42 3 6.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18.58 3 21 5.42 21 8.5c0 2.04-1 4.5-3.8 7.2C16.35 18.46 12 21 12 21z"
          fill="url(#heartGrad5)"
        />
      </svg>

      {/* Heart 6 */}
      <svg
        className="absolute bottom-60 left-1/3 animate-pulse"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heartGrad6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d79dfc" />
          </linearGradient>
        </defs>
        <path
          d="M12 21s-4.35-2.54-7.2-5.3C2 13 1 10.54 1 8.5 1 5.42 3.42 3 6.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18.58 3 21 5.42 21 8.5c0 2.04-1 4.5-3.8 7.2C16.35 18.46 12 21 12 21z"
          fill="url(#heartGrad6)"
        />
      </svg>

      {/* Heart 7 */}
      <svg
        className="absolute bottom-32 left-1/2 transform -translate-x-10 animate-pulse"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heartGrad7" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d79dfc" />
          </linearGradient>
        </defs>
        <path
          d="M12 21s-4.35-2.54-7.2-5.3C2 13 1 10.54 1 8.5 1 5.42 3.42 3 6.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18.58 3 21 5.42 21 8.5c0 2.04-1 4.5-3.8 7.2C16.35 18.46 12 21 12 21z"
          fill="url(#heartGrad7)"
        />
      </svg>
      {/* Bottom gradient mountain */}
      <div className="absolute -bottom-4 left-[-202px] w-[1200px] h-[252px] z-0 pointer-events-none" style={{ filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.25))' }}>
        <svg width="1200" height="252" viewBox="0 0 1200 252" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mountGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#CC90DA" />
              <stop offset="100%" stopColor="#FFFBFB" />
            </linearGradient>
          </defs>
          <path d="M0 180 C 200 120 400 160 600 120 C 800 80 1000 140 1200 100 L1200 252 L0 252 Z" fill="url(#mountGrad)" stroke="#000000" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
} 
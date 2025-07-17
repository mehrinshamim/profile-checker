"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Hero() {
  const router = useRouter();
  
  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col gap-10 ml-8 sm:ml-20 px-6 sm:px-12 pt-24 relative max-w-2xl mt-40">
        {/* Headline */}
        <h1
          className="text-white text-[48px] sm:text-[56px] font-fjalla-one leading-[100%]"
          style={{ fontFamily: "'Fjalla One', sans-serif" }}
        >
          <span className="whitespace-nowrap">No more <span className="text-[#FF99FF]">God when?</span></span>
          <br />
          <span className="block mt-4 whitespace-nowrap">Meet your Perfect Match</span>
        </h1>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/auth")}
          className="font-fjalla-one inline-flex items-center justify-center bg-gradient-to-r from-[#D67BFF] to-[#FF9EFF] text-white font-semibold text-lg sm:text-xl px-10 py-4 rounded-full shadow-md hover:opacity-90 transition-opacity w-max"
        >
          Get started →
        </button>

        {/* Plane with dotted path */}
        <div className="absolute -bottom-70 left-2 z-0">
          

          {/* Plane Icon */}
          <Image
            src="/assets/plane.png"
            alt="plane icon"
            width={4000}
            height={4000}
            className="mt-10"
          />
        </div>
      </section>

      {/* Right-side images */}
      <div className="absolute top-[190px] left-[917px]" style={{ opacity: 1 }}>
        <Image
          src="/assets/cats/1.png"
          alt="cat image 1"
          width={283}
          height={416}
          className="rounded-[30px] shadow-[0px_4px_4px_#00000040]"
          priority
        />
      </div>

      <div className="absolute top-[190px] left-[1220px]" style={{ opacity: 1 }}>
        <Image
          src="/assets/cats/2.png"
          alt="cat image 2"
          width={600}
          height={700}
          className="rounded-[30px] shadow-[0px_4px_4px_#00000040]"
          priority
        />
      </div>

      <div className="absolute top-[620px] left-[919px]" style={{ opacity: 1 }}>
        <Image
          src="/assets/cats/3.png"
          alt="cat image 3"
          width={283}
          height={378}
          className="rounded-[30px] shadow-[0px_4px_4px_#00000040]"
          priority
        />
      </div>

      <div className="absolute top-[530px] left-[1127px] z-10" style={{ opacity: 1 }}>
        <Image
          src="/assets/cats/main.png"
          alt="main cat image"
          width={614}
          height={700}
          priority
        />
      </div>

      {/* Background sticker behind main cat */}
      <div className="absolute top-[550px] left-[1220px]   z-0 pointer-events-none" style={{ opacity: 1 }}>
        <Image
          src="/assets/cats/5.png"
          alt="decorative background"
          width={270}
          height={300}
          className="rounded-[30px] shadow-[0px_4px_4px_#00000040]"
          priority
        />
      </div>

      {/* Heart bubble icon over main cat */}
      <div className="absolute top-[600px] left-[1190px] z-20 pointer-events-none flex items-center justify-center w-[80px] h-[80px] rounded-full bg-[#D67BFF] drop-shadow-[0_0_10px_#FF99FF]">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21s-4.35-2.54-7.2-5.3C2 13 1 10.54 1 8.5 1 5.42 3.42 3 6.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18.58 3 21 5.42 21 8.5c0 2.04-1 4.5-3.8 7.2C16.35 18.46 12 21 12 21z" />
        </svg>
      </div>

      <div className="absolute top-[560px] left-[1497px]" style={{ opacity: 1 }}>
        <Image
          src="/assets/cats/4.png"
          alt="cat image 4"
          width={344}
          height={438}
          className="rounded-[30px] shadow-[0px_4px_4px_#00000040]"
          priority
        />
      </div>

      {/* Chat bubble */}
      <div
        className="absolute top-[809px] left-[1516px] z-20 flex items-center gap-4 px-6 py-4 rounded-full"
        style={{
          background: "#D9D9D93D",
          border: "1px solid #F5F5F55C",
          backdropFilter: "blur(30px)",
          opacity: 1,
        }}
      >
        <Image
          src="/assets/cats/bubble.png"
          alt="cat avatar"
          width={60}
          height={100}
          className="rounded-full"
          priority
        />
        <span
          className="text-white text-[20px] font-fjalla-one"
        >
          Hi handsome... <span className="text-[#B52558]">❤</span>
        </span>
      </div>
    </>
  );
} 
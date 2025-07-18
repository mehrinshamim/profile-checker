import Image from "next/image";


export default function PfpLeftSide() {


  return (
    <div
      className="relative flex flex-col justify-between w-[400px] h-screen overflow-hidden"
      style={{ background: "#CC90DA" }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='2' viewBox='0 0 2 2'%3E%3Crect width='1' height='1' fill='%23000000'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          opacity: 0.25,
        }}
      />

      {/* Top Logo – replicated measurements from Navbar for pixel-perfect alignment */}
      <div className="relative z-10 flex items-center gap- mt-6 ml-4">
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

   

      {/* Cat Illustration */}
      <div className="relative z-10 mt-auto">
        <Image
          src="/assets/cats/6.png"
          alt="Cat illustration"
          width={400}
          height={400}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
} 
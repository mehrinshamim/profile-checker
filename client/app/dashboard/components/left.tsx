import Image from "next/image";

interface LeftSideProps {
  onSettingsClick: () => void;
}

export default function LeftSide({ onSettingsClick }: LeftSideProps) {
  return (
    <div
      className="relative flex flex-col justify-between w-[350px] h-screen overflow-hidden"
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

      {/* Navigation Menu */}
      <div className="relative z-10 flex flex-col gap-4 mt-8 ml-6 ">
        {/* My Profile */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white/20 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="text-white font-medium font-fjalla">My Profile</span>
        </div>

        {/* Users */}
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          <span className="text-white font-medium font-fjalla">Users</span>
        </div>

        {/* Settings */}
        <div onClick={onSettingsClick} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-white font-medium font-fjalla">Settings</span>
        </div>
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
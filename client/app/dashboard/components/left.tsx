import Image from "next/image";

type Section = "profile" | "users" | "matches";

interface LeftSideProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function LeftSide({ activeSection, onSectionChange }: LeftSideProps) {
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
        <div
          onClick={() => onSectionChange("profile")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
            activeSection === "profile" ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="text-white font-medium font-fjalla">My Profile</span>
        </div>

        {/* Users */}
        <div
          onClick={() => onSectionChange("users")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
            activeSection === "users" ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          <span className="text-white font-medium font-fjalla">Users</span>
        </div>

        {/* Matches */}
        <div
          onClick={() => onSectionChange("matches")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
            activeSection === "matches" ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-white font-medium font-fjalla">Matches</span>
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
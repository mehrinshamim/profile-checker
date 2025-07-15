import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 sm:px-12 py-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/assets/logo.png"
          alt="MIS MATCHED logo"
          width={82}
          height={100}
          className="mt-2"
          priority
        />
        <span className="text-white text-[30px] font-normal capitalize leading-[100%] px-2 self-center">
          <span className="text-white">MIS</span>
          <span className="text-[#FF99FF]">MATCHED</span>
        </span>
      </div>

      {/* Navigation links */}
      <ul className="hidden lg:flex items-center gap-10 text-white font-normal text-[25px] leading-[100%]">
        <li className="hover:text-purple-400 transition-colors cursor-pointer text-white flex items-center justify-center px-4">Home</li>
        <li className="hover:text-purple-400 transition-colors cursor-pointer text-white flex items-center justify-center px-4">Features</li>
        <li className="hover:text-purple-400 transition-colors cursor-pointer text-white flex items-center justify-center px-4">Contact</li>
        <li className="hover:text-purple-400 transition-colors cursor-pointer text-white flex items-center justify-center px-4">Login</li>
        <li className="flex items-center justify-center px-4">
          <a
            href="#"
            className="bg-purple-400 text-white font-semibold text-[25px] px-8 py-2 rounded-full hover:bg-purple-500 transition-colors"
          >
            Register
          </a>
        </li>
      </ul>
    </nav>
  );
} 
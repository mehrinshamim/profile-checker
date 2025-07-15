import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      {/* Navbar */}
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

      {/* Hero Section */}
      <section className="flex flex-col gap-10 ml-8 sm:ml-20 px-6 sm:px-12 pt-24 relative max-w-2xl mt-40">
        {/* Headline */}
        <h1
          className="text-white text-[48px] sm:text-[56px] font-normal leading-[100%]"
          style={{ fontFamily: "'Fjalla One', sans-serif" }}
        >
          <span className="whitespace-nowrap">No more <span className="text-[#FF99FF]">God when?</span></span>
          <br />
          <span className="block mt-4 whitespace-nowrap">Meet your Perfect Match</span>
        </h1>

        {/* CTA Button */}
        <a
          href="#"
          className="inline-flex items-center justify-center bg-gradient-to-r from-[#D67BFF] to-[#FF9EFF] text-white font-semibold text-lg sm:text-xl px-10 py-4 rounded-full shadow-md hover:opacity-90 transition-opacity w-max"
        >
          Get started →
        </a>

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
    </div>
  );
}

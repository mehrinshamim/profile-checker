'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/auth');
  };

  const handleSignup = () => {
    router.push('/auth');
  };

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
                  <span className="text-white text-[30px] font-normal capitalize leading-[100%] px-2 self-center font-marcellus">
            <span className="text-white">MIS</span>
            <span className="text-[#FF99FF]">MATCHED</span>
          </span>
      </div>

    
    </nav>
  );
} 
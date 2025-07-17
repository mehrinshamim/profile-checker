"use client";
import { useState } from "react";
import Image from "next/image";

export default function PfpRightSide() {
  const [age, setAge] = useState(18);
  return (
    <div className="flex flex-col items-start justify-start pt-10 pl-10 bg-black h-full w-full">
      {/* Upload Photo container */}
      <div
        className="relative rounded-[30px] overflow-hidden"
        style={{
          width: "581px",
          height: "450px",
          boxShadow: "12px 4px 4px 0px #FBE9FF",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Background image */}
        <Image
          src="/assets/upload-section.png"
          alt="Upload section background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />

        {/* Centered overlay text & icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <span className="text-white font-fjalla-one text-3xl">Upload Photo</span>
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-[#FF99FF]">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="#B52558"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21s-4.35-2.54-7.2-5.3C2 13 1 10.54 1 8.5 1 5.42 3.42 3 6.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18.58 3 21 5.42 21 8.5c0 2.04-1 4.5-3.8 7.2C16.35 18.46 12 21 12 21z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Profile Info Form */}
      <form className="mt-16 w-full max-w-5xl text-white font-fjalla-one">
        <div className="flex w-full">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6 pr-4">
            {/* Name */}
            <div>
              <label className="text-2xl text-gray-400" htmlFor="name">Name :</label>
              <input
                id="name"
                name="name"
                type="text"
                className="block w-full bg-transparent border-0 border-b border-gray-600 focus:border-[#FF99FF] outline-none py-2 mt-2 text-lg"
              />
            </div>

            {/* Work As */}
            <div>
              <label className="text-2xl text-gray-400" htmlFor="workAs">Work As :</label>
              <input
                id="workAs"
                name="workAs"
                type="text"
                className="block w-full bg-transparent border-0 border-b border-gray-600 focus:border-[#FF99FF] outline-none py-2 mt-2 text-lg"
              />
            </div>

            {/* Looking For */}
            <div>
              <label className="text-2xl text-gray-400" htmlFor="lookingFor">Looking For :</label>
              <input
                id="lookingFor"
                name="lookingFor"
                type="text"
                className="block w-full bg-transparent border-0 border-b border-gray-600 focus:border-[#FF99FF] outline-none py-2 mt-2 text-lg"
              />
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-px bg-gray-700" />

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-6 pl-4">
            {/* Family Plan */}
            <div>
              <label className="text-2xl text-gray-400" htmlFor="familyPlan">Family plan:</label>
              <input
                id="familyPlan"
                name="familyPlan"
                type="text"
                className="block w-full bg-transparent border-0 border-b border-gray-600 focus:border-[#FF99FF] outline-none py-2 mt-2 text-lg"
              />
            </div>

            {/* Relationship Status */}
            <div>
              <label className="text-2xl text-gray-400" htmlFor="relationship">Relationship Status:</label>
              <input
                id="relationship"
                name="relationship"
                type="text"
                className="block w-full bg-transparent border-0 border-b border-gray-600 focus:border-[#FF99FF] outline-none py-2 mt-2 text-lg"
              />
            </div>

            {/* Removed Hobby and Pet-Peeves per latest requirement */}

            {/* Texting / Calling */}
            <div>
              <label className="text-2xl text-gray-400" htmlFor="contactPref">Texting/Calling:</label>
              <input
                id="contactPref"
                name="contactPref"
                type="text"
                className="block w-full bg-transparent border-0 border-b border-gray-600 focus:border-[#FF99FF] outline-none py-2 mt-2 text-lg"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Age Slider */}
      <div className="mt-10 w-full max-w-md">
        <label className="text-2xl font-fjalla-one text-[#D79DFC] mb-2 inline-block" htmlFor="ageRange">Age: {age}</label>
        <input
          id="ageRange"
          type="range"
          min="18"
          max="80"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value))}
          className="w-full h-1 bg-[#FBE9FF] rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: "#FFFFFF" }}
        />
        <div className="flex justify-between text-gray-500 mt-1 text-lg w-full">
          <span>18</span>
          <span>80</span>
        </div>
      </div>
    </div>
  );
} 
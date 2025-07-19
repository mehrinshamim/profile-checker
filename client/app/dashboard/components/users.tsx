import React, { useState } from "react";

const Users: React.FC = () => {
  const sampleUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 28,
      photo: "/assets/cats/1.png",
      work: "Designer",
      interests: ["Movies", "Art", "Cycling"],
    },
    {
      id: 2,
      name: "Mike Chen",
      age: 32,
      photo: "/assets/cats/2.png",
      work: "Engineer",
      interests: ["Hiking", "Gaming", "Cooking"],
    },
    {
      id: 3,
      name: "Emma Davis",
      age: 25,
      photo: "/assets/cats/3.png",
      work: "Teacher",
      interests: ["Reading", "Travel", "Yoga"],
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      age: 30,
      photo: "/assets/cats/4.png",
      work: "Doctor",
      interests: ["Coffee", "Running", "Photography"],
    },
    {
      id: 5,
      name: "Lisa Wang",
      age: 27,
      photo: "/assets/cats/5.png",
      work: "Artist",
      interests: ["Painting", "Museums", "Cats"],
    },
    {
      id: 6,
      name: "David Kim",
      age: 29,
      photo: "/assets/cats/6.png",
      work: "Chef",
      interests: ["Food", "Travel", "Basketball"],
    },
    // Remaining users kept simple
    { id: 7, name: "Jessica Brown", age: 26, photo: "/assets/cats/1.png", work: "Marketing", interests: ["Running"] },
    { id: 8, name: "Ryan Wilson", age: 31, photo: "/assets/cats/2.png", work: "Lawyer", interests: ["Golf"] },
    { id: 9, name: "Amanda Lee", age: 24, photo: "/assets/cats/3.png", work: "Nurse", interests: ["Yoga"] },
    { id: 10, name: "Chris Martinez", age: 33, photo: "/assets/cats/4.png", work: "Architect", interests: ["Drawing"] },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentUser = sampleUsers[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleAccept = () => {
    // TODO: perform match / like logic here
    handleNext();
  };

  const handleReject = () => {
    // TODO: perform pass logic here
    handleNext();
  };

  return (
    <div className="relative flex-1 p-8 flex flex-col items-center justify-center overflow-hidden">
        {/* Background spotlight + decorative icons */}
      <div
        className="absolute inset-0 pointer-events-none -z-20"
        style={{
          background:
            "radial-gradient(circle at center, rgba(215,157,252,0.18) 0%, rgba(0,0,0,1) 70%)",
        }}
      />

      {/* Floating icons */}
      <svg
        className="absolute top-16 right-40 w-12 h-12 text-[#D79DFC] opacity-15 animate-pulse -z-10"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      {/* extra hearts */}
      <svg
        className="absolute top-32 left-60 w-8 h-8 text-[#D79DFC] opacity-10 animate-pulse -z-10"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      <svg
        className="absolute bottom-40 right-24 w-14 h-14 text-[#D79DFC] opacity-10 animate-pulse -z-10"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <svg
        className="absolute bottom-24 left-32 w-10 h-10 text-[#FF5B5B] opacity-10 rotate-12 animate-pulse -z-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>

      {/* extra crosses */}
      <svg
        className="absolute top-12 left-20 w-8 h-8 text-[#FF5B5B] opacity-10 -rotate-6 animate-pulse -z-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>

      <svg
        className="absolute bottom-10 right-64 w-12 h-12 text-[#FF5B5B] opacity-10 rotate-3 animate-pulse -z-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-[#FFE9FF] opacity-5 -z-10"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27L18.18 21 16.545 13.97 22 9.24 14.82 8.63 12 2 9.18 8.63 2 9.24 7.455 13.97 5.82 21z" />
      </svg>
      <h2 className="text-3xl mb-8 text-[#D79DFC] font-fjalla-one">Find Your Perfect Match</h2>

      {currentUser ? (
        <>
          {/* Card */}
          <div className="w-[28rem] bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Photo */}
            <img
              src={currentUser.photo}
              alt={currentUser.name}
              className="w-full h-80 object-cover" />

            {/* Info section */}
            <div className="p-6 text-black font-league-spartan">
              <h3 className="text-2xl font-bold mb-1">
                {currentUser.name}, {currentUser.age}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{currentUser.work}</p>

              {/* Interests */}
              {currentUser.interests && (
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map((interest: string) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-[#FFE9FF] text-[#D79DFC] rounded-full text-xs font-semibold"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-10 mt-8">
            <button
              onClick={handleReject}
              className="w-20 h-20 flex items-center justify-center bg-[#FFE9FF] text-[#FF5B5B] rounded-full shadow-lg hover:bg-[#FFDBE0] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={handleAccept}
              className="w-20 h-20 flex items-center justify-center bg-[#D79DFC] text-white rounded-full shadow-xl hover:bg-[#c26dfc] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-9 h-9"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <p className="text-white font-league-spartan text-lg">No more users nearby!</p>
      )}
    </div>
  );
};

export default Users; 
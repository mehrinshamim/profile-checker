import React from "react";

const Users: React.FC = () => {
  return (
    <div className="flex-1 p-8">
      <h2 className="text-3xl mb-8 text-white font-fjalla-one">Users</h2>
      
      <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto">
        {/* Sample user cards - replace with actual data */}
        {[
          { id: 1, name: "Sarah Johnson", age: 28, photo: "/assets/cats/1.png", work: "Designer" },
          { id: 2, name: "Mike Chen", age: 32, photo: "/assets/cats/2.png", work: "Engineer" },
          { id: 3, name: "Emma Davis", age: 25, photo: "/assets/cats/3.png", work: "Teacher" },
          { id: 4, name: "Alex Rodriguez", age: 30, photo: "/assets/cats/4.png", work: "Doctor" },
          { id: 5, name: "Lisa Wang", age: 27, photo: "/assets/cats/5.png", work: "Artist" },
          { id: 6, name: "David Kim", age: 29, photo: "/assets/cats/6.png", work: "Chef" },
          { id: 7, name: "Jessica Brown", age: 26, photo: "/assets/cats/1.png", work: "Marketing" },
          { id: 8, name: "Ryan Wilson", age: 31, photo: "/assets/cats/2.png", work: "Lawyer" },
          { id: 9, name: "Amanda Lee", age: 24, photo: "/assets/cats/3.png", work: "Nurse" },
          { id: 10, name: "Chris Martinez", age: 33, photo: "/assets/cats/4.png", work: "Architect" },
          { id: 11, name: "Sophie Taylor", age: 29, photo: "/assets/cats/5.png", work: "Photographer" },
          { id: 12, name: "Kevin Anderson", age: 35, photo: "/assets/cats/6.png", work: "Consultant" },
          { id: 13, name: "Rachel Green", age: 27, photo: "/assets/cats/1.png", work: "Writer" },
          { id: 14, name: "Tom Harris", age: 30, photo: "/assets/cats/2.png", work: "Musician" },
          { id: 15, name: "Nina Patel", age: 28, photo: "/assets/cats/3.png", work: "Scientist" },
          { id: 16, name: "Marcus Johnson", age: 32, photo: "/assets/cats/4.png", work: "Chef" },
          { id: 17, name: "Isabella Garcia", age: 25, photo: "/assets/cats/5.png", work: "Dentist" },
          { id: 18, name: "Daniel White", age: 34, photo: "/assets/cats/6.png", work: "Pilot" },
          { id: 19, name: "Olivia Clark", age: 26, photo: "/assets/cats/1.png", work: "Veterinarian" },
          { id: 20, name: "James Thompson", age: 29, photo: "/assets/cats/2.png", work: "Firefighter" },
        ].map((user) => (
          <div key={user.id} className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={user.photo}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-base font-bold text-black font-league-spartan">
                  {user.name}, {user.age}
                </h3>
                <p className="text-gray-600 text-xs font-league-spartan">
                  {user.work}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#D79DFC] text-white rounded-lg font-semibold hover:bg-[#c26dfc] transition-colors font-league-spartan text-sm">
                View Profile
              </button>
              <button className="px-3 py-2 bg-[#FFE9FF] text-[#D79DFC] rounded-lg hover:bg-[#FFDBFF] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users; 
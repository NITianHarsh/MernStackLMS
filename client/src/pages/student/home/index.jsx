import React from "react";

function StudentHomePage() {

  return (
    <div className='min-h-screen bg-white'>
<section className="bg-gradient-to-r from-indigo-800 to-purple-600 text-white py-16 px-6 lg:px-20">
  <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
      Unlock Your Potential <br />
      with the Best Courses Available!
    </h1>
    <p className="text-lg md:text-2xl font-semibold mt-4 max-w-2xl">
      Start mastering new skills today. Learn from experts, gain real-world experience, and level up your career.
    </p>
    <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center">
      <button className="bg-yellow-400 text-gray-900 font-bold text-xl px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition">
        Start Learning Now
      </button>
      <button className="border-2 border-white text-white font-semibold text-xl px-8 py-4 rounded-lg shadow-md hover:bg-white hover:text-gray-900 transition">
        Explore Courses
      </button>
    </div>
  </div>
</section>

    </div>
  )
}

export default StudentHomePage
import Navbar from "@/components/navbar";
import React, { useEffect } from "react";
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const users = [
    {
      name: "Gaurav Simkar",
      role: "Full Stack Developer",
      description: (
        <ul className="list-disc list-inside space-y-1 text-left">
          <li>Scalable Web Application Development</li>
          <li>Stack: React.js, Node.js, Strapi, MongoDB, Python</li>
          <li>Database Optimization & Performance Tuning</li>
        </ul>
      ),
      image: "GauravSimkar.png",
      socials: {
        linkedin: "https://www.linkedin.com/in/gauravsimkar/",
        github: "https://github.com/GauravSimkar",
      },
    },

    {
      name: "Harshit Verma",
      role: "Full Stack Developer",
      description: (
        <ul className="list-disc list-inside space-y-1 text-left">
          <li>Backend: Node.js, Express, Strapi CMS, MongoDB</li>
          <li>Frontend: UI, React.js, JavaScript, HTML, CSS</li>
        </ul>
      ),
      image: "profile-pic (1).png",
      socials: {
        linkedin: "https://www.linkedin.com/in/harshitmnnit/",
        github: "https://github.com/NITianHarsh",
      },
    },
    {
      name: "Deepank Kujur",
      role: "Full Stack Developer",
      description: (
        <ul className="list-disc list-inside space-y-1 text-left">
          <li>Frontend: React.js, HTML, CSS, JavaScript</li>
          <li>Responsive Design, Performance Optimization</li>
          <li>Backend: Node.js, Express, Strapi CMS, MongoDB</li>
        </ul>
      ),
      image: "deepankImage.png",
      socials: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
    },
    {
      name: "Gaurav Singh",
      role: "Full Stack Developer",
      description: (
        <ul className="list-disc list-inside space-y-1 text-left">
          <li>Scalable Web Application Development</li>
          <li>Stack: React.js, Node.js, Strapi, MongoDB, Python</li>
          <li>Database Optimization & Performance Tuning</li>
        </ul>
      ),
      image: "singhImg.jpg",
      socials: {
        linkedin: "https://www.linkedin.com/",
        github: "https://github.com/",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] pb-16">
      <Navbar/>
      <h1 className="text-5xl font-extrabold text-center text-white mb-20 tracking-wide">
        Meet Our Team
      </h1>

      {/* Grid with 2 columns on small screens and up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-18 justify-items-center">
        {users.map((user, index) => (
          <div
            key={index}
            className="relative bg-opacity-10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-[340px] shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
          >
            {/* Profile Image */}
            <div className="flex justify-center -mt-20">
              <img
                src={user.image}
                alt={user.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>

            {/* User Info */}
            <h2 className="text-2xl text-white font-bold mt-6 text-center">
              {user.name}
            </h2>
            <p className="text-sm text-purple-300 font-semibold mb-4 text-center">
              {user.role}
            </p>

            {/* Gradient Divider */}
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-4" />

            {/* Description */}
            <div className="text-sm text-gray-200">{user.description}</div>

            {/* Social Media */}
            <div className="flex justify-center gap-6 mt-6">
              <a href={user.socials.linkedin} target="_blank" rel="noreferrer">
                <FaLinkedin
                  className="text-blue-500 hover:text-blue-600 transition-all duration-200"
                  size={24}
                />
              </a>
              <a href={user.socials.github} target="_blank" rel="noreferrer">
                <FaGithub
                  className="text-gray-300 hover:text-white transition-all duration-200"
                  size={24}
                />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;

import React, { useContext, useState } from 'react';
import { GraduationCap, TvMinimalPlay, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { AuthContext } from '@/context/auth-context';

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
 const { resetCredentials } = useContext(AuthContext);
  function handleLogout() {
      resetCredentials();
    sessionStorage.clear();
    console.log("Logout successful");
    }
  return (
    <header className="bg-gradient-to-r from-teal-400 to-lime-400 shadow-lg sticky top-0 z-50 border-b rounded-lg">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/home" className="flex items-center gap-2 hover:text-white transition">
          <GraduationCap className="h-8 w-8 text-white" />
          <span className="text-xl font-bold tracking-tight text-white">LMS Learn</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Button
            variant="ghost"
            className="text-sm font-medium text-white hover:text-teal-300 hover:bg-teal-600 transition px-4 py-2 rounded-md"
            onClick={() => navigate("/PublishedExamList")}
          >
            Explore Exams
          </Button>

          <div onClick={()=>navigate('/student-courses')} className="flex items-center gap-2 cursor-pointer hover:text-teal-300 transition">
            <span className="text-sm font-medium">My Courses</span>
            <TvMinimalPlay className="w-6 h-6 text-white" />
          </div>

          <Button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 text-sm font-semibold rounded-md transition" onClick={handleLogout}>
            LogOut
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 px-6 pt-6 pb-6 bg-white border-t shadow-xl animate-slide-down text-center rounded-lg">
          {/* Explore Courses */}
          <Button
            variant="ghost"
            onClick={()=>navigate('/courses')}
            className="text-sm font-medium text-teal-700 hover:text-teal-600 hover:bg-teal-100 px-4 py-2 rounded-md transition"
          >
            Explore Courses
          </Button>

          {/* My Courses */}
          <button className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-600 hover:bg-teal-100 px-4 py-2 rounded-md transition">
            <TvMinimalPlay className="w-5 h-5 text-teal-700" />
            My Courses
          </button>

          {/* Sign Out */}
          <Button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 text-sm font-semibold rounded-md transition" onClick={handleLogout}>
            LogOut
          </Button>
        </div>
      )}
    </header>
  );
}

export default StudentViewCommonHeader;

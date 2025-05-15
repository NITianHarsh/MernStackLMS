import React from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import StudentViewCommonHeader from "./Header";
import Footer from "@/pages/Footer";

function CommonLayout() {
  const location = useLocation();

  const isExamRoute = location.pathname.includes("/start");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      {!isExamRoute &&<Footer/> && <StudentViewCommonHeader />}

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default CommonLayout;

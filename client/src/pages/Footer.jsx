import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full shadow-md bg-white text-gray-800 text-sm dark:bg-gray-900 dark:text-gray-200">
      <div className="w-full mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6">
          {/* Useful Links */}
          <div>
            <h5 className="text-base font-semibold mb-1 uppercase text-gray-900 dark:text-gray-100">
              Useful Links
            </h5>
            <ul className="flex flex-row gap-x-4">
              <li>
                <Link
                  to="/aboutus"
                  className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/termsandconditions"
                  className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-2 border-gray-300 dark:border-gray-700" />

        {/* Footer Bottom */}
        <div className="text-center text-xs text-gray-600 dark:text-gray-400 pb-1">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full shadow-md bg-white text-gray-800 text-sm">
      <div className="w-full mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6">
          {/* Useful Links */}
          <div>
            <h5 className="text-base font-semibold mb-1 uppercase text-gray-900">
              Useful Links
            </h5>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/aboutus"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/termsandconditions"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-2 border-gray-300" />

        {/* Footer Bottom */}
        <div className="text-center text-xs text-gray-600 pb-1">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

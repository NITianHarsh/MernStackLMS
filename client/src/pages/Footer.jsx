import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full shadow-md bg-fuchsia-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300">
      <div className="w-full mx-auto p-3 lg:px-30">
        <div className="flex flex-col lg:flex-row justify-between gap-5 lg:gap-10">
          {/* Left Section */}
          <div className="lg:w-1/2">
            <h4 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Let's keep in touch!
            </h4>
            <p className="text-base text-gray-700 dark:text-gray-400">
              Find us on any of these platforms. We usually respond within 1–2
              business days.
            </p>
          </div>

          {/* Right Section */}
          <div className="lg:w-1/2 flex flex-col sm:flex-row lg:justify-end gap-8">
            {/* Useful Links */}
            <div>
              <h5 className="text-lg font-semibold mb-1 uppercase text-gray-900 dark:text-white">
                Useful Links
              </h5>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
                <li>
                  <Link
                    to="/aboutus"
                    className="hover:text-teal-600 dark:hover:text-white transition-colors duration-200"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/termsandconditions"
                    className="hover:text-teal-600 dark:hover:text-white transition-colors duration-200"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* You can add more sections here if needed */}
          </div>
        </div>

        {/* Divider */}
        <hr className="my-2 border-gray-300 dark:border-gray-700" />

        {/* Footer Bottom */}
        <div className="text-center text-xs text-gray-600 dark:text-gray-500">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import Navbar from "@/components/navbar";
import React, { useEffect } from "react";

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-[#f0f4f8] to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Terms & Conditions
        </h1>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using our Learning Management System (LMS), you
              agree to comply with these Terms & Conditions. If you do not
              agree, please do not use the platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">
              2. Use of the Platform
            </h2>
            <p>
              Our LMS provides access to educational content, courses, quizzes,
              and assignments. You agree not to misuse the platform for illegal
              activities, plagiarism, or distributing unauthorized materials.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">
              3. Account Responsibility
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account and password. Notify us immediately of any unauthorized
              use of your account.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">
              4. Content Ownership
            </h2>
            <p>
              All content provided through the platform is owned by the LMS or
              its partners unless stated otherwise. You may not reproduce or
              redistribute course materials without permission.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">5. Modifications</h2>
            <p>
              We reserve the right to update these Terms at any time. Continued
              use of the platform after changes implies acceptance of the
              revised terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">6. Termination</h2>
            <p>
              We may suspend or terminate your access to the LMS if you violate
              these Terms or engage in harmful behavior.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a
                href="mailto:support@lms.com"
                className="text-blue-500 underline"
              >
                support@lms.com
              </a>
              .
            </p>
          </div>
        </section>

        <p className="mt-12 text-sm text-center text-gray-500 dark:text-gray-400">
          Last updated: May 10, 2025
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;

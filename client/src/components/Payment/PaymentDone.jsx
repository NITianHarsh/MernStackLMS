import React from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react"; // Using lucide for icon

const PaymentDone = () => {
  const [searchParams] = useSearchParams();
  const referenceNum = searchParams.get("reference");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-green-50 p-4">
      <div className="bg-white shadow-xl border border-blue-100 rounded-2xl p-8 text-center space-y-4 w-full max-w-md">
        <div className="flex justify-center">
          <CheckCircle2 className="text-green-600" size={64} />
        </div>
        <h1 className="text-2xl font-bold text-green-700">
          Payment Successful
        </h1>
        <p className="text-gray-600 text-sm">
          Thank you! Your payment has been processed successfully.
        </p>
        <div className="mt-4 bg-gray-100 p-4 rounded-lg border border-dashed text-left text-sm text-gray-700">
          <p className="font-semibold">Reference Number</p>
          <p className="font-mono break-all text-blue-600">
            {referenceNum || "N/A"}
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/student/student-courses")}
          className="mt-6 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentDone;

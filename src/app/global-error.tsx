"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="text-center max-w-md w-full bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-xl">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Critical Error</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              A fatal error occurred while rendering the application layout. Our technical team has been notified.
            </p>
            <button
              onClick={() => reset()}
              className="w-full py-4 bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
            >
              Try to Recover
            </button>
            <p className="mt-4 text-sm text-gray-400">
              If the problem persists, please check back later.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

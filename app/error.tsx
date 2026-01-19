"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/brutalist";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="text-center font-mono space-y-6 max-w-md">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-black uppercase">Something Went Wrong</h1>
        <p className="text-gray-600 text-sm">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}

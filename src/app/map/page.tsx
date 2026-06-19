"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RemovedMapPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/matches");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">This feature has been integrated into Matches discovery.</p>
      </div>
    </div>
  );
}
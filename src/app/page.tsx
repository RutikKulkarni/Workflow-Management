"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default function HomePage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (!currentUser) {
      router.push("/auth");
    }
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome, {user.email}!</h1>
    </div>
  );
}

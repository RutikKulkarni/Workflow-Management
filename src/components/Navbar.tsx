"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

export default function Navbar() {
  const [user, setUser] = useState<unknown>(null); // Adjust type based on your user structure

  useEffect(() => {
    // Fetch user only on the client side
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Workflow System
        </Link>
        <div>
          {user ? (
            <Link href="/workflows" className="text-blue-600 hover:underline">
              Workflows
            </Link>
          ) : (
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

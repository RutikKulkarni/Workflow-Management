"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bgImage from "@/assets/background.png";
import { login, getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { BrandSection } from "@/components/auth/BrandSection";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    setError(null);
    try {
      login(email, password, rememberMe);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="relative flex h-screen">
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gray bg-opacity-50"></div>
      </div>

      <BrandSection />

      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 md:px-16 z-10">
        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  );
}

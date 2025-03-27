"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Make sure this is uncommented
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import bgImage from "@/assets/background.png"; // Make sure this path matches your actual image location

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Logging in:", { email, password, rememberMe });
      router.push("/");
    } catch {
      setError("Invalid email or password.");
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
        />
        <div className="absolute inset-0 bg-gray bg-opacity-50"></div>
      </div>

      <div className="hidden lg:flex relative w-1/2 z-10">
        <div className="flex flex-col justify-center px-16">
          <h1 className="text-4xl font-bold text-white">HighBridge</h1>
          <p className="mt-4 text-lg text-white">Building the Future...</p>
          <p className="mt-2 text-white text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 md:px-16 z-10">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 text-center">
            WELCOME BACK!
          </h2>
          <h1 className="text-2xl font-bold text-center mt-2">
            Log In to your Account
          </h1>

          <form onSubmit={handleSubmit} className="mt-6">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Type here..."
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Type here..."
                required
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="text-sm">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-red-500 text-white rounded-md mt-4 hover:bg-red-600"
            >
              Log In
            </button>
          </form>

          <div className="flex items-center mt-6">
            <div className="w-full h-px bg-gray-300"></div>
            <span className="mx-4 text-gray-400">Or</span>
            <div className="w-full h-px bg-gray-300"></div>
          </div>

          <div className="mt-4 space-y-3">
            <button className="w-full flex items-center justify-center py-2 border rounded-md text-gray-700 hover:bg-gray-100">
              <FaGoogle className="mr-2" /> Log In with Google
            </button>
            <button className="w-full flex items-center justify-center py-2 border rounded-md text-gray-700 hover:bg-gray-100">
              <FaFacebook className="mr-2" /> Log In with Facebook
            </button>
            <button className="w-full flex items-center justify-center py-2 border rounded-md text-gray-700 hover:bg-gray-100">
              <FaApple className="mr-2" /> Log In with Apple
            </button>
          </div>

          <p className="mt-6 text-sm text-center">
            New User?{" "}
            <a href="#" className="text-blue-600 font-semibold hover:underline">
              SIGN UP HERE
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

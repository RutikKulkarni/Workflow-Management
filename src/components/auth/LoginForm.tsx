import { useState, FormEvent } from "react";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

interface LoginFormProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => void;
  error: string | null;
}

export function LoginForm({ onSubmit, error }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(email, password, rememberMe);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-700 text-center">
        WELCOME BACK!
      </h2>
      <h1 className="text-2xl font-bold text-center mt-2">
        Log In to your Account
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
        <div>
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

        <div className="flex justify-between items-center">
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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
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
        {[
          { Icon: FaGoogle, text: "Google" },
          { Icon: FaFacebook, text: "Facebook" },
          { Icon: FaApple, text: "Apple" },
        ].map(({ Icon, text }) => (
          <button
            key={text}
            className="w-full flex items-center justify-center py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Icon className="mr-2" /> Log In with {text}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-center">
        New User?{" "}
        <a href="#" className="text-blue-600 font-semibold hover:underline">
          SIGN UP HERE
        </a>
      </p>
    </div>
  );
}

import { useState } from "react";
import { toast } from "sonner";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "admin@inventory.com" && password === "1234") {
      onLogin({ email: email, name: "Admin User" });
    } else {
      toast.error("Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 mt-2">
            Sign in to manage your inventory
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="admin@inventory.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded hover:bg-indigo-700 transition-colors mt-4"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>Demo Credentials</p>
          <p>User: admin@inventory.com | Pass: 1234</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

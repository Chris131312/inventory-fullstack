import { useState } from "react";
import { toast } from "sonner";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      localStorage.setItem("token", data.access_token);
      toast.success("Login successful!");

      onLogin({ username: username });
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Incorrect username or password.");
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
              Username
            </label>
            <input
              type="text"
              className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="******"
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
          <p>User: admin | Pass: 123456</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

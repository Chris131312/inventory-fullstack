import { useState } from "react";
import { toast } from "sonner";

const LoginPage = ({ onLogin }) => {
  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      //Register flow
      try {
        const response = await fetch("http://127.0.0.1:8000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Registration failed");
        }

        toast.success("Account created successfully! You can now log in.");
        setIsRegistering(false);
        setPassword("");
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(error.message);
      }
    } else {
      //Login flow with FormData
      try {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const response = await fetch("http://127.0.0.1:8000/login", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Invalid username or password");
        }

        const data = await response.json();
        localStorage.setItem("token", data.access_token);

        onLogin({ username });
        toast.success(`Welcome, ${username}!`);
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-indigo-900 justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-slate-900 opacity-90"></div>
        <div className="relative z-10 text-center px-12">
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
            Inventory <span className="text-indigo-400">Pro</span>
          </h1>
          <p className="text-lg text-indigo-200 max-w-md mx-auto">
            Manage your materials, track stock levels, and optimize your
            workflow in one secure platform.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {isRegistering ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-slate-500">
              {isRegistering
                ? "Register to manage your inventory"
                : "Sign in to access your dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full p-3 pr-12 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                {/* Toggle password visibility button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-600 focus:outline-none font-medium text-sm transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all mt-4"
            >
              {isRegistering ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setPassword("");
                setUsername("");
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
            >
              {isRegistering
                ? "Already have an account? Sign in here"
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

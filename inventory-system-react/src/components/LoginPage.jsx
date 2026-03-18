import { useState } from "react";
import { toast } from "sonner";

const LoginPage = ({ onLogin }) => {
  //State for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //State to toggle between Login and Register modes
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      //--Register Flow --
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
      // --Login FLow--
      try {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const response = await fetch("http://127.0.0.1:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-ww-form-urlencoded",
          },
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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-slate-600">
            {isRegistering
              ? "Register to manage your inventory"
              : "Sign in to access your dashboard"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            {isRegistering ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setPassword(""); // Clear password when switching modes
            }}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            {isRegistering
              ? "Already have an account? Sign in here"
              : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

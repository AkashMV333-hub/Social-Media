import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    dob: "",
    careOf: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/");
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log(formData)
    const result = await login(formData);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-spotify-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-spotify-text">
            Aadhaar-based Login
          </h2>
          <p className="mt-2 text-center text-sm text-spotify-text-subdued">
            Enter Aadhaar details exactly as printed
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-900 bg-opacity-50 p-4 border border-red-700">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              className="w-full px-4 py-3 bg-spotify-gray border border-spotify-border rounded-md text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-colors"
              value={formData.username}
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full px-4 py-3 bg-spotify-gray border border-spotify-border rounded-md text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-colors"
              value={formData.password}
              onChange={handleChange}
            />

            <input
              name="name"
              type="text"
              required
              placeholder="Full Name (as on Aadhaar)"
              className="w-full px-4 py-3 bg-spotify-gray border border-spotify-border rounded-md text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-colors"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              name="dob"
              type="text"
              required
              placeholder="Date of Birth"
              className="w-full px-4 py-3 bg-spotify-gray border border-spotify-border rounded-md text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-colors"
              value={formData.dob}
              onChange={handleChange}
            />

            <input
              name="careOf"
              type="text"
              required
              placeholder="Care Of / Father's Name"
              className="w-full px-4 py-3 bg-spotify-gray border border-spotify-border rounded-md text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-colors"
              value={formData.careOf}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-full text-black bg-spotify-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green disabled:opacity-50 transition-all"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <div className="text-center">
            <Link
              to="/register"
              className="font-medium text-spotify-green hover:text-green-400 transition-colors"
            >
              Don’t have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;


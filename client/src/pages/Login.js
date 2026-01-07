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
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

 // In Login.js handleSubmit function:
const handleSubmit = async (e) => {
  e.preventDefault(); // This should prevent page refresh
  setError("");
  setFieldErrors({});
  setLoading(true);

  try {
    console.log("Submitting login data:", formData);
    const result = await login(formData);
    console.log("Login result from AuthContext:", result);

    if (result.success) {
      console.log("Login successful, navigating...");
      navigate("/");
    } else {
      console.log("Login failed, checking for field errors...");
      if (result.fieldErrors) {
        console.log("Field errors found:", result.fieldErrors);
        setFieldErrors(result.fieldErrors);
      } else {
        console.log("General error:", result.message);
        setError(result.message);
      }
      setLoading(false);
    }
  } catch (error) {
    console.log("Unexpected error in handleSubmit:", error);
    setError("An unexpected error occurred. Please try again.");
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand2">
            Aadhaar-based Login
          </h2>
          <p className="mt-2 text-center text-sm text-brand2">
            Enter Aadhaar details exactly as printed
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-blue-700 bg-opacity-50 p-4 border border-blue-700">
              <p className="text-sm text-blue-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                name="username"
                type="text"
                required
                placeholder="Username"
                className={`w-full px-4 py-3 bg-brand2 border rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  fieldErrors.username 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-brand2 focus:ring-brand1'
                }`}
                value={formData.username}
                onChange={handleChange}
              />
              {fieldErrors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            <div>
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                className={`w-full px-4 py-3 bg-brand2 border rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  fieldErrors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-brand2 focus:ring-brand1'
                }`}
                value={formData.password}
                onChange={handleChange}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <input
                name="name"
                type="text"
                required
                placeholder="Full Name (as on Aadhaar)"
                className={`w-full px-4 py-3 bg-brand2 border rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  fieldErrors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-brand2 focus:ring-brand1'
                }`}
                value={formData.name}
                onChange={handleChange}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <input
                name="dob"
                type="text"
                required
                placeholder="Date of Birth"
                className={`w-full px-4 py-3 bg-brand2 border rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  fieldErrors.dob 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-brand2 focus:ring-brand1'
                }`}
                value={formData.dob}
                onChange={handleChange}
              />
              {fieldErrors.dob && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.dob}
                </p>
              )}
            </div>

            <div>
              <input
                name="careOf"
                type="text"
                required
                placeholder="Care Of / Father's Name"
                className={`w-full px-4 py-3 bg-brand2 border rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  fieldErrors.careOf 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-brand2 focus:ring-brand1'
                }`}
                value={formData.careOf}
                onChange={handleChange}
              />
              {fieldErrors.careOf && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.careOf}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-full text-brand1 bg-brand2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand1 disabled:opacity-50 transition-all"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <div className="flex items-center justify-between">
            <div className="text-center">
              <Link
                to="/register"
                className="font-medium text-brand2 hover:text-white transition-colors"
              >
                Don't have an account? Sign up
              </Link>
            </div>
            
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="font-medium text-brand2 hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
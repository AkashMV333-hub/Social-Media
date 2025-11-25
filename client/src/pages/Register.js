import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTwitter } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    shareCode: "",
    displayName: "",
    password: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/");
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate file presence
    if (!file) {
      setError("Please upload your Aadhaar XML file.");
      setLoading(false);
      return;
    }

    // Create FormData for file + fields
    const data = new FormData();
    data.append("file", file);
    data.append("username", formData.username);
    data.append("shareCode", formData.shareCode);
    data.append("displayName", formData.displayName);
    data.append("password", formData.password);

    const result = await register(data); // assuming your useAuth.register handles FormData

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-spotify-text">
            Aadhaar-based Registration
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-blue-700 bg-opacity-50 p-4 border border-blue-700">
              <p className="text-sm text-blue-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Aadhaar XML File Upload */}
            <div>
              <label className="block text-spotify-text-subdued mb-1 text-sm">
                Aadhaar Offline eKYC (.xml or .zip)
              </label>
              <input
                type="file"
                name="file"
                accept=".zip"
                required
                className="w-full px-4 py-3 bg-brand2 border border-brand2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-brand1 focus:border-transparent transition-colors"
                onChange={handleFileChange}
              />
            </div>

            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              className="w-full px-4 py-3 bg-brand2 border border-brand2 rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand1 focus:border-transparent transition-colors"
              value={formData.username}
              onChange={handleChange}
            />

            <input
              name="shareCode"
              type="text"
              required
              placeholder="Aadhaar Share Code"
              className="w-full px-4 py-3 bg-brand2 border border-brand1 rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand1 focus:border-transparent transition-colors"
              value={formData.shareCode}
              onChange={handleChange}
            />

            <input
              name="displayName"
              type="text"
              required
              placeholder="Full Name / Display Name"
              className="w-full px-4 py-3 bg-brand2 border border-brand1 rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand1 focus:border-transparent transition-colors"
              value={formData.displayName}
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              required
              placeholder="Password (min 6 characters)"
              className="w-full px-4 py-3 bg-brand2 border border-brand1 rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand1 focus:border-transparent transition-colors"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-full text-brand1 bg-brand2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand1 disabled:opacity-50 transition-all"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-brand2 hover:text-white transition-colors"
            >
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;


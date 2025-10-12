import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTwitter } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/');
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.username,
      formData.password
    );

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-spotify-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <FaTwitter className="mx-auto h-12 w-auto text-spotify-green" size={48} />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-spotify-text">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-900 bg-opacity-50 p-4 border border-red-700">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <input
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 bg-spotify-gray border border-spotify-border rounded-md text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-colors"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-spotify-gray border border-spotify-border rounded-md text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-colors"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 bg-spotify-gray border border-spotify-border rounded-md text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-colors"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-spotify-gray border border-spotify-border rounded-md text-spotify-text placeholder-spotify-text-subdued focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-colors"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-full text-black bg-spotify-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green disabled:opacity-50 transition-all"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <div className="text-center">
            <Link to="/login" className="font-medium text-spotify-green hover:text-green-400 transition-colors">
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

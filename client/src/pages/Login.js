import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTwitter } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-spotify-text">
            Log in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-900 bg-opacity-50 p-4 border border-red-700">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-3">
            <div>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-spotify-gray border border-spotify-border placeholder-spotify-text-subdued text-spotify-text rounded-md focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-colors sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-spotify-gray border border-spotify-border placeholder-spotify-text-subdued text-spotify-text rounded-md focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-colors sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-black bg-spotify-green hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green disabled:opacity-50 transition-all"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="font-medium text-spotify-green hover:text-green-400 transition-colors">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

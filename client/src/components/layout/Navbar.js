import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { getImageUrl } from '../../utils/imageUtils';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-brand1 backdrop-blur-xl border-b border-brand1 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-brand1 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <h1 className='relative text-3xl font-bold bg-brand2 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200'>
                  Vibe
                </h1>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/notifications"
              className="p-3 rounded-xl text-brand2 hover:text-brand2 hover:bg-primary/10 transition-all duration-200 relative group"
              title="Notifications"
            >
              <FaBell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
            </Link>

            <Link
              to="/messages"
              className="p-3 rounded-xl text-brand2 hover:text-brand2 hover:bg-primary/10 transition-all duration-200 group"
              title="Messages"
            >
              <FaEnvelope className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>

            <Link
              to={`/profile/${user?.username}`}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-primary/10 transition-all duration-200 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-brand1 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                <img
                  src={getImageUrl(user?.profilePicture)}
                  alt={user?.name}
                  className="relative w-10 h-10 rounded-full object-cover ring-2 ring-brand2 group-hover:ring-brand2 transition-all duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name) + '&background=6366f1&color=fff&size=150';
                  }}
                />
              </div>
              <span className="hidden sm:block text-sm font-semibold text-brand2 group-hover:text-brand2 transition-colors">
                {user?.name}
              </span>
            </Link>

            <button
              onClick={logout}
              className="p-3 rounded-xl text-brand2 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 group"
              title="Logout"
            >
              <FaSignOutAlt className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

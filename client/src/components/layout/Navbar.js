import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTwitter, FaBell, FaEnvelope } from 'react-icons/fa';
import { getImageUrl } from '../../utils/imageUtils';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-spotify-black border-b border-spotify-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <p className='text-2xl font-bold'>SocialApp</p>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/notifications" className="text-spotify-text-gray hover:text-spotify-green transition-colors duration-200">
              <FaBell size={20} />
            </Link>
            <Link to="/messages" className="text-spotify-text-gray hover:text-spotify-green transition-colors duration-200">
              <FaEnvelope size={20} />
            </Link>
            <Link to={`/profile/${user?.username}`} className="flex items-center gap-2">
              <img
                src={getImageUrl(user?.profilePicture)}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover bg-spotify-gray hover:opacity-80 transition-opacity duration-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name) + '&background=1DB954&color=fff&size=150';
                }}
              />
            </Link>
            <button
              onClick={logout}
              className="text-spotify-text-gray hover:text-red-500 font-semibold transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

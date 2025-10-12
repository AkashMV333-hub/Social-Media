import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTwitter, FaBell, FaEnvelope } from 'react-icons/fa';
import { getImageUrl } from '../../utils/imageUtils';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FaTwitter className="text-primary" size={32} />
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/notifications" className="text-gray-700 hover:text-primary">
              <FaBell size={20} />
            </Link>
            <Link to="/messages" className="text-gray-700 hover:text-primary">
              <FaEnvelope size={20} />
            </Link>
            <Link to={`/profile/${user?.username}`} className="flex items-center gap-2">
              <img
                src={getImageUrl(user?.profilePicture)}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
            </Link>
            <button
              onClick={logout}
              className="text-gray-700 hover:text-red-600 font-semibold"
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

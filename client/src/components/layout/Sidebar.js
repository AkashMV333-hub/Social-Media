import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCompass, FaBell, FaUser, FaHashtag, FaBookmark } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home', gradient: 'from-blue-500 to-purple-500' },
    { path: '/explore', icon: FaCompass, label: 'Explore', gradient: 'from-purple-500 to-pink-500' },
    { path: '/notifications', icon: FaBell, label: 'Notifications', gradient: 'from-pink-500 to-red-500' },
    { path: `/profile/${user?.username}`, icon: FaUser, label: 'Profile', gradient: 'from-indigo-500 to-blue-500' },
  ];

  return (
    <aside className="w-72 sticky top-24 h-fit hidden md:block">
    <div className="bg-brand2 rounded-2xl shadow-card p-4 border border-brand2">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`group flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
              isActive(item.path)
                ? 'bg-brand1 text-brand2 shadow-md'
                : 'hover:bg-gray-100'
            }`}
          >
            {/* Gradient Overlay When Active */}
            {isActive(item.path) && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
            )}

            {/* Icon Wrapper */}
            <div
              className={`relative p-2 rounded-lg transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-white/30'
                  : 'bg-brand2 group-hover:bg-gray-200/20'
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-colors duration-300 ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-gray-500 group-hover:text-gray-800'
                }`}
              />
            </div>

            {/* Label Text */}
            <span
              className={`relative text-lg font-semibold transition-colors duration-300 ${
                isActive(item.path)
                  ? 'text-brand2'
                  : 'text-gray-700 group-hover:text-black'
              }`}
            >
              {item.label}
            </span>

            {/* Right Active Indicator Line */}
            {isActive(item.path) && (
              <div className="absolute right-4 w-1.5 h-8 bg-brand2 rounded-full"></div>
            )}
          </Link>
        ))}
      </nav>
    </div>
  </aside>
  );
};

export default Sidebar;

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
      <div className="bg-dark-800 rounded-2xl shadow-card p-4 border border-dark-600">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                isActive(item.path)
                  ? 'bg-gradient-primary shadow-glow'
                  : 'hover:bg-dark-700/50'
              }`}
            >
              {isActive(item.path) && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              )}
              <div className={`relative p-2 rounded-lg ${
                isActive(item.path)
                  ? 'bg-white/20'
                  : 'bg-dark-600 group-hover:bg-primary/20'
              } transition-all duration-300`}>
                <item.icon className={`w-5 h-5 ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-text-muted group-hover:text-primary'
                } transition-colors duration-300`} />
              </div>
              <span className={`relative text-lg font-semibold ${
                isActive(item.path)
                  ? 'text-white'
                  : 'text-text-secondary group-hover:text-text-primary'
              } transition-colors duration-300`}>
                {item.label}
              </span>
              {isActive(item.path) && (
                <div className="absolute right-4 w-1.5 h-8 bg-white/50 rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

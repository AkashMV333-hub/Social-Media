import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCompass, FaBell, FaEnvelope, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/explore', icon: FaCompass, label: 'Explore' },
    { path: '/notifications', icon: FaBell, label: 'Notifications' },
    { path: '/messages', icon: FaEnvelope, label: 'Messages' },
    { path: `/profile/${user?.username}`, icon: FaUser, label: 'Profile' },
  ];

  return (
    <aside className="w-64 sticky top-20 h-fit hidden md:block">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition ${
              isActive(item.path)
                ? 'bg-blue-50 text-primary font-bold'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xl">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

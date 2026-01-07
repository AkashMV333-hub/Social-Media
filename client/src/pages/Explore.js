import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { FaSearch } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUtils';

const Explore = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (searchQuery) => {
      if (!searchQuery.trim()) {
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/search/users?q=${searchQuery}`);
        setUsers(response.data.data.users);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Handle input change with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(query);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [query, debouncedSearch]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-brand1">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <Sidebar />

          <main className="flex-1 max-w-2xl">
            <div className="bg-brand2 rounded-lg shadow-lg p-4">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Explore</h2>

              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 pl-10 bg-brand2 border border-brand1 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand1 transition-colors"
                    placeholder="Search users..."
                    value={query}
                    onChange={handleInputChange}
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand1 mx-auto"></div>
                </div>
              ) : users.length > 0 ? (
                <div className="space-y-4">
                  {users.map(user => (
                    <Link
                      key={user._id}
                      to={`/profile/${user.username}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <img
                        src={getImageUrl(user.profilePicture)}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover bg-gray-100"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=1DB954&color=fff&size=150';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-gray-500 text-sm">@{user.username}</p>
                        {user.bio && (
                          <p className="text-gray-500 text-sm mt-1">{user.bio}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : query ? (
                <p className="text-center text-gray-500 py-8">No users found</p>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Search for users by name or username
                </p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Explore;
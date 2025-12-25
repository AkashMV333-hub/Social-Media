import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const PostDeleted = () => {
  const { state } = useLocation();
  const notification = state?.notification;

  return (
    <div className="min-h-screen bg-brand1">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <Sidebar />

          <main className="flex-1 max-w-3xl">
            <div className="bg-brand2 rounded-2xl shadow-card p-8 border border-brand2 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Post has been deleted</h2>
              {notification ? (
                <p className="text-gray-600">This notification from <strong>{notification.sender?.name}</strong> refers to a post that is no longer available.</p>
              ) : (
                <p className="text-gray-600">The post you are looking for has been removed.</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PostDeleted;

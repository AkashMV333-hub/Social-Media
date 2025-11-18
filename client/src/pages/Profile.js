import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import ProfileHeader from '../components/profile/ProfileHeader';
import TweetCard from '../components/tweet/TweetCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tweets');

  useEffect(() => {
    fetchUserProfile();
    fetchUserTweets();
  }, [username]);

  useEffect(() => {
    if (user) {
      fetchUserTweets();
    }
  }, [activeTab]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/api/users/${username}`);
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserTweets = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/users/${username}/tweets?tab=${activeTab}`);
      setTweets(response.data.data.tweets);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <Sidebar />

          <main className="flex-1 max-w-3xl">
            <div className="bg-dark-800 rounded-2xl shadow-card overflow-hidden border border-dark-600">
              <ProfileHeader user={user} onUpdate={fetchUserProfile} />

              <div className="border-b border-dark-600 bg-dark-800/50 backdrop-blur-xl">
                <div className="flex p-2 gap-2">
                  <button
                    className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all duration-200 ${
                      activeTab === 'tweets'
                        ? 'bg-brand1 text-white shadow-glow-sm'
                        : 'text-text-muted hover:text-text-primary hover:bg-dark-700'
                    }`}
                    onClick={() => setActiveTab('tweets')}
                  >
                    Posts
                  </button>
                  <button
                    className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all duration-200 ${
                      activeTab === 'media'
                        ? 'bg-brand1 text-white shadow-glow-sm'
                        : 'text-text-muted hover:text-text-primary hover:bg-dark-700'
                    }`}
                    onClick={() => setActiveTab('media')}
                  >
                    Media
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="p-12 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : tweets.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-5xl">📝</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">No posts yet</h3>
                  <p className="text-text-muted">Start sharing your thoughts!</p>
                </div>
              ) : (
                <div className="divide-y divide-dark-600">
                  {tweets.map((tweet, index) => (
                    <TweetCard key={tweet._id} tweet={tweet} index={index} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <Sidebar />

          <main className="flex-1 max-w-2xl">
            <div className="bg-white rounded-lg shadow">
              <ProfileHeader user={user} onUpdate={fetchUserProfile} />

              <div className="border-b">
                <div className="flex">
                  <button
                    className={`flex-1 py-4 font-semibold ${
                      activeTab === 'tweets'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setActiveTab('tweets')}
                  >
                    Tweets
                  </button>
                  <button
                    className={`flex-1 py-4 font-semibold ${
                      activeTab === 'media'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setActiveTab('media')}
                  >
                    Media
                  </button>
                </div>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : tweets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No tweets yet
                </div>
              ) : (
                tweets.map(tweet => (
                  <TweetCard key={tweet._id} tweet={tweet} />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;

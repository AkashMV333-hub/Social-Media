import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import ProfileHeader from '../components/profile/ProfileHeader';
import FollowersList from '../components/profile/FollowersList';
import AnimatedTweetCard from '../components/animations/AnimatedTweetCard';
import TweetCard from '../components/tweet/TweetCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tweets');
  const [asideContent, setAsideContent] = useState(null);

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
    <div className="min-h-screen bg-brand1">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
        <div className="flex gap-6">
          <Sidebar />

          <main className="flex-1 max-w-3xl">
            <div className="bg-brand2 backdrop-blur-xl rounded-2xl shadow-card overflow-hidden border border-brand1">
              <ProfileHeader user={user} onUpdate={fetchUserProfile} onShowAside={(content) => setAsideContent(content)} />

              <div className="border-b border-brand2 backdrop-blur-xl bg-brand2">
                <div className="flex p-2 gap-2">
                  <button
                    className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all duration-200 ${
                      activeTab === 'tweets'
                        ? 'bg-brand1 text-brand2 shadow-glow-sm'
                        : 'text-gray-600 hover:text-black hover:bg-brand2'
                    }`}
                    onClick={() => setActiveTab('tweets')}
                  >
                    Posts
                  </button>
                  <button
                    className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all duration-200 ${
                      activeTab === 'media'
                        ? 'bg-brand1 text-brand2 shadow-glow-sm'
                        : 'text-gray-600 hover:text-black hover:bg-brand2'
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
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-brand2 flex items-center justify-center">
                    <span className="text-5xl">📝</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500">Start sharing your thoughts!</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {tweets.map((tweet, index) => (
                    <TweetCard
                      key={tweet._id}
                      tweet={{ ...tweet, id: tweet._id }}
                      onUpdate={fetchUserTweets}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
          <aside
            className={`lg:block w-80 h-[600px] rounded-2xl transition-all duration-200 hide-scrollbar ${
              asideContent
                ? 'bg-brand2 border border-brand2 shadow-card overflow-y-scroll'
                : 'bg-transparent border-transparent pointer-events-none shadow-none overflow-hidden'
            }`}
          >
            {asideContent ? (
              <div className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold px-4 text-brand1">{asideContent.type === 'followers' ? 'Followers' : 'Following'}</h3>
                  <button
                    className="text-sm text-brand1 px-4 hover:text-gray-700"
                    onClick={() => setAsideContent(null)}
                  >
                    Close
                  </button>
                </div>
                <FollowersList username={asideContent.username} type={asideContent.type} onUserClick={() => setAsideContent(null)} />
              </div>
            ) : (
              <div className="p-4 invisible" aria-hidden="true">&nbsp;</div>
            )}
          </aside>
        </div>
        
      </div>
    </div>
  );
};

export default Profile;

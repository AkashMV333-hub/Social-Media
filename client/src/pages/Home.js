import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import TweetComposer from '../components/tweet/TweetComposer';
import TweetCard from '../components/tweet/TweetCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'latest'

  useEffect(() => {
    fetchTweets();
  }, [activeTab]);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'feed' ? '/api/tweets/feed' : '/api/tweets/latest';
      const response = await api.get(endpoint);
      setTweets(response.data.data.tweets);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTweetCreated = (newTweet) => {
    setTweets([newTweet, ...tweets]);
  };

  const handleTweetDeleted = (tweetId) => {
    setTweets(tweets.filter(tweet => tweet._id !== tweetId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <Sidebar />

          <main className="flex-1 max-w-2xl">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b">
                <div className="flex">
                  <button
                    className={`flex-1 py-4 font-semibold ${
                      activeTab === 'feed'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setActiveTab('feed')}
                  >
                    Home Feed
                  </button>
                  <button
                    className={`flex-1 py-4 font-semibold ${
                      activeTab === 'latest'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setActiveTab('latest')}
                  >
                    Latest
                  </button>
                </div>
              </div>

              <TweetComposer onTweetCreated={handleTweetCreated} />

              {loading ? (
                <LoadingSpinner />
              ) : tweets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {activeTab === 'feed'
                    ? 'Follow users to see their tweets here'
                    : 'No tweets yet'}
                </div>
              ) : (
                tweets.map(tweet => (
                  <TweetCard
                    key={tweet._id}
                    tweet={tweet}
                    onDelete={handleTweetDeleted}
                  />
                ))
              )}
            </div>
          </main>

          <aside className="hidden lg:block w-80">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-2">Trending</h3>
              <p className="text-gray-500 text-sm">Coming soon...</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;

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
    <div className="min-h-screen bg-spotify-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <Sidebar />

          <main className="flex-1 max-w-2xl">
            <div className="bg-spotify-gray rounded-lg shadow-lg">
              <div className="border-b border-spotify-border">
                <div className="flex">
                  <button
                    className={`flex-1 py-4 font-semibold transition-colors ${
                      activeTab === 'feed'
                        ? 'text-spotify-green border-b-2 border-spotify-green'
                        : 'text-spotify-text-gray hover:text-spotify-text'
                    }`}
                    onClick={() => setActiveTab('feed')}
                  >
                    Home Feed
                  </button>
                  <button
                    className={`flex-1 py-4 font-semibold transition-colors ${
                      activeTab === 'latest'
                        ? 'text-spotify-green border-b-2 border-spotify-green'
                        : 'text-spotify-text-gray hover:text-spotify-text'
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
                <div className="p-8 text-center text-spotify-text-subdued">
                  {activeTab === 'feed'
                    ? 'Follow users to see their tweets here'
                    : 'No tweets yet'}
                </div>
              ) : (
                tweets.map((tweet, index) => (
                  <TweetCard
                    key={tweet._id}
                    tweet={tweet}
                    index={index}
                    onDelete={handleTweetDeleted}
                  />
                ))
              )}
            </div>
          </main>

          <aside className="hidden lg:block w-80">
            <div className="bg-spotify-gray rounded-lg shadow-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-spotify-text">Trending</h3>
              <p className="text-spotify-text-subdued text-sm">Coming soon...</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;

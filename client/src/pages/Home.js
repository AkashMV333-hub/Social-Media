import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import TweetComposer from '../components/tweet/TweetComposer';
import TweetCard from '../components/tweet/TweetCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ParticleWave from '../components/3d/ParticleWave';
import AnimatedTweetCard from '../components/animations/AnimatedTweetCard';
import PageTransition from '../components/animations/PageTransition';
import TextReveal from '../components/animations/TextReveal';
import { mockTweets } from '../utils/mockData';

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
      // Using mock data for testing animations
      // const endpoint = activeTab === 'feed' ? '/api/tweets/feed' : '/api/tweets/latest';
      // const response = await api.get(endpoint);
      // setTweets(response.data.data.tweets);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setTweets(mockTweets);
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
    <>
      {/* 3D Particle Wave Background - Outside everything */}
      <ParticleWave />

      <PageTransition>
        <div className="min-h-screen relative">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
            <div className="flex gap-6">
              <Sidebar />

            <main className="flex-1 max-w-3xl">
              <div className="bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-card overflow-hidden border border-dark-600">
                <div className="border-b border-dark-600 bg-dark-800/50 backdrop-blur-xl">
                  <div className="flex p-2 gap-2">
                    <button
                      className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all duration-200 ${
                        activeTab === 'feed'
                          ? 'bg-gradient-primary text-white shadow-glow-sm'
                          : 'text-text-muted hover:text-text-primary hover:bg-dark-700'
                      }`}
                      onClick={() => setActiveTab('feed')}
                    >
                      For You
                    </button>
                    <button
                      className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all duration-200 ${
                        activeTab === 'latest'
                          ? 'bg-gradient-primary text-white shadow-glow-sm'
                          : 'text-text-muted hover:text-text-primary hover:bg-dark-700'
                      }`}
                      onClick={() => setActiveTab('latest')}
                    >
                      Discover
                    </button>
                  </div>
                </div>

                <TweetComposer onTweetCreated={handleTweetCreated} />

                {loading ? (
                  <div className="p-12 flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : tweets.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-5xl">📭</span>
                    </div>
                    <TextReveal className="text-xl font-bold text-text-primary mb-2">
                      {activeTab === 'feed' ? 'Nothing here yet' : 'No posts found'}
                    </TextReveal>
                    <p className="text-text-muted">
                      {activeTab === 'feed'
                        ? 'Follow users to see their posts in your feed'
                        : 'Be the first to share something!'}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {tweets.map((tweet, index) => (
                      <AnimatedTweetCard
                        key={tweet.id}
                        tweet={tweet}
                      />
                    ))}
                  </div>
                )}
              </div>
            </main>

            <aside className="hidden lg:block w-80">

            </aside>
          </div>
        </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Home;

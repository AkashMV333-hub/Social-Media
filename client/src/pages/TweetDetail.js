import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import TweetCard from '../components/tweet/TweetCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TweetDetail = () => {
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTweet();
  }, [id]);

  const fetchTweet = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/tweets/${id}`);
      // server returns { data: { tweet, isLiked } }
      const serverTweet = res.data.data.tweet;
      const isLiked = res.data.data.isLiked;
      setTweet({ ...serverTweet, isLiked });
    } catch (err) {
      console.error('Error fetching tweet:', err);
      setTweet(null);
    } finally {
      setLoading(false);
    }
  };

  // parse comment id from query param if present
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const commentId = params.get('comment');

  return (
    <div className="min-h-screen bg-brand1">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <Sidebar />

          <main className="flex-1 max-w-3xl">
            <div className="bg-brand2 rounded-2xl shadow-card p-4 border border-brand2">
              {loading ? (
                <div className="p-12 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : !tweet ? (
                <div className="p-8 text-center text-gray-500">Tweet not found</div>
                ) : (
                <TweetCard
                  tweet={{ ...tweet, _id: tweet._id, isLiked: tweet.isLiked }}
                  initialShowComments={!!commentId}
                  scrollToCommentId={commentId}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TweetDetail;

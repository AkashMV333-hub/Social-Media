import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { getImageUrl } from '../utils/imageUtils';

const Messages = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchConversation(userId);
    }
  }, [userId]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/api/messages/conversations');
      setConversations(response.data.data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (userId) => {
    try {
      const response = await api.get(`/api/messages/conversation/${userId}`);
      setMessages(response.data.data.messages);
      setSelectedUser(response.data.data.conversation.user);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    try {
      const response = await api.post('/api/messages', {
        recipientId: userId,
        text: newMessage,
      });

      setMessages([...messages, response.data.data.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <Sidebar />

          <main className="flex-1 max-w-4xl">
            <div className="bg-white rounded-lg shadow h-[600px] flex">
              {/* Conversations list */}
              <div className="w-1/3 border-r">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold">Messages</h2>
                </div>
                <div className="overflow-y-auto" style={{ height: 'calc(600px - 60px)' }}>
                  {conversations.map(conv => (
                    <Link
                      key={conv.conversationId}
                      to={`/messages/${conv.otherUser._id}`}
                      className={`block p-4 border-b hover:bg-gray-50 ${
                        userId === conv.otherUser._id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={getImageUrl(conv.otherUser.profilePicture)}
                          alt={conv.otherUser.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{conv.otherUser.name}</p>
                          <p className="text-sm text-gray-600 truncate">
                            {conv.lastMessage.text}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Chat panel */}
              <div className="flex-1 flex flex-col">
                {selectedUser ? (
                  <>
                    <div className="p-4 border-b">
                      <Link
                        to={`/profile/${selectedUser.username}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <img
                          src={getImageUrl(selectedUser.profilePicture)}
                          alt={selectedUser.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold">{selectedUser.name}</p>
                          <p className="text-sm text-gray-600">@{selectedUser.username}</p>
                        </div>
                      </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map(message => (
                        <div
                          key={message._id}
                          className={`flex ${
                            message.sender._id === currentUser._id
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.sender._id === currentUser._id
                                ? 'bg-primary text-white'
                                : 'bg-gray-200'
                            }`}
                          >
                            <p>{message.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender._id === currentUser._id
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                              }`}
                            >
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="input-field flex-1"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit" className="btn-primary">
                          Send
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a conversation to start messaging
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Messages;

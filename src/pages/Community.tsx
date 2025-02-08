import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Send, ThumbsUp, PlayCircle, Clock, Music2, ArrowLeft } from 'lucide-react';
import { useChat } from '../lib/chat';
import { useForum } from '../lib/forum';
import { useAuth } from '../lib/auth';
import { mockActiveUsers } from '../lib/mockData';
import { formatDistanceToNow } from '../lib/utils';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'forum'>('chat');
  const [message, setMessage] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [activeUsers, setActiveUsers] = useState(mockActiveUsers);
  
  const { 
    messages, 
    privateChats,
    activeChat,
    sendMessage, 
    fetchMessages, 
    fetchPrivateMessages,
    subscribeToMessages, 
    unsubscribeFromMessages,
    setActiveChat 
  } = useChat();
  const { posts, comments, createPost, createComment, fetchPosts, fetchComments, likePost } = useForum();
  const user = useAuth((state) => state.user);

  useEffect(() => {
    if (activeTab === 'chat') {
      if (activeChat) {
        fetchPrivateMessages(activeChat);
      } else {
        fetchMessages();
      }
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    } else {
      fetchPosts();
    }
  }, [activeTab, activeChat]);

  // Update active users every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(users => users.map(user => ({
        ...user,
        lastSeen: user.isOnline ? new Date().toISOString() : user.lastSeen
      })));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message, activeChat);
    setMessage('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;
    createPost(postTitle, postContent);
    setPostTitle('');
    setPostContent('');
  };

  const handleUserClick = (userId: string) => {
    setActiveChat(userId);
    setActiveTab('chat');
  };

  const currentMessages = activeChat ? privateChats[activeChat] || [] : messages;
  const chatPartner = activeChat ? activeUsers.find(u => u.id === activeChat) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Community</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'chat'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'forum'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Users className="w-5 h-5" />
            Forum
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'chat' ? (
            <div className="bg-gray-800 rounded-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              {activeChat && (
                <div className="p-4 border-b border-gray-700 flex items-center gap-4">
                  <button
                    onClick={() => setActiveChat(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <img
                    src={chatPartner?.avatar_url}
                    alt={chatPartner?.full_name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{chatPartner?.full_name}</h3>
                    <p className="text-sm text-gray-400">
                      {chatPartner?.isOnline ? 'Online' : `Last seen ${formatDistanceToNow(new Date(chatPartner?.lastSeen || ''))}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-4 ${
                      msg.sender_id === user?.id ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <img
                      src={msg.sender?.avatar_url || `https://source.unsplash.com/random/40x40?face&sig=${msg.sender_id}`}
                      alt={msg.sender?.full_name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender_id === user?.id
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700'
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">{msg.sender?.full_name}</p>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Type a message${activeChat ? '' : ' in public chat'}...`}
                    className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-6 py-2 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Create Post Form */}
              <form onSubmit={handleCreatePost} className="bg-gray-800 rounded-lg p-6 space-y-4">
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Post title"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Write your post..."
                  rows={4}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-6 py-2"
                >
                  Create Post
                </button>
              </form>

              {/* Posts List */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-gray-800 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={post.user?.avatar_url || `https://source.unsplash.com/random/40x40?face&sig=${post.user_id}`}
                        alt={post.user?.full_name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-sm text-gray-400">
                          Posted by {post.user?.full_name} • {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-300">{post.content}</p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => likePost(post.id)}
                        className="flex items-center gap-2 text-gray-400 hover:text-purple-500"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes} Likes
                      </button>
                      <button
                        onClick={() => fetchComments(post.id)}
                        className="flex items-center gap-2 text-gray-400 hover:text-purple-500"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {comments[post.id]?.length || 0} Comments
                      </button>
                    </div>

                    {comments[post.id] && (
                      <div className="pl-8 space-y-4">
                        {comments[post.id].map((comment) => (
                          <div key={comment.id} className="flex gap-4">
                            <img
                              src={comment.user?.avatar_url || `https://source.unsplash.com/random/32x32?face&sig=${comment.user_id}`}
                              alt={comment.user?.full_name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="bg-gray-700 rounded-lg p-3">
                              <p className="text-sm font-medium mb-1">{comment.user?.full_name}</p>
                              <p>{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Users Sidebar */}
        <div className="bg-gray-800 rounded-lg p-6 h-[600px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Active Users
            <span className="text-sm text-gray-400">
              ({activeUsers.filter(u => u.isOnline).length})
            </span>
          </h2>
          <div className="space-y-4">
            {activeUsers
              .sort((a, b) => {
                // Sort online users first, then by last seen
                if (a.isOnline && !b.isOnline) return -1;
                if (!a.isOnline && b.isOnline) return 1;
                return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
              })
              .map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition ${
                    activeChat === user.id
                      ? 'bg-purple-500/20'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                      user.isOnline ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{user.full_name}</span>
                      {user.is_artist && (
                        <Music2 className="w-4 h-4 text-purple-500" />
                      )}
                    </div>
                    {user.isOnline ? (
                      user.currentlyPlaying ? (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <PlayCircle className="w-4 h-4 text-purple-500" />
                          <span className="truncate">{user.currentlyPlaying.song.title}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-green-500">Online</span>
                      )
                    ) : (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Last seen {formatDistanceToNow(new Date(user.lastSeen))}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
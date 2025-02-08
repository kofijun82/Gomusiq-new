import { create } from 'zustand';
import { mockForumPosts, mockForumComments } from './mockData';
import { logger } from './logger';

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url: string | null;
  };
  likes: number;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface ForumState {
  posts: Post[];
  comments: Record<string, Comment[]>;
  isLoading: boolean;
  error: string | null;
  createPost: (title: string, content: string) => Promise<void>;
  createComment: (postId: string, content: string) => Promise<void>;
  fetchPosts: () => Promise<void>;
  fetchComments: (postId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
}

export const useForum = create<ForumState>((set, get) => ({
  posts: [],
  comments: {},
  isLoading: false,
  error: null,

  createPost: async (title: string, content: string) => {
    try {
      // Create new post
      const newPost = {
        id: `post-${Date.now()}`,
        title,
        content,
        user_id: 'user1', // Current user
        created_at: new Date().toISOString(),
        user: {
          full_name: 'John Doe',
          avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=1'
        },
        likes: 0
      };

      // Update local state
      set(state => ({
        posts: [newPost, ...state.posts]
      }));

      logger.info('Post created successfully');
    } catch (error) {
      logger.error('Failed to create post', error as Error);
      set({ error: 'Failed to create post' });
    }
  },

  createComment: async (postId: string, content: string) => {
    try {
      // Create new comment
      const newComment = {
        id: `comment-${Date.now()}`,
        content,
        user_id: 'user1', // Current user
        post_id: postId,
        created_at: new Date().toISOString(),
        user: {
          full_name: 'John Doe',
          avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=1'
        }
      };

      // Update local state
      set(state => ({
        comments: {
          ...state.comments,
          [postId]: [...(state.comments[postId] || []), newComment]
        }
      }));

      logger.info('Comment created successfully');
    } catch (error) {
      logger.error('Failed to create comment', error as Error);
      set({ error: 'Failed to create comment' });
    }
  },

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ posts: mockForumPosts });
      logger.info('Posts fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch posts', error as Error);
      set({ error: 'Failed to fetch posts' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchComments: async (postId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        comments: {
          ...state.comments,
          [postId]: mockForumComments[postId] || []
        }
      }));
      
      logger.info('Comments fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch comments', error as Error);
      set({ error: 'Failed to fetch comments' });
    } finally {
      set({ isLoading: false });
    }
  },

  likePost: async (postId: string) => {
    try {
      // Update local state
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, likes: post.likes + 1 }
            : post
        )
      }));

      logger.info('Post liked successfully');
    } catch (error) {
      logger.error('Failed to like post', error as Error);
      set({ error: 'Failed to like post' });
    }
  },
}));
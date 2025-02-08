import { create } from 'zustand';
import { mockMessages } from './mockData';
import { logger } from './logger';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  group_id: string | null;
  content: string;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface ChatState {
  messages: Message[];
  privateChats: Record<string, Message[]>;
  activeChat: string | null; // null for public chat, user_id for private chat
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, receiverId?: string) => Promise<void>;
  fetchMessages: () => Promise<void>;
  fetchPrivateMessages: (userId: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setActiveChat: (userId: string | null) => void;
}

export const useChat = create<ChatState>((set, get) => ({
  messages: [],
  privateChats: {},
  activeChat: null,
  isLoading: false,
  error: null,

  sendMessage: async (content: string, receiverId?: string) => {
    try {
      // Create a new message
      const newMessage = {
        id: `msg-${Date.now()}`,
        sender_id: 'user1', // Current user
        receiver_id: receiverId || null,
        group_id: null,
        content,
        created_at: new Date().toISOString(),
        sender: {
          full_name: 'John Doe',
          avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=1'
        }
      };

      // Update local state
      if (receiverId) {
        set(state => ({
          privateChats: {
            ...state.privateChats,
            [receiverId]: [...(state.privateChats[receiverId] || []), newMessage]
          }
        }));
      } else {
        set(state => ({
          messages: [...state.messages, newMessage]
        }));
      }

      logger.info('Message sent successfully');
    } catch (error) {
      logger.error('Failed to send message', error as Error);
      set({ error: 'Failed to send message' });
    }
  },

  fetchMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ messages: mockMessages.filter(msg => !msg.receiver_id) });
      logger.info('Messages fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch messages', error as Error);
      set({ error: 'Failed to fetch messages' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPrivateMessages: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock messages for private chat
      const privateMessages = mockMessages.filter(msg => 
        (msg.sender_id === 'user1' && msg.receiver_id === userId) ||
        (msg.sender_id === userId && msg.receiver_id === 'user1')
      );
      
      set(state => ({
        privateChats: {
          ...state.privateChats,
          [userId]: privateMessages
        }
      }));
      
      logger.info('Private messages fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch private messages', error as Error);
      set({ error: 'Failed to fetch private messages' });
    } finally {
      set({ isLoading: false });
    }
  },

  subscribeToMessages: () => {
    logger.info('Subscribed to messages');
  },

  unsubscribeFromMessages: () => {
    logger.info('Unsubscribed from messages');
  },

  setActiveChat: (userId) => set({ activeChat: userId }),
}));
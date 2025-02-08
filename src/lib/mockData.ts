// Mock data for the application
import { Song, Artist, Purchase, User, Notification } from '../types';

export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist_id: '1',
    cover_url: 'https://source.unsplash.com/random/400x400?summer+music',
    song_url: 'https://example.com/song1.mp3',
    price: 0.99,
    genre: 'pop',
    duration: 180,
    plays: 1200,
    status: 'approved',
    created_at: '2024-02-01T00:00:00Z',
    artist: { artist_name: 'DJ Awesome' }
  },
  {
    id: '2',
    title: 'Night Drive',
    artist_id: '2',
    cover_url: 'https://source.unsplash.com/random/400x400?night+music',
    song_url: 'https://example.com/song2.mp3',
    price: 1.99,
    genre: 'electronic',
    duration: 240,
    plays: 800,
    status: 'approved',
    created_at: '2024-02-02T00:00:00Z',
    artist: { artist_name: 'Rock Star' }
  }
];

export const mockArtists: Artist[] = [
  {
    id: '1',
    user_id: '1',
    artist_name: 'DJ Awesome',
    bio: 'Electronic music producer',
    verified: true,
    total_sales: 5000,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    user_id: '2',
    artist_name: 'Rock Star',
    bio: 'Rock band from LA',
    verified: false,
    total_sales: 3000,
    created_at: '2024-01-02T00:00:00Z',
  }
];

export const mockUsers: User[] = [
  {
    id: 'admin',
    email: 'admin@gomusiq.com',
    full_name: 'Admin User',
    avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=admin',
    is_artist: false,
    is_admin: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user1',
    email: 'user@example.com',
    full_name: 'John Doe',
    avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=1',
    is_artist: true,
    is_admin: false,
    created_at: '2024-01-01T00:00:00Z',
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    user_id: '1',
    title: 'New Song Available',
    message: 'Check out the latest release from DJ Awesome',
    type: 'info',
    read: false,
    link: '/store',
    created_at: '2024-02-06T00:00:00Z',
  },
  {
    id: '2',
    user_id: '1',
    title: 'Purchase Successful',
    message: 'You have successfully purchased "Summer Vibes"',
    type: 'success',
    read: true,
    link: '/library',
    created_at: '2024-02-05T00:00:00Z',
  }
];

export const mockPurchases: Purchase[] = [
  {
    id: '1',
    user_id: '1',
    song_id: '1',
    amount: 0.99,
    platform_fee: 0.29,
    artist_revenue: 0.70,
    created_at: '2024-02-05T00:00:00Z',
  }
];

export interface Message {
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

export interface ForumPost {
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

export interface ForumComment {
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

export const mockMessages: Message[] = [
  {
    id: '1',
    sender_id: 'user1',
    receiver_id: null,
    group_id: null,
    content: 'Hey everyone! Check out my new track!',
    created_at: '2024-02-06T10:00:00Z',
    sender: {
      full_name: 'John Doe',
      avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=1'
    }
  },
  {
    id: '2',
    sender_id: 'user2',
    receiver_id: null,
    group_id: null,
    content: 'Awesome track! Love the beats 🎵',
    created_at: '2024-02-06T10:05:00Z',
    sender: {
      full_name: 'Jane Smith',
      avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=2'
    }
  },
  {
    id: '3',
    sender_id: 'user3',
    receiver_id: null,
    group_id: null,
    content: 'Anyone up for a collab?',
    created_at: '2024-02-06T10:10:00Z',
    sender: {
      full_name: 'Mike Johnson',
      avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=3'
    }
  }
];

export const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Tips for Music Production',
    content: 'Here are some tips that helped me improve my music production...',
    user_id: 'user1',
    created_at: '2024-02-05T00:00:00Z',
    user: {
      full_name: 'John Doe',
      avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=1'
    },
    likes: 15
  },
  {
    id: '2',
    title: 'Best DAWs for Beginners',
    content: 'Looking for recommendations on the best DAWs for beginners...',
    user_id: 'user2',
    created_at: '2024-02-06T00:00:00Z',
    user: {
      full_name: 'Jane Smith',
      avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=2'
    },
    likes: 8
  }
];

export const mockForumComments: Record<string, ForumComment[]> = {
  '1': [
    {
      id: '1',
      content: 'Great tips! Really helped me out.',
      user_id: 'user2',
      post_id: '1',
      created_at: '2024-02-05T01:00:00Z',
      user: {
        full_name: 'Jane Smith',
        avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=2'
      }
    }
  ],
  '2': [
    {
      id: '2',
      content: 'I recommend FL Studio for beginners!',
      user_id: 'user3',
      post_id: '2',
      created_at: '2024-02-06T01:00:00Z',
      user: {
        full_name: 'Mike Johnson',
        avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=3'
      }
    }
  ]
};

export interface ActiveUser extends User {
  isOnline: boolean;
  lastSeen: string;
  currentlyPlaying?: {
    song: Song;
    startedAt: string;
  };
}

export const mockActiveUsers: ActiveUser[] = [
  {
    id: 'user1',
    email: 'john@example.com',
    full_name: 'John Doe',
    avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=1',
    is_artist: true,
    created_at: '2024-01-01T00:00:00Z',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    currentlyPlaying: {
      song: mockSongs[0],
      startedAt: new Date(Date.now() - 120000).toISOString() // 2 minutes ago
    }
  },
  {
    id: 'user2',
    email: 'jane@example.com',
    full_name: 'Jane Smith',
    avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=2',
    is_artist: false,
    created_at: '2024-01-02T00:00:00Z',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    currentlyPlaying: {
      song: mockSongs[1],
      startedAt: new Date(Date.now() - 60000).toISOString() // 1 minute ago
    }
  },
  {
    id: 'user3',
    email: 'mike@example.com',
    full_name: 'Mike Johnson',
    avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=3',
    is_artist: false,
    created_at: '2024-01-03T00:00:00Z',
    isOnline: true,
    lastSeen: new Date().toISOString()
  },
  {
    id: 'user4',
    email: 'sarah@example.com',
    full_name: 'Sarah Wilson',
    avatar_url: 'https://source.unsplash.com/random/100x100?face&sig=4',
    is_artist: true,
    created_at: '2024-01-04T00:00:00Z',
    isOnline: false,
    lastSeen: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
  }
];
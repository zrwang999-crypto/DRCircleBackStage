import type { FeedItem, MessageThread, User } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Deer Morgan',
  handle: 'deer6317',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop',
  bio: 'Building a calmer daily record.',
  posts: 12,
  followers: 1200,
  following: 86,
};

export const FEED_ITEMS: FeedItem[] = [
  {
    id: '1',
    title: 'Morning light on the desk',
    description: 'A quiet snapshot from the start of the day.',
    category: 'Daily',
    author: 'Mia Reed',
    location: 'Shanghai',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&h=1200&fit=crop',
  },
  {
    id: '2',
    title: 'A walk after work',
    description: 'Small scenes collected while leaving the office.',
    category: 'Life',
    author: 'Lynn Parker',
    location: 'Hangzhou',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&h=1200&fit=crop',
  },
  {
    id: '3',
    title: 'Coffee before the rain',
    description: 'A simple moment before the weather changed.',
    category: 'Mood',
    author: 'Avery Stone',
    location: 'Shenzhen',
    image: 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=900&h=1200&fit=crop',
  },
  {
    id: '4',
    title: 'Window reflection at night',
    description: 'City lights folded into a dark window.',
    category: 'City',
    author: 'Noah Lane',
    location: 'Chengdu',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900&h=1200&fit=crop',
  },
  {
    id: '5',
    title: 'Weekend table',
    description: 'Nothing staged, just the table as it was.',
    category: 'Home',
    author: 'Emma Clark',
    location: 'Guangzhou',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=1200&fit=crop',
  },
  {
    id: '6',
    title: 'Signage passed by chance',
    description: 'A piece of street text that stayed in memory.',
    category: 'Street',
    author: 'Lucas Ford',
    location: 'Suzhou',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&h=1200&fit=crop',
  },
];

export const MESSAGES: MessageThread[] = [
  {
    id: '1',
    name: 'Mia Reed',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop',
    lastMessage: 'I sent over the latest notes.',
    time: '09:41',
    unread: 2,
  },
  {
    id: '2',
    name: 'Lynn Parker',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop',
    lastMessage: 'The new layout feels much cleaner.',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    name: 'System',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=System&backgroundColor=111827&fontWeight=700',
    lastMessage: 'Your account settings were updated.',
    time: 'Monday',
    unread: 1,
  },
];

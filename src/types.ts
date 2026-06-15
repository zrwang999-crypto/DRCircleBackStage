export interface FeedItem {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  location: string;
  image: string;
}

export interface MessageThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  posts: number;
  followers: number;
  following: number;
}

export type Screen =
  | 'home'
  | 'smart-ring'
  | 'messages'
  | 'me'
  | 'content-detail'
  | 'chat'
  | 'profile'
  | 'settings'
  | 'reserved-space';

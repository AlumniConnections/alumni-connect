export type Lang = 'zh' | 'en';

/** A bilingual string used throughout mock content. */
export interface LocalizedText {
  zh: string;
  en: string;
}

export interface Profile {
  id: string;
  name: LocalizedText;
  avatarColor: string;
  initials: string;
  university: LocalizedText;
  major: LocalizedText;
  gradYear: number;
  city: string;
  occupation: LocalizedText;
  headline?: LocalizedText;
  immigrationYear?: number;
  verified?: boolean;
  openTo?: ('mentoring' | 'hiring' | 'jobs' | 'cofounder' | 'newcomer-help')[];
}

export interface Conversation {
  id: string;
  kind: 'direct' | 'group';
  title: LocalizedText;
  avatarColor: string;
  initials: string;
  participantIds: string[];
  lastMessage: LocalizedText;
  lastTime: string;
  unread: number;
  pinned?: boolean;
  muted?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string; // 'me' for current user
  text: LocalizedText;
  time: string;
  system?: boolean;
}

export interface Meeting {
  id: string;
  title: LocalizedText;
  host: LocalizedText;
  kind: 'video' | 'voice';
  startsAt: LocalizedText;
  durationMin: number;
  attendees: number;
  live?: boolean;
  tag: LocalizedText;
}

export interface Poll {
  id: string;
  question: LocalizedText;
  options: { id: string; label: LocalizedText; votes: number }[];
  totalVotes: number;
  endsAt: LocalizedText;
  closed?: boolean;
}

export type FeedItem =
  | { id: string; type: 'announcement'; authorId: string; group: LocalizedText; time: LocalizedText; body: LocalizedText; likes: number; comments: number }
  | { id: string; type: 'poll'; authorId: string; group: LocalizedText; time: LocalizedText; poll: Poll }
  | { id: string; type: 'ad'; brand: LocalizedText; time: LocalizedText; headline: LocalizedText; body: LocalizedText; cta: LocalizedText; accent: string }
  | { id: string; type: 'meeting'; meetingId: string; group: LocalizedText; time: LocalizedText };

export interface ForumCategory {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  color: string;
  threads: number;
  posts: number;
}

export interface ForumThread {
  id: string;
  categoryId: string;
  title: LocalizedText;
  authorId: string;
  excerpt: LocalizedText;
  replies: number;
  views: number;
  lastActivity: LocalizedText;
  pinned?: boolean;
  hot?: boolean;
  tags: LocalizedText[];
}

export interface ForumReply {
  id: string;
  threadId: string;
  authorId: string;
  body: LocalizedText;
  time: LocalizedText;
  upvotes: number;
}

export interface NotificationItem {
  id: string;
  group: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
  time: LocalizedText;
  icon: string;
  color: string;
  unread?: boolean;
}

export interface ResourceCategory {
  id: 'newcomer' | 'career' | 'startup';
  title: LocalizedText;
  subtitle: LocalizedText;
  icon: string;
  color: string;
  colorSoft: string;
}

export interface ResourceItem {
  id: string;
  categoryId: ResourceCategory['id'];
  title: LocalizedText;
  body: LocalizedText;
  meta: LocalizedText;
  tag: LocalizedText;
  action: LocalizedText;
}

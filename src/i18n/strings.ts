import type { Lang } from '../types';

export const strings = {
  appName: { zh: '校友连线', en: 'AlumniConnect' },
  tagline: { zh: '加拿大华人校友社区', en: 'Chinese Alumni in Canada' },

  // Tabs
  tab_home: { zh: '首页', en: 'Home' },
  tab_network: { zh: '校友', en: 'Network' },
  tab_forums: { zh: '论坛', en: 'Forums' },
  tab_messages: { zh: '消息', en: 'Messages' },
  tab_profile: { zh: '我的', en: 'Profile' },

  // Home
  home_greeting_am: { zh: '早上好', en: 'Good morning' },
  home_greeting_pm: { zh: '下午好', en: 'Good afternoon' },
  home_greeting_eve: { zh: '晚上好', en: 'Good evening' },
  home_quick_actions: { zh: '快捷功能', en: 'Quick actions' },
  home_feed: { zh: '社区动态', en: 'Community feed' },
  home_upcoming: { zh: '即将开始的会议', en: 'Upcoming meetings' },
  home_sponsored: { zh: '赞助', en: 'Sponsored' },
  see_all: { zh: '查看全部', en: 'See all' },

  qa_meetings: { zh: '视频会议', en: 'Meetings' },
  qa_newcomer: { zh: '新移民帮助', en: 'Newcomer' },
  qa_career: { zh: '职业辅导', en: 'Career' },
  qa_startup: { zh: '创业资源', en: 'Startup' },
  qa_polls: { zh: '投票', en: 'Voting' },
  qa_notifications: { zh: '群通知', en: 'Notices' },

  // Network
  network_title: { zh: '校友网络', en: 'Alumni Network' },
  network_search: { zh: '搜索姓名、学校、专业、城市…', en: 'Search name, school, major, city…' },
  network_members: { zh: '位校友', en: 'alumni' },
  filter_all: { zh: '全部', en: 'All' },
  filter_city: { zh: '城市', en: 'City' },
  filter_university: { zh: '院校', en: 'University' },
  open_to_mentoring: { zh: '可做导师', en: 'Mentoring' },
  open_to_hiring: { zh: '正在招聘', en: 'Hiring' },
  open_to_jobs: { zh: '求职中', en: 'Open to jobs' },
  open_to_cofounder: { zh: '寻找合伙人', en: 'Co-founder' },
  open_to_newcomer: { zh: '帮助新移民', en: 'Helps newcomers' },

  // Profile detail
  message_btn: { zh: '发消息', en: 'Message' },
  connect_btn: { zh: '建立联系', en: 'Connect' },
  profile_major: { zh: '专业', en: 'Major' },
  profile_grad: { zh: '毕业年份', en: 'Graduated' },
  profile_city: { zh: '现居城市', en: 'City' },
  profile_occupation: { zh: '职业', en: 'Occupation' },
  profile_university: { zh: '毕业院校', en: 'University' },
  profile_immigrated: { zh: '登陆加拿大', en: 'In Canada since' },
  profile_about: { zh: '关于', en: 'About' },
  profile_offers: { zh: '可以提供', en: 'Open to' },

  // Messages
  messages_title: { zh: '消息', en: 'Messages' },
  messages_search: { zh: '搜索对话', en: 'Search chats' },
  new_message: { zh: '发起对话', en: 'New chat' },
  group_chat: { zh: '群聊', en: 'Group' },
  type_message: { zh: '输入消息…', en: 'Type a message…' },
  send: { zh: '发送', en: 'Send' },
  start_voice: { zh: '语音通话', en: 'Voice' },
  start_video: { zh: '视频通话', en: 'Video' },
  members_count: { zh: '名成员', en: 'members' },

  // Meetings
  meetings_title: { zh: '语音/视频会议', en: 'Meetings' },
  meetings_live: { zh: '正在进行', en: 'Live now' },
  meetings_upcoming: { zh: '即将开始', en: 'Upcoming' },
  join_meeting: { zh: '加入会议', en: 'Join' },
  start_meeting: { zh: '发起会议', en: 'Start a meeting' },
  meeting_attendees: { zh: '人参加', en: 'attending' },
  meeting_mic: { zh: '麦克风', en: 'Mic' },
  meeting_camera: { zh: '摄像头', en: 'Camera' },
  meeting_share: { zh: '共享', en: 'Share' },
  meeting_leave: { zh: '离开', en: 'Leave' },
  meeting_invite: { zh: '邀请校友', en: 'Invite' },
  meeting_connecting: { zh: '连接中…', en: 'Connecting…' },

  // Forums
  forums_title: { zh: '校友论坛', en: 'Forums' },
  forums_categories: { zh: '版块', en: 'Categories' },
  forums_trending: { zh: '热门讨论', en: 'Trending' },
  thread_replies: { zh: '回复', en: 'replies' },
  thread_views: { zh: '浏览', en: 'views' },
  new_thread: { zh: '发帖', en: 'New post' },
  reply_placeholder: { zh: '写下你的回复…', en: 'Write a reply…' },
  post_reply: { zh: '回复', en: 'Reply' },
  pinned: { zh: '置顶', en: 'Pinned' },
  hot: { zh: '热', en: 'Hot' },

  // Voting
  voting_title: { zh: '社区投票', en: 'Community Voting' },
  vote_now: { zh: '立即投票', en: 'Vote' },
  voted: { zh: '已投票', en: 'Voted' },
  total_votes: { zh: '票', en: 'votes' },
  poll_closed: { zh: '投票已结束', en: 'Closed' },
  poll_ends: { zh: '截止', en: 'Ends' },
  your_vote_counted: { zh: '感谢你的投票！', en: 'Thanks for voting!' },

  // Notifications
  notifications_title: { zh: '群通知', en: 'Notifications' },
  mark_all_read: { zh: '全部已读', en: 'Mark all read' },
  no_notifications: { zh: '暂无通知', en: 'No notifications' },

  // Resources
  resources_title: { zh: '资源中心', en: 'Resources' },
  res_newcomer: { zh: '新移民帮助', en: 'Newcomer Help' },
  res_newcomer_sub: { zh: '安家落户、政策、生活指南', en: 'Settle in: housing, paperwork, life' },
  res_career: { zh: '职业辅导', en: 'Career Coaching' },
  res_career_sub: { zh: '求职、简历、面试、内推', en: 'Jobs, resumes, interviews, referrals' },
  res_startup: { zh: '创业资源', en: 'Startup Resources' },
  res_startup_sub: { zh: '融资、合伙人、孵化器', en: 'Funding, co-founders, incubators' },
  resource_open: { zh: '查看', en: 'Open' },
  book_session: { zh: '预约', en: 'Book' },
  ask_mentor: { zh: '咨询导师', en: 'Ask a mentor' },

  // Profile (mine)
  edit_profile: { zh: '编辑资料', en: 'Edit profile' },
  my_activity: { zh: '我的动态', en: 'My activity' },
  settings: { zh: '设置', en: 'Settings' },
  language: { zh: '语言', en: 'Language' },
  language_value: { zh: '中文', en: 'English' },
  saved_items: { zh: '收藏', en: 'Saved' },
  my_groups: { zh: '我的群组', en: 'My groups' },
  notifications_setting: { zh: '通知', en: 'Notifications' },
  privacy: { zh: '隐私', en: 'Privacy' },
  help_support: { zh: '帮助与反馈', en: 'Help & feedback' },
  sign_out: { zh: '退出登录', en: 'Sign out' },
  stat_connections: { zh: '人脉', en: 'Connections' },
  stat_posts: { zh: '帖子', en: 'Posts' },
  stat_groups: { zh: '群组', en: 'Groups' },

  // Common
  back: { zh: '返回', en: 'Back' },
  cancel: { zh: '取消', en: 'Cancel' },
  done: { zh: '完成', en: 'Done' },
  save: { zh: '保存', en: 'Save' },
  online: { zh: '在线', en: 'Online' },
  now: { zh: '刚刚', en: 'now' },
  members: { zh: '成员', en: 'Members' },
  view_profile: { zh: '查看资料', en: 'View profile' },

  // Auth
  auth_welcome: { zh: '欢迎回来', en: 'Welcome back' },
  auth_welcome_new: { zh: '加入校友社区', en: 'Join the community' },
  auth_subtitle: { zh: '加拿大华人校友的专属社区', en: 'The home for Chinese alumni in Canada' },
  auth_login: { zh: '登录', en: 'Sign in' },
  auth_register: { zh: '注册', en: 'Sign up' },
  auth_email: { zh: '邮箱', en: 'Email' },
  auth_password: { zh: '密码', en: 'Password' },
  auth_name: { zh: '姓名', en: 'Full name' },
  auth_have_account: { zh: '已有账号？登录', en: 'Have an account? Sign in' },
  auth_no_account: { zh: '没有账号？注册', en: 'New here? Create an account' },
  auth_optional_section: { zh: '校友资料（选填）', en: 'Alumni details (optional)' },
  auth_university: { zh: '毕业院校', en: 'University' },
  auth_major: { zh: '专业', en: 'Major' },
  auth_gradYear: { zh: '毕业年份', en: 'Graduation year' },
  auth_city: { zh: '现居城市', en: 'City' },
  auth_occupation: { zh: '职业', en: 'Occupation' },
  auth_signing_in: { zh: '正在登录…', en: 'Signing in…' },
  auth_creating: { zh: '正在创建账号…', en: 'Creating account…' },
  auth_demo_hint: { zh: '体验演示账号', en: 'Use a demo account' },
  auth_demo_fill: { zh: '一键填入演示账号', en: 'Fill demo credentials' },
  auth_required: { zh: '请填写邮箱和密码', en: 'Email and password are required' },

  // Connection status
  status_connected: { zh: '已连接', en: 'Connected' },
  status_connecting: { zh: '连接中…', en: 'Connecting…' },
  status_offline: { zh: '离线 · 重连中', en: 'Offline · reconnecting' },
  typing_indicator: { zh: '正在输入…', en: 'typing…' },
} as const;

export type StringKey = keyof typeof strings;

export function t(key: StringKey, lang: Lang): string {
  return strings[key][lang];
}

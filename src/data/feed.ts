import type { FeedItem, Poll } from '../types';
import { palette } from '../theme';

export const polls: Poll[] = [
  {
    id: 'poll1',
    question: { zh: '今年的校友年会你更希望在哪个城市举办？', en: 'Which city should host this year’s alumni gala?' },
    options: [
      { id: 'o1', label: { zh: '多伦多', en: 'Toronto' }, votes: 312 },
      { id: 'o2', label: { zh: '温哥华', en: 'Vancouver' }, votes: 268 },
      { id: 'o3', label: { zh: '蒙特利尔', en: 'Montreal' }, votes: 94 },
      { id: 'o4', label: { zh: '卡尔加里', en: 'Calgary' }, votes: 57 },
    ],
    totalVotes: 731,
    endsAt: { zh: '7月3日截止', en: 'Ends Jul 3' },
  },
  {
    id: 'poll2',
    question: { zh: '下一期线上讲座你最想听哪个主题？', en: 'Pick the topic for our next webinar' },
    options: [
      { id: 'a', label: { zh: 'PR 与公民身份规划', en: 'PR & citizenship planning' }, votes: 188 },
      { id: 'b', label: { zh: '北美买房第一步', en: 'Buying your first home' }, votes: 240 },
      { id: 'c', label: { zh: 'AI 行业求职', en: 'Landing AI jobs' }, votes: 205 },
    ],
    totalVotes: 633,
    endsAt: { zh: '6月30日截止', en: 'Ends Jun 30' },
  },
  {
    id: 'poll3',
    question: { zh: '校友会会费是否应改为自愿捐赠制？', en: 'Should membership dues become voluntary donations?' },
    options: [
      { id: 'y', label: { zh: '支持', en: 'Yes' }, votes: 421 },
      { id: 'n', label: { zh: '反对', en: 'No' }, votes: 156 },
    ],
    totalVotes: 577,
    endsAt: { zh: '已结束', en: 'Closed' },
    closed: true,
  },
];

export const pollById = (id: string): Poll | undefined => polls.find((p) => p.id === id);

export const feed: FeedItem[] = [
  {
    id: 'f1',
    type: 'announcement',
    authorId: 'p6',
    group: { zh: '新移民互助群', en: 'Newcomer Support' },
    time: { zh: '1小时前', en: '1h ago' },
    body: {
      zh: '【免费讲座】本周日上午10点，移民律师在线答疑：工签转PR、配偶团聚、续签常见坑。报名见会议页。',
      en: 'Free webinar Sun 10 AM: immigration lawyer Q&A — work permit to PR, spousal sponsorship, renewals. Sign up on the Meetings page.',
    },
    likes: 64,
    comments: 21,
  },
  {
    id: 'f2',
    type: 'poll',
    authorId: 'me',
    group: { zh: '全体校友', en: 'All Alumni' },
    time: { zh: '3小时前', en: '3h ago' },
    poll: polls[0],
  },
  {
    id: 'f3',
    type: 'ad',
    brand: { zh: '枫叶银行 · 新移民专享', en: 'Maple Bank · Newcomer Offer' },
    time: { zh: '赞助', en: 'Sponsored' },
    headline: { zh: '新移民开户送 $400 现金奖励', en: '$400 cash bonus for newcomer accounts' },
    body: { zh: '无月费，免费跨境汇款，专属华人客户经理。', en: 'No monthly fees, free remittance, dedicated Mandarin advisor.' },
    cta: { zh: '了解详情', en: 'Learn more' },
    accent: palette.jade,
  },
  {
    id: 'f4',
    type: 'meeting',
    meetingId: 'mt1',
    group: { zh: '职业辅导', en: 'Career Coaching' },
    time: { zh: '正在进行', en: 'Live' },
  },
  {
    id: 'f5',
    type: 'announcement',
    authorId: 'p2',
    group: { zh: '华人创业者俱乐部', en: 'Founders Club' },
    time: { zh: '5小时前', en: '5h ago' },
    body: {
      zh: 'NorthLeaf AI 正在招聘高级前端、ML 工程师，欢迎校友内推。简历发我私信，优先看校友！',
      en: 'NorthLeaf AI is hiring Senior Frontend & ML Engineers. Alumni referrals welcome — DM me your resume!',
    },
    likes: 91,
    comments: 33,
  },
  {
    id: 'f6',
    type: 'poll',
    authorId: 'p1',
    group: { zh: '活动委员会', en: 'Events Committee' },
    time: { zh: '昨天', en: 'Yesterday' },
    poll: polls[1],
  },
  {
    id: 'f7',
    type: 'ad',
    brand: { zh: '安家地产 · 大多伦多', en: 'Settle Realty · GTA' },
    time: { zh: '赞助', en: 'Sponsored' },
    headline: { zh: '校友购房咨询，首次置业全流程陪跑', en: 'First-home buying, fully guided for alumni' },
    body: { zh: '熟悉学区、贷款、政府补贴，普通话/英语服务。', en: 'School zones, mortgages, grants — service in Mandarin/English.' },
    cta: { zh: '预约咨询', en: 'Book a call' },
    accent: palette.sky,
  },
];

import type { ForumCategory, ForumThread, ForumReply } from '../types';
import { palette } from '../theme';

export const forumCategories: ForumCategory[] = [
  {
    id: 'cat_life',
    name: { zh: '生活在加拿大', en: 'Life in Canada' },
    description: { zh: '租房、买车、育儿、医疗', en: 'Housing, cars, kids, healthcare' },
    icon: 'home-outline',
    color: palette.jade,
    threads: 1284,
    posts: 9321,
  },
  {
    id: 'cat_immigration',
    name: { zh: '身份与移民', en: 'Immigration & Status' },
    description: { zh: '工签、PR、入籍、签证', en: 'Permits, PR, citizenship, visas' },
    icon: 'document-text-outline',
    color: palette.sky,
    threads: 642,
    posts: 5187,
  },
  {
    id: 'cat_career',
    name: { zh: '职场与求职', en: 'Career & Jobs' },
    description: { zh: '内推、面试、薪资、转行', en: 'Referrals, interviews, pay, switching' },
    icon: 'briefcase-outline',
    color: palette.maple,
    threads: 938,
    posts: 7762,
  },
  {
    id: 'cat_startup',
    name: { zh: '创业与投资', en: 'Startup & Investing' },
    description: { zh: '融资、合伙、股权、副业', en: 'Funding, co-founders, equity, side gigs' },
    icon: 'rocket-outline',
    color: palette.amber,
    threads: 311,
    posts: 2604,
  },
  {
    id: 'cat_social',
    name: { zh: '同城活动', en: 'Local Meetups' },
    description: { zh: '聚会、球局、相亲、读书会', en: 'Gatherings, sports, dating, book clubs' },
    icon: 'people-outline',
    color: palette.plum,
    threads: 527,
    posts: 4410,
  },
  {
    id: 'cat_buysell',
    name: { zh: '二手与跳蚤市场', en: 'Buy & Sell' },
    description: { zh: '家具、电子、车位、转让', en: 'Furniture, electronics, parking, deals' },
    icon: 'pricetags-outline',
    color: palette.gold,
    threads: 803,
    posts: 3990,
  },
];

export const forumCategoryById = (id: string): ForumCategory | undefined =>
  forumCategories.find((c) => c.id === id);

export const forumThreads: ForumThread[] = [
  {
    id: 't1',
    categoryId: 'cat_immigration',
    title: { zh: '工签转 PR 最新 Express Entry 分数线讨论', en: 'Latest Express Entry cutoffs for work permit → PR' },
    authorId: 'p6',
    excerpt: { zh: '本轮 CEC 邀请分数降到了 521，分享一下我的时间线和材料清单…', en: 'This CEC round dropped to 521. Sharing my timeline and document checklist…' },
    replies: 86,
    views: 4210,
    lastActivity: { zh: '12分钟前', en: '12m ago' },
    pinned: true,
    hot: true,
    tags: [{ zh: 'PR', en: 'PR' }, { zh: 'Express Entry', en: 'Express Entry' }],
  },
  {
    id: 't2',
    categoryId: 'cat_career',
    title: { zh: '从国内大厂到加拿大，第一份工作怎么找？', en: 'From a Chinese tech giant to Canada: landing job #1' },
    authorId: 'p7',
    excerpt: { zh: '海外经验不被认可？分享我投了 200 份简历后总结的本地化技巧。', en: 'Overseas experience discounted? Tips after 200 applications on localizing your resume.' },
    replies: 142,
    views: 6890,
    lastActivity: { zh: '38分钟前', en: '38m ago' },
    hot: true,
    tags: [{ zh: '求职', en: 'Job hunt' }, { zh: '简历', en: 'Resume' }],
  },
  {
    id: 't3',
    categoryId: 'cat_life',
    title: { zh: '多伦多哪个区适合带娃家庭？学区+通勤求建议', en: 'Best GTA neighbourhoods for families (schools + commute)?' },
    authorId: 'p12',
    excerpt: { zh: '预算 100 万以内，希望好学区，先生在 downtown 上班…', en: 'Budget under $1M, good schools, spouse works downtown…' },
    replies: 57,
    views: 2980,
    lastActivity: { zh: '1小时前', en: '1h ago' },
    tags: [{ zh: '买房', en: 'Housing' }, { zh: '学区', en: 'Schools' }],
  },
  {
    id: 't4',
    categoryId: 'cat_startup',
    title: { zh: '在加拿大注册公司：联邦 vs 省注册怎么选？', en: 'Incorporating in Canada: federal vs provincial?' },
    authorId: 'p2',
    excerpt: { zh: '准备做 SaaS，未来想拿 VC。会计师建议联邦注册，求过来人经验。', en: 'Building a SaaS, aiming for VC. Accountant suggests federal — experiences?' },
    replies: 34,
    views: 1542,
    lastActivity: { zh: '2小时前', en: '2h ago' },
    tags: [{ zh: '注册公司', en: 'Incorporation' }, { zh: 'SaaS', en: 'SaaS' }],
  },
  {
    id: 't5',
    categoryId: 'cat_career',
    title: { zh: '【内推汇总】6月各大厂校友内推帖', en: '[Referrals] June alumni referral megathread' },
    authorId: 'me',
    excerpt: { zh: 'Shopify / RBC / Mila / MDA 等校友内推集中贴，跟帖留岗位。', en: 'Shopify / RBC / Mila / MDA referrals — drop your role below.' },
    replies: 209,
    views: 8120,
    lastActivity: { zh: '3小时前', en: '3h ago' },
    pinned: true,
    tags: [{ zh: '内推', en: 'Referral' }],
  },
  {
    id: 't6',
    categoryId: 'cat_social',
    title: { zh: '温哥华周末羽毛球局，常年缺人～', en: 'Vancouver weekend badminton — always need players' },
    authorId: 'p3',
    excerpt: { zh: '每周六上午 Richmond，混双为主，新手友好。', en: 'Saturdays AM in Richmond, mixed doubles, beginners welcome.' },
    replies: 41,
    views: 1130,
    lastActivity: { zh: '4小时前', en: '4h ago' },
    tags: [{ zh: '运动', en: 'Sports' }],
  },
];

export const threadById = (id: string): ForumThread | undefined =>
  forumThreads.find((t) => t.id === id);

export const threadsByCategory = (categoryId: string): ForumThread[] =>
  forumThreads.filter((t) => t.categoryId === categoryId);

export const forumReplies: Record<string, ForumReply[]> = {
  t1: [
    { id: 'r1', threadId: 't1', authorId: 'p9', body: { zh: '太及时了！请问硕士学历加分怎么算？', en: 'So timely! How are master’s degree points calculated?' }, time: { zh: '20分钟前', en: '20m ago' }, upvotes: 12 },
    { id: 'r2', threadId: 't1', authorId: 'p1', body: { zh: '建议先把雅思刷到 CLB9，语言分性价比最高。', en: 'Push IELTS to CLB9 first — best ROI on points.' }, time: { zh: '15分钟前', en: '15m ago' }, upvotes: 28 },
    { id: 'r3', threadId: 't1', authorId: 'p7', body: { zh: '我去年 519 上岸，材料我整理成了清单，需要私我。', en: 'Got in at 519 last year. DM me for my checklist.' }, time: { zh: '12分钟前', en: '12m ago' }, upvotes: 19 },
  ],
  t2: [
    { id: 'r4', threadId: 't2', authorId: 'p10', body: { zh: '一定要把项目成果量化，本地 HR 很看重数字。', en: 'Quantify your impact — local recruiters love numbers.' }, time: { zh: '50分钟前', en: '50m ago' }, upvotes: 33 },
    { id: 'r5', threadId: 't2', authorId: 'p2', body: { zh: '内推真的有用，我们家进面试的 80% 来自内推。', en: 'Referrals work — 80% of our interviews come from them.' }, time: { zh: '38分钟前', en: '38m ago' }, upvotes: 41 },
  ],
  t4: [
    { id: 'r6', threadId: 't4', authorId: 'p8', body: { zh: '要拿 VC 基本都建议特拉华或联邦，方便后续融资。', en: 'For VC, go federal (or Delaware C-corp) for cleaner financing.' }, time: { zh: '1小时前', en: '1h ago' }, upvotes: 9 },
  ],
};

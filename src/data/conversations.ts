import type { Conversation, Message } from '../types';
import { palette } from '../theme';

export const conversations: Conversation[] = [
  {
    id: 'c_group_toronto',
    kind: 'group',
    title: { zh: '多伦多清华校友会', en: 'Tsinghua Alumni · Toronto' },
    avatarColor: palette.maple,
    initials: '清',
    participantIds: ['me', 'p1', 'p6', 'p7', 'p11', 'p10'],
    lastMessage: { zh: '周六的烧烤聚会有人拼车吗？', en: 'Anyone carpooling to the Sat BBQ?' },
    lastTime: '17:42',
    unread: 3,
    pinned: true,
  },
  {
    id: 'c_p2',
    kind: 'direct',
    title: { zh: '王浩然', en: 'Haoran Wang' },
    avatarColor: palette.sky,
    initials: '浩',
    participantIds: ['me', 'p2'],
    lastMessage: { zh: '我们正在招前端，要不要聊聊？', en: 'We are hiring frontend — wanna chat?' },
    lastTime: '16:08',
    unread: 1,
  },
  {
    id: 'c_group_newcomer',
    kind: 'group',
    title: { zh: '新移民互助群', en: 'Newcomer Support Group' },
    avatarColor: palette.jade,
    initials: '助',
    participantIds: ['me', 'p6', 'p9', 'p7', 'p12'],
    lastMessage: { zh: '分享了《登陆第一个月清单》', en: 'Shared "First Month Checklist"' },
    lastTime: '14:20',
    unread: 0,
    pinned: true,
  },
  {
    id: 'c_p1',
    kind: 'direct',
    title: { zh: '林婉清', en: 'Wanqing Lin' },
    avatarColor: palette.jade,
    initials: '婉',
    participantIds: ['me', 'p1'],
    lastMessage: { zh: '报税的事我帮你看过了 👍', en: 'I looked over your tax question 👍' },
    lastTime: '昨天',
    unread: 0,
  },
  {
    id: 'c_group_startup',
    kind: 'group',
    title: { zh: '华人创业者俱乐部', en: 'Founders Club' },
    avatarColor: palette.amber,
    initials: '创',
    participantIds: ['me', 'p2', 'p5', 'p11', 'p8'],
    lastMessage: { zh: '下周三 demo day，名额还有 5 个', en: '5 spots left for next Wed demo day' },
    lastTime: '昨天',
    unread: 0,
  },
  {
    id: 'c_p5',
    kind: 'direct',
    title: { zh: '孙梦琪', en: 'Mengqi Sun' },
    avatarColor: palette.maple,
    initials: '梦',
    participantIds: ['me', 'p5'],
    lastMessage: { zh: '论文初稿发你邮箱了', en: 'Sent the draft to your email' },
    lastTime: '周二',
    unread: 0,
  },
];

export const conversationById = (id: string): Conversation | undefined =>
  conversations.find((c) => c.id === id);

export const seedMessages: Record<string, Message[]> = {
  c_group_toronto: [
    { id: 'tg1', conversationId: 'c_group_toronto', senderId: 'p11', text: { zh: '大家周六的烧烤聚会还来吗？', en: 'Everyone still on for the Saturday BBQ?' }, time: '17:30' },
    { id: 'tg2', conversationId: 'c_group_toronto', senderId: 'p7', text: { zh: '来！我带些卤味', en: 'Coming! I will bring snacks.' }, time: '17:33' },
    { id: 'tg3', conversationId: 'c_group_toronto', senderId: 'p10', text: { zh: '地点定在 High Park 吗？', en: 'Are we doing High Park?' }, time: '17:38' },
    { id: 'tg4', conversationId: 'c_group_toronto', senderId: 'p1', text: { zh: '周六的烧烤聚会有人拼车吗？', en: 'Anyone carpooling to the Sat BBQ?' }, time: '17:42' },
  ],
  c_p2: [
    { id: 'p2a', conversationId: 'c_p2', senderId: 'p2', text: { zh: '思远好久不见！', en: 'Siyuan, long time no see!' }, time: '15:55' },
    { id: 'p2b', conversationId: 'c_p2', senderId: 'me', text: { zh: '浩然好！最近忙创业吧', en: 'Hey Haoran! Busy with the startup?' }, time: '16:02' },
    { id: 'p2c', conversationId: 'c_p2', senderId: 'p2', text: { zh: '我们正在招前端，要不要聊聊？', en: 'We are hiring frontend — wanna chat?' }, time: '16:08' },
  ],
  c_group_newcomer: [
    { id: 'nc1', conversationId: 'c_group_newcomer', senderId: 'p9', text: { zh: '刚登陆，请问 SIN 卡在哪里办？', en: 'Just landed — where do I get a SIN card?' }, time: '14:02' },
    { id: 'nc2', conversationId: 'c_group_newcomer', senderId: 'p6', text: { zh: 'Service Canada 就可以，带护照和登陆纸', en: 'Service Canada — bring passport and landing paper.' }, time: '14:10' },
    { id: 'nc3', conversationId: 'c_group_newcomer', senderId: 'p12', text: { zh: '分享了《登陆第一个月清单》', en: 'Shared "First Month Checklist"' }, time: '14:20', system: true },
  ],
  c_p1: [
    { id: 'p1a', conversationId: 'c_p1', senderId: 'p1', text: { zh: '报税的事我帮你看过了 👍', en: 'I looked over your tax question 👍' }, time: '昨天' },
  ],
  c_group_startup: [
    { id: 'su1', conversationId: 'c_group_startup', senderId: 'p2', text: { zh: '下周三 demo day，名额还有 5 个', en: '5 spots left for next Wed demo day' }, time: '昨天' },
  ],
  c_p5: [
    { id: 'p5a', conversationId: 'c_p5', senderId: 'p5', text: { zh: '论文初稿发你邮箱了', en: 'Sent the draft to your email' }, time: '周二' },
  ],
};

import type { Meeting } from '../types';

export const meetings: Meeting[] = [
  {
    id: 'mt1',
    title: { zh: '加拿大科技求职分享会', en: 'Breaking into Canadian Tech' },
    host: { zh: '王浩然 · NorthLeaf AI', en: 'Haoran Wang · NorthLeaf AI' },
    kind: 'video',
    startsAt: { zh: '正在进行', en: 'Live now' },
    durationMin: 60,
    attendees: 87,
    live: true,
    tag: { zh: '职业辅导', en: 'Career' },
  },
  {
    id: 'mt2',
    title: { zh: '新移民税务与福利答疑', en: 'Newcomer Tax & Benefits Q&A' },
    host: { zh: '林婉清 · RBC', en: 'Wanqing Lin · RBC' },
    kind: 'video',
    startsAt: { zh: '今天 20:00', en: 'Today 8:00 PM' },
    durationMin: 45,
    attendees: 42,
    tag: { zh: '新移民', en: 'Newcomer' },
  },
  {
    id: 'mt3',
    title: { zh: '创业融资 Office Hour', en: 'Startup Fundraising Office Hours' },
    host: { zh: '孙梦琪 · Mila', en: 'Mengqi Sun · Mila' },
    kind: 'voice',
    startsAt: { zh: '明天 12:30', en: 'Tomorrow 12:30 PM' },
    durationMin: 30,
    attendees: 18,
    tag: { zh: '创业', en: 'Startup' },
  },
  {
    id: 'mt4',
    title: { zh: '清华校友月度茶话会', en: 'Tsinghua Alumni Monthly Mixer' },
    host: { zh: '多伦多清华校友会', en: 'Tsinghua Alumni Toronto' },
    kind: 'video',
    startsAt: { zh: '周六 15:00', en: 'Saturday 3:00 PM' },
    durationMin: 90,
    attendees: 56,
    tag: { zh: '社交', en: 'Social' },
  },
];

export const meetingById = (id: string): Meeting | undefined =>
  meetings.find((m) => m.id === id);

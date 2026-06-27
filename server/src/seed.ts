import { db, isSeeded } from './db.js';
import { config } from './config.js';
import { createConversation, createUser, type NewUserInput } from './store.js';
import { hashPassword } from './auth.js';

const palette = {
  maple: '#C8102E',
  jade: '#1F8A70',
  sky: '#2C6FB3',
  plum: '#7A4FB5',
  amber: '#D98324',
};

interface SeedProfile extends Omit<NewUserInput, 'password'> {
  id: string;
}

const profiles: SeedProfile[] = [
  { id: 'me', email: 'me@alumni.app', name: { zh: '陈思远', en: 'Siyuan Chen' }, avatarColor: palette.maple, initials: '思', university: { zh: '清华大学', en: 'Tsinghua University' }, major: { zh: '计算机科学与技术', en: 'Computer Science' }, gradYear: 2016, city: 'Toronto', occupation: { zh: '高级软件工程师 @ Shopify', en: 'Senior Software Engineer @ Shopify' }, headline: { zh: '前端架构 · 校友会志愿者', en: 'Frontend architecture · Alumni volunteer' }, immigrationYear: 2018, verified: true, openTo: ['mentoring', 'newcomer-help'] },
  { id: 'p1', email: 'p1@alumni.app', name: { zh: '林婉清', en: 'Wanqing Lin' }, avatarColor: palette.jade, initials: '婉', university: { zh: '北京大学', en: 'Peking University' }, major: { zh: '金融学', en: 'Finance' }, gradYear: 2014, city: 'Toronto', occupation: { zh: '投资经理 @ RBC', en: 'Investment Manager @ RBC' }, headline: { zh: '帮新移民做财务规划', en: 'Financial planning for newcomers' }, immigrationYear: 2016, verified: true, openTo: ['mentoring', 'newcomer-help'] },
  { id: 'p2', email: 'p2@alumni.app', name: { zh: '王浩然', en: 'Haoran Wang' }, avatarColor: palette.sky, initials: '浩', university: { zh: '上海交通大学', en: 'Shanghai Jiao Tong University' }, major: { zh: '电子工程', en: 'Electrical Engineering' }, gradYear: 2012, city: 'Waterloo', occupation: { zh: '创始人 @ NorthLeaf AI', en: 'Founder @ NorthLeaf AI' }, headline: { zh: '连续创业者，正在招人', en: 'Serial founder, hiring' }, immigrationYear: 2014, verified: true, openTo: ['hiring', 'cofounder'] },
  { id: 'p3', email: 'p3@alumni.app', name: { zh: '赵雅婷', en: 'Yating Zhao' }, avatarColor: palette.plum, initials: '雅', university: { zh: '复旦大学', en: 'Fudan University' }, major: { zh: '新闻传播学', en: 'Journalism & Communication' }, gradYear: 2018, city: 'Vancouver', occupation: { zh: '市场总监 @ Lululemon', en: 'Marketing Director @ Lululemon' }, headline: { zh: '品牌 · 增长 · 内容', en: 'Brand · Growth · Content' }, immigrationYear: 2019, openTo: ['mentoring'] },
  { id: 'p4', email: 'p4@alumni.app', name: { zh: '刘子轩', en: 'Zixuan Liu' }, avatarColor: palette.amber, initials: '子', university: { zh: '浙江大学', en: 'Zhejiang University' }, major: { zh: '机械工程', en: 'Mechanical Engineering' }, gradYear: 2015, city: 'Calgary', occupation: { zh: '能源系统工程师 @ Suncor', en: 'Energy Systems Engineer @ Suncor' }, immigrationYear: 2017, openTo: ['jobs'] },
  { id: 'p5', email: 'p5@alumni.app', name: { zh: '孙梦琪', en: 'Mengqi Sun' }, avatarColor: palette.maple, initials: '梦', university: { zh: '中国科学技术大学', en: 'USTC' }, major: { zh: '物理学', en: 'Physics' }, gradYear: 2017, city: 'Montreal', occupation: { zh: '机器学习研究员 @ Mila', en: 'ML Researcher @ Mila' }, headline: { zh: '深度学习 · 论文合作', en: 'Deep learning · paper collabs' }, immigrationYear: 2019, verified: true, openTo: ['mentoring', 'cofounder'] },
  { id: 'p6', email: 'p6@alumni.app', name: { zh: '黄俊杰', en: 'Junjie Huang' }, avatarColor: palette.jade, initials: '俊', university: { zh: '南京大学', en: 'Nanjing University' }, major: { zh: '法学', en: 'Law' }, gradYear: 2013, city: 'Toronto', occupation: { zh: '移民律师 @ Huang Law', en: 'Immigration Lawyer @ Huang Law' }, headline: { zh: '专注移民与身份规划', en: 'Immigration & status planning' }, immigrationYear: 2015, verified: true, openTo: ['newcomer-help'] },
  { id: 'p7', email: 'p7@alumni.app', name: { zh: '周欣怡', en: 'Xinyi Zhou' }, avatarColor: palette.sky, initials: '欣', university: { zh: '武汉大学', en: 'Wuhan University' }, major: { zh: '生物医学工程', en: 'Biomedical Engineering' }, gradYear: 2019, city: 'Toronto', occupation: { zh: '产品经理 @ 医疗科技初创', en: 'PM @ HealthTech startup' }, immigrationYear: 2021, openTo: ['jobs', 'newcomer-help'] },
  { id: 'p8', email: 'p8@alumni.app', name: { zh: '吴天磊', en: 'Tianlei Wu' }, avatarColor: palette.plum, initials: '天', university: { zh: '哈尔滨工业大学', en: 'Harbin Institute of Technology' }, major: { zh: '航天工程', en: 'Aerospace Engineering' }, gradYear: 2011, city: 'Ottawa', occupation: { zh: '技术总监 @ MDA Space', en: 'Engineering Director @ MDA Space' }, immigrationYear: 2013, verified: true, openTo: ['mentoring', 'hiring'] },
  { id: 'p9', email: 'p9@alumni.app', name: { zh: '郑可欣', en: 'Kexin Zheng' }, avatarColor: palette.amber, initials: '可', university: { zh: '中山大学', en: 'Sun Yat-sen University' }, major: { zh: '会计学', en: 'Accounting' }, gradYear: 2020, city: 'Richmond', occupation: { zh: '注册会计师 @ Deloitte', en: 'CPA @ Deloitte' }, immigrationYear: 2022, openTo: ['newcomer-help'] },
  { id: 'p10', email: 'p10@alumni.app', name: { zh: '杨睿', en: 'Rui Yang' }, avatarColor: palette.maple, initials: '睿', university: { zh: '清华大学', en: 'Tsinghua University' }, major: { zh: '工业设计', en: 'Industrial Design' }, gradYear: 2018, city: 'Vancouver', occupation: { zh: 'UX 设计负责人 @ Hootsuite', en: 'Head of UX @ Hootsuite' }, immigrationYear: 2020, openTo: ['mentoring'] },
  { id: 'p11', email: 'p11@alumni.app', name: { zh: '冯佳音', en: 'Jiayin Feng' }, avatarColor: palette.jade, initials: '佳', university: { zh: '北京大学', en: 'Peking University' }, major: { zh: '生命科学', en: 'Life Sciences' }, gradYear: 2016, city: 'Toronto', occupation: { zh: '博士后 @ University of Toronto', en: 'Postdoc @ University of Toronto' }, immigrationYear: 2017, openTo: ['cofounder'] },
  { id: 'p12', email: 'p12@alumni.app', name: { zh: '许文博', en: 'Wenbo Xu' }, avatarColor: palette.sky, initials: '文', university: { zh: '上海交通大学', en: 'Shanghai Jiao Tong University' }, major: { zh: '土木工程', en: 'Civil Engineering' }, gradYear: 2014, city: 'Mississauga', occupation: { zh: '项目经理 @ EllisDon', en: 'Project Manager @ EllisDon' }, immigrationYear: 2016, openTo: ['newcomer-help', 'mentoring'] },
];

interface SeedConversation {
  id: string;
  kind: 'direct' | 'group';
  title: { zh: string; en: string };
  avatarColor: string;
  initials: string;
  participantIds: string[];
  pinned?: boolean;
  unread: number;
  messages: { senderId: string; text: { zh: string; en: string }; displayTime: string; system?: boolean }[];
}

const conversations: SeedConversation[] = [
  {
    id: 'c_group_toronto', kind: 'group', title: { zh: '多伦多清华校友会', en: 'Tsinghua Alumni · Toronto' }, avatarColor: palette.maple, initials: '清', participantIds: ['me', 'p1', 'p6', 'p7', 'p11', 'p10'], pinned: true, unread: 3,
    messages: [
      { senderId: 'p11', text: { zh: '大家周六的烧烤聚会还来吗？', en: 'Everyone still on for the Saturday BBQ?' }, displayTime: '17:30' },
      { senderId: 'p7', text: { zh: '来！我带些卤味', en: 'Coming! I will bring snacks.' }, displayTime: '17:33' },
      { senderId: 'p10', text: { zh: '地点定在 High Park 吗？', en: 'Are we doing High Park?' }, displayTime: '17:38' },
      { senderId: 'p1', text: { zh: '周六的烧烤聚会有人拼车吗？', en: 'Anyone carpooling to the Sat BBQ?' }, displayTime: '17:42' },
    ],
  },
  {
    id: 'c_p2', kind: 'direct', title: { zh: '王浩然', en: 'Haoran Wang' }, avatarColor: palette.sky, initials: '浩', participantIds: ['me', 'p2'], unread: 1,
    messages: [
      { senderId: 'p2', text: { zh: '思远好久不见！', en: 'Siyuan, long time no see!' }, displayTime: '15:55' },
      { senderId: 'me', text: { zh: '浩然好！最近忙创业吧', en: 'Hey Haoran! Busy with the startup?' }, displayTime: '16:02' },
      { senderId: 'p2', text: { zh: '我们正在招前端，要不要聊聊？', en: 'We are hiring frontend — wanna chat?' }, displayTime: '16:08' },
    ],
  },
  {
    id: 'c_group_newcomer', kind: 'group', title: { zh: '新移民互助群', en: 'Newcomer Support Group' }, avatarColor: palette.jade, initials: '助', participantIds: ['me', 'p6', 'p9', 'p7', 'p12'], pinned: true, unread: 0,
    messages: [
      { senderId: 'p9', text: { zh: '刚登陆，请问 SIN 卡在哪里办？', en: 'Just landed — where do I get a SIN card?' }, displayTime: '14:02' },
      { senderId: 'p6', text: { zh: 'Service Canada 就可以，带护照和登陆纸', en: 'Service Canada — bring passport and landing paper.' }, displayTime: '14:10' },
      { senderId: 'p12', text: { zh: '分享了《登陆第一个月清单》', en: 'Shared "First Month Checklist"' }, displayTime: '14:20', system: true },
    ],
  },
  {
    id: 'c_p1', kind: 'direct', title: { zh: '林婉清', en: 'Wanqing Lin' }, avatarColor: palette.jade, initials: '婉', participantIds: ['me', 'p1'], unread: 0,
    messages: [
      { senderId: 'p1', text: { zh: '报税的事我帮你看过了 👍', en: 'I looked over your tax question 👍' }, displayTime: '昨天' },
    ],
  },
  {
    id: 'c_group_startup', kind: 'group', title: { zh: '华人创业者俱乐部', en: 'Founders Club' }, avatarColor: palette.amber, initials: '创', participantIds: ['me', 'p2', 'p5', 'p11', 'p8'], unread: 0,
    messages: [
      { senderId: 'p2', text: { zh: '下周三 demo day，名额还有 5 个', en: '5 spots left for next Wed demo day' }, displayTime: '昨天' },
    ],
  },
  {
    id: 'c_p5', kind: 'direct', title: { zh: '孙梦琪', en: 'Mengqi Sun' }, avatarColor: palette.maple, initials: '梦', participantIds: ['me', 'p5'], unread: 0,
    messages: [
      { senderId: 'p5', text: { zh: '论文初稿发你邮箱了', en: 'Sent the draft to your email' }, displayTime: '周二' },
    ],
  },
];

export function seedIfEmpty(): void {
  if (isSeeded()) return;
  runSeed();
}

function runSeed(): void {
  const sharedHash = hashPassword(config.demoPassword);
  const insertMessage = db.prepare(
    `INSERT INTO messages (id, conversation_id, sender_id, text_zh, text_en, display_time, system, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const setRead = db.prepare(
    'UPDATE participants SET last_read_at = ? WHERE conversation_id = ? AND user_id = ?',
  );

  const tx = db.transaction(() => {
    for (const p of profiles) {
      createUser({ ...p, password: sharedHash, passwordIsHashed: true });
    }

    let clock = Date.now() - conversations.length * 24 * 60 * 60 * 1000;

    for (const conv of conversations) {
      createConversation({
        id: conv.id,
        kind: conv.kind,
        title: conv.title,
        avatarColor: conv.avatarColor,
        initials: conv.initials,
        participantIds: conv.participantIds,
        pinned: conv.pinned,
      });

      const createdAts: { ts: number; senderId: string }[] = [];
      conv.messages.forEach((m, i) => {
        const ts = clock + i * 60_000;
        insertMessage.run(
          `m_seed_${conv.id}_${i}`,
          conv.id,
          m.senderId,
          m.text.zh,
          m.text.en,
          m.displayTime,
          m.system ? 1 : 0,
          ts,
        );
        createdAts.push({ ts, senderId: m.senderId });
      });
      clock += conv.messages.length * 60_000 + 24 * 60 * 60 * 1000;

      const maxTs = createdAts.length ? createdAts[createdAts.length - 1].ts : 0;

      // Everyone is caught up by default...
      for (const uid of conv.participantIds) setRead.run(maxTs, conv.id, uid);

      // ...except "me" keeps the seeded unread badge.
      if (conv.unread > 0) {
        const fromOthers = createdAts.filter((c) => c.senderId !== 'me').map((c) => c.ts);
        if (conv.unread >= fromOthers.length) {
          setRead.run(0, conv.id, 'me');
        } else {
          const threshold = fromOthers[fromOthers.length - conv.unread];
          setRead.run(threshold - 1, conv.id, 'me');
        }
      }
    }
  });

  tx();
  console.log(`[seed] Seeded ${profiles.length} users and ${conversations.length} conversations.`);
}

// Allow running `npm run seed` directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  if (isSeeded()) {
    console.log('[seed] Database already seeded. Nothing to do.');
  } else {
    runSeed();
  }
}

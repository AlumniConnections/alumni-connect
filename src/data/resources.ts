import type { ResourceCategory, ResourceItem } from '../types';
import { palette } from '../theme';

export const resourceCategories: ResourceCategory[] = [
  {
    id: 'newcomer',
    title: { zh: '新移民帮助', en: 'Newcomer Help' },
    subtitle: { zh: '登陆第一步、安家、政策', en: 'Landing, settling, paperwork' },
    icon: 'airplane-outline',
    color: palette.jade,
    colorSoft: palette.jadeSoft,
  },
  {
    id: 'career',
    title: { zh: '职业辅导', en: 'Career Coaching' },
    subtitle: { zh: '求职、简历、面试、内推', en: 'Jobs, resumes, interviews' },
    icon: 'briefcase-outline',
    color: palette.sky,
    colorSoft: palette.skySoft,
  },
  {
    id: 'startup',
    title: { zh: '创业资源', en: 'Startup Resources' },
    subtitle: { zh: '融资、合伙人、孵化器', en: 'Funding, co-founders, incubators' },
    icon: 'rocket-outline',
    color: palette.amber,
    colorSoft: palette.amberSoft,
  },
];

export const resourceCategoryById = (id: string): ResourceCategory | undefined =>
  resourceCategories.find((c) => c.id === id);

export const resourceItems: ResourceItem[] = [
  // Newcomer
  {
    id: 'rn1',
    categoryId: 'newcomer',
    title: { zh: '登陆第一个月清单', en: 'Your First Month Checklist' },
    body: { zh: 'SIN、健康卡、银行账户、手机卡、信用记录，一步步带你完成。', en: 'SIN, health card, bank account, SIM, credit — step by step.' },
    meta: { zh: '指南 · 8 分钟', en: 'Guide · 8 min' },
    tag: { zh: '必读', en: 'Essential' },
    action: { zh: '查看清单', en: 'Open checklist' },
  },
  {
    id: 'rn2',
    categoryId: 'newcomer',
    title: { zh: '租房避坑指南', en: 'Renting Without Getting Burned' },
    body: { zh: '看房、押金、合同条款、与房东沟通的实用模板。', en: 'Viewings, deposits, lease clauses, landlord templates.' },
    meta: { zh: '指南 · 6 分钟', en: 'Guide · 6 min' },
    tag: { zh: '热门', en: 'Popular' },
    action: { zh: '查看', en: 'Open' },
  },
  {
    id: 'rn3',
    categoryId: 'newcomer',
    title: { zh: '免费一对一安家咨询', en: 'Free 1:1 Settlement Help' },
    body: { zh: '与资深校友志愿者通话，解答你登陆后的任何问题。', en: 'Talk to a senior alumni volunteer about anything after landing.' },
    meta: { zh: '志愿者 · 30 分钟', en: 'Volunteer · 30 min' },
    tag: { zh: '免费', en: 'Free' },
    action: { zh: '预约', en: 'Book' },
  },
  {
    id: 'rn4',
    categoryId: 'newcomer',
    title: { zh: '医疗与家庭医生注册', en: 'Healthcare & Finding a Family Doctor' },
    body: { zh: '各省医保等待期、walk-in、家庭医生 waitlist 全解析。', en: 'Provincial coverage waits, walk-ins, family doctor waitlists.' },
    meta: { zh: '指南 · 5 分钟', en: 'Guide · 5 min' },
    tag: { zh: '指南', en: 'Guide' },
    action: { zh: '查看', en: 'Open' },
  },
  // Career
  {
    id: 'rc1',
    categoryId: 'career',
    title: { zh: '加拿大简历改写工作坊', en: 'Canadian Resume Makeover' },
    body: { zh: '把国内简历改成本地 HR 喜欢的格式，含模板下载。', en: 'Convert your resume to the local format recruiters expect.' },
    meta: { zh: '工作坊 · 录播', en: 'Workshop · replay' },
    tag: { zh: '模板', en: 'Template' },
    action: { zh: '观看', en: 'Watch' },
  },
  {
    id: 'rc2',
    categoryId: 'career',
    title: { zh: '校友内推通道', en: 'Alumni Referral Pipeline' },
    body: { zh: 'Shopify、RBC、Mila 等公司的校友愿意为你内推。', en: 'Alumni at Shopify, RBC, Mila and more will refer you.' },
    meta: { zh: '12 家公司在招', en: '12 companies hiring' },
    tag: { zh: '内推', en: 'Referral' },
    action: { zh: '申请内推', en: 'Request referral' },
  },
  {
    id: 'rc3',
    categoryId: 'career',
    title: { zh: '模拟面试 · 技术/行为', en: 'Mock Interviews · Tech & Behavioral' },
    body: { zh: '与在职校友进行 1 小时模拟面试并获得反馈。', en: 'A 1-hour mock interview with working alumni + feedback.' },
    meta: { zh: '导师 · 60 分钟', en: 'Mentor · 60 min' },
    tag: { zh: '一对一', en: '1:1' },
    action: { zh: '预约', en: 'Book' },
  },
  {
    id: 'rc4',
    categoryId: 'career',
    title: { zh: '本地证书与执照换算', en: 'Credential & License Recognition' },
    body: { zh: '工程师 P.Eng、会计 CPA、医护等专业认证路径。', en: 'P.Eng, CPA, healthcare and other licensing pathways.' },
    meta: { zh: '指南 · 7 分钟', en: 'Guide · 7 min' },
    tag: { zh: '认证', en: 'Licensing' },
    action: { zh: '查看', en: 'Open' },
  },
  // Startup
  {
    id: 'rs1',
    categoryId: 'startup',
    title: { zh: '校友天使投资人名录', en: 'Alumni Angel Investor List' },
    body: { zh: '20+ 位活跃校友天使，含投资阶段与赛道偏好。', en: '20+ active alumni angels with stage & sector focus.' },
    meta: { zh: '名录 · 持续更新', en: 'Directory · updated' },
    tag: { zh: '融资', en: 'Funding' },
    action: { zh: '查看名录', en: 'View list' },
  },
  {
    id: 'rs2',
    categoryId: 'startup',
    title: { zh: '寻找联合创始人', en: 'Find a Co-founder' },
    body: { zh: '按赛道、技能、城市匹配有创业意向的校友。', en: 'Match with alumni by sector, skills and city.' },
    meta: { zh: '匹配 · 38 人在找', en: 'Matching · 38 looking' },
    tag: { zh: '合伙人', en: 'Co-founder' },
    action: { zh: '开始匹配', en: 'Start matching' },
  },
  {
    id: 'rs3',
    categoryId: 'startup',
    title: { zh: '政府补助与孵化器', en: 'Grants & Incubators' },
    body: { zh: 'IRAP、SR&ED、MaRS、Communitech 申请要点。', en: 'IRAP, SR&ED, MaRS, Communitech — how to apply.' },
    meta: { zh: '指南 · 9 分钟', en: 'Guide · 9 min' },
    tag: { zh: '补助', en: 'Grants' },
    action: { zh: '查看', en: 'Open' },
  },
  {
    id: 'rs4',
    categoryId: 'startup',
    title: { zh: '创业法律与股权模板', en: 'Legal & Equity Templates' },
    body: { zh: 'SAFE、股权分配、创始人协议中文解读 + 模板。', en: 'SAFE, equity splits, founder agreements — explained.' },
    meta: { zh: '模板 · 可下载', en: 'Templates · download' },
    tag: { zh: '法律', en: 'Legal' },
    action: { zh: '下载', en: 'Download' },
  },
];

export const resourcesByCategory = (id: ResourceCategory['id']): ResourceItem[] =>
  resourceItems.filter((r) => r.categoryId === id);

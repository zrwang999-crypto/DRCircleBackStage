import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Bell,
  ChevronRight,
  FileText,
  Globe2,
  Heart,
  Home,
  Languages,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CURRENT_USER, FEED_ITEMS, MESSAGES } from './constants';
import { Logo } from './components/Logo';
import type { FeedItem, MessageThread, Screen, User } from './types';

const pageRoot = 'flex h-full flex-col bg-[#f7f3ec] pt-8 text-[#241f1b]';
const headerRoot = 'sticky top-0 z-30 flex items-center justify-between border-b border-[#e8dfd2] bg-[#f7f3ec]/94 px-5 py-4 backdrop-blur-xl';
const iconButton = 'flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8dfd2] bg-white text-[#241f1b] shadow-sm active:scale-95 transition-transform';
const primaryButton = 'h-12 rounded-full bg-[#241f1b] px-5 text-sm font-black text-white shadow-sm active:scale-95 transition-transform';
const mutedButton = 'h-12 rounded-full border border-[#e8dfd2] bg-white px-5 text-sm font-black text-[#6f6256] active:scale-95 transition-transform';
const adminCard = 'rounded-lg border border-[#e5e7eb] bg-white shadow-sm';
const adminLabel = 'text-[11px] font-black uppercase tracking-[0.16em] text-[#6b7280]';
const adminInput = 'h-10 w-full rounded-md border border-[#d1d5db] bg-white px-3 text-sm font-medium text-[#111827] outline-none focus:border-[#111827]';
const adminActionButton = 'h-8 rounded-md border border-[#d1d5db] px-3 text-xs font-black text-[#111827]';

type AdminSection =
  | 'overview'
  | 'app'
  | 'content'
  | 'comments'
  | 'users'
  | 'feedback'
  | 'reports'
  | 'appeals'
  | 'permissions'
  | 'messages'
  | 'smart-ring'
  | 'moderation'
  | 'language';

function AdminToggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-md border border-[#e5e7eb] bg-white px-4 py-3 text-left transition-colors hover:bg-[#f9fafb]"
    >
      <span>
        <span className="block text-sm font-black text-[#111827]">{label}</span>
        <span className="mt-0.5 block text-xs font-medium leading-relaxed text-[#6b7280]">{description}</span>
      </span>
      {checked ? <ToggleRight className="shrink-0 text-[#111827]" size={34} /> : <ToggleLeft className="shrink-0 text-[#9ca3af]" size={34} />}
    </button>
  );
}

function AdminField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className={adminLabel}>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className={adminInput} />
    </label>
  );
}

function AdminSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block space-y-2">
      <span className={adminLabel}>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={adminInput}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusPill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'green' | 'amber' | 'red' }) {
  const toneClass = {
    neutral: 'bg-[#f3f4f6] text-[#374151]',
    green: 'bg-[#dcfce7] text-[#166534]',
    amber: 'bg-[#fef3c7] text-[#92400e]',
    red: 'bg-[#fee2e2] text-[#991b1b]',
  }[tone];

  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${toneClass}`}>{children}</span>;
}

function UserIdentity({
  name,
  userId,
  hasRing = true,
  ringBound = false,
}: {
  name?: string;
  userId: string;
  hasRing?: boolean;
  ringBound?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {name && <p className="font-bold text-[#111827]">{name}</p>}
        {hasRing && (
          <span
            title={ringBound ? '已购买戒指 + 已绑定' : '已购买戒指'}
            className="inline-flex h-6 items-center gap-1 rounded-full bg-[#eef2ff] px-2 text-[#3730a3]"
          >
            <BadgeCheck size={14} strokeWidth={2.6} />
            {ringBound && <Heart size={12} fill="currentColor" strokeWidth={2.8} />}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs font-black text-[#6b7280]">{userId}</p>
    </div>
  );
}

function AdminTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <div className={`${adminCard} overflow-hidden`}>
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-[#f9fafb] text-[11px] font-black uppercase tracking-[0.12em] text-[#6b7280]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-b border-[#e5e7eb] px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1f5f9]">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-middle text-[#111827]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminAppShell() {
  const [active, setActive] = useState<AdminSection>('overview');
  const [appName, setAppName] = useState('DRcircle');
  const [tagline, setTagline] = useState('A calmer daily record.');
  const [primaryTab, setPrimaryTab] = useState('首页');
  const [loginMode, setLoginMode] = useState('三方登录');
  const [homeEnabled, setHomeEnabled] = useState(true);
  const [thirdPartyLoginEnabled, setThirdPartyLoginEnabled] = useState(true);
  const [smartRingEnabled, setSmartRingEnabled] = useState(true);
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [meEnabled, setMeEnabled] = useState(true);
  const [ugcEnabled, setUgcEnabled] = useState(true);
  const [defaultLanguage, setDefaultLanguage] = useState('英文');
  const [region, setRegion] = useState('全球');
  const [bottomTab1, setBottomTab1] = useState('首页');
  const [bottomTab2, setBottomTab2] = useState('智能戒指');
  const [bottomTab3, setBottomTab3] = useState('消息');
  const [bottomTab4, setBottomTab4] = useState('我的');
  const [contentFilter, setContentFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [publishTimeFilter, setPublishTimeFilter] = useState('全部');
  const [appliedFilters, setAppliedFilters] = useState({ content: '', author: '', status: '全部', publishTime: '全部' });
  const [contentStatusById, setContentStatusById] = useState<Record<string, string>>({});
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReasonById, setRejectReasonById] = useState<Record<string, string>>({});
  const [detailItemId, setDetailItemId] = useState<string | null>(null);
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([]);
  const [bulkRejectOpen, setBulkRejectOpen] = useState(false);
  const [bulkRejectReason, setBulkRejectReason] = useState('色情或低俗');
  const [commentKeyword, setCommentKeyword] = useState('');
  const [feedbackUserId, setFeedbackUserId] = useState('');
  const [reportUserId, setReportUserId] = useState('');
  const [appealUserId, setAppealUserId] = useState('');
  const [messageUserId, setMessageUserId] = useState('');
  const [messageViolationType, setMessageViolationType] = useState('全部');
  const [commentStatus, setCommentStatus] = useState('全部');
  const [userKeyword, setUserKeyword] = useState('');
  const [userStatus, setUserStatus] = useState('全部');
  const [feedbackStatus, setFeedbackStatus] = useState('全部');
  const [reportStatus, setReportStatus] = useState('全部');
  const [appealStatus, setAppealStatus] = useState('全部');
  const [appealUserStatusFilter, setAppealUserStatusFilter] = useState('全部');
  const [appealStateById, setAppealStateById] = useState<Record<string, { userStatus: string; reviewStatus: string; handledAt: string }>>({});
  const [roleName, setRoleName] = useState('内容审核员');
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [adminAction, setAdminAction] = useState<{ action: string; target: string; needsReason?: boolean } | null>(null);

  const navItems = [
    { id: 'overview' as const, label: '总览', icon: LayoutDashboard },
    { id: 'app' as const, label: 'App 基础配置', icon: Smartphone },
    { id: 'content' as const, label: '内容管理', icon: FileText },
    { id: 'comments' as const, label: '评论管理', icon: MessageSquare },
    { id: 'users' as const, label: '用户管理', icon: Users },
    { id: 'feedback' as const, label: '用户反馈', icon: Bell },
    { id: 'reports' as const, label: '举报审核', icon: ShieldCheck },
    { id: 'appeals' as const, label: '申诉审核', icon: FileText },
    { id: 'permissions' as const, label: '权限管理', icon: SlidersHorizontal },
    { id: 'messages' as const, label: '消息管理', icon: MessageSquare },
  ];
  const bottomTabOptions = ['首页', '智能戒指', '消息', '我的', '空'];
  const rejectReasons = [
    '色情或低俗',
    '政治敏感',
    '煽动对立',
    '赌博 / 博彩',
    '引导跳转外部网站',
    '疑似欺诈',
    '种族歧视',
    '违法违规',
    '未成年人不当行为',
    '违反公序良俗',
    '危害人身安全',
    '违规营销与假冒商品',
    '辱骂与嘲讽',
    '饭圈举报集中地',
  ];
  const reviewItems = FEED_ITEMS.slice(0, 5).map((item, index) => {
    const mediaType = index === 1 ? 'video' : 'image';
    return {
      ...item,
      userId: String(100000041 + index),
      mediaType,
      body:
        `${item.description} The post includes user submitted media and should be reviewed before distribution.`,
      publishedAt: ['2026-06-15 09:12', '2026-06-15 08:30', '2026-06-14 22:18', '2026-06-12 19:45', '2026-05-28 11:06'][index],
      hasRing: index !== 2,
      ringBound: index === 0 || index === 3,
      video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      videoPoster: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.jpg',
      status: contentStatusById[item.id] || (index % 3 === 0 ? '待审核' : '已发布'),
    };
  });
  const filteredReviewItems = reviewItems.filter((item) => {
    const publishedDate = new Date(item.publishedAt.replace(' ', 'T'));
    const now = new Date('2026-06-15T23:59:59');
    const dayGap = Math.floor((now.getTime() - publishedDate.getTime()) / 86400000);
    const contentMatched = `${item.title} ${item.body}`.toLowerCase().includes(appliedFilters.content.toLowerCase());
    const authorMatched = `${item.author} ${item.userId}`.toLowerCase().includes(appliedFilters.author.toLowerCase());
    const statusMatched = appliedFilters.status === '全部' || item.status === appliedFilters.status;
    const timeMatched =
      appliedFilters.publishTime === '全部' ||
      (appliedFilters.publishTime === '今天' && item.publishedAt.startsWith('2026-06-15')) ||
      (appliedFilters.publishTime === '昨天' && item.publishedAt.startsWith('2026-06-14')) ||
      (appliedFilters.publishTime === '近7天' && dayGap <= 7) ||
      (appliedFilters.publishTime === '近30天' && dayGap <= 30);
    return contentMatched && authorMatched && statusMatched && timeMatched;
  });
  const filteredReviewIds = filteredReviewItems.map((item) => item.id);
  const selectedVisibleCount = selectedReviewIds.filter((id) => filteredReviewIds.includes(id)).length;
  const allVisibleSelected = filteredReviewIds.length > 0 && selectedVisibleCount === filteredReviewIds.length;
  const detailItem = reviewItems.find((item) => item.id === detailItemId);
  const openAdminAction = (action: string, target: string, needsReason = false) => setAdminAction({ action, target, needsReason });
  const renderActionButtons = (actions: string[], target: string) => (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button key={action} onClick={() => openAdminAction(action, target, action === '违规')} className={adminActionButton}>
          {action}
        </button>
      ))}
    </div>
  );
  const userRows = [
    ['100000041', '2026-04-21 10:12', '正常', CURRENT_USER.avatar, '女', 'iPhone 15 Pro', 12],
    ['100000042', '2026-05-03 08:44', '风险', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop', '女', 'Pixel 9', 28],
    ['100000043', '2026-05-16 19:02', '封禁', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop', '男', 'iPhone 14', 17],
  ].filter((row) => String(row[0]).includes(userKeyword) && (userStatus === '全部' || row[2] === userStatus));

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          ['活跃用户', '18,240', '+12.4%'],
          ['已发布内容', '4,821', '+8.1%'],
          ['待处理举报', '23', '-3.2%'],
          ['新增用户', '1,284', '+9.6%'],
        ].map(([label, value, meta]) => (
          <div key={label} className={`${adminCard} p-5`}>
            <p className={adminLabel}>{label}</p>
            <p className="mt-3 text-3xl font-black text-[#111827]">{value}</p>
            <p className="mt-2 text-xs font-bold text-[#6b7280]">{meta}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          ['认证用户', '6,138', '33.6%'],
          ['戒指用户', '3,902', '21.4%'],
          ['绑定情侣', '1,476', '37.8%'],
          ['7日留存', '62.4%', '+4.1%'],
          ['三方登录', '15,906', '87.2%'],
          ['邀请码登录', '2,334', '12.8%'],
          ['视频内容', '1,207', '25.0%'],
          ['图片内容', '3,614', '75.0%'],
        ].map(([label, value, meta]) => (
          <div key={label} className={`${adminCard} p-5`}>
            <p className={adminLabel}>{label}</p>
            <p className="mt-3 text-2xl font-black text-[#111827]">{value}</p>
            <p className="mt-2 text-xs font-bold text-[#6b7280]">{meta}</p>
          </div>
        ))}
      </div>
      <section className={`${adminCard} p-5`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">用户停留时长占比</h2>
          <StatusPill tone="neutral">近 7 天</StatusPill>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4">
          {[
            ['首页信息流', '86%'],
            ['智能戒指入口', '42%'],
            ['消息', '58%'],
            ['个人中心', '64%'],
            ['内容发布', '31%'],
            ['详情页查看', '73%'],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between text-sm font-black">
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div className="h-2 rounded-full bg-[#e5e7eb]">
                <div className="h-2 rounded-full bg-[#111827]" style={{ width: value }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderApp = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_1fr] gap-4">
        <section className={`${adminCard} space-y-4 p-5`}>
          <h2 className="text-lg font-black">品牌与导航</h2>
          <AdminField label="App 名称" value={appName} onChange={setAppName} />
          <AdminField label="标语" value={tagline} onChange={setTagline} />
          <AdminSelect label="默认落地页" value={primaryTab} onChange={setPrimaryTab} options={['三方登录页', '首页', '智能戒指', '消息', '我的']} />
          <AdminSelect label="登录方式" value={loginMode} onChange={setLoginMode} options={['三方登录', '三方+邀请码登录']} />
        </section>
        <section className={`${adminCard} space-y-3 p-5`}>
          <h2 className="text-lg font-black">底部 Tab 配置</h2>
          <p className="text-xs font-bold leading-relaxed text-[#6b7280]">设置 App 底部 TAB1-TAB4 分别显示的内容。</p>
          <div className="grid grid-cols-2 gap-4">
            <AdminSelect label="TAB1" value={bottomTab1} onChange={setBottomTab1} options={bottomTabOptions} />
            <AdminSelect label="TAB2" value={bottomTab2} onChange={setBottomTab2} options={bottomTabOptions} />
            <AdminSelect label="TAB3" value={bottomTab3} onChange={setBottomTab3} options={bottomTabOptions} />
            <AdminSelect label="TAB4" value={bottomTab4} onChange={setBottomTab4} options={bottomTabOptions} />
          </div>
          <div className="rounded-md border border-dashed border-[#d1d5db] bg-[#f9fafb] p-4">
            <p className={adminLabel}>当前底部导航</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[bottomTab1, bottomTab2, bottomTab3, bottomTab4].map((tab, index) => (
                <div key={`${tab}-${index}`} className="rounded-md bg-white p-3 text-center shadow-sm">
                  <p className="text-[11px] font-black text-[#6b7280]">TAB{index + 1}</p>
                  <p className="mt-1 text-sm font-black text-[#111827]">{tab}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <section className={`${adminCard} p-5`}>
        <h2 className="text-lg font-black">H5 配置</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {[
            ['隐私政策', 'https://Drcirclr.cn/privacy'],
            ['用户协议', 'https://Drcirclr.cn/terms'],
            ['平台规则', 'https://Drcirclr.cn/rules'],
            ['申诉页面', 'https://Drcirclr.cn/appeal'],
            ['反馈页面', 'https://Drcirclr.cn/feedback'],
          ].map(([label, url]) => (
            <label key={label} className="block space-y-2">
              <span className={adminLabel}>{label}</span>
              <input value={url} readOnly className={adminInput} />
            </label>
          ))}
        </div>
      </section>
      <div className="flex justify-end">
        <button onClick={() => setSaveConfirmOpen(true)} className="h-10 rounded-md bg-[#111827] px-5 text-sm font-black text-white">
          保存
        </button>
      </div>
      {saveConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/38 p-8">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-2xl">
            <h2 className="text-lg font-black">确定保存更改吗？</h2>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setSaveConfirmOpen(false)} className="h-10 rounded-md border border-[#d1d5db] px-4 text-sm font-black text-[#111827]">
                取消
              </button>
              <button onClick={() => setSaveConfirmOpen(false)} className="h-10 rounded-md bg-[#111827] px-4 text-sm font-black text-white">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => (
    <div className="space-y-4">
      <section className={`${adminCard} grid grid-cols-[1fr_1fr_180px_180px_auto] items-end gap-4 p-5`}>
        <AdminField label="按内容" value={contentFilter} onChange={setContentFilter} />
        <AdminField label="按作者 / 用户ID" value={authorFilter} onChange={setAuthorFilter} />
        <AdminSelect label="按状态" value={statusFilter} onChange={setStatusFilter} options={['全部', '待审核', '已发布', '违规']} />
        <AdminSelect label="按发布时间" value={publishTimeFilter} onChange={setPublishTimeFilter} options={['全部', '今天', '昨天', '近7天', '近30天']} />
        <button
          onClick={() => setAppliedFilters({ content: contentFilter, author: authorFilter, status: statusFilter, publishTime: publishTimeFilter })}
          className="h-10 rounded-md bg-[#111827] px-5 text-sm font-black text-white"
        >
          筛选
        </button>
      </section>

      <section className={`${adminCard} flex items-end justify-between gap-4 p-5`}>
        <div>
          <p className={adminLabel}>批量操作</p>
          <p className="mt-2 text-sm font-bold text-[#4b5563]">已选择 {selectedReviewIds.length} 条内容</p>
        </div>
        <div className="flex items-center gap-3">
          {bulkRejectOpen && (
            <AdminSelect label="批量违规原因" value={bulkRejectReason} onChange={setBulkRejectReason} options={rejectReasons} />
          )}
          <button
            disabled={selectedReviewIds.length === 0}
            onClick={() => {
              setContentStatusById((current) => {
                const next = { ...current };
                selectedReviewIds.forEach((id) => {
                  next[id] = '已发布';
                });
                return next;
              });
              setRejectingId(null);
              setBulkRejectOpen(false);
            }}
            className="h-10 rounded-md bg-[#111827] px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
          >
            批量通过
          </button>
          <button
            disabled={selectedReviewIds.length === 0}
            onClick={() => {
              if (!bulkRejectOpen) {
                setBulkRejectOpen(true);
                return;
              }
              setContentStatusById((current) => {
                const next = { ...current };
                selectedReviewIds.forEach((id) => {
                  next[id] = '违规';
                });
                return next;
              });
              setRejectReasonById((current) => {
                const next = { ...current };
                selectedReviewIds.forEach((id) => {
                  next[id] = bulkRejectReason;
                });
                return next;
              });
              setRejectingId(null);
              setBulkRejectOpen(false);
            }}
            className="h-10 rounded-md border border-[#991b1b] px-4 text-sm font-black text-[#991b1b] disabled:cursor-not-allowed disabled:border-[#d1d5db] disabled:text-[#9ca3af]"
          >
            {bulkRejectOpen ? '确认批量违规' : '批量违规'}
          </button>
        </div>
      </section>

      <div className={`${adminCard} overflow-hidden`}>
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#f9fafb] text-[11px] font-black uppercase tracking-[0.12em] text-[#6b7280]">
            <tr>
              <th className="border-b border-[#e5e7eb] px-4 py-3">
                <input
                  aria-label="全选当前列表"
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={(event) => {
                    setSelectedReviewIds((current) => {
                      const hiddenSelected = current.filter((id) => !filteredReviewIds.includes(id));
                      return event.target.checked ? [...hiddenSelected, ...filteredReviewIds] : hiddenSelected;
                    });
                  }}
                  className="h-4 w-4"
                />
              </th>
              <th className="border-b border-[#e5e7eb] px-4 py-3">内容</th>
              <th className="border-b border-[#e5e7eb] px-4 py-3">内容字段</th>
              <th className="border-b border-[#e5e7eb] px-4 py-3">作者 / 用户ID</th>
              <th className="border-b border-[#e5e7eb] px-4 py-3">发布时间</th>
              <th className="border-b border-[#e5e7eb] px-4 py-3">状态</th>
              <th className="border-b border-[#e5e7eb] px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {filteredReviewItems.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="bg-white">
                  <td className="px-4 py-3 align-middle">
                    <input
                      aria-label={`选择 ${item.title}`}
                      type="checkbox"
                      checked={selectedReviewIds.includes(item.id)}
                      onChange={(event) => {
                        setSelectedReviewIds((current) =>
                          event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id),
                        );
                      }}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <p className="font-black text-[#111827]">{item.title}</p>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <img src={item.mediaType === 'video' ? item.videoPoster : item.image} alt="" className="h-12 w-12 rounded-md object-cover" />
                      <div>
                        <StatusPill tone="neutral">{item.mediaType === 'video' ? '视频' : '图片'}</StatusPill>
                        <p className="mt-1 line-clamp-1 max-w-[260px] text-xs font-medium text-[#6b7280]">{item.body}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <UserIdentity name={item.author} userId={item.userId} hasRing={item.hasRing} ringBound={item.ringBound} />
                  </td>
                  <td className="px-4 py-3 align-middle text-xs font-bold text-[#4b5563]">{item.publishedAt}</td>
                  <td className="px-4 py-3 align-middle">
                    <StatusPill tone={item.status === '待审核' ? 'amber' : item.status === '违规' ? 'red' : 'green'}>{item.status}</StatusPill>
                    {rejectReasonById[item.id] && <p className="mt-1 text-xs font-bold text-[#991b1b]">{rejectReasonById[item.id]}</p>}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="flex flex-wrap gap-2">
                      {item.status === '已发布' ? (
                        <button
                          onClick={() => setRejectingId(rejectingId === item.id ? null : item.id)}
                          className="h-8 rounded-md border border-[#991b1b] px-3 text-xs font-black text-[#991b1b]"
                        >
                          违规
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setContentStatusById((current) => ({ ...current, [item.id]: '已发布' }));
                              setRejectingId(null);
                            }}
                            className="h-8 rounded-md bg-[#111827] px-3 text-xs font-black text-white"
                          >
                            通过
                          </button>
                          <button
                            onClick={() => setRejectingId(rejectingId === item.id ? null : item.id)}
                            className="h-8 rounded-md border border-[#d1d5db] px-3 text-xs font-black text-[#111827]"
                          >
                            违规
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setDetailItemId(item.id)}
                        className="h-8 rounded-md border border-[#d1d5db] px-3 text-xs font-black text-[#111827]"
                      >
                        详情
                      </button>
                    </div>
                  </td>
                </tr>
                {rejectingId === item.id && (
                  <tr className="bg-[#fef2f2]">
                    <td colSpan={7} className="px-4 py-4">
                      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
                        <AdminSelect
                          label="选择违规原因"
                          value={rejectReasonById[item.id] || rejectReasons[0]}
                          onChange={(value) => setRejectReasonById((current) => ({ ...current, [item.id]: value }))}
                          options={rejectReasons}
                        />
                        <button
                          onClick={() => {
                            setRejectReasonById((current) => ({ ...current, [item.id]: current[item.id] || rejectReasons[0] }));
                            setContentStatusById((current) => ({ ...current, [item.id]: '违规' }));
                            setRejectingId(null);
                          }}
                          className="h-10 rounded-md bg-[#991b1b] px-4 text-sm font-black text-white"
                        >
                          确认违规
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/38 p-8">
          <div className="max-h-[86vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#e5e7eb] bg-white px-5 py-4">
              <div>
                <p className={adminLabel}>作品详情</p>
                <h2 className="text-xl font-black">{detailItem.title}</h2>
              </div>
              <button onClick={() => setDetailItemId(null)} className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d1d5db]">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-[1fr_0.9fr] gap-5 p-5">
              <section>
                {detailItem.mediaType === 'video' ? (
                  <video src={detailItem.video} poster={detailItem.videoPoster} className="aspect-video w-full rounded-lg bg-black object-cover" controls />
                ) : (
                  <img src={detailItem.image} alt="" className="max-h-[520px] w-full rounded-lg object-cover" />
                )}
              </section>
              <section className="space-y-4">
                <div>
                  <p className={adminLabel}>作者</p>
                  <UserIdentity name={detailItem.author} userId={detailItem.userId} hasRing={detailItem.hasRing} ringBound={detailItem.ringBound} />
                </div>
                <div>
                  <p className={adminLabel}>发布时间</p>
                  <p className="mt-1 text-sm font-black">{detailItem.publishedAt}</p>
                </div>
                <div>
                  <p className={adminLabel}>内容文字</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#374151]">{detailItem.body}</p>
                </div>
                <div>
                  <p className={adminLabel}>内容类型</p>
                  <p className="mt-2 text-sm font-black">{detailItem.mediaType === 'video' ? '视频' : '图片'}</p>
                </div>
                {detailItem.mediaType === 'image' && <img src={detailItem.image} alt="" className="h-32 w-32 rounded-md object-cover" />}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <section className={`${adminCard} grid grid-cols-[1fr_180px_auto] items-end gap-4 p-5`}>
        <AdminField label="按用户ID" value={userKeyword} onChange={setUserKeyword} />
        <AdminSelect label="按状态" value={userStatus} onChange={setUserStatus} options={['全部', '正常', '封禁', '风险']} />
        <button className="h-10 rounded-md bg-[#111827] px-5 text-sm font-black text-white">筛选</button>
      </section>
      <AdminTable
        headers={['用户ID', '注册时间', '状态', '头像', '性别', '设备', '内容数', '操作']}
        rows={userRows.map(([id, time, status, avatar, gender, device, count], index) => [
          <UserIdentity userId={String(id)} hasRing={index !== 2} ringBound={index === 0} />,
          time,
          <StatusPill tone={status === '正常' ? 'green' : status === '风险' ? 'amber' : 'red'}>{status}</StatusPill>,
          <img src={String(avatar)} alt="" className="h-10 w-10 rounded-full object-cover" />,
          gender,
          device,
          count,
          renderActionButtons(status === '封禁' ? ['警告', '详情'] : ['封禁7天', '永久封禁', '警告', '详情'], String(id)),
        ])}
      />
    </div>
  );

  const renderComments = () => (
    <div className="space-y-4">
      <section className={`${adminCard} grid grid-cols-[260px_180px_auto] items-end gap-4 p-5`}>
        <AdminField label="按用户ID" value={commentKeyword} onChange={setCommentKeyword} />
        <AdminSelect label="按状态" value={commentStatus} onChange={setCommentStatus} options={['全部', '已发布', '待审核', '违规']} />
        <button className="h-10 rounded-md bg-[#111827] px-5 text-sm font-black text-white">筛选</button>
      </section>
      <AdminTable
        headers={['对应内容', '评论ID', '作者 / 用户ID', '评论内容', '状态', '操作']}
        rows={[
          ['Morning light on the desk', 'CMT-90012', <UserIdentity name="Mia Reed" userId="100000041" ringBound />, 'Nice photo, very clean mood.', <StatusPill tone="green">已发布</StatusPill>, '已发布'],
          ['A walk after work', 'CMT-90013', <UserIdentity name="Lynn Parker" userId="100000042" />, 'This looks suspicious.', <StatusPill tone="amber">待审核</StatusPill>, '待审核'],
          ['Weekend table', 'CMT-90014', <UserIdentity name="Emma Clark" userId="100000045" />, 'Spam text sample.', <StatusPill tone="red">违规</StatusPill>, '违规'],
        ]
          .filter((row) => String((row[2] as React.ReactElement).props.userId).includes(commentKeyword) && (commentStatus === '全部' || (row[4] as React.ReactElement).props.children === commentStatus))
          .map((row) => {
            const status = row[5];
            const actions = status === '待审核' ? ['通过', '违规', '详情'] : status === '已发布' ? ['违规', '详情'] : ['详情'];
            return [...row.slice(0, 5), renderActionButtons(actions, String(row[1]))];
          })}
      />
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-4">
      <section className={`${adminCard} grid grid-cols-[260px_180px_auto] items-end gap-4 p-5`}>
        <AdminField label="按用户ID" value={feedbackUserId} onChange={setFeedbackUserId} />
        <AdminSelect label="按状态" value={feedbackStatus} onChange={setFeedbackStatus} options={['全部', '已处理', '待处理', '暂不处理']} />
        <button className="h-10 w-fit rounded-md bg-[#111827] px-5 text-sm font-black text-white">筛选</button>
      </section>
      <AdminTable
        headers={['用户ID', '反馈内容', '用户名称 / 头像', '状态', '时间', '操作']}
        rows={[
          [<UserIdentity userId="100000041" ringBound />, <img src={FEED_ITEMS[0].image} alt="" className="h-12 w-12 rounded-md object-cover" />, <div className="flex items-center gap-2"><img src={CURRENT_USER.avatar} alt="" className="h-8 w-8 rounded-full" />Deer Morgan</div>, <StatusPill tone="amber">待处理</StatusPill>, '2026-06-15 12:20'],
          [<UserIdentity userId="100000042" />, <StatusPill>视频</StatusPill>, <div className="flex items-center gap-2"><img src={MESSAGES[0].avatar} alt="" className="h-8 w-8 rounded-full" />Mia Reed</div>, <StatusPill tone="green">已处理</StatusPill>, '2026-06-14 09:11'],
        ].filter((row) => String((row[0] as React.ReactElement).props.userId).includes(feedbackUserId) && (feedbackStatus === '全部' || (row[3] as React.ReactElement).props.children === feedbackStatus)).map((row) => [
          ...row,
          renderActionButtons((row[3] as React.ReactElement).props.children === '待处理' ? ['已处理', '暂不处理'] : ['详情'], String(row[0])),
        ])}
      />
    </div>
  );

  const renderReports = () => (
    <div className="space-y-4">
      <section className={`${adminCard} grid grid-cols-[260px_180px_auto] items-end gap-4 p-5`}>
        <AdminField label="按用户ID" value={reportUserId} onChange={setReportUserId} />
        <AdminSelect label="按状态" value={reportStatus} onChange={setReportStatus} options={['全部', '待处理', '已警告', '已封禁', '暂不处理']} />
        <button className="h-10 w-fit rounded-md bg-[#111827] px-5 text-sm font-black text-white">筛选</button>
      </section>
      <AdminTable
        headers={['用户', '举报类型', '举报内容 / 对象', '被举报用户', '举报时间', '状态', '操作']}
        rows={[
          [
            <UserIdentity name="Mia Reed" userId="100000041" ringBound />,
            '疑似欺诈',
            <div className="space-y-1"><p>External link in comment</p><StatusPill tone="amber">内容</StatusPill></div>,
            <UserIdentity name="Lynn Parker" userId="100000042" />,
            '2026-06-15 13:04',
            <StatusPill tone="amber">待处理</StatusPill>,
          ],
          [
            <UserIdentity name="Avery Stone" userId="100000043" hasRing={false} />,
            '辱骂与嘲讽',
            <div className="space-y-1"><p>Abusive profile behavior</p><StatusPill tone="red">用户</StatusPill></div>,
            <UserIdentity name="Emma Clark" userId="100000045" />,
            '2026-06-14 18:30',
            <StatusPill tone="green">已警告</StatusPill>,
          ],
        ].filter((row) => {
          const reporterId = String((row[0] as React.ReactElement).props.userId);
          const reportedId = String((row[3] as React.ReactElement).props.userId);
          return (reporterId.includes(reportUserId) || reportedId.includes(reportUserId)) && (reportStatus === '全部' || (row[5] as React.ReactElement).props.children === reportStatus);
        }).map((row) => [
          ...row,
          renderActionButtons((row[5] as React.ReactElement).props.children === '待处理' ? ['封禁用户', '警告用户', '下架内容', '暂不处理', '详情'] : ['详情'], '举报记录'),
        ])}
      />
    </div>
  );

  const renderAppeals = () => {
    const appealRows = [
      {
        id: '100000043',
        registeredAt: '2026-05-16 19:02',
        appeal: 'I believe this was a mistake.',
        banReason: '疑似欺诈',
        userStatus: '永久封禁',
        reviewStatus: '待处理',
        handledAt: '-',
        avatar: MESSAGES[1].avatar,
        gender: '男',
        device: 'iPhone 14',
        hasRing: false,
      },
      {
        id: '100000046',
        registeredAt: '2026-06-01 11:20',
        appeal: 'Please review my account.',
        banReason: '辱骂与嘲讽',
        userStatus: '封禁7天',
        reviewStatus: '待处理',
        handledAt: '-',
        avatar: MESSAGES[0].avatar,
        gender: '女',
        device: 'Pixel 9',
        ringBound: true,
      },
    ].map((row) => ({ ...row, ...appealStateById[row.id] }));

    const toneForUserStatus = (status: string) => (status === '永久封禁' ? 'red' : status === '正常' ? 'green' : 'amber') as 'red' | 'green' | 'amber';
    const toneForReviewStatus = (status: string) => (status === '已解封' ? 'green' : status === '已复核' ? 'red' : 'amber') as 'red' | 'green' | 'amber';
    const handledAt = '2026-06-15 18:30';

    return (
      <div className="space-y-4">
        <section className={`${adminCard} grid grid-cols-[220px_180px_180px_auto] items-end gap-4 p-5`}>
          <AdminField label="按用户ID" value={appealUserId} onChange={setAppealUserId} />
          <AdminSelect label="按用户状态" value={appealUserStatusFilter} onChange={setAppealUserStatusFilter} options={['全部', '永久封禁', '封禁7天', '正常']} />
          <AdminSelect label="按申诉状态" value={appealStatus} onChange={setAppealStatus} options={['全部', '待处理', '已复核', '已解封']} />
          <button className="h-10 w-fit rounded-md bg-[#111827] px-5 text-sm font-black text-white">筛选</button>
        </section>
        <AdminTable
          headers={['用户ID', '注册时间', '申诉内容', '封禁原因', '用户状态', '申诉状态', '处理时间', '头像', '性别', '设备', '操作']}
          rows={appealRows
            .filter((row) => row.id.includes(appealUserId) && (appealUserStatusFilter === '全部' || row.userStatus === appealUserStatusFilter) && (appealStatus === '全部' || row.reviewStatus === appealStatus))
            .map((row) => [
              <UserIdentity userId={row.id} hasRing={row.hasRing} ringBound={row.ringBound} />,
              row.registeredAt,
              row.appeal,
              row.banReason,
              <StatusPill tone={toneForUserStatus(row.userStatus)}>{row.userStatus}</StatusPill>,
              <StatusPill tone={toneForReviewStatus(row.reviewStatus)}>{row.reviewStatus}</StatusPill>,
              row.handledAt,
              <img src={row.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />,
              row.gender,
              row.device,
              <div className="flex flex-wrap gap-2">
                {row.reviewStatus === '待处理' && (
                  <>
                    <button
                      onClick={() => setAppealStateById((current) => ({ ...current, [row.id]: { userStatus: row.userStatus, reviewStatus: '已复核', handledAt } }))}
                      className={adminActionButton}
                    >
                      暂不处理
                    </button>
                    <button
                      onClick={() => setAppealStateById((current) => ({ ...current, [row.id]: { userStatus: '正常', reviewStatus: '已解封', handledAt } }))}
                      className="h-8 rounded-md bg-[#111827] px-3 text-xs font-black text-white"
                    >
                      解封
                    </button>
                  </>
                )}
                <button onClick={() => openAdminAction('详情', `申诉记录 ${row.id}`)} className={adminActionButton}>详情</button>
              </div>,
            ])}
        />
      </div>
    );
  };

  const renderPermissions = () => {
    const permissionRows = [
      ['总览', ['访问']],
      ['App 基础配置', ['访问', '保存']],
      ['内容管理', ['访问', '筛选', '通过', '违规', '详情', '批量通过', '批量违规']],
      ['评论管理', ['访问', '筛选', '通过', '违规', '详情']],
      ['用户管理', ['访问', '筛选', '封禁7天', '永久封禁', '警告', '详情']],
      ['用户反馈', ['访问', '筛选', '已处理', '暂不处理', '详情']],
      ['举报审核', ['访问', '筛选', '封禁用户', '警告用户', '下架内容', '暂不处理', '详情']],
      ['申诉审核', ['访问', '筛选', '解封', '暂不处理', '详情']],
      ['权限管理', ['访问', '创建角色', '配置菜单', '配置操作']],
      ['消息管理', ['访问', '筛选', '违规', '详情']],
    ];

    return (
      <div className="grid grid-cols-[0.8fr_1.2fr] gap-4">
        <section className={`${adminCard} space-y-4 p-5`}>
          <h2 className="text-lg font-black">角色</h2>
          <AdminField label="角色名称" value={roleName} onChange={setRoleName} />
          <AdminTable headers={['角色', '成员数', '状态']} rows={[['超级管理员', 3, <StatusPill tone="green">启用</StatusPill>], [roleName, 12, <StatusPill tone="green">启用</StatusPill>], ['客服', 8, <StatusPill>启用</StatusPill>]]} />
        </section>
        <section className={`${adminCard} p-5`}>
          <h2 className="text-lg font-black">菜单与操作权限</h2>
          <div className="mt-4 space-y-3">
            {permissionRows.map(([menu, actions]) => (
              <div key={String(menu)} className="grid grid-cols-[120px_1fr] gap-3 rounded-md border border-[#e5e7eb] px-4 py-3">
                <span className="pt-1 text-sm font-black">{menu}</span>
                <div className="flex flex-wrap gap-3">
                  {(actions as string[]).map((action) => (
                    <label key={action} className="flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-xs font-bold text-[#4b5563]">
                      <input type="checkbox" defaultChecked />
                      {action}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const renderMessages = () => (
    <div className="space-y-4">
      <section className={`${adminCard} grid grid-cols-[260px_180px_auto] items-end gap-4 p-5`}>
        <AdminField label="按用户ID" value={messageUserId} onChange={setMessageUserId} />
        <AdminSelect label="按违规类型" value={messageViolationType} onChange={setMessageViolationType} options={['全部', '政治', '低俗', '涉黄', '骚扰', '广告欺诈']} />
        <button className="h-10 w-fit rounded-md bg-[#111827] px-5 text-sm font-black text-white">筛选</button>
      </section>
      <AdminTable
        headers={['用户名 / 用户ID', '消息内容', '发送时间', '违规类型', '操作']}
        rows={[
          [<UserIdentity name="Mia Reed" userId="100000041" ringBound />, 'Please visit this external promo link.', '2026-06-15 14:20', <StatusPill tone="red">广告欺诈</StatusPill>],
          [<UserIdentity name="Lynn Parker" userId="100000042" />, 'Harassing message sample.', '2026-06-15 12:05', <StatusPill tone="amber">骚扰</StatusPill>],
          [<UserIdentity name="Avery Stone" userId="100000043" hasRing={false} />, 'Sensitive political content sample.', '2026-06-14 20:44', <StatusPill tone="red">政治</StatusPill>],
        ].filter((row) => {
          const userId = String((row[0] as React.ReactElement).props.userId);
          const violationType = String((row[3] as React.ReactElement).props.children);
          return userId.includes(messageUserId) && (messageViolationType === '全部' || violationType === messageViolationType);
        }).map((row) => [...row, renderActionButtons(['违规', '详情'], '消息记录')])}
      />
    </div>
  );

  const renderSmartRing = () => (
    <div className="grid grid-cols-[0.9fr_1.1fr] gap-4">
      <section className={`${adminCard} space-y-4 p-5`}>
        <h2 className="text-lg font-black">智能戒指占位</h2>
        <AdminToggle checked={smartRingEnabled} onChange={setSmartRingEnabled} label="展示入口" description="保持底部第二个入口为智能戒指。" />
        <AdminSelect label="上线状态" value="占位中" onChange={() => {}} options={['占位中', '内部测试', '公开测试', '已上线']} />
        <AdminField label="空状态标题" value="Smart Ring is not configured yet" onChange={() => {}} />
        <AdminField label="空状态说明" value="This section is intentionally empty until the product direction is confirmed." onChange={() => {}} />
      </section>
      <section className={`${adminCard} p-5`}>
        <h2 className="text-lg font-black">未来配置槽位</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {['设备绑定', '健康指标', '睡眠看板', '活动趋势', '固件升级', '通知同步'].map((item) => (
            <div key={item} className="rounded-md border border-dashed border-[#d1d5db] p-4">
              <p className="text-sm font-black">{item}</p>
              <p className="mt-1 text-xs font-medium text-[#6b7280]">预留</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderModeration = () => (
    <div className="grid grid-cols-[1fr_1fr] gap-4">
      <section className={`${adminCard} space-y-3 p-5`}>
        <h2 className="text-lg font-black">安全与审核</h2>
        <AdminToggle checked={true} onChange={() => {}} label="图片审核" description="内容大范围分发前先过图像审核。" />
        <AdminToggle checked={true} onChange={() => {}} label="文本审核" description="扫描标题、评论、资料等文本。" />
        <AdminToggle checked={true} onChange={() => {}} label="举报队列" description="允许用户举报内容和账号。" />
        <AdminToggle checked={false} onChange={() => {}} label="关系类举报" description="已关闭，因为关系模块已移除。" />
      </section>
      <AdminTable
        headers={['队列', '待处理', '时限', '负责人']}
        rows={[
          ['内容举报', '14', '4h', '风控团队'],
          ['账号举报', '9', '8h', '风控团队'],
          ['垃圾内容复核', '31', '24h', '运营团队'],
          ['申诉', '3', '48h', '客服团队'],
        ]}
      />
    </div>
  );

  const renderLanguage = () => (
    <div className="grid grid-cols-[0.9fr_1.1fr] gap-4">
      <section className={`${adminCard} space-y-4 p-5`}>
        <h2 className="text-lg font-black">语言策略</h2>
        <AdminSelect label="前台默认语言" value={defaultLanguage} onChange={setDefaultLanguage} options={['英文']} />
        <AdminSelect label="市场区域" value={region} onChange={setRegion} options={['全球', '美国', '新加坡', '英国']} />
        <AdminToggle checked={true} onChange={() => {}} label="前台仅英文" description="用户侧产品文案保持英文。" />
        <AdminToggle checked={true} onChange={() => {}} label="屏蔽旧玩法词" description="防止已删除的玩法词回到前台。" />
      </section>
      <section className={`${adminCard} p-5`}>
        <h2 className="text-lg font-black">前台禁用词</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {['CP', 'single mode', 'collaboration gameplay', 'points', 'credits', 'diamonds', 'virtual gifts', 'relationship binding', 'soulmate signal'].map((term) => (
            <span key={term}>
              <StatusPill tone="red">{term}</StatusPill>
            </span>
          ))}
        </div>
      </section>
    </div>
  );

  const renderActiveSection = () => {
    if (active === 'overview') return renderOverview();
    if (active === 'app') return renderApp();
    if (active === 'content') return renderContent();
    if (active === 'comments') return renderComments();
    if (active === 'users') return renderUsers();
    if (active === 'feedback') return renderFeedback();
    if (active === 'reports') return renderReports();
    if (active === 'appeals') return renderAppeals();
    if (active === 'permissions') return renderPermissions();
    if (active === 'messages') return renderMessages();
    if (active === 'smart-ring') return renderSmartRing();
    if (active === 'moderation') return renderModeration();
    if (active === 'language') return renderLanguage();
    return renderOverview();
  };

  const activeLabel = navItems.find((item) => item.id === active)?.label || '总览';

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827]">
      <aside className="fixed inset-y-0 left-0 flex w-72 flex-col border-r border-[#e5e7eb] bg-white">
        <div className="flex h-16 items-center gap-3 border-b border-[#e5e7eb] px-5">
          <Logo size={34} className="rounded-md" />
          <div>
            <p className="text-sm font-black leading-none">DRcircle 后台</p>
            <p className="mt-1 text-[11px] font-bold text-[#6b7280]">配置中心</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-black transition-colors ${
                  isActive ? 'bg-[#111827] text-white' : 'text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#111827]'
                }`}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="ml-72 min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white/92 px-8 backdrop-blur-xl">
          <div>
            <p className={adminLabel}>后台模块</p>
            <h1 className="text-xl font-black">{activeLabel}</h1>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill tone="green">旧玩法已移除</StatusPill>
            <StatusPill tone="green">前台英文</StatusPill>
          </div>
        </header>
        <div className="p-8">{renderActiveSection()}</div>
      </main>
      {adminAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/38 p-8">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl">
            <p className={adminLabel}>操作确认</p>
            <h2 className="mt-2 text-lg font-black">{adminAction.action === '详情' ? '详情' : `确定执行「${adminAction.action}」吗？`}</h2>
            <p className="mt-2 text-sm font-bold text-[#6b7280]">目标：{adminAction.target}</p>
            {adminAction.needsReason && (
              <div className="mt-4">
                <AdminSelect label="选择违规原因" value={bulkRejectReason} onChange={setBulkRejectReason} options={rejectReasons} />
              </div>
            )}
            {adminAction.action === '详情' && (
              <div className="mt-4 rounded-md bg-[#f9fafb] p-4 text-sm font-medium leading-relaxed text-[#374151]">
                展示该记录的完整内容、用户信息、处理记录和相关媒体。
              </div>
            )}
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setAdminAction(null)} className="h-10 rounded-md border border-[#d1d5db] px-4 text-sm font-black text-[#111827]">
                取消
              </button>
              <button onClick={() => setAdminAction(null)} className="h-10 rounded-md bg-[#111827] px-4 text-sm font-black text-white">
                {adminAction.action === '详情' ? '关闭' : '确认'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BottomNav({
  active,
  setScreen,
}: {
  active: Screen;
  setScreen: (screen: Screen) => void;
}) {
  const items = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'smart-ring' as const, label: 'Smart Ring', icon: ShieldCheck },
    { id: 'messages' as const, label: 'Messages', icon: MessageCircle },
    { id: 'me' as const, label: 'Me', icon: UserIcon },
  ];

  return (
    <nav className="absolute inset-x-0 bottom-0 z-50 flex h-[96px] items-center justify-around border-t border-[#e8dfd2] bg-[#f7f3ec]/96 px-4 pb-6 shadow-[0_-10px_30px_rgba(99,77,56,0.08)] backdrop-blur-xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`flex h-14 min-w-16 flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
              isActive ? 'text-[#241f1b]' : 'text-[#a79584]'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.6 : 2} />
            <span className="text-[10px] font-black">{item.label}</span>
            {isActive && <span className="h-1 w-1 rounded-full bg-[#241f1b]" />}
          </button>
        );
      })}
    </nav>
  );
}

function EmptyState({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-7 text-center">
      <div className="max-w-[280px]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#6f6256] shadow-sm">
          {icon}
        </div>
        <h2 className="mt-5 text-2xl font-black tracking-tight">{title}</h2>
        <p className="mt-3 text-sm font-bold leading-relaxed text-[#8f7f6d]">{body}</p>
      </div>
    </div>
  );
}

function HomeScreen({
  openItem,
}: {
  openItem: (item: FeedItem) => void;
}) {
  const featured = FEED_ITEMS[0];

  return (
    <div className={pageRoot}>
      <header className="sticky top-0 z-30 bg-[#f7f3ec]/94 px-5 pb-3 pt-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9b8a79]">DRcircle</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight">Today</h1>
          </div>
          <button className={iconButton} aria-label="Notifications">
            <Bell size={19} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-2 no-scrollbar">
        <button
          onClick={() => openItem(featured)}
          className="relative h-48 w-full overflow-hidden rounded-[22px] bg-black text-left shadow-[0_18px_38px_rgba(47,38,29,0.16)] active:scale-[0.99] transition-transform"
        >
          <img src={featured.image} alt="" className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <span className="rounded-full bg-white/16 px-3 py-1 text-[10px] font-black backdrop-blur-md">Featured</span>
            <h2 className="mt-3 text-2xl font-black leading-tight">{featured.title}</h2>
            <p className="mt-1 text-xs font-bold text-white/70">{featured.description}</p>
          </div>
        </button>

        <section className="mt-5 grid grid-cols-2 gap-3">
          {FEED_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => openItem(item)}
              className="overflow-hidden rounded-[18px] border border-[#eadfce] bg-white text-left shadow-[0_10px_26px_rgba(103,81,58,0.08)] active:scale-[0.98] transition-transform"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#eadfce]">
                <img src={item.image} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-black/52 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur-md">
                  {item.category}
                </span>
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-[13px] font-black leading-snug">{item.title}</h3>
                <p className="mt-2 truncate text-[10px] font-bold text-[#8f7f6d]">{item.location}</p>
              </div>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}

function ContentDetailScreen({
  item,
  setScreen,
}: {
  item: FeedItem;
  setScreen: (screen: Screen) => void;
}) {
  return (
    <div className="flex h-full flex-col bg-[#fffaf4] pt-8 text-[#241f1b]">
      <header className={headerRoot}>
        <button onClick={() => setScreen('home')} className={iconButton} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h2 className="truncate text-sm font-black">{item.category}</h2>
        <button className={iconButton} aria-label="More">
          <MoreHorizontal size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-8 no-scrollbar">
        <section className="bg-black">
          <img src={item.image} alt="" className="max-h-[520px] w-full object-cover" />
        </section>
        <section className="space-y-5 px-5 py-5">
          <div>
            <h1 className="text-2xl font-black leading-tight">{item.title}</h1>
            <p className="mt-2 text-sm font-bold leading-relaxed text-[#6f6256]">{item.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[item.category, item.location, item.author].map((tag) => (
              <span key={tag} className="rounded-full bg-[#f2e8dc] px-3 py-1 text-[11px] font-black text-[#8f7f6d]">
                {tag}
              </span>
            ))}
          </div>
          <button className={primaryButton}>Save</button>
        </section>
      </main>
    </div>
  );
}

function SmartRingPlaceholder() {
  return (
    <div className={pageRoot}>
      <header className={headerRoot}>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9b8a79]">Module</p>
          <h1 className="text-xl font-black">Smart Ring</h1>
        </div>
        <button className={iconButton} aria-label="Settings">
          <Settings size={19} />
        </button>
      </header>
      <EmptyState
        icon={<ShieldCheck size={30} />}
        title="Smart Ring is not configured yet"
        body="This section is intentionally empty until the product direction is confirmed."
      />
    </div>
  );
}

function MessagesScreen({
  openThread,
}: {
  openThread: (thread: MessageThread) => void;
}) {
  return (
    <div className={pageRoot}>
      <header className={headerRoot}>
        <h1 className="text-xl font-black">Messages</h1>
        <button className={iconButton} aria-label="Search">
          <Search size={19} />
        </button>
      </header>
      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-4 no-scrollbar">
        <div className="space-y-3">
          {MESSAGES.map((thread) => (
            <button
              key={thread.id}
              onClick={() => openThread(thread)}
              className="flex w-full items-center gap-3 rounded-[18px] border border-[#eadfce] bg-white p-4 text-left shadow-sm active:scale-[0.99] transition-transform"
            >
              <img src={thread.avatar} alt="" className="h-12 w-12 rounded-full bg-[#f6ede3] object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate text-sm font-black">{thread.name}</h3>
                  <span className="text-[10px] font-bold text-[#a79584]">{thread.time}</span>
                </div>
                <p className="mt-1 truncate text-xs font-bold text-[#8f7f6d]">{thread.lastMessage}</p>
              </div>
              {thread.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#241f1b] px-1 text-[10px] font-black text-white">
                  {thread.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

function ChatScreen({
  thread,
  setScreen,
}: {
  thread: MessageThread;
  setScreen: (screen: Screen) => void;
}) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'other', text: thread.lastMessage, time: thread.time },
    { id: 2, sender: 'me', text: 'Thanks for the update.', time: '09:42' },
  ]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'me', text, time: 'Now' }]);
    setDraft('');
  };

  return (
    <div className="flex h-full flex-col bg-[#f7f7f7] pt-8 text-[#161616]">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#f7f7f7]/96 px-5 py-4 backdrop-blur-xl">
        <button onClick={() => setScreen('messages')} className={iconButton} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-black">{thread.name}</h1>
        <button className={iconButton} aria-label="More">
          <MoreHorizontal size={20} />
        </button>
      </header>

      <main className="flex-1 space-y-4 overflow-y-auto px-4 py-4 no-scrollbar">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-2.5 ${message.sender === 'me' ? 'flex-row-reverse' : ''}`}>
            <img
              src={message.sender === 'me' ? CURRENT_USER.avatar : thread.avatar}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full bg-white object-cover"
            />
            <div
              className={`max-w-[72%] rounded-[16px] px-3.5 py-2.5 text-sm font-medium shadow-sm ${
                message.sender === 'me' ? 'rounded-tr-[4px] bg-[#241f1b] text-white' : 'rounded-tl-[4px] bg-white text-[#161616]'
              }`}
            >
              <p>{message.text}</p>
              <span className={`mt-1 block text-right text-[9px] font-bold ${message.sender === 'me' ? 'text-white/55' : 'text-[#a1a1a1]'}`}>
                {message.time}
              </span>
            </div>
          </div>
        ))}
      </main>

      <footer className="border-t border-[#ececec] bg-[#f7f7f7]/96 px-3 pb-6 pt-2 backdrop-blur-xl">
        <div className="flex h-12 items-center gap-2 rounded-[20px] bg-white px-2 shadow-sm">
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-[#7d6f61]" aria-label="Add">
            <Plus size={22} />
          </button>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && send()}
            placeholder={`Message ${thread.name}`}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[#a5a5a5]"
          />
          <button onClick={send} className="h-9 rounded-full bg-[#241f1b] px-4 text-xs font-black text-white">
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

function MeScreen({
  profile,
  setScreen,
}: {
  profile: User;
  setScreen: (screen: Screen) => void;
}) {
  return (
    <div className={pageRoot}>
      <header className="absolute left-0 right-0 top-8 z-30 flex justify-end gap-2 px-7 py-3">
        <button onClick={() => setScreen('settings')} className={iconButton} aria-label="Settings">
          <Settings size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-16 no-scrollbar">
        <section className="rounded-[28px] bg-white p-5 shadow-[0_16px_36px_rgba(103,81,58,0.08)]">
          <button onClick={() => setScreen('profile')} className="flex w-full items-center gap-4 text-left">
            <img src={profile.avatar} alt="" className="h-20 w-20 rounded-full object-cover shadow-sm" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-black">{profile.name}</h1>
              <p className="mt-1 text-sm font-bold text-[#8f7f6d]">@{profile.handle}</p>
              <p className="mt-2 line-clamp-2 text-xs font-bold leading-relaxed text-[#6f6256]">{profile.bio}</p>
            </div>
            <ChevronRight size={18} className="text-[#b0a08e]" />
          </button>
        </section>

        <section className="mt-4 grid grid-cols-3 gap-3">
          {[
            ['Posts', profile.posts.toString()],
            ['Following', profile.following.toLocaleString()],
            ['Followers', profile.followers.toLocaleString()],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[18px] bg-white p-4 text-center shadow-sm">
              <p className="text-lg font-black">{value}</p>
              <p className="mt-1 text-[10px] font-bold text-[#8f7f6d]">{label}</p>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm">
          <h2 className="text-sm font-black">Open Sections</h2>
          <div className="mt-3 space-y-2">
            {[
              { label: 'Profile', screen: 'profile' as const },
              { label: 'Reserved Space', screen: 'reserved-space' as const },
              { label: 'Settings', screen: 'settings' as const },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setScreen(item.screen)}
                className="flex h-12 w-full items-center justify-between rounded-xl bg-[#f8f1e8] px-4 text-sm font-black active:scale-[0.99] transition-transform"
              >
                {item.label}
                <ChevronRight size={16} className="text-[#b0a08e]" />
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ReservedSpacePlaceholder({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  return (
    <div className={pageRoot}>
      <header className={headerRoot}>
        <button onClick={() => setScreen('me')} className={iconButton} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black">Reserved Space</h1>
        <div className="h-10 w-10" />
      </header>
      <EmptyState
        icon={<Home size={30} />}
        title="This section is not defined yet"
        body="The space is intentionally empty until the next version of this feature is decided."
      />
    </div>
  );
}

function ProfileScreen({
  profile,
  setProfile,
  setScreen,
  showToast,
}: {
  profile: User;
  setProfile: (profile: User) => void;
  setScreen: (screen: Screen) => void;
  showToast: (message: string) => void;
}) {
  const [draft, setDraft] = useState(profile);

  const save = () => {
    setProfile(draft);
    showToast('Profile saved');
    setScreen('me');
  };

  return (
    <div className={pageRoot}>
      <header className={headerRoot}>
        <button onClick={() => setScreen('me')} className={iconButton} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black">Profile</h1>
        <button onClick={save} className={primaryButton}>
          Save
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-6 no-scrollbar">
        <section className="space-y-4 rounded-[24px] bg-white p-5 shadow-sm">
          <label className="block space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#9b8a79]">Name</span>
            <input
              value={draft.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              className="h-12 w-full rounded-xl bg-[#f8f1e8] px-4 text-sm font-bold outline-none"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#9b8a79]">Handle</span>
            <input
              value={draft.handle}
              onChange={(event) => setDraft((prev) => ({ ...prev, handle: event.target.value.replace(/^@/, '') }))}
              className="h-12 w-full rounded-xl bg-[#f8f1e8] px-4 text-sm font-bold outline-none"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#9b8a79]">Bio</span>
            <textarea
              value={draft.bio}
              onChange={(event) => setDraft((prev) => ({ ...prev, bio: event.target.value }))}
              className="min-h-[112px] w-full resize-none rounded-xl bg-[#f8f1e8] px-4 py-3 text-sm font-bold leading-relaxed outline-none"
            />
          </label>
        </section>
      </main>
    </div>
  );
}

function SettingsScreen({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) {
  return (
    <div className={pageRoot}>
      <header className={headerRoot}>
        <button onClick={() => setScreen('me')} className={iconButton} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black">Settings</h1>
        <div className="h-10 w-10" />
      </header>
      <main className="flex-1 overflow-y-auto px-5 py-5 no-scrollbar">
        <section className="space-y-2 rounded-[24px] bg-white p-3 shadow-sm">
          {['Account', 'Privacy', 'Notifications', 'Help'].map((item) => (
            <button key={item} className="flex h-12 w-full items-center justify-between rounded-xl px-3 text-sm font-black active:bg-[#f8f1e8]">
              {item}
              <ChevronRight size={16} className="text-[#b0a08e]" />
            </button>
          ))}
        </section>
        <button className={`${mutedButton} mt-5 w-full text-rose-500`}>Log Out</button>
      </main>
    </div>
  );
}

export default function App() {
  const isAdminRoute = window.location.pathname.includes('/admin');
  const [screen, setScreen] = useState<Screen>('home');
  const [profile, setProfile] = useState<User>(CURRENT_USER);
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.body.dataset.appReady = '1';
    return () => {
      delete document.body.dataset.appReady;
    };
  }, []);

  const visibleBottomNav = useMemo(() => ['home', 'smart-ring', 'messages', 'me'].includes(screen), [screen]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  const openItem = (item: FeedItem) => {
    setSelectedItem(item);
    setScreen('content-detail');
  };

  const openThread = (thread: MessageThread) => {
    setSelectedThread(thread);
    setScreen('chat');
  };

  const renderScreen = () => {
    if (screen === 'home') return <HomeScreen openItem={openItem} />;
    if (screen === 'smart-ring') return <SmartRingPlaceholder />;
    if (screen === 'messages') return <MessagesScreen openThread={openThread} />;
    if (screen === 'me') return <MeScreen profile={profile} setScreen={setScreen} />;
    if (screen === 'content-detail' && selectedItem) return <ContentDetailScreen item={selectedItem} setScreen={setScreen} />;
    if (screen === 'chat' && selectedThread) return <ChatScreen thread={selectedThread} setScreen={setScreen} />;
    if (screen === 'reserved-space') return <ReservedSpacePlaceholder setScreen={setScreen} />;
    if (screen === 'profile') return <ProfileScreen profile={profile} setProfile={setProfile} setScreen={setScreen} showToast={showToast} />;
    if (screen === 'settings') return <SettingsScreen setScreen={setScreen} />;
    return <HomeScreen openItem={openItem} />;
  };

  if (isAdminRoute) {
    return <AdminAppShell />;
  }

  return (
    <div className="mx-auto my-4 h-[874px] max-w-[402px] overflow-hidden rounded-[44px] border-[8px] border-[#f5f5f5] bg-[#f7f3ec] font-sans shadow-[0_0_120px_rgba(0,0,0,0.15)]">
      <div className="absolute top-0 inset-x-0 z-[100] mx-auto flex h-10 max-w-[402px] items-center justify-between px-10 pointer-events-none">
        <span className="mt-3 text-[13px] font-black tracking-tight text-[#4f3d2d]">9:41</span>
        <div className="mt-3 h-[30px] w-[110px] rounded-full bg-[#111] shadow-2xl" />
        <div className="mt-3 h-2.5 w-5 rounded-[3px] bg-[#ded2c4] ring-1 ring-[#cdbdab]">
          <div className="h-full w-3/4 rounded-[3px] bg-[#4f3d2d]" />
        </div>
      </div>

      <div className="relative h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.22 }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        {visibleBottomNav && <BottomNav active={screen} setScreen={setScreen} />}

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-1/2 top-1/2 z-[150] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/80 px-6 py-4 text-xs font-bold text-white shadow-2xl backdrop-blur-md"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

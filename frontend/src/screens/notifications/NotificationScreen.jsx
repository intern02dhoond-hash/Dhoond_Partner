import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Briefcase,
  Banknote,
  Star,
  CircleCheck,
  ShieldCheck,
  Wallet,
  MapPin,
  Bell,
} from 'lucide-react-native';

/* ─── Design tokens ─── */
const COLORS = {
  primary: '#2F6BFF',
  primaryLight: '#EDF3FF',
  primaryBorder: 'rgba(47,107,255,0.2)',
  primaryDark: '#1D4ED8',

  success: '#16A34A',
  successLight: '#ECFDF3',

  warning: '#D97706',
  warningLight: '#FFF8E8',

  purple: '#7C3AED',
  purpleLight: '#F3EEFF',

  textPrimary: '#0B1220',
  textSecondary: '#475569',
  textMuted: '#8A94A7',

  white: '#FFFFFF',
  background: '#F4F7FC',
  surfaceAlt: '#EFF3FA',
  border: 'rgba(11,18,32,0.08)',
  borderMed: 'rgba(11,18,32,0.14)',
  shadow: 'rgba(11,18,32,0.12)',

  danger: '#DC2626',
  dangerLight: '#FEF2F2',

  unreadBg: '#EEF4FF',
  unreadBorder: 'rgba(47,107,255,0.22)',
};

/* ─── Responsive helpers ─── */
const { width: W } = Dimensions.get('window');
const isTablet = W >= 600;
const isSmall = W < 375;
const ANDROID_TOP_INSET = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;

const rem = (base) => {
  if (isSmall) return base * 0.9;
  if (isTablet) return base * 1.1;
  return base;
};

/* ─── Notification type → icon config ─── */
const ICON_CONFIG = {
  job_request:    { Icon: Briefcase,   bg: COLORS.primaryLight, color: COLORS.primary   },
  payout_settled: { Icon: Banknote,    bg: COLORS.warningLight, color: COLORS.warning   },
  review:         { Icon: Star,        bg: COLORS.warningLight, color: COLORS.warning   },
  job_completed:  { Icon: CircleCheck, bg: COLORS.successLight, color: COLORS.success   },
  verification:   { Icon: ShieldCheck, bg: COLORS.purpleLight,  color: COLORS.purple    },
  payout_summary: { Icon: Wallet,      bg: COLORS.primaryLight, color: COLORS.primary   },
  service_area:   { Icon: MapPin,      bg: COLORS.surfaceAlt,   color: COLORS.textSecondary },
  general:        { Icon: Bell,        bg: COLORS.surfaceAlt,   color: COLORS.textSecondary },
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'payments', label: 'Payments' },
  { key: 'reviews', label: 'Reviews' },
];

const TYPE_TO_TAB = {
  job_request: 'jobs',
  job_completed: 'jobs',
  payout_settled: 'payments',
  payout_summary: 'payments',
  review: 'reviews',
};

/* ─── Demo data ─── */
const INITIAL_NOTIFICATIONS = [
  { id: '1', type: 'job_request',    title: 'New job request',               body: 'AC Service Jet + Foam · ₹569 · Koramangala',                            time: '4:14 pm',  section: 'TODAY',      read: false },
  { id: '2', type: 'payout_settled', title: 'Payout settled',                body: '₹2,418 credited to your bank account · 5 jobs',                         time: '2:14 pm',  section: 'TODAY',      read: false },
  { id: '3', type: 'review',         title: 'New 5-star review',             body: '"Quick and very professional, will book again." — Manoj V.',             time: '10:14 am', section: 'TODAY',      read: false },
  { id: '4', type: 'job_completed',  title: 'Job completed',                 body: "Refrigerator Repair · ₹749 added to today's earnings",                   time: '27 Apr',   section: 'YESTERDAY',  read: true  },
  { id: '5', type: 'verification',   title: 'Aadhaar verification approved', body: "Your documents have cleared review. You're fully verified.",              time: '27 Apr',   section: 'YESTERDAY',  read: true  },
  { id: '6', type: 'payout_summary', title: 'Weekly payout summary',        body: 'You earned ₹6,210 last week from 9 completed jobs.',                      time: '25 Apr',   section: '3 DAYS AGO', read: true  },
  { id: '7', type: 'service_area',   title: 'New service area added',       body: 'You can now accept jobs in Whitefield & Marathahalli.',                   time: '23 Apr',   section: '5 DAYS AGO', read: true  },
];

/* ─── Group by section ─── */
function groupBySection(notifications) {
  const order = [];
  const map = {};
  notifications.forEach((n) => {
    if (!map[n.section]) {
      map[n.section] = [];
      order.push(n.section);
    }
    map[n.section].push(n);
  });
  return order.map((s) => ({ title: s, data: map[s] }));
}

/* ─── Unread badge ─── */
const UnreadBadge = ({ count }) => {
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

/* ─── Single notification row ─── */
const NotificationItem = React.memo(({ item, onPress }) => {
  const cfg = ICON_CONFIG[item.type] || ICON_CONFIG.general;
  const { Icon, bg, color } = cfg;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(item.id)}
      style={[styles.card, !item.read && styles.cardUnread]}
    >
      {/* Unread left accent bar */}
      {!item.read && <View style={styles.accentBar} />}

      {/* Icon pill */}
      <View style={[styles.iconWrap, { backgroundColor: bg }]}>
        <Icon color={color} size={rem(18)} strokeWidth={1.8} />
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text
            style={[styles.cardTitle, !item.read && styles.cardTitleUnread]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.cardTime}>{item.time}</Text>
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.body}
        </Text>
      </View>

      {/* Unread dot */}
      {!item.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );
});

/* ═══════════════════════════════════════════
   Main Screen
   ═══════════════════════════════════════════ */
export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => TYPE_TO_TAB[n.type] === activeTab);
  }, [activeTab, notifications]);

  const sections = useMemo(
    () => groupBySection(filteredNotifications),
    [filteredNotifications],
  );

  const markRead = useCallback((id) => {
    setNotifications((prev) => {
      let changed = false;
      const next = prev.map((n) => {
        if (n.id === id && !n.read) {
          changed = true;
          return { ...n, read: true };
        }
        return n;
      });
      return changed ? next : prev;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const hasUnread = prev.some((n) => !n.read);
      if (!hasUnread) return prev;
      return prev.map((n) => (n.read ? n : { ...n, read: true }));
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft color={COLORS.textPrimary} size={rem(20)} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <UnreadBadge count={unreadCount} />
        </View>

        {unreadCount > 0 ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={markAllRead}
            style={styles.markAllBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerPlaceholder} />
        )}
      </View>

      {/* ── Notification list ── */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === 'ios'}
        overScrollMode="never"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={(
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsWrap}
            bounces={false}
          >
            {FILTER_TABS.map((item) => {
              const active = item.key === activeTab;
              return (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.75}
                  onPress={() => setActiveTab(item.key)}
                  style={[styles.tabBtn, active && styles.tabBtnActive]}
                >
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
        ListFooterComponent={<View style={styles.bottomSpace} />}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            <View style={styles.sectionLine} />
          </View>
        )}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={markRead} />
        )}
      />
    </SafeAreaView>
  );
}

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */
const HORIZ = isTablet ? 24 : isSmall ? 12 : 16;
const MAX_W = isTablet ? 640 : undefined;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: ANDROID_TOP_INSET,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingVertical: rem(14),
    paddingHorizontal: HORIZ,
    minHeight: rem(66),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  backBtn: {
    width: rem(38),
    height: rem(38),
    borderRadius: rem(12),
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: rem(18),
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  headerPlaceholder: {
    width: rem(80),
  },

  /* ── Badge ── */
  badge: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: rem(11),
    fontWeight: '700',
    color: COLORS.danger,
    letterSpacing: 0.1,
  },

  /* ── Mark all ── */
  markAllBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    minWidth: rem(80),
    alignItems: 'flex-end',
  },
  markAllText: {
    fontSize: rem(14),
    fontWeight: '600',
    color: COLORS.primaryDark,
  },

  /* ── Tabs ── */
  tabsWrap: {
    paddingHorizontal: HORIZ,
    paddingTop: rem(12),
    paddingBottom: rem(6),
    gap: 10,
  },
  tabBtn: {
    height: rem(38),
    paddingHorizontal: rem(16),
    borderRadius: rem(18),
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderMed,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: rem(13),
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },

  /* ── List ── */
  listContent: {
    paddingHorizontal: HORIZ,
    paddingTop: 0,
    maxWidth: MAX_W,
    alignSelf: isTablet ? 'center' : undefined,
    width: isTablet ? '100%' : undefined,
    flexGrow: 1,
  },

  /* ── Section row ── */
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rem(12),
    marginBottom: rem(10),
    gap: 10,
  },
  sectionLabel: {
    fontSize: rem(10),
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.0,
  },
  sectionLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },

  /* ── Card ── */
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    borderRadius: rem(16),
    padding: rem(13),
    paddingLeft: rem(13),
    marginBottom: rem(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 2,
    minHeight: rem(70), // ensures comfortable tap target
  },
  cardUnread: {
    backgroundColor: COLORS.unreadBg,
    borderColor: COLORS.unreadBorder,
  },

  /* ── Unread accent bar ── */
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3.5,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: rem(16),
    borderBottomLeftRadius: rem(16),
  },

  /* ── Icon wrap ── */
  iconWrap: {
    width: rem(42),
    height: rem(42),
    borderRadius: rem(13),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rem(12),
    marginTop: 1,
    flexShrink: 0,
  },

  /* ── Card content ── */
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: rem(4),
    gap: 8,
  },
  cardTitle: {
    fontSize: rem(14),
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: rem(20),
  },
  cardTitleUnread: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardTime: {
    fontSize: rem(11),
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 2,
    flexShrink: 0,
  },
  cardDesc: {
    fontSize: rem(13),
    color: COLORS.textSecondary,
    lineHeight: rem(19),
  },

  /* ── Unread dot ── */
  dot: {
    width: rem(7),
    height: rem(7),
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: rem(8),
    marginLeft: rem(8),
    flexShrink: 0,
  },
  bottomSpace: {
    height: rem(28),
  },
});
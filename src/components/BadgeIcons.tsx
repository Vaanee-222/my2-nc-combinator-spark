import {
  Award, Rocket, Layers, Tag, Gift, Users, Handshake, GraduationCap, TrendingUp,
  CalendarCheck, Medal, Sparkles, Star, Zap, Crown, type LucideIcon,
} from "lucide-react";

export const BADGE_ICONS: Record<string, LucideIcon> = {
  rocket: Rocket, layers: Layers, tag: Tag, gift: Gift, users: Users, handshake: Handshake,
  "graduation-cap": GraduationCap, "trending-up": TrendingUp, "calendar-check": CalendarCheck,
  medal: Medal, sparkles: Sparkles, star: Star, zap: Zap, crown: Crown, award: Award,
};

export const badgeIcon = (key?: string): LucideIcon => BADGE_ICONS[key ?? ""] ?? Award;

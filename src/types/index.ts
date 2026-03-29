/**
 * 「走地」全局 TypeScript 类型定义
 * 与 Prisma Schema 对应，用于 API 响应和前端组件
 */

// ─────────────────────────────────────────────
// 基础枚举
// ─────────────────────────────────────────────

export type Scene = "date" | "kids" | "citywalk";
export type DurationType = "short" | "half" | "full";
export type WeatherType = "sunny" | "rainy" | "both";
export type RouteStatus = "draft" | "published" | "archived";
export type TransportMode = "walk" | "bus" | "drive" | "subway";

// ─────────────────────────────────────────────
// 路线筛选参数（PRD 9.3）
// ─────────────────────────────────────────────
export interface RouteFilter {
  scene?: Scene;
  duration?: DurationType;
  budget?: "50" | "100" | "200" | "unlimited";
  weather?: WeatherType;
  kidAge?: "0-2" | "2-4" | "4-8";
  tags?: string[];            // 多选特色标签
  city?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "newest" | "rating" | "favorites";
}

// ─────────────────────────────────────────────
// 路线卡片（列表展示）
// ─────────────────────────────────────────────
export interface RouteCard {
  id: string;
  title: string;
  subtitle: string | null;
  scene: Scene;
  city: string;
  duration_type: DurationType;
  duration_minutes: number;
  budget_per_person: number | null;
  cover_image_url: string | null;
  avg_rating: number;
  favorite_count: number;
  stop_count: number;
  weather_type: WeatherType;
  is_featured: boolean;
  tags: TagItem[];
  // 用户状态（需登录）
  is_favorited?: boolean;
}

// ─────────────────────────────────────────────
// 路线详情（PRD 9.2）
// ─────────────────────────────────────────────
export interface RouteDetail extends RouteCard {
  description: string | null;
  highlights: string[];
  tips: string[];
  rainy_alternative: string | null;
  suggested_start_time: string | null;
  fit_for: string[];
  not_fit_for: string[];
  risk_notes: string[];
  // 遛娃专属
  kid_age_min: number | null;
  kid_age_max: number | null;
  stroller_friendly: boolean;
  has_restroom: boolean;
  has_nursing_room: boolean;
  has_parking: boolean;
  has_dining: boolean;
  // 站点列表
  steps: RouteStepDetail[];
  // 图片
  images: RouteImageItem[];
  published_at: string | null;
  status?: RouteStatus;
  view_count?: number;
}

// ─────────────────────────────────────────────
// 路线站点
// ─────────────────────────────────────────────
export interface RouteStepDetail {
  id: string;
  sequence_order: number;
  poi_name: string | null;
  stay_duration: number | null;
  activity_tips: string | null;
  photo_spots: string | null;
  transport_to_next: TransportMode | null;
  distance_to_next: number | null;
  time_to_next: number | null;
  transport_tips: string | null;
  poi: PoiBasic | null;
}

// ─────────────────────────────────────────────
// POI 点位
// ─────────────────────────────────────────────
export interface PoiBasic {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
  cover_image_url: string | null;
  avg_cost: number | null;
  has_parking: boolean;
  has_restroom: boolean;
  is_accessible: boolean;
  amap_id: string | null;
}

export interface PoiDetail extends PoiBasic {
  opening_hours: Record<string, string> | string | null;
  phone: string | null;
  website: string | null;
}

// ─────────────────────────────────────────────
// 标签
// ─────────────────────────────────────────────
export interface TagItem {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
}

// ─────────────────────────────────────────────
// 图片
// ─────────────────────────────────────────────
export interface RouteImageItem {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  is_cover: boolean;
}

// ─────────────────────────────────────────────
// 用户
// ─────────────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string | null;
  nickname: string | null;
  avatar_url: string | null;
  city: string | null;
  is_admin: boolean;
  created_at: string;
  preferences: UserPreferencesData | null;
}

export interface UserPreferencesData {
  primary_scene: Scene | null;
  budget_level: "low" | "medium" | "high" | null;
  kid_age_min: number | null;
  kid_age_max: number | null;
  prefer_duration: DurationType | null;
}

// ─────────────────────────────────────────────
// 收藏
// ─────────────────────────────────────────────
export interface FavoriteItem {
  id: string;
  route: RouteCard;
  created_at: string;
}

// ─────────────────────────────────────────────
// 管理后台 - 路线表单
// ─────────────────────────────────────────────
export interface RouteFormData {
  title: string;
  subtitle?: string;
  scene: Scene;
  city: string;
  duration_type: DurationType;
  duration_minutes: number;
  budget_min?: number;
  budget_max?: number;
  budget_per_person?: number;
  weather_type: WeatherType;
  best_season?: string;
  description?: string;
  highlights?: string[];
  tips?: string[];
  rainy_alternative?: string;
  suggested_start_time?: string;
  fit_for?: string[];
  not_fit_for?: string[];
  risk_notes?: string[];
  is_featured?: boolean;
  // 遛娃专属
  kid_age_min?: number;
  kid_age_max?: number;
  stroller_friendly?: boolean;
  has_restroom?: boolean;
  has_nursing_room?: boolean;
  has_parking?: boolean;
  has_dining?: boolean;
  // 关联
  tagIds?: string[];
}

// ─────────────────────────────────────────────
// 管理后台 - AI 草稿
// ─────────────────────────────────────────────
export interface AiDraftItem {
  id: string;
  status: "draft" | "reviewed" | "published" | "rejected";
  model_name: string;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────
// 搜索
// ─────────────────────────────────────────────
export interface SearchResult {
  routes: RouteCard[];
  total: number;
  query: string;
}

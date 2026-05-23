export interface Influencer {
  id: string;
  username: string;
  display_name?: string;
  platform: string;
  tier: string;
  niche?: string;
  bio?: string;
  profile_url?: string;
  avatar_url?: string;
  embed_url?: string;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  avg_views?: number;
  avg_likes?: number;
  avg_comments?: number;
  engagement_rate?: number;
  growth_rate?: number;
  kalodata_id?: string;
  kolid_id?: string;
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsData {
  followers_history: { date: string; followers: number }[];
  engagement_history: { date: string; rate: number }[];
  views_history: { date: string; views: number }[];
}

export interface DashboardStats {
  totalInfluencers: number;
  avgEngagement: number;
  topTierCount: number;
  syncedToday: number;
}

export interface SearchResult {
  id: string;
  username: string;
  display_name?: string;
  platform: string;
  tier: string;
  followers_count?: number;
  engagement_rate?: number;
}

export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter';
export type Tier = 'mega' | 'macro' | 'micro' | 'nano';
export type SortField = 'followers_count' | 'engagement_rate' | 'avg_views' | 'growth_rate';
export type SortOrder = 'asc' | 'desc';

export interface InfluencerFilters {
  search: string;
  platform: string;
  tier: string;
  niche: string;
  sortBy: SortField;
  order: SortOrder;
  page: number;
  limit: number;
}

/**
 * KOL.ID Partner API Service
 * Access through official partner program at: https://kol.id
 * Supports: TikTok, Instagram, YouTube
 * API uses official social media API integrations authorized by users
 */
import axios, { AxiosInstance } from 'axios';

const KOLID_BASE = process.env.KOLID_BASE_URL || 'https://api.kol.id/v1';

const client: AxiosInstance = axios.create({
  baseURL: KOLID_BASE,
  headers: {
    'Authorization': `Bearer ${process.env.KOLID_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

export const getInfluencerList = async (params: {
  platform?: string;
  category?: string;
  followerMin?: number;
  followerMax?: number;
  engagementMin?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
}) => {
  const res = await client.get('/influencers', { params });
  return res.data;
};

export const getInfluencerProfile = async (influencerId: string) => {
  const res = await client.get(`/influencers/${influencerId}`);
  return res.data;
};

export const getInfluencerContent = async (influencerId: string, platform?: string) => {
  const res = await client.get(`/influencers/${influencerId}/content`, {
    params: { platform },
  });
  return res.data;
};

export const getInfluencerRateCard = async (influencerId: string) => {
  const res = await client.get(`/influencers/${influencerId}/rate-card`);
  return res.data;
};

export const getInfluencerAudienceDemographics = async (influencerId: string) => {
  const res = await client.get(`/influencers/${influencerId}/audience`);
  return res.data;
};

export const searchInfluencers = async (query: {
  keyword?: string;
  hashtag?: string;
  platform?: string;
  country?: string;
  niche?: string;
  followerMin?: number;
  followerMax?: number;
  engagementMin?: number;
  engagementMax?: number;
  rateCardMin?: number;
  rateCardMax?: number;
  verifiedOnly?: boolean;
  contentType?: string;
}) => {
  const res = await client.get('/search/influencers', { params: query });
  return res.data;
};

export const compareInfluencers = async (influencerIds: string[]) => {
  const res = await client.post('/influencers/compare', { ids: influencerIds });
  return res.data;
};

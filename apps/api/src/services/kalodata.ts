/**
 * KaloData Open API Service
 * Docs: https://kalodata.com/open-api
 * Contact: service@kalodata.com to obtain your secret-key
 */
import axios, { AxiosInstance } from 'axios';

const KALODATA_BASE = 'https://kalodata.com/openapi/v1';

const client: AxiosInstance = axios.create({
  baseURL: KALODATA_BASE,
  headers: {
    'secret-key': process.env.KALODATA_SECRET_KEY!,
    'content-type': 'application/json;charset=UTF-8',
  },
  timeout: 15000,
});

const DEFAULT_PARAMS = {
  region: 'ID',
  language: 'id-ID',
  currency: 'IDR',
  date_range: 'last30Day',
};

// ---- Creator APIs ----

export const getCreatorRanking = async (params: {
  region?: string;
  dateRange?: string;
  sortField?: string;
  page?: number;
  followerMin?: number;
  followerMax?: number;
  category?: string;
}) => {
  const res = await client.post('/creator/rank', {
    ...DEFAULT_PARAMS,
    region: params.region ?? 'ID',
    date_range: params.dateRange ?? 'last30Day',
    sort: { field: params.sortField ?? 'engagement_rate', type: 'DESC' },
    page_number: params.page ?? 1,
    ...(params.category && { category: params.category }),
    ...(params.followerMin !== undefined && { follower_min: params.followerMin }),
    ...(params.followerMax !== undefined && { follower_max: params.followerMax }),
  });
  return res.data;
};

export const getCreatorDetail = async (creatorId: string, region = 'ID') => {
  const res = await client.post('/creator/detail', {
    ...DEFAULT_PARAMS,
    region,
    creator_id: creatorId,
  });
  return res.data;
};

export const searchCreators = async (keyword: string, region = 'ID') => {
  const res = await client.post('/creator/search', {
    ...DEFAULT_PARAMS,
    region,
    keyword,
    page_number: 1,
  });
  return res.data;
};

// ---- Video APIs ----

export const getVideoRanking = async (creatorId: string, region = 'ID') => {
  const res = await client.post('/video/rank', {
    ...DEFAULT_PARAMS,
    region,
    creator_id: creatorId,
    sort: { field: 'views', type: 'DESC' },
    page_number: 1,
  });
  return res.data;
};

export const getVideoDetail = async (videoId: string) => {
  const res = await client.post('/video/detail', {
    ...DEFAULT_PARAMS,
    video_id: videoId,
  });
  return res.data;
};

// ---- Category APIs ----

export const getCategoryList = async (region = 'ID') => {
  const res = await client.post('/category/list', {
    ...DEFAULT_PARAMS,
    region,
  });
  return res.data;
};

// ---- Throttle helper for bulk syncs ----
export const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Official Social Media Embed Services
 * - TikTok: oEmbed API (https://www.tiktok.com/oembed)
 * - YouTube: IFrame Player API (official)
 * - Instagram: Graph API oEmbed endpoint
 */
import axios from 'axios';

// ---- TikTok oEmbed (Official API) ----

export const getTikTokEmbed = async (videoUrl: string) => {
  const res = await axios.get('https://www.tiktok.com/oembed', {
    params: { url: videoUrl },
    timeout: 10000,
  });
  return {
    html: res.data.html,
    authorName: res.data.author_name,
    title: res.data.title,
    thumbnailUrl: res.data.thumbnail_url,
    thumbnailWidth: res.data.thumbnail_width,
    thumbnailHeight: res.data.thumbnail_height,
    providerName: 'TikTok',
    platform: 'tiktok',
  };
};

export const extractTikTokVideoId = (url: string): string | null => {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
};

// ---- YouTube IFrame API (Official) ----

export const getYouTubeEmbedUrl = (videoId: string, options?: {
  autoplay?: boolean;
  mute?: boolean;
  controls?: boolean;
}) => {
  const params = new URLSearchParams({
    enablejsapi: '1',
    autoplay: options?.autoplay ? '1' : '0',
    mute: options?.mute ? '1' : '0',
    controls: options?.controls === false ? '0' : '1',
    modestbranding: '1',
    rel: '0',
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

export const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/shorts\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
};

// ---- Instagram Graph API oEmbed (Official) ----

export const getInstagramEmbed = async (postUrl: string) => {
  const res = await axios.get('https://graph.facebook.com/v19.0/instagram_oembed', {
    params: {
      url: postUrl,
      access_token: process.env.INSTAGRAM_TOKEN,
      maxwidth: 480,
    },
    timeout: 10000,
  });
  return {
    html: res.data.html,
    authorName: res.data.author_name,
    thumbnailUrl: res.data.thumbnail_url,
    providerName: 'Instagram',
    platform: 'instagram',
  };
};

export const extractInstagramPostId = (url: string): string | null => {
  const match = url.match(/\/p\/([^/?]+)|reel\/([^/?]+)/);
  return match ? (match[1] || match[2]) : null;
};

// ---- Unified embed resolver ----

export const resolveEmbed = async (url: string) => {
  if (url.includes('tiktok.com')) {
    return getTikTokEmbed(url);
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');
    return {
      html: `<iframe src="${getYouTubeEmbedUrl(videoId)}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`,
      platform: 'youtube',
      videoId,
    };
  }
  if (url.includes('instagram.com')) {
    return getInstagramEmbed(url);
  }
  throw new Error(`Unsupported platform URL: ${url}`);
};

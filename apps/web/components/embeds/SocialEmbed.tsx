'use client';

interface SocialEmbedProps {
  url: string;
  platform: string;
}

export function SocialEmbed({ url, platform }: SocialEmbedProps) {
  const platformLower = platform?.toLowerCase();

  if (platformLower === 'tiktok') {
    // TikTok oEmbed-style embed
    const videoId = url.split('/video/')?.[1]?.split('?')?.[0];
    if (videoId) {
      return (
        <div className="flex justify-center">
          <blockquote
            className="tiktok-embed"
            cite={url}
            data-video-id={videoId}
            style={{ maxWidth: 605, minWidth: 325 }}
          >
            <section />
          </blockquote>
          <script async src="https://www.tiktok.com/embed.js" />
        </div>
      );
    }
  }

  if (platformLower === 'instagram') {
    return (
      <div className="flex justify-center">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ maxWidth: 540, minWidth: 326, width: '100%' }}
        />
        <script async src="//www.instagram.com/embed.js" />
      </div>
    );
  }

  if (platformLower === 'youtube') {
    const videoId = url.match(/(?:v=|youtu.be\/|embed\/)([\w-]{11})/)?.[1];
    if (videoId) {
      return (
        <div className="aspect-video w-full rounded-xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      );
    }
  }

  // Fallback: external link
  return (
    <div className="text-center py-8">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
      >
        View Content on {platform}
      </a>
    </div>
  );
}

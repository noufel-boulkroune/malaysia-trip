/**
 * VideoEmbed.jsx — YouTube search link button
 * Props: video ({ title: string } | null)
 * Does NOT embed an iframe. Generates a YouTube search URL from the video
 * title so there are no broken embeds or GDPR issues. Opens in new tab.
 * Returns null when video is null or title is missing.
 */
import { ExternalLink, Play } from 'lucide-react';

export default function VideoEmbed({ video }) {
  if (!video?.title) return null;

  const query = encodeURIComponent(video.title);
  const searchUrl = `https://www.youtube.com/results?search_query=${query}`;

  return (
    <div className="card p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center shrink-0">
          <Play size={16} className="text-white fill-white ml-0.5" />
        </div>
        <span className="font-semibold text-sm text-white/80">{video.title}</span>
      </div>
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm rounded-xl transition-colors shrink-0"
      >
        Watch <ExternalLink size={13} />
      </a>
    </div>
  );
}

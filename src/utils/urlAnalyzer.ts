import { CategoryType } from '../types';

export interface AnalyzedUrlResult {
  url: string;
  filename: string;
  category: CategoryType;
  extension: string;
  mimeType: string;
  estimatedSizeBytes: number;
  offlineType: 'video' | 'audio' | 'document' | 'image' | 'archive' | 'code' | 'raw';
  supportsMultiThreading: boolean;
  serverThreadsDetected: number;
  isSecure: boolean;
  videoQualityOptions?: { resolution: string; format: string; sizeEstimate: string }[];
  defaultOfflinePreviewUrl?: string;
  defaultOfflineText?: string;
}

export function analyzeUrl(inputUrl: string): AnalyzedUrlResult {
  const trimmed = inputUrl.trim();
  let cleanUrl = trimmed;
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('ftp://')) {
    cleanUrl = 'https://' + cleanUrl;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(cleanUrl);
  } catch {
    parsedUrl = new URL('https://example.com/file.bin');
  }

  const pathname = parsedUrl.pathname;
  const hostname = parsedUrl.hostname.toLowerCase();
  const isSecure = parsedUrl.protocol === 'https:';

  // Extract raw filename
  const segments = pathname.split('/').filter(Boolean);
  let rawFilename = segments.length > 0 ? segments[segments.length - 1] : 'downloaded_file';
  
  // Clean query params or hash if present in filename
  rawFilename = decodeURIComponent(rawFilename.split('?')[0].split('#')[0]);

  // Check for video platforms
  const isYouTube = hostname.includes('youtube.com') || hostname.includes('youtu.be');
  const isVimeo = hostname.includes('vimeo.com');
  const isTwitch = hostname.includes('twitch.tv');

  if (isYouTube || isVimeo || isTwitch) {
    const videoId = parsedUrl.searchParams.get('v') || segments[segments.length - 1] || 'media_stream';
    const videoName = `Video_Stream_${videoId}.mp4`;
    return {
      url: cleanUrl,
      filename: videoName,
      category: 'video',
      extension: 'mp4',
      mimeType: 'video/mp4',
      estimatedSizeBytes: 245 * 1024 * 1024, // 245 MB
      offlineType: 'video',
      supportsMultiThreading: true,
      serverThreadsDetected: 16,
      isSecure,
      videoQualityOptions: [
        { resolution: '4K (2160p 60fps)', format: 'MP4 / H.264', sizeEstimate: '1.2 GB' },
        { resolution: '1080p (Full HD)', format: 'MP4 / H.264', sizeEstimate: '245 MB' },
        { resolution: '720p (HD)', format: 'MP4 / AAC', sizeEstimate: '110 MB' },
        { resolution: 'Audio Only (320kbps)', format: 'MP3 / HQ', sizeEstimate: '12 MB' },
      ],
      defaultOfflinePreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    };
  }

  // Detect by extension
  const extMatch = rawFilename.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : '';

  if (['mp4', 'mkv', 'webm', 'mov', 'avi', 'flv', 'wmv'].includes(ext)) {
    return {
      url: cleanUrl,
      filename: rawFilename,
      category: 'video',
      extension: ext,
      mimeType: `video/${ext === 'mkv' ? 'x-matroska' : ext}`,
      estimatedSizeBytes: 185 * 1024 * 1024,
      offlineType: 'video',
      supportsMultiThreading: true,
      serverThreadsDetected: 16,
      isSecure,
      defaultOfflinePreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    };
  }

  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext)) {
    return {
      url: cleanUrl,
      filename: rawFilename,
      category: 'audio',
      extension: ext,
      mimeType: `audio/${ext}`,
      estimatedSizeBytes: 28 * 1024 * 1024,
      offlineType: 'audio',
      supportsMultiThreading: true,
      serverThreadsDetected: 8,
      isSecure,
      defaultOfflinePreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    };
  }

  if (['pdf', 'docx', 'doc', 'xlsx', 'pptx', 'txt', 'md', 'epub', 'rtf'].includes(ext)) {
    return {
      url: cleanUrl,
      filename: rawFilename,
      category: 'document',
      extension: ext,
      mimeType: ext === 'pdf' ? 'application/pdf' : 'text/plain',
      estimatedSizeBytes: 14 * 1024 * 1024,
      offlineType: 'document',
      supportsMultiThreading: true,
      serverThreadsDetected: 8,
      isSecure,
      defaultOfflineText: `# ${rawFilename}\n\nDocument downloaded via RAI MK DOWNLOAD MANAGER.\n\nOffline viewing mode initialized successfully.\nEncrypted checksum verified.\n\nSummary:\n- High speed chunked fetch complete.\n- Ready for cross-device cloud synchronization.`,
    };
  }

  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)) {
    return {
      url: cleanUrl,
      filename: rawFilename,
      category: 'compressed',
      extension: ext,
      mimeType: 'application/zip',
      estimatedSizeBytes: 350 * 1024 * 1024,
      offlineType: 'archive',
      supportsMultiThreading: true,
      serverThreadsDetected: 16,
      isSecure,
    };
  }

  if (['exe', 'msi', 'dmg', 'pkg', 'deb', 'rpm', 'appimage', 'apk', 'iso'].includes(ext)) {
    return {
      url: cleanUrl,
      filename: rawFilename,
      category: 'program',
      extension: ext,
      mimeType: 'application/octet-stream',
      estimatedSizeBytes: 520 * 1024 * 1024,
      offlineType: 'raw',
      supportsMultiThreading: true,
      serverThreadsDetected: 16,
      isSecure,
    };
  }

  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'ico'].includes(ext)) {
    return {
      url: cleanUrl,
      filename: rawFilename,
      category: 'image',
      extension: ext,
      mimeType: `image/${ext === 'svg' ? 'svg+xml' : ext}`,
      estimatedSizeBytes: 4 * 1024 * 1024,
      offlineType: 'image',
      supportsMultiThreading: true,
      serverThreadsDetected: 8,
      isSecure,
      defaultOfflinePreviewUrl: cleanUrl,
    };
  }

  // Fallback for general URLs
  const defaultName = rawFilename.includes('.') ? rawFilename : `${rawFilename || 'download_package'}.bin`;
  return {
    url: cleanUrl,
    filename: defaultName,
    category: 'other',
    extension: 'bin',
    mimeType: 'application/octet-stream',
    estimatedSizeBytes: 75 * 1024 * 1024,
    offlineType: 'raw',
    supportsMultiThreading: true,
    serverThreadsDetected: 8,
    isSecure,
  };
}

// Preset samples that users can click to quickly test any category
export const QUICK_URL_PRESETS = [
  {
    label: 'NASA Artemis Missions Report (PDF)',
    url: 'https://www.nasa.gov/specials/artemis-accords/img/Artemis-Accords-signed-10132020.pdf',
    category: 'document',
    size: '18.4 MB',
    type: 'PDF Document',
  },
  {
    label: '4K Open Cinema Project (MP4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'video',
    size: '158 MB',
    type: 'Ultra HD Video',
  },
  {
    label: 'Ubuntu 24.04 LTS Desktop Image (ISO)',
    url: 'https://releases.ubuntu.com/24.04/ubuntu-24.04-desktop-amd64.iso',
    category: 'program',
    size: '5.8 GB',
    type: 'OS Installer',
  },
  {
    label: 'Synthesizer Orchestral Audio (FLAC/MP3)',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    category: 'audio',
    size: '28.5 MB',
    type: 'Studio Audio',
  },
  {
    label: 'Web Standards Toolkit (ZIP)',
    url: 'https://github.com/facebook/react/archive/refs/tags/v19.0.0.zip',
    category: 'compressed',
    size: '42.1 MB',
    type: 'Source Archive',
  },
];

export type CategoryType = 'all' | 'video' | 'document' | 'audio' | 'compressed' | 'program' | 'image' | 'other';

export type DownloadStatus = 'downloading' | 'completed' | 'paused' | 'queued' | 'error';

export type CloudProvider = 'gdrive' | 'dropbox' | 'onedrive' | 'nextcloud';

export type CloudSyncStatus = 'synced' | 'syncing' | 'pending' | 'local_only';

export type DesktopOS = 'windows' | 'mac' | 'linux';

export type DarkTheme = 'obsidian' | 'oled' | 'mica' | 'nord';

export type RGBPalette = 'cyber' | 'aurora' | 'neon_violet' | 'matrix' | 'sunset' | 'ice';

export interface ChunkProgress {
  id: number;
  progress: number; // 0-100
  speed: string; // e.g. "4.2 MB/s"
}

export interface DownloadItem {
  id: string;
  url: string;
  filename: string;
  category: CategoryType;
  totalBytes: number;
  downloadedBytes: number;
  progress: number; // 0-100
  speedBytesPerSec: number;
  etaSeconds: number;
  status: DownloadStatus;
  threadsCount: number;
  threads: ChunkProgress[];
  dateAdded: string;
  dateCompleted?: string;
  isEncrypted: boolean;
  encryptionKeyHint?: string;
  sha256Checksum?: string;
  mimeType: string;
  offlineType: 'video' | 'audio' | 'document' | 'image' | 'archive' | 'code' | 'raw';
  offlineContentUrl?: string; // Blob or sample media URL
  offlineTextContent?: string; // For text/code/doc preview
  cloudSync: {
    status: CloudSyncStatus;
    provider: CloudProvider;
    lastSynced?: string;
    cloudUrl?: string;
  };
  saveDirectory: string;
  customTags?: string[];
  notes?: string;
}

export interface RGBConfig {
  enabled: boolean;
  palette: RGBPalette;
  breathingSpeedSeconds: number;
  intensity: 'subtle' | 'vibrant' | 'ultra';
  edgeWidth: number;
}

export interface SpeedSettings {
  mode: 'turbo' | 'unlimited' | 'capped';
  cappedSpeedKBps: number;
  maxThreadsPerDownload: number;
  simultaneousDownloads: number;
}

export interface CloudAccount {
  provider: CloudProvider;
  name: string;
  email: string;
  connected: boolean;
  usedBytes: number;
  totalBytes: number;
  autoSync: boolean;
}

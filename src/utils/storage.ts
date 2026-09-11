import { DownloadItem, RGBConfig, SpeedSettings, CloudAccount } from '../types';

export const STORAGE_KEYS = {
  DOWNLOADS: 'rai_mk_downloads_v1',
  RGB_CONFIG: 'rai_mk_rgb_config_v1',
  SPEED_CONFIG: 'rai_mk_speed_config_v1',
  CLOUD_ACCOUNTS: 'rai_mk_cloud_accounts_v1',
  THEME: 'rai_mk_dark_theme_v1',
  OS: 'rai_mk_desktop_os_v1',
  MASTER_PASS: 'rai_mk_master_pass_v1',
};

export const INITIAL_RGB_CONFIG: RGBConfig = {
  enabled: true,
  palette: 'cyber',
  breathingSpeedSeconds: 4,
  intensity: 'vibrant',
  edgeWidth: 2,
};

export const INITIAL_SPEED_CONFIG: SpeedSettings = {
  mode: 'turbo',
  cappedSpeedKBps: 15000,
  maxThreadsPerDownload: 16,
  simultaneousDownloads: 4,
};

export const INITIAL_CLOUD_ACCOUNTS: CloudAccount[] = [
  {
    provider: 'gdrive',
    name: 'Google Drive',
    email: 'raimksangra@gmail.com',
    connected: true,
    usedBytes: 14.8 * 1024 * 1024 * 1024,
    totalBytes: 100 * 1024 * 1024 * 1024,
    autoSync: true,
  },
  {
    provider: 'dropbox',
    name: 'Dropbox Pro',
    email: 'raimksangra@gmail.com',
    connected: true,
    usedBytes: 8.2 * 1024 * 1024 * 1024,
    totalBytes: 50 * 1024 * 1024 * 1024,
    autoSync: false,
  },
  {
    provider: 'onedrive',
    name: 'Microsoft OneDrive',
    email: 'raimksangra@outlook.com',
    connected: false,
    usedBytes: 0,
    totalBytes: 50 * 1024 * 1024 * 1024,
    autoSync: false,
  },
  {
    provider: 'nextcloud',
    name: 'Nextcloud / WebDAV Private Server',
    email: 'user@rai-cloud.net',
    connected: false,
    usedBytes: 0,
    totalBytes: 500 * 1024 * 1024 * 1024,
    autoSync: false,
  },
];

export const INITIAL_DOWNLOADS: DownloadItem[] = [
  {
    id: 'rai-dl-001',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    filename: 'Cyberpunk_Neon_Metropolis_4K.mp4',
    category: 'video',
    totalBytes: 158 * 1024 * 1024,
    downloadedBytes: 158 * 1024 * 1024,
    progress: 100,
    speedBytesPerSec: 0,
    etaSeconds: 0,
    status: 'completed',
    threadsCount: 16,
    threads: Array.from({ length: 16 }, (_, i) => ({ id: i + 1, progress: 100, speed: 'Done' })),
    dateAdded: '2026-09-10 14:20',
    dateCompleted: '2026-09-10 14:21',
    isEncrypted: false,
    mimeType: 'video/mp4',
    offlineType: 'video',
    offlineContentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    cloudSync: {
      status: 'synced',
      provider: 'gdrive',
      lastSynced: '2 mins ago',
      cloudUrl: 'https://drive.google.com/file/d/rai_mk_video_001',
    },
    saveDirectory: 'C:\\Downloads\\Videos\\',
    sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    customTags: ['4K', 'Ultra HD', 'Stream'],
  },
  {
    id: 'rai-dl-002',
    url: 'https://arxiv.org/pdf/quantum_ml_paper.pdf',
    filename: 'Quantum_Neural_Networks_Architecture_2026.pdf',
    category: 'document',
    totalBytes: 18.5 * 1024 * 1024,
    downloadedBytes: 18.5 * 1024 * 1024,
    progress: 100,
    speedBytesPerSec: 0,
    etaSeconds: 0,
    status: 'completed',
    threadsCount: 8,
    threads: Array.from({ length: 8 }, (_, i) => ({ id: i + 1, progress: 100, speed: 'Done' })),
    dateAdded: '2026-09-10 13:45',
    dateCompleted: '2026-09-10 13:46',
    isEncrypted: false,
    mimeType: 'application/pdf',
    offlineType: 'document',
    offlineTextContent: `# QUANTUM NEURAL ARCHITECTURES & DISTRIBUTED COMPUTING (2026)
Author: Dr. Elena Rostova & RAI Research Lab
Published: September 2026

## 1. ABSTRACT
We introduce a hybrid quantum-classical pipeline engineered for ultra-low-latency tensor graph acceleration. By decoupling state superposition from non-linear gradient projection, our benchmarks illustrate a 38x reduction in backpropagation cycles across heterogeneous cluster topologies.

## 2. MATHEMATICAL FORMULATION
Let H be a 2^N-dimensional Hilbert space governed by parameterized unitary transformations U(θ):
U(θ) = ∏ exp(-i θ_k σ_k / 2)

Where σ_k denotes the Pauli operators {σ_x, σ_y, σ_z} acting upon contiguous qubit sub-registers.

## 3. EXPERIMENTAL VERIFICATION & OFFLINE METRICS
- Phase Coherence Time: 420 microseconds
- Fidelity Threshold: 99.982%
- Distributed Node Throughput: 128 Gbps via InfiniBand RDMA

Verified locally with RAI MK DOWNLOAD MANAGER engine. Ready for offline inspection.`,
    cloudSync: {
      status: 'synced',
      provider: 'dropbox',
      lastSynced: '10 mins ago',
      cloudUrl: 'https://dropbox.com/s/quantum_paper',
    },
    saveDirectory: 'C:\\Downloads\\Documents\\',
    sha256Checksum: '9a5c88b2f1e29087c2f309a473e13dcf589139829a1bcf9102498234ab1209cc',
    customTags: ['Whitepaper', 'Research', 'AI'],
  },
  {
    id: 'rai-dl-003',
    url: 'https://releases.ubuntu.com/24.04/ubuntu-24.04-desktop-amd64.iso',
    filename: 'Ubuntu_24.04_LTS_Noble_Numbat_x64.iso',
    category: 'program',
    totalBytes: 5.8 * 1024 * 1024 * 1024,
    downloadedBytes: 3.9 * 1024 * 1024 * 1024,
    progress: 67.2,
    speedBytesPerSec: 48.5 * 1024 * 1024, // 48.5 MB/s
    etaSeconds: 41,
    status: 'downloading',
    threadsCount: 16,
    threads: [
      { id: 1, progress: 95, speed: '3.2 MB/s' },
      { id: 2, progress: 91, speed: '3.1 MB/s' },
      { id: 3, progress: 88, speed: '2.9 MB/s' },
      { id: 4, progress: 85, speed: '3.4 MB/s' },
      { id: 5, progress: 78, speed: '3.0 MB/s' },
      { id: 6, progress: 74, speed: '3.1 MB/s' },
      { id: 7, progress: 70, speed: '3.3 MB/s' },
      { id: 8, progress: 68, speed: '2.8 MB/s' },
      { id: 9, progress: 65, speed: '3.0 MB/s' },
      { id: 10, progress: 62, speed: '3.1 MB/s' },
      { id: 11, progress: 58, speed: '3.5 MB/s' },
      { id: 12, progress: 54, speed: '2.7 MB/s' },
      { id: 13, progress: 50, speed: '3.1 MB/s' },
      { id: 14, progress: 48, speed: '3.0 MB/s' },
      { id: 15, progress: 44, speed: '2.9 MB/s' },
      { id: 16, progress: 39, speed: '2.4 MB/s' },
    ],
    dateAdded: '2026-09-10 15:05',
    isEncrypted: false,
    mimeType: 'application/x-iso9660-image',
    offlineType: 'raw',
    cloudSync: {
      status: 'pending',
      provider: 'gdrive',
    },
    saveDirectory: 'C:\\Downloads\\OS_Images\\',
    customTags: ['Linux', 'ISO', 'HighPriority'],
  },
  {
    id: 'rai-dl-004',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    filename: 'Cyberpunk_Synthwave_Lossless_Master.flac',
    category: 'audio',
    totalBytes: 32.4 * 1024 * 1024,
    downloadedBytes: 32.4 * 1024 * 1024,
    progress: 100,
    speedBytesPerSec: 0,
    etaSeconds: 0,
    status: 'completed',
    threadsCount: 8,
    threads: Array.from({ length: 8 }, (_, i) => ({ id: i + 1, progress: 100, speed: 'Done' })),
    dateAdded: '2026-09-10 11:15',
    dateCompleted: '2026-09-10 11:16',
    isEncrypted: false,
    mimeType: 'audio/flac',
    offlineType: 'audio',
    offlineContentUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cloudSync: {
      status: 'synced',
      provider: 'gdrive',
      lastSynced: '1 hr ago',
    },
    saveDirectory: 'C:\\Downloads\\Music\\',
    sha256Checksum: '7b6d19a008e137b7194f4848039c3e2bbd8e0df39e55a828695f269a8449c402',
    customTags: ['Music', 'Lossless', 'Synthwave'],
  },
  {
    id: 'rai-dl-005',
    url: 'https://secure-vault.corp/financials_q3_2026.enc',
    filename: 'Confidential_Enterprise_Ledger.enc',
    category: 'document',
    totalBytes: 44.8 * 1024 * 1024,
    downloadedBytes: 44.8 * 1024 * 1024,
    progress: 100,
    speedBytesPerSec: 0,
    etaSeconds: 0,
    status: 'completed',
    threadsCount: 16,
    threads: Array.from({ length: 16 }, (_, i) => ({ id: i + 1, progress: 100, speed: 'Done' })),
    dateAdded: '2026-09-10 09:30',
    dateCompleted: '2026-09-10 09:31',
    isEncrypted: true,
    encryptionKeyHint: 'Passphrase: "rai-mk-secure-2026"',
    mimeType: 'application/octet-stream',
    offlineType: 'document',
    offlineTextContent: `[CONFIDENTIAL ENCRYPTED FINANCIAL LEDGER - DECRYPTED VIA AES-256 GCM]
Entity: RAI MK GLOBAL INFRASTRUCTURE CORP.
Audit Period: Q3 FY2026
Status: Verified & Cryptographically Signed

Executive Highlights:
- Network Bandwidth Utilization: 84.6 PB
- Global CDN Multi-Thread Throughput: 99.999% SLA
- Zero Knowledge Vault Instances: 142,000 Active Keys
- Cross-Platform Synchronizations: 98.4% On-time

This record is restricted to authorized credentials only.`,
    cloudSync: {
      status: 'synced',
      provider: 'gdrive',
      lastSynced: '3 hrs ago',
    },
    saveDirectory: 'C:\\Downloads\\EncryptedVault\\',
    sha256Checksum: '11ab23cd45ef67890123456789abcdef0123456789abcdef0123456789abcdef',
    customTags: ['AES-256', 'Confidential', 'Vault'],
  },
];

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec === 0) return '0 KB/s';
  if (bytesPerSec >= 1024 * 1024) {
    return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
  }
  return `${(bytesPerSec / 1024).toFixed(0)} KB/s`;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0 || !isFinite(seconds)) return '--';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  const remM = m % 60;
  return `${h}h ${remM}m`;
}

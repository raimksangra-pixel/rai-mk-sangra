import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Download,
  Plus,
  Play,
  Pause,
  Trash2,
  FolderOpen,
  Eye,
  Shield,
  Cloud,
  HardDrive,
  Sliders,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  FileVideo,
  FileText,
  Music,
  Archive,
  Cpu,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Zap,
  Lock,
  Unlock,
  Key,
  Laptop,
  Check,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

import {
  CategoryType,
  CloudAccount,
  DarkTheme,
  DesktopOS,
  DownloadItem,
  DownloadStatus,
  RGBConfig,
  SpeedSettings,
} from './types';
import {
  formatBytes,
  formatDuration,
  formatSpeed,
  INITIAL_CLOUD_ACCOUNTS,
  INITIAL_DOWNLOADS,
  INITIAL_RGB_CONFIG,
  INITIAL_SPEED_CONFIG,
  STORAGE_KEYS,
} from './utils/storage';
import { DesktopTitleBar } from './components/DesktopTitleBar';
import { SegmentVisualizer } from './components/SegmentVisualizer';
import { NewDownloadModal } from './components/NewDownloadModal';
import { OfflineMediaViewerModal } from './components/OfflineMediaViewerModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { SettingsModal } from './components/SettingsModal';
import { FilePropertiesModal } from './components/FilePropertiesModal';
import { EncryptionVaultModal } from './components/EncryptionVaultModal';

export default function App() {
  // Persistence state
  const [downloads, setDownloads] = useState<DownloadItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOWNLOADS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_DOWNLOADS;
  });

  const [rgbConfig, setRgbConfig] = useState<RGBConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RGB_CONFIG);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_RGB_CONFIG;
  });

  const [speedSettings, setSpeedSettings] = useState<SpeedSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPEED_CONFIG);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_SPEED_CONFIG;
  });

  const [cloudAccounts, setCloudAccounts] = useState<CloudAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLOUD_ACCOUNTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_CLOUD_ACCOUNTS;
  });

  const [darkTheme, setDarkTheme] = useState<DarkTheme>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as DarkTheme) || 'obsidian';
  });

  const [os, setOs] = useState<DesktopOS>(() => {
    return (localStorage.getItem(STORAGE_KEYS.OS) as DesktopOS) || 'windows';
  });

  // UI Filter states
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'downloading' | 'completed' | 'encrypted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name' | 'progress'>('date');

  // Modals state
  const [isNewDownloadOpen, setIsNewDownloadOpen] = useState(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [selectedViewerItem, setSelectedViewerItem] = useState<DownloadItem | null>(null);
  const [selectedPropertiesItem, setSelectedPropertiesItem] = useState<DownloadItem | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RGB_CONFIG, JSON.stringify(rgbConfig));
  }, [rgbConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPEED_CONFIG, JSON.stringify(speedSettings));
  }, [speedSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLOUD_ACCOUNTS, JSON.stringify(cloudAccounts));
  }, [cloudAccounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, darkTheme);
  }, [darkTheme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OS, os);
  }, [os]);

  // Real-time download acceleration simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads((prevDownloads) => {
        let hasChanges = false;
        const updated = prevDownloads.map((item) => {
          if (item.status !== 'downloading') return item;
          hasChanges = true;

          // Compute step speed
          let currentSpeed = item.speedBytesPerSec;
          if (speedSettings.mode === 'capped') {
            currentSpeed = Math.min(currentSpeed, speedSettings.cappedSpeedKBps * 1024);
          } else {
            // Turbo jitter between 35MB/s and 52MB/s
            const jitter = (Math.random() - 0.5) * 4 * 1024 * 1024;
            currentSpeed = Math.max(15 * 1024 * 1024, currentSpeed + jitter);
          }

          const increment = currentSpeed * 0.8; // 800ms step
          const newDownloaded = Math.min(item.totalBytes, item.downloadedBytes + increment);
          const newProgress = Math.min(100, (newDownloaded / item.totalBytes) * 100);
          const remainingBytes = item.totalBytes - newDownloaded;
          const newEta = remainingBytes > 0 && currentSpeed > 0 ? Math.ceil(remainingBytes / currentSpeed) : 0;

          // Update thread progress chunks
          const newThreads = item.threads.map((th) => {
            const threadProg = Math.min(100, th.progress + (100 - th.progress) * 0.08 + Math.random() * 2);
            return {
              ...th,
              progress: Math.floor(threadProg),
              speed: `${(currentSpeed / (item.threadsCount * 1024 * 1024)).toFixed(1)} MB/s`,
            };
          });

          if (newDownloaded >= item.totalBytes) {
            return {
              ...item,
              downloadedBytes: item.totalBytes,
              progress: 100,
              speedBytesPerSec: 0,
              etaSeconds: 0,
              status: 'completed' as DownloadStatus,
              dateCompleted: new Date().toISOString().replace('T', ' ').substring(0, 16),
              threads: newThreads.map((t) => ({ ...t, progress: 100, speed: 'Done' })),
              cloudSync: {
                ...item.cloudSync,
                status: item.cloudSync.status === 'pending' ? 'synced' : item.cloudSync.status,
                lastSynced: 'Just now',
              },
            };
          }

          return {
            ...item,
            downloadedBytes: newDownloaded,
            progress: newProgress,
            speedBytesPerSec: currentSpeed,
            etaSeconds: newEta,
            threads: newThreads,
          };
        });

        return hasChanges ? updated : prevDownloads;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [speedSettings]);

  // Aggregate stats
  const activeDownloads = useMemo(() => {
    return downloads.filter((d) => d.status === 'downloading');
  }, [downloads]);

  const totalDownloadSpeed = useMemo(() => {
    return activeDownloads.reduce((acc, curr) => acc + curr.speedBytesPerSec, 0);
  }, [activeDownloads]);

  const totalDownloadedBytes = useMemo(() => {
    return downloads.reduce((acc, curr) => acc + curr.downloadedBytes, 0);
  }, [downloads]);

  // Filtered and sorted downloads
  const filteredDownloads = useMemo(() => {
    return downloads
      .filter((item) => {
        // Category filter
        if (activeCategory !== 'all' && item.category !== activeCategory) {
          return false;
        }
        // Status filter
        if (statusFilter === 'downloading' && item.status !== 'downloading') return false;
        if (statusFilter === 'completed' && item.status !== 'completed') return false;
        if (statusFilter === 'encrypted' && !item.isEncrypted) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.filename.toLowerCase().includes(q);
          const matchUrl = item.url.toLowerCase().includes(q);
          const matchTags = item.customTags?.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchUrl && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date') return b.dateAdded.localeCompare(a.dateAdded);
        if (sortBy === 'size') return b.totalBytes - a.totalBytes;
        if (sortBy === 'name') return a.filename.localeCompare(b.filename);
        if (sortBy === 'progress') return b.progress - a.progress;
        return 0;
      });
  }, [downloads, activeCategory, statusFilter, searchQuery, sortBy]);

  // Handler Actions
  const handleAddDownload = (partialItem: Partial<DownloadItem>) => {
    const newItem: DownloadItem = {
      id: `rai-dl-${Date.now()}`,
      url: partialItem.url || '',
      filename: partialItem.filename || 'download.bin',
      category: partialItem.category || 'other',
      totalBytes: partialItem.totalBytes || 100 * 1024 * 1024,
      downloadedBytes: 0,
      progress: 0,
      speedBytesPerSec: partialItem.speedBytesPerSec || 32 * 1024 * 1024,
      etaSeconds: 15,
      status: 'downloading',
      threadsCount: partialItem.threadsCount || 16,
      threads: partialItem.threads || [],
      dateAdded: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isEncrypted: !!partialItem.isEncrypted,
      encryptionKeyHint: partialItem.encryptionKeyHint,
      mimeType: partialItem.mimeType || 'application/octet-stream',
      offlineType: partialItem.offlineType || 'raw',
      offlineContentUrl: partialItem.offlineContentUrl,
      offlineTextContent: partialItem.offlineTextContent,
      cloudSync: partialItem.cloudSync || { status: 'local_only', provider: 'gdrive' },
      saveDirectory: partialItem.saveDirectory || 'C:\\Downloads\\',
      sha256Checksum: partialItem.sha256Checksum,
      customTags: partialItem.customTags || [],
    };

    setDownloads((prev) => [newItem, ...prev]);
  };

  const handleTogglePause = (id: string) => {
    setDownloads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.status === 'downloading') {
            return { ...item, status: 'paused', speedBytesPerSec: 0 };
          } else if (item.status === 'paused') {
            return { ...item, status: 'downloading', speedBytesPerSec: 32 * 1024 * 1024 };
          }
        }
        return item;
      })
    );
  };

  const handleDelete = (id: string) => {
    setDownloads((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePauseAll = () => {
    setDownloads((prev) =>
      prev.map((item) => (item.status === 'downloading' ? { ...item, status: 'paused', speedBytesPerSec: 0 } : item))
    );
  };

  const handleResumeAll = () => {
    setDownloads((prev) =>
      prev.map((item) =>
        item.status === 'paused' ? { ...item, status: 'downloading', speedBytesPerSec: 32 * 1024 * 1024 } : item
      )
    );
  };

  const handleClearCompleted = () => {
    setDownloads((prev) => prev.filter((item) => item.status !== 'completed'));
  };

  const handleTriggerCloudSyncAll = () => {
    setDownloads((prev) =>
      prev.map((item) => ({
        ...item,
        cloudSync: {
          ...item.cloudSync,
          status: 'synced',
          lastSynced: 'Just now',
        },
      }))
    );
  };

  // Real Save/Export to local disk
  const handleSaveToDisk = (item: DownloadItem) => {
    try {
      let contentBlob: Blob;
      if (item.offlineTextContent) {
        contentBlob = new Blob([item.offlineTextContent], { type: item.mimeType || 'text/plain' });
      } else {
        // Synthesize downloadable container
        const dummyPayload = `RAI MK DOWNLOAD MANAGER - VERIFIED OFFLINE PAYLOAD\nFile: ${item.filename}\nOriginal Source: ${item.url}\nEncrypted: ${item.isEncrypted}\nTimestamp: ${item.dateAdded}\nIntegrity Hash: ${item.sha256Checksum || 'OK'}`;
        contentBlob = new Blob([dummyPayload], { type: item.mimeType || 'application/octet-stream' });
      }

      const blobUrl = URL.createObjectURL(contentBlob);
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = item.filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback
    }
  };

  // Theme styling classes
  const themeBgClass = {
    obsidian: 'bg-[#090d16]',
    oled: 'bg-black',
    mica: 'bg-[#0f172a]',
    nord: 'bg-[#18181b]',
  }[darkTheme];

  const rgbAnimationClass = rgbConfig.enabled
    ? rgbConfig.palette === 'aurora'
      ? 'rgb-animate-aurora'
      : rgbConfig.palette === 'neon_violet'
      ? 'rgb-animate-violet'
      : 'rgb-animate-cyber'
    : '';

  return (
    <div
      id="app-root-container"
      className={`relative h-screen w-screen overflow-hidden ${themeBgClass} text-slate-100 flex flex-col p-1 sm:p-2.5 transition-colors duration-300`}
      style={
        {
          '--breathe-speed': `${rgbConfig.breathingSpeedSeconds}s`,
        } as React.CSSProperties
      }
    >
      {/* Outer RGB Breathing Border Halo Frame */}
      <div
        id="desktop-window-frame"
        className={`relative flex flex-col flex-1 h-full w-full rounded-2xl overflow-hidden border transition-all duration-300 ${
          rgbConfig.enabled
            ? `${rgbAnimationClass} border-indigo-500/40`
            : 'border-white/10 shadow-2xl'
        } bg-slate-950/90 backdrop-blur-2xl`}
      >
        {/* Top RGB Specular Aura Accent Stripe */}
        {rgbConfig.enabled && (
          <div className="h-[2px] w-full rgb-flow-border opacity-90 shrink-0" />
        )}

        {/* Desktop System Titlebar */}
        <DesktopTitleBar
          os={os}
          setOs={setOs}
          rgbConfig={rgbConfig}
          setRgbConfig={setRgbConfig}
          totalDownloadSpeed={totalDownloadSpeed}
          activeDownloadsCount={activeDownloads.length}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCloudSync={() => setIsCloudSyncOpen(true)}
        />

        {/* Main Application Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar Navigation */}
          <aside
            id="sidebar-navigation"
            className="w-56 shrink-0 border-r border-white/10 bg-slate-950/60 p-3 flex flex-col justify-between hidden md:flex backdrop-blur-md"
          >
            <div className="space-y-4">
              {/* Primary Add Button */}
              <button
                id="btn-open-new-download"
                onClick={() => setIsNewDownloadOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>New Download</span>
              </button>

              {/* Status Section */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                  Queue Filters
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-indigo-600/30 text-white font-semibold border border-indigo-500/40'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Download className="h-3.5 w-3.5 text-indigo-400" />
                      All Items
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{downloads.length}</span>
                  </button>

                  <button
                    onClick={() => setStatusFilter('downloading')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      statusFilter === 'downloading'
                        ? 'bg-emerald-600/30 text-emerald-200 font-semibold border border-emerald-500/40'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-emerald-400" />
                      Downloading
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">{activeDownloads.length}</span>
                  </button>

                  <button
                    onClick={() => setStatusFilter('completed')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      statusFilter === 'completed'
                        ? 'bg-indigo-600/30 text-white font-semibold border border-indigo-500/40'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Completed
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {downloads.filter((d) => d.status === 'completed').length}
                    </span>
                  </button>

                  <button
                    onClick={() => setStatusFilter('encrypted')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      statusFilter === 'encrypted'
                        ? 'bg-amber-600/30 text-amber-200 font-semibold border border-amber-500/40'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-amber-400" />
                      Encrypted Vault
                    </span>
                    <span className="text-[11px] font-mono text-amber-400">
                      {downloads.filter((d) => d.isEncrypted).length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Media Categories Section */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                  Media Categories
                </span>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: 'All Formats', icon: HardDrive },
                    { id: 'video', label: 'Videos (MP4/MKV)', icon: FileVideo },
                    { id: 'document', label: 'Documents (PDF)', icon: FileText },
                    { id: 'audio', label: 'Music & Audio', icon: Music },
                    { id: 'compressed', label: 'Compressed (ZIP)', icon: Archive },
                    { id: 'program', label: 'Software & ISO', icon: Cpu },
                    { id: 'image', label: 'Images & Photos', icon: ImageIcon },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const count =
                      cat.id === 'all' ? downloads.length : downloads.filter((d) => d.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id as CategoryType)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          activeCategory === cat.id
                            ? 'bg-white/10 text-white font-semibold'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{cat.label}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Quick Tools */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsCloudSyncOpen(true)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl bg-sky-950/40 border border-sky-500/30 text-xs text-sky-300 hover:bg-sky-900/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-sky-400" />
                  <span>Cloud Sync</span>
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" title="Connected" />
              </button>

              <button
                onClick={() => setIsVaultOpen(true)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 hover:bg-emerald-900/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span>AES-256 Vault</span>
                </span>
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
              >
                <Sliders className="h-4 w-4 text-slate-400" />
                <span>Preferences &amp; RGB</span>
              </button>
            </div>
          </aside>

          {/* Right Main Content Panel */}
          <main id="main-content-panel" className="flex-1 flex flex-col overflow-hidden bg-slate-950/40">
            {/* Top Command Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 bg-slate-900/40 backdrop-blur-md">
              {/* Search input */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="input-search-downloads"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search file name, URL, or #tag..."
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-resume-all"
                  onClick={handleResumeAll}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  title="Resume all downloads"
                >
                  <Play className="h-3 w-3 text-emerald-400" />
                  <span className="hidden sm:inline">Start All</span>
                </button>

                <button
                  id="btn-pause-all"
                  onClick={handlePauseAll}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  title="Pause all downloads"
                >
                  <Pause className="h-3 w-3 text-amber-400" />
                  <span className="hidden sm:inline">Pause All</span>
                </button>

                <button
                  id="btn-clear-completed"
                  onClick={handleClearCompleted}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  title="Clear finished downloads"
                >
                  <Trash2 className="h-3 w-3 text-rose-400" />
                  <span className="hidden sm:inline">Clear Done</span>
                </button>

                <button
                  onClick={() => setIsNewDownloadOpen(true)}
                  className="md:hidden flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add URL</span>
                </button>
              </div>
            </div>

            {/* Metric Status Bar Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 px-4 py-2 bg-slate-950/60 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-4">
                <span>
                  Items: <strong className="text-white">{filteredDownloads.length}</strong>
                </span>
                <span>
                  Total Downloaded: <strong className="text-indigo-300">{formatBytes(totalDownloadedBytes)}</strong>
                </span>
                <span className="hidden sm:inline">
                  Speed Mode:{' '}
                  <strong className="text-emerald-400">
                    {speedSettings.mode === 'unlimited' ? 'Turbo Unlimited (16x)' : 'Speed Capped'}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-900 border border-white/10 rounded px-2 py-0.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="date">Date Added</option>
                  <option value="size">File Size</option>
                  <option value="progress">Progress %</option>
                  <option value="name">File Name</option>
                </select>
              </div>
            </div>

            {/* Downloads Cards Container */}
            <div id="downloads-list-container" className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredDownloads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-6 border border-dashed border-white/10 rounded-2xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 mb-3">
                    <Download className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">No Downloads in View</h3>
                  <p className="text-xs text-slate-400 max-w-sm mb-4">
                    Paste any URL from the internet into the sniffer to download at maximum multi-threaded speed.
                  </p>
                  <button
                    onClick={() => setIsNewDownloadOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Paste URL to Download</span>
                  </button>
                </div>
              ) : (
                filteredDownloads.map((item) => {
                  const isDownloading = item.status === 'downloading';
                  const isCompleted = item.status === 'completed';
                  const isPaused = item.status === 'paused';

                  return (
                    <div
                      key={item.id}
                      className="group relative rounded-2xl border border-white/10 bg-slate-900/70 p-4 transition-all hover:border-indigo-500/40 hover:bg-slate-900/90 shadow-md backdrop-blur-xl space-y-3"
                    >
                      {/* Top Row: Icon, Title, Status Badges, Actions */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* File Type Icon */}
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                              item.category === 'video'
                                ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                                : item.category === 'document'
                                ? 'bg-sky-500/20 border-sky-500/30 text-sky-300'
                                : item.category === 'audio'
                                ? 'bg-pink-500/20 border-pink-500/30 text-pink-300'
                                : item.category === 'compressed'
                                ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                                : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                            }`}
                          >
                            {item.category === 'video' && <FileVideo className="h-5 w-5" />}
                            {item.category === 'document' && <FileText className="h-5 w-5" />}
                            {item.category === 'audio' && <Music className="h-5 w-5" />}
                            {item.category === 'compressed' && <Archive className="h-5 w-5" />}
                            {item.category === 'program' && <Cpu className="h-5 w-5" />}
                            {item.category === 'image' && <ImageIcon className="h-5 w-5" />}
                            {item.category === 'other' && <HardDrive className="h-5 w-5" />}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3
                                onClick={() => isCompleted && setSelectedViewerItem(item)}
                                className={`text-xs sm:text-sm font-bold text-white truncate max-w-md ${
                                  isCompleted ? 'cursor-pointer hover:text-indigo-300 transition-colors' : ''
                                }`}
                                title={item.filename}
                              >
                                {item.filename}
                              </h3>

                              {/* Badges */}
                              {isCompleted && (
                                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                  <CheckCircle2 className="h-2.5 w-2.5" />
                                  Ready Offline
                                </span>
                              )}

                              {isDownloading && (
                                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                                  <Zap className="h-2.5 w-2.5 animate-pulse text-emerald-400" />
                                  16x Turbo Download
                                </span>
                              )}

                              {isPaused && (
                                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                                  Paused
                                </span>
                              )}

                              {item.isEncrypted && (
                                <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-semibold text-teal-300 border border-teal-500/30 flex items-center gap-1">
                                  <Shield className="h-2.5 w-2.5" />
                                  AES-256
                                </span>
                              )}

                              {item.cloudSync.status === 'synced' && (
                                <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300 border border-sky-500/30 flex items-center gap-1">
                                  <Cloud className="h-2.5 w-2.5" />
                                  Synced
                                </span>
                              )}
                            </div>

                            {/* URL & Meta */}
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                              <span className="font-mono text-slate-400 truncate max-w-xs">{item.url}</span>
                              <span>•</span>
                              <span>{formatBytes(item.totalBytes)}</span>
                              <span>•</span>
                              <span>Dir: {item.saveDirectory}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons on card */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Offline View Button (For Completed) */}
                          {isCompleted && (
                            <button
                              id={`btn-view-${item.id}`}
                              onClick={() => setSelectedViewerItem(item)}
                              className="flex items-center gap-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 px-3 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-600/50 transition-all shadow-sm"
                              title="Play or View Offline"
                            >
                              <Eye className="h-3.5 w-3.5 text-indigo-400" />
                              <span>View Offline</span>
                            </button>
                          )}

                          {/* Real Save to Disk */}
                          <button
                            onClick={() => handleSaveToDisk(item)}
                            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                            title="Save / Export File to Laptop Disk"
                          >
                            <Download className="h-3.5 w-3.5 text-emerald-400" />
                          </button>

                          {/* Pause / Resume Button */}
                          {!isCompleted && (
                            <button
                              onClick={() => handleTogglePause(item.id)}
                              className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                              title={isDownloading ? 'Pause' : 'Resume'}
                            >
                              {isDownloading ? (
                                <Pause className="h-3.5 w-3.5 text-amber-400" />
                              ) : (
                                <Play className="h-3.5 w-3.5 text-emerald-400" />
                              )}
                            </button>
                          )}

                          {/* Properties / Checksum */}
                          <button
                            onClick={() => setSelectedPropertiesItem(item)}
                            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                            title="File Properties & Checksum"
                          >
                            <FileText className="h-3.5 w-3.5 text-slate-400" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Middle Row: Progress Bar and Metrics */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-mono text-slate-300">
                          <div className="flex items-center gap-3">
                            <span>
                              {formatBytes(item.downloadedBytes)} of {formatBytes(item.totalBytes)}
                            </span>
                            {isDownloading && (
                              <span className="text-emerald-400 font-bold">
                                @ {formatSpeed(item.speedBytesPerSec)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {isDownloading && (
                              <span className="text-slate-400">
                                ETA: {formatDuration(item.etaSeconds)}
                              </span>
                            )}
                            <span className="font-bold text-white">{Math.floor(item.progress)}%</span>
                          </div>
                        </div>

                        {/* Progress Bar with glowing sheen */}
                        <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden relative border border-white/5">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isCompleted
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Multi-thread segmented blocks visualizer (when active) */}
                      {isDownloading && item.threads && (
                        <SegmentVisualizer
                          threads={item.threads}
                          threadsCount={item.threadsCount}
                          totalProgress={item.progress}
                          isDownloading={isDownloading}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </main>
        </div>
      </div>

      {/* MODALS */}
      <NewDownloadModal
        isOpen={isNewDownloadOpen}
        onClose={() => setIsNewDownloadOpen(false)}
        onAddDownload={handleAddDownload}
      />

      <OfflineMediaViewerModal
        isOpen={!!selectedViewerItem}
        onClose={() => setSelectedViewerItem(null)}
        item={selectedViewerItem}
        onSaveToDisk={handleSaveToDisk}
      />

      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        accounts={cloudAccounts}
        setAccounts={setCloudAccounts}
        onTriggerSyncAll={handleTriggerCloudSyncAll}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        rgbConfig={rgbConfig}
        setRgbConfig={setRgbConfig}
        darkTheme={darkTheme}
        setDarkTheme={setDarkTheme}
        os={os}
        setOs={setOs}
        speedSettings={speedSettings}
        setSpeedSettings={setSpeedSettings}
      />

      <FilePropertiesModal
        isOpen={!!selectedPropertiesItem}
        onClose={() => setSelectedPropertiesItem(null)}
        item={selectedPropertiesItem}
        onUpdateItem={(updated) => {
          setDownloads((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
        }}
      />

      <EncryptionVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        downloads={downloads}
        onOpenViewer={(item) => setSelectedViewerItem(item)}
      />
    </div>
  );
}

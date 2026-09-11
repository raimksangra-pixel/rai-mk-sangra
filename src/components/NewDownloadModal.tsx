import React, { useState } from 'react';
import {
  X,
  Link,
  Search,
  Download,
  Shield,
  Cloud,
  Folder,
  Zap,
  CheckCircle2,
  FileVideo,
  FileText,
  Music,
  Archive,
  Cpu,
  Layers,
  Sparkles,
  ClipboardPaste,
  Info,
} from 'lucide-react';
import { analyzeUrl, AnalyzedUrlResult, QUICK_URL_PRESETS } from '../utils/urlAnalyzer';
import { CategoryType, CloudProvider, DownloadItem } from '../types';
import { formatBytes } from '../utils/storage';

interface NewDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDownload: (item: Partial<DownloadItem>) => void;
}

export const NewDownloadModal: React.FC<NewDownloadModalProps> = ({
  isOpen,
  onClose,
  onAddDownload,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzedUrlResult | null>(null);

  // Editable configuration fields
  const [customFilename, setCustomFilename] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('video');
  const [enableEncryption, setEnableEncryption] = useState(false);
  const [encryptionPassphrase, setEncryptionPassphrase] = useState('');
  const [autoCloudSync, setAutoCloudSync] = useState(true);
  const [selectedCloudProvider, setSelectedCloudProvider] = useState<CloudProvider>('gdrive');
  const [targetDirectory, setTargetDirectory] = useState('C:\\Downloads\\');
  const [selectedQuality, setSelectedQuality] = useState('1080p (Full HD)');
  const [threadCount, setThreadCount] = useState(16);

  if (!isOpen) return null;

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text);
          triggerAnalysis(text);
        }
      }
    } catch {
      // Fallback
    }
  };

  const triggerAnalysis = (urlToAnalyze: string) => {
    if (!urlToAnalyze.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeUrl(urlToAnalyze);
      setAnalysis(result);
      setCustomFilename(result.filename);
      setSelectedCategory(result.category);
      setThreadCount(result.serverThreadsDetected);

      // Default directory based on category
      if (result.category === 'video') setTargetDirectory('C:\\Downloads\\Videos\\');
      else if (result.category === 'document') setTargetDirectory('C:\\Downloads\\Documents\\');
      else if (result.category === 'audio') setTargetDirectory('C:\\Downloads\\Music\\');
      else if (result.category === 'compressed') setTargetDirectory('C:\\Downloads\\Archives\\');
      else setTargetDirectory('C:\\Downloads\\Software\\');

      setIsAnalyzing(false);
    }, 450);
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrlInput(presetUrl);
    triggerAnalysis(presetUrl);
  };

  const handleStartDownload = () => {
    const finalFilename = customFilename.trim() || analysis?.filename || 'downloaded_file.bin';
    const totalBytes = analysis?.estimatedSizeBytes || 50 * 1024 * 1024;
    const finalCategory = selectedCategory || analysis?.category || 'other';

    const newItem: Partial<DownloadItem> = {
      url: urlInput,
      filename: finalFilename,
      category: finalCategory,
      totalBytes,
      downloadedBytes: 0,
      progress: 0,
      speedBytesPerSec: 35 * 1024 * 1024, // 35 MB/s initial turbo speed
      etaSeconds: Math.ceil(totalBytes / (35 * 1024 * 1024)),
      status: 'downloading',
      threadsCount: threadCount,
      threads: Array.from({ length: threadCount }, (_, i) => ({
        id: i + 1,
        progress: Math.floor(Math.random() * 5),
        speed: '3.2 MB/s',
      })),
      dateAdded: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isEncrypted: enableEncryption,
      encryptionKeyHint: enableEncryption ? (encryptionPassphrase ? `Passphrase protected` : 'Default Vault Key') : undefined,
      mimeType: analysis?.mimeType || 'application/octet-stream',
      offlineType: analysis?.offlineType || 'raw',
      offlineContentUrl: analysis?.defaultOfflinePreviewUrl,
      offlineTextContent: analysis?.defaultOfflineText,
      cloudSync: {
        status: autoCloudSync ? 'pending' : 'local_only',
        provider: selectedCloudProvider,
      },
      saveDirectory: targetDirectory,
      sha256Checksum: 'auto-calculating-upon-completion',
      customTags: [analysis?.extension?.toUpperCase() || 'FILE', `${threadCount}x Speed`],
    };

    onAddDownload(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="modal-new-download"
        className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 0 40px rgba(99, 102, 241, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 shadow-md">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                New Accelerated Download
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Turbo 16x
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Paste any internet URL or media stream to probe and download at maximum speed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* URL Input & Deep Probe Section */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Source URL or Network Stream</span>
              <span className="text-[11px] text-indigo-400 font-mono">Auto-Sniffer Enabled</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="input-download-url"
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (e.target.value.includes('http')) {
                      triggerAnalysis(e.target.value);
                    }
                  }}
                  placeholder="https://example.com/file.mp4, YouTube link, PDF document, or ISO..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <button
                type="button"
                onClick={handlePasteClipboard}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="h-4 w-4 text-indigo-400" />
                <span>Paste</span>
              </button>

              <button
                type="button"
                onClick={() => triggerAnalysis(urlInput)}
                disabled={isAnalyzing || !urlInput.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-xs font-medium text-white hover:brightness-110 disabled:opacity-50 transition-all shadow-md"
              >
                {isAnalyzing ? (
                  <>
                    <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Probing...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-3.5 w-3.5" />
                    <span>Probe Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Presets for 1-click test */}
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Quick Test Links:</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {QUICK_URL_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className="rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1 text-[11px] text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-200 transition-colors"
                >
                  <span className="font-semibold text-indigo-300">[{preset.type}]</span> {preset.label.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Card Results */}
          {analysis && (
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">
                    Network Stream Verified &amp; Ready
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-indigo-300 font-mono">
                  <span>SSL TLS: Secure</span>
                  <span>|</span>
                  <span>Parallel Threads: {analysis.serverThreadsDetected}x</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Target Filename</label>
                  <input
                    type="text"
                    value={customFilename}
                    onChange={(e) => setCustomFilename(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Category &amp; Type</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as CategoryType)}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="video">Video Media (MP4 / MKV / Stream)</option>
                    <option value="document">Document (PDF / DOCX / Text)</option>
                    <option value="audio">Music / Audio (MP3 / FLAC)</option>
                    <option value="compressed">Compressed Archive (ZIP / RAR)</option>
                    <option value="program">Executable / Software / ISO</option>
                    <option value="image">Image (PNG / JPG / Vector)</option>
                    <option value="other">General Binary</option>
                  </select>
                </div>
              </div>

              {/* Video Quality Selector if applicable */}
              {analysis.videoQualityOptions && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Stream Resolution / Quality</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {analysis.videoQualityOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedQuality(opt.resolution)}
                        className={`rounded-lg p-2 text-left text-[11px] border transition-all ${
                          selectedQuality === opt.resolution
                            ? 'border-indigo-500 bg-indigo-600/30 text-white font-semibold'
                            : 'border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="font-medium">{opt.resolution}</div>
                        <div className="text-[10px] text-slate-400">{opt.sizeEstimate}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <span>Estimated Size: <strong className="text-white font-mono">{formatBytes(analysis.estimatedSizeBytes)}</strong></span>
                <span>MIME: <span className="font-mono text-slate-400">{analysis.mimeType}</span></span>
              </div>
            </div>
          )}

          {/* Advanced Configurations: Encryption, Cloud Sync, Target Dir */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Security &amp; Storage Pipeline
            </h3>

            {/* AES-256 GCM Toggle */}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-medium text-white flex items-center gap-2">
                      AES-256 GCM Military-Grade Encryption
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 rounded">Zero-Knowledge</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Encrypt downloaded payload locally with hardware-accelerated cipher
                    </div>
                  </div>
                </div>
                <input
                  id="checkbox-encryption"
                  type="checkbox"
                  checked={enableEncryption}
                  onChange={(e) => setEnableEncryption(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                />
              </div>

              {enableEncryption && (
                <div className="mt-3 pt-2 border-t border-white/10">
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Custom Decryption Passphrase (Optional, leave blank for master key):
                  </label>
                  <input
                    type="password"
                    value={encryptionPassphrase}
                    onChange={(e) => setEncryptionPassphrase(e.target.value)}
                    placeholder="Enter custom passphrase or auto-generate"
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Cloud Auto-Sync Toggle */}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-sky-400" />
                  <div>
                    <div className="text-xs font-medium text-white">
                      Seamless Cross-Device Cloud Synchronization
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Automatically sync completed file to connected cloud storage
                    </div>
                  </div>
                </div>
                <input
                  id="checkbox-cloud-sync"
                  type="checkbox"
                  checked={autoCloudSync}
                  onChange={(e) => setAutoCloudSync(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                />
              </div>

              {autoCloudSync && (
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">Target Cloud:</span>
                  <select
                    value={selectedCloudProvider}
                    onChange={(e) => setSelectedCloudProvider(e.target.value as CloudProvider)}
                    className="rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="gdrive">Google Drive (Connected)</option>
                    <option value="dropbox">Dropbox (Connected)</option>
                    <option value="onedrive">Microsoft OneDrive</option>
                    <option value="nextcloud">Nextcloud / WebDAV</option>
                  </select>
                </div>
              )}
            </div>

            {/* Save Directory & Threads */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-400 block mb-1">Save Directory</label>
                <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/70 px-2.5 py-1.5 text-xs text-slate-300 font-mono">
                  <Folder className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <input
                    type="text"
                    value={targetDirectory}
                    onChange={(e) => setTargetDirectory(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Connection Threads</label>
                <select
                  value={threadCount}
                  onChange={(e) => setThreadCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value={8}>8 Connections</option>
                  <option value={16}>16 Connections (Turbo)</option>
                  <option value={32}>32 Connections (Extreme)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-start-download-confirm"
            type="button"
            disabled={!urlInput.trim()}
            onClick={handleStartDownload}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:brightness-110 disabled:opacity-50 transition-all"
          >
            <Zap className="h-4 w-4" />
            <span>Launch Accelerated Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

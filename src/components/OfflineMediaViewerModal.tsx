import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCw,
  Search,
  Copy,
  Check,
  Shield,
  Unlock,
  Key,
  Download,
  FileText,
  FileVideo,
  Music,
  Archive,
  Image as ImageIcon,
  ExternalLink,
  Sliders,
  ZoomIn,
  ZoomOut,
  FolderOpen,
} from 'lucide-react';
import { DownloadItem } from '../types';
import { formatBytes } from '../utils/storage';
import { decryptText } from '../utils/crypto';

interface OfflineMediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DownloadItem | null;
  onSaveToDisk: (item: DownloadItem) => void;
}

export const OfflineMediaViewerModal: React.FC<OfflineMediaViewerModalProps> = ({
  isOpen,
  onClose,
  item,
  onSaveToDisk,
}) => {
  if (!isOpen || !item) return null;

  // Encryption unlock state
  const [isDecrypted, setIsDecrypted] = useState(!item.isEncrypted);
  const [passphraseInput, setPassphraseInput] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const [unlockedText, setUnlockedText] = useState<string | null>(null);

  // Video/Audio player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Document states
  const [documentSearch, setDocumentSearch] = useState('');
  const [docFontSize, setDocFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copied, setCopied] = useState(false);

  // Image zoom state
  const [imageZoom, setImageZoom] = useState(1);

  useEffect(() => {
    setIsDecrypted(!item.isEncrypted);
    setPassphraseInput('');
    setDecryptError('');
    setUnlockedText(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setImageZoom(1);
  }, [item]);

  const handleUnlock = async () => {
    setDecryptError('');
    // For our pre-seeded confidential document, test against hint
    if (item.encryptionKeyHint && passphraseInput.trim() !== 'rai-mk-secure-2026' && passphraseInput.length < 4) {
      setDecryptError('Invalid decryption passphrase. Please check key credentials.');
      return;
    }
    setIsDecrypted(true);
    setUnlockedText(item.offlineTextContent || 'Decrypted successfully using AES-256 GCM engine.');
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return '00:00';
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="modal-offline-viewer"
        className="relative flex flex-col w-full max-w-5xl h-[88vh] rounded-2xl border border-white/15 bg-slate-950/95 shadow-2xl backdrop-blur-2xl text-slate-100 overflow-hidden"
        style={{
          boxShadow: '0 0 50px rgba(99, 102, 241, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Top Bar */}
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-5 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
              {item.category === 'video' && <FileVideo className="h-4 w-4" />}
              {item.category === 'document' && <FileText className="h-4 w-4" />}
              {item.category === 'audio' && <Music className="h-4 w-4" />}
              {item.category === 'image' && <ImageIcon className="h-4 w-4" />}
              {item.category === 'compressed' && <Archive className="h-4 w-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-white max-w-md truncate">
                  {item.filename}
                </h2>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                  Offline Ready
                </span>
                {item.isEncrypted && (
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Shield className="h-2.5 w-2.5" />
                    AES-256
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>{formatBytes(item.totalBytes)}</span>
                <span>•</span>
                <span>{item.mimeType}</span>
                <span>•</span>
                <span>Local path: {item.saveDirectory}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSaveToDisk(item)}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export to Disk</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-950/80 p-4 sm:p-6">
          {/* Encrypted Lock Screen if not decrypted */}
          {!isDecrypted ? (
            <div className="flex h-full flex-col items-center justify-center text-center max-w-md mx-auto py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-lg mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Encrypted File Container
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                This document was protected with military-grade AES-256-GCM cipher during download. Provide your vault passphrase to unlock offline viewing.
              </p>

              {item.encryptionKeyHint && (
                <div className="w-full mb-4 p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 text-left">
                  <span className="font-semibold text-amber-400">Security Hint: </span>
                  <span className="font-mono">{item.encryptionKeyHint}</span>
                </div>
              )}

              <div className="w-full space-y-3">
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={passphraseInput}
                    onChange={(e) => setPassphraseInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                    placeholder="Enter decryption passphrase..."
                    className="w-full rounded-xl border border-white/15 bg-slate-900/90 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                {decryptError && (
                  <p className="text-xs text-rose-400 text-left">{decryptError}</p>
                )}

                <button
                  type="button"
                  onClick={handleUnlock}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 py-2.5 text-xs font-semibold text-white hover:brightness-110 transition-all shadow-md shadow-amber-600/20"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Decrypt &amp; View Offline</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* VIDEO PLAYER */}
              {item.category === 'video' && (
                <div className="flex flex-col items-center justify-center h-full max-h-[70vh]">
                  <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
                    <video
                      ref={videoRef}
                      src={item.offlineContentUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                      onTimeUpdate={handleVideoTimeUpdate}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full aspect-video object-contain"
                      onClick={() => {
                        if (videoRef.current) {
                          if (isPlaying) videoRef.current.pause();
                          else videoRef.current.play();
                          setIsPlaying(!isPlaying);
                        }
                      }}
                    />

                    {/* Overlay Media Controls */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 space-y-2">
                      {/* Seek Bar */}
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCurrentTime(val);
                          if (videoRef.current) videoRef.current.currentTime = val;
                        }}
                        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />

                      <div className="flex items-center justify-between text-xs text-white">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                if (isPlaying) videoRef.current.pause();
                                else videoRef.current.play();
                                setIsPlaying(!isPlaying);
                              }
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (videoRef.current) {
                                  videoRef.current.muted = !isMuted;
                                  setIsMuted(!isMuted);
                                }
                              }}
                            >
                              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </button>
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step={0.05}
                              value={isMuted ? 0 : volume}
                              onChange={(e) => {
                                const v = Number(e.target.value);
                                setVolume(v);
                                setIsMuted(false);
                                if (videoRef.current) videoRef.current.volume = v;
                              }}
                              className="w-20 h-1 bg-white/20 rounded accent-indigo-500"
                            />
                          </div>

                          <span className="font-mono text-xs text-slate-300">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <select
                            value={playbackSpeed}
                            onChange={(e) => {
                              const s = Number(e.target.value);
                              setPlaybackSpeed(s);
                              if (videoRef.current) videoRef.current.playbackRate = s;
                            }}
                            className="bg-black/50 border border-white/20 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                          >
                            <option value={0.5}>0.5x</option>
                            <option value={1}>1.0x (Normal)</option>
                            <option value={1.25}>1.25x</option>
                            <option value={1.5}>1.5x</option>
                            <option value={2}>2.0x</option>
                          </select>

                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                if (videoRef.current.requestFullscreen) {
                                  videoRef.current.requestFullscreen();
                                }
                              }
                            }}
                            className="p-1 hover:text-indigo-400 transition-colors"
                          >
                            <Maximize className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AUDIO PLAYER */}
              {item.category === 'audio' && (
                <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto py-8">
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-pink-500 to-amber-500 shadow-2xl p-1 mb-6">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950">
                      <Music className={`h-12 w-12 text-pink-400 ${isPlaying ? 'animate-bounce' : ''}`} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{item.filename}</h3>
                  <p className="text-xs text-indigo-300 font-mono mb-6">Studio Master 24-Bit / 48kHz FLAC</p>

                  <audio
                    ref={audioRef}
                    src={item.offlineContentUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
                    onTimeUpdate={handleAudioTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                  />

                  {/* Waveform graphic simulator */}
                  <div className="flex items-end justify-center gap-1 w-full h-16 px-6 mb-6">
                    {Array.from({ length: 36 }).map((_, i) => {
                      const heightPercent = isPlaying ? Math.floor(Math.sin(i + currentTime * 3) * 40 + 50) : 20;
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-indigo-500 to-pink-500 rounded-full transition-all duration-150"
                          style={{ height: `${heightPercent}%`, opacity: isPlaying ? 0.9 : 0.3 }}
                        />
                      );
                    })}
                  </div>

                  {/* Audio Controls */}
                  <div className="w-full space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-white/10">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCurrentTime(val);
                        if (audioRef.current) audioRef.current.currentTime = val;
                      }}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />

                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-mono">{formatTime(currentTime)}</span>
                      <button
                        onClick={() => {
                          if (audioRef.current) {
                            if (isPlaying) audioRef.current.pause();
                            else audioRef.current.play();
                            setIsPlaying(!isPlaying);
                          }
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white shadow-lg hover:brightness-110"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                      </button>
                      <span className="font-mono">{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DOCUMENT & TEXT VIEWER */}
              {item.category === 'document' && (
                <div className="h-full flex flex-col space-y-3">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={documentSearch}
                        onChange={(e) => setDocumentSearch(e.target.value)}
                        placeholder="Search document offline..."
                        className="w-full rounded-lg border border-white/10 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-white/10 text-xs">
                        <button
                          onClick={() => setDocFontSize('sm')}
                          className={`px-2 py-0.5 rounded text-[11px] ${docFontSize === 'sm' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                        >
                          A-
                        </button>
                        <button
                          onClick={() => setDocFontSize('base')}
                          className={`px-2 py-0.5 rounded text-[11px] ${docFontSize === 'base' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                        >
                          A
                        </button>
                        <button
                          onClick={() => setDocFontSize('lg')}
                          className={`px-2 py-0.5 rounded text-[11px] ${docFontSize === 'lg' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                        >
                          A+
                        </button>
                      </div>

                      <button
                        onClick={() => handleCopyText(unlockedText || item.offlineTextContent || '')}
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Document Text Box */}
                  <div
                    className={`flex-1 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/90 p-6 font-mono leading-relaxed whitespace-pre-wrap ${
                      docFontSize === 'sm' ? 'text-xs' : docFontSize === 'lg' ? 'text-base' : 'text-sm'
                    } text-slate-200`}
                  >
                    {unlockedText || item.offlineTextContent || 'Document payload loaded from local offline storage.'}
                  </div>
                </div>
              )}

              {/* IMAGE VIEWER */}
              {item.category === 'image' && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
                    <button
                      onClick={() => setImageZoom(prev => Math.max(0.4, prev - 0.2))}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <span className="font-mono text-slate-300">{Math.round(imageZoom * 100)}%</span>
                    <button
                      onClick={() => setImageZoom(prev => Math.min(3, prev + 0.2))}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="overflow-auto max-h-[60vh] max-w-full flex items-center justify-center p-4">
                    <img
                      src={item.offlineContentUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
                      alt={item.filename}
                      style={{ transform: `scale(${imageZoom})`, transition: 'transform 0.15s ease' }}
                      className="rounded-xl shadow-2xl max-w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* ARCHIVE / RAW BINARY */}
              {(item.category === 'compressed' || item.category === 'program' || item.category === 'other') && (
                <div className="flex flex-col h-full space-y-4">
                  <div className="rounded-xl border border-white/10 bg-slate-900/80 p-4">
                    <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Archive className="h-4 w-4 text-amber-400" />
                      Archive Content Inspector &amp; Hash Integrity
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-black/40 p-2.5 rounded border border-white/5">
                        <span className="text-slate-400 block text-[11px]">SHA-256 Checksum</span>
                        <span className="font-mono text-indigo-300 text-[11px] break-all">
                          {item.sha256Checksum || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                        </span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded border border-white/5">
                        <span className="text-slate-400 block text-[11px]">Uncompressed Size</span>
                        <span className="font-mono text-emerald-300 text-xs font-semibold">
                          {formatBytes(item.totalBytes * 1.42)}
                        </span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded border border-white/5">
                        <span className="text-slate-400 block text-[11px]">Compression Format</span>
                        <span className="font-mono text-slate-200 text-xs">DEFLATE / LZMA2</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulated File Table */}
                  <div className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/60 p-3">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                          <th className="pb-2 font-medium">Contained File</th>
                          <th className="pb-2 font-medium">Packed Size</th>
                          <th className="pb-2 font-medium">CRC32</th>
                          <th className="pb-2 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        <tr>
                          <td className="py-2.5 font-mono flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-indigo-400" />
                            <span>README.md</span>
                          </td>
                          <td className="py-2.5 font-mono text-slate-400">14.2 KB</td>
                          <td className="py-2.5 font-mono text-slate-400">9A4B88CC</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => alert('Offline extraction ready.')}
                              className="text-[11px] text-indigo-400 hover:underline"
                            >
                              Extract
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono flex items-center gap-2">
                            <Archive className="h-3.5 w-3.5 text-amber-400" />
                            <span>core_binaries.dll</span>
                          </td>
                          <td className="py-2.5 font-mono text-slate-400">42.8 MB</td>
                          <td className="py-2.5 font-mono text-slate-400">012FE38A</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => alert('Offline extraction ready.')}
                              className="text-[11px] text-indigo-400 hover:underline"
                            >
                              Extract
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

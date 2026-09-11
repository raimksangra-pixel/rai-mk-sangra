import React from 'react';
import {
  Minus,
  Square,
  X,
  Radio,
  Zap,
  Shield,
  Layers,
  Sparkles,
  Laptop,
  CheckCircle2,
} from 'lucide-react';
import { DesktopOS, RGBConfig } from '../types';

interface DesktopTitleBarProps {
  os: DesktopOS;
  setOs: (os: DesktopOS) => void;
  rgbConfig: RGBConfig;
  setRgbConfig: React.Dispatch<React.SetStateAction<RGBConfig>>;
  totalDownloadSpeed: number;
  activeDownloadsCount: number;
  onOpenSettings: () => void;
  onOpenCloudSync: () => void;
}

export const DesktopTitleBar: React.FC<DesktopTitleBarProps> = ({
  os,
  setOs,
  rgbConfig,
  setRgbConfig,
  totalDownloadSpeed,
  activeDownloadsCount,
  onOpenSettings,
  onOpenCloudSync,
}) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  const formatSpeed = (bytesPerSec: number) => {
    if (bytesPerSec === 0) return '0.0 MB/s';
    return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
  };

  return (
    <header
      id="desktop-titlebar"
      className="relative z-30 flex h-11 w-full items-center justify-between border-b border-white/10 bg-slate-950/80 px-3 select-none backdrop-blur-md"
    >
      {/* Left side: OS window controls or brand badge */}
      <div className="flex items-center gap-3">
        {/* macOS Traffic Lights (if macOS chosen) */}
        {os === 'mac' && (
          <div className="flex items-center gap-2 mr-2">
            <button
              id="mac-btn-close"
              aria-label="Close"
              className="h-3 w-3 rounded-full bg-rose-500 hover:opacity-80 transition-opacity"
            />
            <button
              id="mac-btn-min"
              aria-label="Minimize"
              className="h-3 w-3 rounded-full bg-amber-500 hover:opacity-80 transition-opacity"
            />
            <button
              id="mac-btn-max"
              aria-label="Maximize"
              onClick={() => setIsMaximized(!isMaximized)}
              className="h-3 w-3 rounded-full bg-emerald-500 hover:opacity-80 transition-opacity"
            />
          </div>
        )}

        {/* Brand Icon & Name */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 shadow-md">
            <Zap className="h-3.5 w-3.5 text-white animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider text-xs sm:text-sm bg-gradient-to-r from-indigo-300 via-pink-300 to-emerald-300 bg-clip-text text-transparent">
              RAI MK DOWNLOAD MANAGER
            </span>
            <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
              v4.8 PRO
            </span>
          </div>
        </div>

        {/* Live Network Speed Ticker */}
        <div className="hidden md:flex items-center gap-3 ml-4 pl-3 border-l border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                  activeDownloadsCount > 0 ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  activeDownloadsCount > 0 ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </span>
            <span className="text-[11px] text-slate-400">Total Speed:</span>
            <span className="font-mono text-xs font-semibold text-emerald-400">
              {formatSpeed(totalDownloadSpeed)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Threads Active:</span>
            <span className="font-mono text-indigo-300 font-semibold">
              {activeDownloadsCount > 0 ? activeDownloadsCount * 16 : 0}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: OS & RGB breathing quick toggles */}
      <div className="flex items-center gap-2">
        {/* RGB Breathing Aura Quick Toggle */}
        <button
          id="btn-toggle-rgb"
          onClick={() => setRgbConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
            rgbConfig.enabled
              ? 'bg-gradient-to-r from-indigo-500/30 via-pink-500/30 to-emerald-500/30 border border-pink-500/40 text-pink-200 shadow-sm'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle RGB Breathing Effect"
        >
          <Sparkles className={`h-3 w-3 ${rgbConfig.enabled ? 'text-pink-400 animate-spin' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">RGB Aura:</span>
          <span className="font-semibold">{rgbConfig.enabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* OS Persona Selector */}
        <div className="hidden lg:flex items-center bg-slate-900/90 rounded-md p-0.5 border border-white/10 text-[11px]">
          <button
            id="os-tab-windows"
            onClick={() => setOs('windows')}
            className={`px-2 py-0.5 rounded transition-all ${
              os === 'windows' ? 'bg-indigo-600/60 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Windows
          </button>
          <button
            id="os-tab-mac"
            onClick={() => setOs('mac')}
            className={`px-2 py-0.5 rounded transition-all ${
              os === 'mac' ? 'bg-indigo-600/60 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            macOS
          </button>
          <button
            id="os-tab-linux"
            onClick={() => setOs('linux')}
            className={`px-2 py-0.5 rounded transition-all ${
              os === 'linux' ? 'bg-indigo-600/60 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Linux
          </button>
        </div>
      </div>

      {/* Right side: Windows / Linux Window buttons */}
      <div className="flex items-center gap-1">
        {os !== 'mac' ? (
          <div className="flex items-center">
            <button
              id="win-btn-minimize"
              aria-label="Minimize"
              className="flex h-7 w-9 items-center justify-center rounded text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              id="win-btn-maximize"
              aria-label="Maximize"
              onClick={() => setIsMaximized(!isMaximized)}
              className="flex h-7 w-9 items-center justify-center rounded text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Square className="h-3 w-3" />
            </button>
            <button
              id="win-btn-close"
              aria-label="Close"
              className="flex h-7 w-9 items-center justify-center rounded text-slate-400 hover:bg-rose-600 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-6" />
        )}
      </div>
    </header>
  );
};

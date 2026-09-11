import React from 'react';
import {
  X,
  Sparkles,
  Sliders,
  Moon,
  Laptop,
  Zap,
  Globe,
  Shield,
  Gauge,
  Check,
  Cpu,
} from 'lucide-react';
import { DarkTheme, DesktopOS, RGBConfig, RGBPalette, SpeedSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rgbConfig: RGBConfig;
  setRgbConfig: React.Dispatch<React.SetStateAction<RGBConfig>>;
  darkTheme: DarkTheme;
  setDarkTheme: (theme: DarkTheme) => void;
  os: DesktopOS;
  setOs: (os: DesktopOS) => void;
  speedSettings: SpeedSettings;
  setSpeedSettings: React.Dispatch<React.SetStateAction<SpeedSettings>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  rgbConfig,
  setRgbConfig,
  darkTheme,
  setDarkTheme,
  os,
  setOs,
  speedSettings,
  setSpeedSettings,
}) => {
  if (!isOpen) return null;

  const rgbPalettes: { id: RGBPalette; name: string; gradient: string }[] = [
    { id: 'cyber', name: 'Cyberpunk Neon', gradient: 'from-indigo-500 via-pink-500 to-emerald-500' },
    { id: 'aurora', name: 'Aurora Borealis', gradient: 'from-emerald-400 via-teal-400 to-sky-400' },
    { id: 'neon_violet', name: 'Deep Violet', gradient: 'from-purple-500 via-pink-500 to-rose-500' },
    { id: 'matrix', name: 'Matrix Emerald', gradient: 'from-emerald-500 via-green-400 to-lime-400' },
    { id: 'sunset', name: 'Vaporwave Sunset', gradient: 'from-amber-400 via-rose-500 to-purple-600' },
    { id: 'ice', name: 'Glacial Ice Blue', gradient: 'from-cyan-400 via-blue-500 to-indigo-600' },
  ];

  const darkThemes: { id: DarkTheme; name: string; desc: string; bg: string }[] = [
    { id: 'obsidian', name: 'Obsidian Glass', desc: 'Deep cosmic slate with specular reflections', bg: 'bg-slate-950' },
    { id: 'oled', name: 'Midnight OLED', desc: 'True #000000 black with zero eye strain', bg: 'bg-black' },
    { id: 'mica', name: 'Windows Mica', desc: 'Acrylic blur matched to Windows 11 Fluent', bg: 'bg-slate-900' },
    { id: 'nord', name: 'Nord Frost', desc: 'Cool arctic Scandinavian slate palette', bg: 'bg-zinc-900' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="modal-settings"
        className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 0 45px rgba(99, 102, 241, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-md">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Manager Preferences &amp; UI Customizer
              </h2>
              <p className="text-xs text-slate-400">
                Configure RGB aura breathing, dark themes, speed limiter, and browser integration
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

        {/* SECTION 1: RGB BREATHING EFFECT */}
        <div className="mt-5 space-y-4 rounded-xl border border-pink-500/30 bg-pink-950/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-pink-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                RGB Breathing &amp; Glass Glow Aura
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="toggle-rgb-effect"
                type="checkbox"
                checked={rgbConfig.enabled}
                onChange={(e) => setRgbConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-pink-500" />
            </label>
          </div>

          {rgbConfig.enabled && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1.5 font-medium">Color Palette Spectrum</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {rgbPalettes.map((pal) => (
                    <button
                      key={pal.id}
                      onClick={() => setRgbConfig(prev => ({ ...prev, palette: pal.id }))}
                      className={`flex items-center gap-2 rounded-lg p-2 text-xs border transition-all ${
                        rgbConfig.palette === pal.id
                          ? 'border-pink-500 bg-pink-600/20 text-white font-semibold shadow-sm'
                          : 'border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div className={`h-3.5 w-3.5 rounded-full bg-gradient-to-r ${pal.gradient} shadow-sm shrink-0`} />
                      <span className="truncate">{pal.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Breathing Cycle Duration:</span>
                    <span className="font-mono text-pink-300">{rgbConfig.breathingSpeedSeconds}s</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    step={0.5}
                    value={rgbConfig.breathingSpeedSeconds}
                    onChange={(e) =>
                      setRgbConfig(prev => ({ ...prev, breathingSpeedSeconds: Number(e.target.value) }))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded accent-pink-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 font-mono">
                    <span>2s (Fast)</span>
                    <span>8s (Gentle)</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Aura Glow Intensity</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['subtle', 'vibrant', 'ultra'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setRgbConfig(prev => ({ ...prev, intensity: lvl }))}
                        className={`rounded-lg py-1.5 text-center text-xs capitalize border ${
                          rgbConfig.intensity === lvl
                            ? 'border-pink-500 bg-pink-600/30 text-white font-medium'
                            : 'border-white/10 bg-slate-950/50 text-slate-400'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: CUSTOMIZABLE DARK THEME */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Customizable Dark Theme &amp; Surface
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {darkThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setDarkTheme(theme.id)}
                className={`flex items-start gap-3 rounded-xl p-3 border text-left transition-all ${
                  darkTheme === theme.id
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-sm'
                    : 'border-white/10 bg-slate-950/60 hover:bg-white/5'
                }`}
              >
                <div className={`h-8 w-8 rounded-lg ${theme.bg} border border-white/20 flex items-center justify-center shrink-0`}>
                  {darkTheme === theme.id && <Check className="h-4 w-4 text-indigo-400" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{theme.name}</div>
                  <div className="text-[11px] text-slate-400">{theme.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 3: DESKTOP OS SELECTION */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2">
            <Laptop className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Desktop Platform Aesthetic Compatibility
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['windows', 'mac', 'linux'] as DesktopOS[]).map((p) => (
              <button
                key={p}
                onClick={() => setOs(p)}
                className={`rounded-xl p-3 text-center border capitalize text-xs transition-all ${
                  os === p
                    ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 font-semibold shadow-sm'
                    : 'border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="font-bold">{p === 'mac' ? 'macOS Sequoia' : p === 'windows' ? 'Windows 11' : 'Linux GNOME'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {p === 'mac' ? 'Traffic Lights UI' : p === 'windows' ? 'Fluent Mica Frame' : 'GTK Dark Header'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 4: MAX SPEED & THREAD LIMITER */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Download Acceleration Engine &amp; Bandwidth Limiter
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white">Acceleration Mode</span>
                <span className="text-[11px] text-slate-400 block">Number of segmented socket connections</span>
              </div>
              <select
                value={speedSettings.maxThreadsPerDownload}
                onChange={(e) =>
                  setSpeedSettings(prev => ({ ...prev, maxThreadsPerDownload: Number(e.target.value) }))
                }
                className="rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1 text-xs text-white focus:outline-none"
              >
                <option value={8}>8 Segments (Standard)</option>
                <option value={16}>16 Segments (Turbo Boost)</option>
                <option value={32}>32 Segments (Extreme Multi-Thread)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Bandwidth Speed Limiter:</span>
                <span className="font-mono text-amber-400">
                  {speedSettings.mode === 'unlimited' ? 'Unlimited (Max Speed)' : `${speedSettings.cappedSpeedKBps / 1000} MB/s`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setSpeedSettings(prev => ({
                      ...prev,
                      mode: prev.mode === 'unlimited' ? 'capped' : 'unlimited',
                    }))
                  }
                  className={`rounded-lg px-3 py-1 text-xs font-semibold border ${
                    speedSettings.mode === 'unlimited'
                      ? 'border-emerald-500 bg-emerald-600/30 text-emerald-300'
                      : 'border-white/10 bg-slate-900 text-slate-400'
                  }`}
                >
                  {speedSettings.mode === 'unlimited' ? 'Unlimited Turbo' : 'Speed Limit Active'}
                </button>

                {speedSettings.mode === 'capped' && (
                  <input
                    type="range"
                    min={1000}
                    max={50000}
                    step={1000}
                    value={speedSettings.cappedSpeedKBps}
                    onChange={(e) =>
                      setSpeedSettings(prev => ({ ...prev, cappedSpeedKBps: Number(e.target.value) }))
                    }
                    className="flex-1 h-1.5 bg-slate-800 rounded accent-amber-500"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: BROWSER INTEGRATION */}
        <div className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
            <Globe className="h-4 w-4" />
            <span>Universal Browser Integration (Chrome / Edge / Firefox / Brave)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            RAI MK Download Manager automatically intercepts file and media links across any web browser. You can also paste any webpage or direct download URL into the sniffer to detect and extract multi-stream audio, 4K video, or documents instantly.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:brightness-110 transition-all"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

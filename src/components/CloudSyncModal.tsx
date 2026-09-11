import React, { useState } from 'react';
import {
  X,
  Cloud,
  RefreshCw,
  CheckCircle2,
  HardDrive,
  Share2,
  Copy,
  Check,
  Laptop,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { CloudAccount, CloudProvider } from '../types';
import { formatBytes } from '../utils/storage';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: CloudAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<CloudAccount[]>>;
  onTriggerSyncAll: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  accounts,
  setAccounts,
  onTriggerSyncAll,
}) => {
  const [syncCode, setSyncCode] = useState('RAI-MK-SYNC-9824-CROSSDEV');
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    onTriggerSyncAll();
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  const toggleAccountAutoSync = (provider: CloudProvider) => {
    setAccounts(prev =>
      prev.map(acc => (acc.provider === provider ? { ...acc, autoSync: !acc.autoSync } : acc))
    );
  };

  const toggleAccountConnection = (provider: CloudProvider) => {
    setAccounts(prev =>
      prev.map(acc => (acc.provider === provider ? { ...acc, connected: !acc.connected } : acc))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="modal-cloud-sync"
        className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 0 45px rgba(56, 189, 248, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Cloud Synchronization &amp; Cross-Device Access
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30">
                  Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Mirror your download queue and offline vaults across PC, laptops, and mobile
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

        {/* Cross Device Pairing Card */}
        <div className="mt-5 rounded-xl border border-sky-500/30 bg-sky-950/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-bold text-white">
                Cross-Device Sync Pair Token
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Laptop className="h-3.5 w-3.5 text-slate-300" />
              <ArrowRight className="h-3 w-3 text-sky-400" />
              <Smartphone className="h-3.5 w-3.5 text-slate-300" />
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Use this secure token to link your second PC, Mac, or mobile phone to this instance. Downloads started on any device will synchronize automatically with your encrypted cloud drive.
          </p>

          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 font-mono text-xs text-sky-300 font-semibold tracking-wider">
              {syncCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 rounded-lg bg-sky-600/30 border border-sky-500/40 px-3 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-600/50 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Connected Cloud Accounts List */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Connected Cloud Drives
            </h3>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing...' : 'Sync All Files Now'}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {accounts.map((acc) => {
              const usagePercent = acc.totalBytes > 0 ? (acc.usedBytes / acc.totalBytes) * 100 : 0;
              return (
                <div
                  key={acc.provider}
                  className="rounded-xl border border-white/10 bg-slate-950/60 p-3.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                        <HardDrive className="h-4 w-4 text-sky-400" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          {acc.name}
                          {acc.connected && (
                            <span className="h-2 w-2 rounded-full bg-emerald-400" title="Connected" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {acc.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {acc.connected ? (
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] text-slate-400 flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={acc.autoSync}
                              onChange={() => toggleAccountAutoSync(acc.provider)}
                              className="rounded bg-slate-900 border-white/20 text-sky-600 focus:ring-0"
                            />
                            Auto-sync
                          </label>
                          <button
                            onClick={() => toggleAccountConnection(acc.provider)}
                            className="text-[11px] text-rose-400 hover:underline ml-2"
                          >
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleAccountConnection(acc.provider)}
                          className="rounded-lg bg-indigo-600/30 border border-indigo-500/40 px-3 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-600/50 transition-colors"
                        >
                          Connect Drive
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quota bar if connected */}
                  {acc.connected && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Used: {formatBytes(acc.usedBytes)}</span>
                        <span>Capacity: {formatBytes(acc.totalBytes)}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-indigo-500"
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Close button */}
        <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

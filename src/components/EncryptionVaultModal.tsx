import React, { useState } from 'react';
import {
  X,
  Shield,
  Key,
  Lock,
  Unlock,
  RefreshCw,
  Copy,
  Check,
  FileText,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { DownloadItem } from '../types';
import { generateSecureKey } from '../utils/crypto';
import { formatBytes } from '../utils/storage';

interface EncryptionVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloads: DownloadItem[];
  onOpenViewer: (item: DownloadItem) => void;
}

export const EncryptionVaultModal: React.FC<EncryptionVaultModalProps> = ({
  isOpen,
  onClose,
  downloads,
  onOpenViewer,
}) => {
  if (!isOpen) return null;

  const [generatedKey, setGeneratedKey] = useState(generateSecureKey());
  const [copiedKey, setCopiedKey] = useState(false);

  const encryptedFiles = downloads.filter((d) => d.isEncrypted);

  const handleGenerateNewKey = () => {
    setGeneratedKey(generateSecureKey());
    setCopiedKey(false);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="modal-encryption-vault"
        className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 0 50px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AES-256 GCM Zero-Knowledge Vault
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Hardware Cipher
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                End-to-end client-side encryption for sensitive media and enterprise documents
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

        {/* Security Specs Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cipher Spec</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">AES-256-GCM</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Key Derivation</span>
            <span className="text-xs font-bold text-indigo-300 font-mono">PBKDF2 100k</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Protected Files</span>
            <span className="text-xs font-bold text-white font-mono">{encryptedFiles.length} Locked</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Integrity Auth</span>
            <span className="text-xs font-bold text-teal-300 font-mono">128-bit MAC</span>
          </div>
        </div>

        {/* Secure Key Generator */}
        <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Key className="h-4 w-4 text-emerald-400" />
              High-Entropy 256-Bit Vault Key Generator
            </span>
            <button
              onClick={handleGenerateNewKey}
              className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Regenerate</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 font-mono text-xs text-emerald-300 select-all overflow-x-auto">
              {generatedKey}
            </div>
            <button
              onClick={handleCopyKey}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600/30 border border-emerald-500/40 px-3 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-600/50 transition-colors"
            >
              {copiedKey ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Store this key in your password manager. Decryption occurs strictly within your device's memory; keys are never transmitted over the network.
          </p>
        </div>

        {/* Encrypted Items List */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Encrypted Vault Documents &amp; Binaries ({encryptedFiles.length})
          </h3>

          {encryptedFiles.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-6 text-center text-xs text-slate-400">
              No files currently encrypted. When starting a download, check "Enable AES-256 GCM Military-Grade Encryption".
            </div>
          ) : (
            <div className="space-y-2">
              {encryptedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 p-3 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white font-mono">{file.filename}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{formatBytes(file.totalBytes)}</span>
                        <span>•</span>
                        <span>{file.dateAdded}</span>
                        {file.encryptionKeyHint && (
                          <span className="text-emerald-400">({file.encryptionKeyHint})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenViewer(file);
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-600/40 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Decrypt &amp; View</span>
                  </button>
                </div>
              ))}
            </div>
          )}
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

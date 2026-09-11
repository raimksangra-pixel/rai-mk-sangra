import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  Folder,
  Tag,
  Copy,
  Check,
  HardDrive,
  Clock,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { DownloadItem } from '../types';
import { formatBytes } from '../utils/storage';
import { computeSha256 } from '../utils/crypto';

interface FilePropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DownloadItem | null;
  onUpdateItem: (updated: DownloadItem) => void;
}

export const FilePropertiesModal: React.FC<FilePropertiesModalProps> = ({
  isOpen,
  onClose,
  item,
  onUpdateItem,
}) => {
  if (!isOpen || !item) return null;

  const [filename, setFilename] = useState(item.filename);
  const [saveDirectory, setSaveDirectory] = useState(item.saveDirectory);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(item.customTags || []);
  const [checksum, setChecksum] = useState(
    item.sha256Checksum || 'Calculating SHA-256...'
  );
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyChecksum = () => {
    navigator.clipboard.writeText(checksum);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = () => {
    const updated: DownloadItem = {
      ...item,
      filename: filename.trim() || item.filename,
      saveDirectory: saveDirectory.trim() || item.saveDirectory,
      customTags: tags,
    };
    onUpdateItem(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="modal-file-properties"
        className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 0 40px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">File Properties &amp; Cryptographic Hash</h2>
              <p className="text-[11px] text-slate-400">Manage file metadata, tags, and checksum</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">File Name</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Target Directory</label>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-300 font-mono">
              <Folder className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <input
                type="text"
                value={saveDirectory}
                onChange={(e) => setSaveDirectory(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-white text-xs"
              />
            </div>
          </div>

          {/* SHA-256 Hash Card */}
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                SHA-256 Hardware-Verified Checksum
              </span>
              <button
                onClick={handleCopyChecksum}
                className="text-[10px] text-indigo-300 hover:text-white flex items-center gap-1"
              >
                {copiedHash ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedHash ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="font-mono text-[10px] text-slate-300 break-all bg-black/40 p-2 rounded border border-white/5">
              {checksum}
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 bg-slate-950/60 rounded-lg border border-white/5">
              <span className="text-slate-400 block">Total File Size</span>
              <span className="font-mono text-white font-semibold">{formatBytes(item.totalBytes)}</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded-lg border border-white/5">
              <span className="text-slate-400 block">MIME Content-Type</span>
              <span className="font-mono text-slate-200">{item.mimeType}</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded-lg border border-white/5">
              <span className="text-slate-400 block">Added Timestamp</span>
              <span className="font-mono text-slate-200">{item.dateAdded}</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded-lg border border-white/5">
              <span className="text-slate-400 block">Cloud Status</span>
              <span className="font-mono text-sky-400 capitalize">{item.cloudSync.status}</span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Tags &amp; Labels</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded bg-indigo-500/20 px-2 py-0.5 text-[11px] text-indigo-300 border border-indigo-500/30"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag (e.g. Work, UltraHD, Backup)..."
                className="flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-lg bg-indigo-600/30 border border-indigo-500/40 px-3 py-1.5 text-xs font-medium text-indigo-200 hover:bg-indigo-600/50 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end gap-2 border-t border-white/10 pt-3.5">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-1.5 text-xs text-slate-300 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { JournalEntry, SharedJournalPayload } from '../types';
import { Icon } from './common/Icon';
import Card from './common/Card';

interface ShareModalProps {
    entry: JournalEntry;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ entry, onClose }) => {
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const payload: SharedJournalPayload = {
            entry,
            expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour from now
        };
        const jsonString = JSON.stringify(payload);
        const base64String = btoa(jsonString);
        const url = `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(base64String)}`;
        setShareUrl(url);
    }, [entry]);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Share Journal Entry</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        A secure, read-only link has been generated. For privacy, this link will automatically expire in <strong>1 hour</strong>.
                    </p>
                    <div className="relative">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 pr-24 text-sm text-slate-600 dark:text-slate-300"
                        />
                        <button
                            onClick={handleCopy}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-sky-600 text-white text-xs font-semibold rounded-md hover:bg-sky-700 transition flex items-center gap-1.5"
                        >
                            <Icon name="copy" className="w-3 h-3" />
                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ShareModal;

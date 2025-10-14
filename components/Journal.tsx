import React, { useState } from 'react';
import { JournalEntry, Mood, JournalFeedback } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { Icon } from './common/Icon';
import Feedback from './common/Feedback';
import ShareModal from './ShareModal';

const moodEmoji: Record<Mood, string> = {
    [Mood.Joyful]: '😄',
    [Mood.Content]: '😊',
    [Mood.Neutral]: '😐',
    [Mood.Sad]: '😢',
    [Mood.Anxious]: '😟',
    [Mood.Stressed]: '😥',
    [Mood.Angry]: '😠',
};

const AnalysisDisplay: React.FC<{ analysis: JournalEntry['analysis'], isAnalyzing?: boolean }> = ({ analysis, isAnalyzing }) => {
    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center py-4">
                <Spinner />
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">MindWeave is analyzing your entry...</p>
            </div>
        );
    }
    
    if (!analysis) {
        return <p className="text-sm text-slate-500 dark:text-slate-400">AI analysis could not be generated for this entry.</p>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <span className="text-3xl">{moodEmoji[analysis.mood]}</span>
                <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">Detected Mood: {analysis.mood}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{analysis.keyInsight}</p>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Icon name="sparkles" className="w-4 h-4 text-sky-500" /> Thought Patterns</h4>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {analysis.thoughtPatterns.map((pattern, index) => <li key={index}>{pattern}</li>)}
                </ul>
            </div>
             <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Icon name="lightbulb" className="w-4 h-4 text-yellow-500" /> Coping Strategies</h4>
                <div className="mt-2 space-y-3">
                 {analysis.copingStrategies.map((strategy, index) => (
                        <div key={index} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                           <p className="font-medium text-slate-700 dark:text-slate-200">{strategy.title}</p>
                           <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{strategy.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const FeedbackDisplay: React.FC<{ feedback: JournalFeedback }> = ({ feedback }) => (
    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
        <div className="flex items-center gap-2">
            {feedback.rating === 'good' ? (
                <Icon name="thumbUp" className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
                <Icon name="thumbDown" className="w-4 h-4 text-red-600 dark:text-red-400" />
            )}
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Your Feedback: You found this {feedback.rating === 'good' ? 'helpful' : 'unhelpful'}.
            </p>
        </div>
        {feedback.comment && (
            <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-2 pl-6">
                "{feedback.comment}"
            </p>
        )}
    </div>
);


interface JournalProps {
    entries: JournalEntry[];
    addEntry: (text: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    updateJournalEntryFeedback: (entryId: string, feedback: JournalFeedback) => void;
}

const Journal: React.FC<JournalProps> = ({ entries, addEntry, isLoading, error, updateJournalEntryFeedback }) => {
    const [text, setText] = useState('');
    const [entryToShare, setEntryToShare] = useState<JournalEntry | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || isLoading) return;
        // Sanitize input to prevent XSS by stripping HTML tags.
        const sanitizedText = text.replace(/<[^>]*>?/gm, '');
        addEntry(sanitizedText);
        setText('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">AI Journal</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Write down your thoughts and get instant, gentle insights.</p>
            </div>
            
            <Card>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What's on your mind? The more you write, the better the insight..."
                        className="w-full h-40 p-3 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 resize-none dark:text-slate-200 dark:placeholder-slate-400"
                        disabled={isLoading}
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            disabled={isLoading || !text.trim()}
                            className="px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition flex items-center gap-2"
                        >
                            {isLoading ? <Spinner size="sm" /> : <Icon name="sparkles" className="w-4 h-4" />}
                            <span>{isLoading ? 'Analyzing...' : 'Analyze Entry'}</span>
                        </button>
                    </div>
                </form>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Past Entries</h2>
                {entries.length === 0 && (
                    <Card><p className="text-slate-500 dark:text-slate-400">Your journal entries will appear here.</p></Card>
                )}
                {entries.map(entry => (
                    <Card key={entry.id}>
                        <div className="flex justify-between items-start">
                            <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{new Date(entry.date).toLocaleString()}</p>
                            {entry.analysis && (
                                <button
                                    onClick={() => setEntryToShare(entry)}
                                    className="text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
                                    aria-label="Share entry"
                                >
                                    <Icon name="share" className="w-4 h-4"/>
                                </button>
                            )}
                        </div>
                        <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300">{entry.text}</p>
                        <div className="my-4 border-t border-slate-200 dark:border-slate-700"></div>
                        <AnalysisDisplay analysis={entry.analysis} isAnalyzing={entry.isAnalyzing} />
                        
                        {entry.analysis && !entry.feedback && (
                            <Feedback onSubmit={(feedbackData) => updateJournalEntryFeedback(entry.id, feedbackData)} />
                        )}
                        {entry.feedback && <FeedbackDisplay feedback={entry.feedback} />}
                    </Card>
                ))}
            </div>
            {entryToShare && <ShareModal entry={entryToShare} onClose={() => setEntryToShare(null)} />}
        </div>
    );
};

export default Journal;
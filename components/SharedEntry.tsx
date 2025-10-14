import React, { useState, useEffect } from 'react';
import { JournalEntry, Mood, SharedJournalPayload, JournalFeedback } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { Icon } from './common/Icon';

const moodEmoji: Record<Mood, string> = {
    [Mood.Joyful]: '😄',
    [Mood.Content]: '😊',
    [Mood.Neutral]: '😐',
    [Mood.Sad]: '😢',
    [Mood.Anxious]: '😟',
    [Mood.Stressed]: '😥',
    [Mood.Angry]: '😠',
};

const AnalysisDisplay: React.FC<{ analysis: JournalEntry['analysis'] }> = ({ analysis }) => {
    if (!analysis) return null;
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
                User Feedback: This analysis was rated as {feedback.rating === 'good' ? 'helpful' : 'unhelpful'}.
            </p>
        </div>
        {feedback.comment && (
            <p className="text-sm italic text-slate-500 dark:text-slate-400 mt-2 pl-6">
                Comment: "{feedback.comment}"
            </p>
        )}
    </div>
);

const SharedEntry: React.FC<{ data: string }> = ({ data }) => {
    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const decodedString = atob(data);
            const payload = JSON.parse(decodedString) as SharedJournalPayload;

            if (payload.expiresAt < Date.now()) {
                setError("This shared link has expired.");
                return;
            }
            if (!payload.entry || !payload.entry.id) {
                throw new Error("Invalid data structure.");
            }
            setEntry(payload.entry);
        } catch (e) {
            console.error("Failed to decode shared entry:", e);
            setError("This shared link is invalid or corrupted.");
        }
    }, [data]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            <header className="flex items-center gap-2 mb-8">
                <Icon name="logo" className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">MindWeave OS</h1>
            </header>

            <main className="w-full max-w-3xl">
                {!entry && !error && <Spinner />}
                {error && (
                    <Card>
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 text-center">Link Error</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-center mt-2">{error}</p>
                    </Card>
                )}
                {entry && (
                    <Card>
                        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-4">
                            This is a private, read-only journal entry shared with you.
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{new Date(entry.date).toLocaleString()}</p>
                        <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300">{entry.text}</p>
                        <div className="my-4 border-t border-slate-200 dark:border-slate-700"></div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">AI Analysis</h3>
                        <AnalysisDisplay analysis={entry.analysis} />
                        {entry.feedback && <FeedbackDisplay feedback={entry.feedback} />}
                    </Card>
                )}
            </main>
        </div>
    );
};

export default SharedEntry;

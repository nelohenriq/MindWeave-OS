import { useState, useCallback } from 'react';
import { JournalEntry, JournalAnalysis, JournalFeedback } from '../types';
import { analyzeJournalEntry } from '../services/geminiService';

export const useJournal = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addEntry = useCallback(async (text: string) => {
        if (isLoading) return;
        
        setIsLoading(true);
        setError(null);
        
        const entryId = new Date().toISOString() + Math.random();
        const newEntry: JournalEntry = {
            id: entryId,
            date: new Date().toISOString(),
            text,
            analysis: null,
            isAnalyzing: true,
        };

        // Add entry to the UI immediately in a loading state
        setEntries(prevEntries => [newEntry, ...prevEntries]);

        try {
            const analysisResult: JournalAnalysis = await analyzeJournalEntry(text);
            setEntries(prevEntries =>
                prevEntries.map(entry =>
                    entry.id === entryId ? { ...entry, analysis: analysisResult, isAnalyzing: false } : entry
                )
            );
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            // Update the entry to remove the loading state even if analysis fails
            setEntries(prevEntries =>
                prevEntries.map(entry =>
                    entry.id === entryId ? { ...entry, isAnalyzing: false } : entry
                )
            );
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const updateJournalEntryFeedback = useCallback((entryId: string, feedback: JournalFeedback) => {
        setEntries(prevEntries =>
            prevEntries.map(entry =>
                entry.id === entryId ? { ...entry, feedback } : entry
            )
        );
        // Log feedback to console for future use in refining AI suggestions
        console.log(`Feedback for entry ${entryId}:`, feedback);
    }, []);

    return { entries, addEntry, isLoading, error, updateJournalEntryFeedback };
};
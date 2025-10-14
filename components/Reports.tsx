import React, { useState, useMemo } from 'react';
import { JournalEntry } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { Icon } from './common/Icon';
import { generateJournalSummary } from '../services/geminiService';
import { marked } from 'marked';

type Period = 'weekly' | 'monthly';

const Reports: React.FC<{ entries: JournalEntry[] }> = ({ entries }) => {
    const [period, setPeriod] = useState<Period>('weekly');
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filteredEntries = useMemo(() => {
        const days = period === 'weekly' ? 7 : 30;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return entries
            .filter(entry => new Date(entry.date) >= cutoffDate && entry.analysis)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [entries, period]);

    const handleGenerate = async () => {
        if (filteredEntries.length === 0) return;
        setIsLoading(true);
        setError(null);
        setSummary('');

        try {
            const result = await generateJournalSummary(filteredEntries);
            const htmlResult = await marked.parse(result);
            setSummary(htmlResult);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Progress Reports</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Generate a summary of your recent activity and insights.</p>
            </div>
            
            <Card>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Select Period</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <button 
                                onClick={() => setPeriod('weekly')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${period === 'weekly' ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                            >
                                Last 7 Days
                            </button>
                            <button 
                                onClick={() => setPeriod('monthly')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${period === 'monthly' ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                            >
                                Last 30 Days
                            </button>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || filteredEntries.length === 0}
                            className="w-full px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Spinner size="sm" /> : <Icon name="sparkles" className="w-4 h-4" />}
                            <span>{isLoading ? 'Generating...' : 'Generate Report'}</span>
                        </button>
                    </div>
                </div>
                 {filteredEntries.length === 0 && (
                    <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-4">
                        No journal entries with analysis found for this period. Write some entries to generate a report.
                    </p>
                )}
            </Card>

            { (isLoading || error || summary) && (
                <Card>
                    {isLoading && <Spinner />}
                    {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
                    {summary && (
                         <div
                            className="prose prose-slate dark:prose-invert max-w-none prose-h2:text-xl prose-h2:font-semibold"
                            dangerouslySetInnerHTML={{ __html: summary }}
                        />
                    )}
                </Card>
            )}
        </div>
    );
};

export default Reports;
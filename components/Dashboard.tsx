import React, { useState, useEffect } from 'react';
import { JournalEntry, View } from '../types';
import Card from './common/Card';
import { Icon } from './common/Icon';
import MoodGraph from './MoodGraph';
import { generateDailyAffirmation } from '../services/geminiService';
import Spinner from './common/Spinner';

interface DashboardProps {
    journalEntries: JournalEntry[];
    setActiveView: (view: View) => void;
}

const QuickLink: React.FC<{
    view: View,
    icon: React.ComponentProps<typeof Icon>['name'],
    title: string,
    description: string,
    onClick: (view: View) => void
}> = ({ view, icon, title, description, onClick }) => (
    <button onClick={() => onClick(view)} className="w-full h-full text-left">
        <Card className="hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-md transition-all duration-200 h-full">
            <Icon name={icon} className="w-8 h-8 text-sky-500 mb-3"/>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </Card>
    </button>
);

const DailyAffirmationCard: React.FC<{ entries: JournalEntry[] }> = ({ entries }) => {
    const [affirmation, setAffirmation] = useState<{ text: string, isLoading: boolean }>({ text: '', isLoading: true });

    useEffect(() => {
        const getAffirmation = async () => {
            const today = new Date().toISOString().split('T')[0];
            const cachedData = localStorage.getItem('mindweave_affirmation');

            if (cachedData) {
                const { text, date } = JSON.parse(cachedData);
                if (date === today) {
                    setAffirmation({ text, isLoading: false });
                    return;
                }
            }

            try {
                const newAffirmation = await generateDailyAffirmation(entries);
                setAffirmation({ text: newAffirmation, isLoading: false });
                localStorage.setItem('mindweave_affirmation', JSON.stringify({ text: newAffirmation, date: today }));
            } catch (error) {
                console.error("Failed to fetch daily affirmation:", error);
                setAffirmation({ text: "May you be kind to yourself today.", isLoading: false });
            }
        };

        getAffirmation();
    }, [entries]);

    return (
         <Card>
            <div className="flex items-center gap-3">
                <Icon name="heart" className="w-6 h-6 text-rose-500" />
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Your Daily Affirmation</h2>
            </div>
            <div className="mt-3 pl-9 min-h-[40px] flex items-center">
                {affirmation.isLoading ? (
                    <Spinner size="sm" />
                ) : (
                    <p className="text-slate-600 dark:text-slate-300 italic">
                        "{affirmation.text}"
                    </p>
                )}
            </div>
        </Card>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ journalEntries, setActiveView }) => {
    const latestEntry = journalEntries.length > 0 ? journalEntries[0] : null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome back</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Here's a look at your mental landscape.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickLink 
                    view="journal"
                    icon="journal"
                    title="Write a Journal Entry"
                    description="Reflect on your day and gain new insights."
                    onClick={setActiveView}
                />
                 <QuickLink 
                    view="echoMind"
                    icon="echoMind"
                    title="Talk to EchoMind"
                    description="Engage in a supportive, therapeutic conversation."
                    onClick={setActiveView}
                />
                 <QuickLink 
                    view="selfSage"
                    icon="selfSage"
                    title="Explore SelfSage"
                    description="Learn about mental health topics and strategies."
                    onClick={setActiveView}
                />
            </div>
            
            <DailyAffirmationCard entries={journalEntries} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Moods</h2>
                    {journalEntries.length > 0 ? (
                         <MoodGraph entries={journalEntries.slice(0, 7).reverse()} />
                    ) : (
                         <div className="flex flex-col items-center justify-center h-48 text-center">
                            <Icon name="journal" className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-2"/>
                            <p className="text-slate-500 dark:text-slate-400">Your mood trend will appear here once you start journaling.</p>
                        </div>
                    )}
                   
                </Card>
                <Card>
                     <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Latest Insight</h2>
                     {latestEntry && latestEntry.analysis ? (
                         <div className="space-y-3">
                            <p className="text-sm text-slate-500 dark:text-slate-400">From your entry on {new Date(latestEntry.date).toLocaleDateString()}:</p>
                             <p className="italic text-slate-600 dark:text-slate-300 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                "{latestEntry.analysis.keyInsight}"
                             </p>
                            <button onClick={() => setActiveView('journal')} className="font-semibold text-sky-600 dark:text-sky-400 text-sm hover:underline">
                                Read full analysis &rarr;
                            </button>
                         </div>
                     ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-center">
                            <Icon name="lightbulb" className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-2"/>
                            <p className="text-slate-500 dark:text-slate-400">Your latest AI insight will appear here after you write a journal entry.</p>
                        </div>
                     )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
import React from 'react';
import { JournalEntry, Mood } from '../types';

interface MoodGraphProps {
    entries: JournalEntry[];
}

const moodToValue: Record<Mood, number> = {
    [Mood.Joyful]: 5,
    [Mood.Content]: 4,
    [Mood.Neutral]: 3,
    [Mood.Sad]: 2,
    [Mood.Anxious]: 1.5,
    [Mood.Stressed]: 1,
    [Mood.Angry]: 0.5,
};

const moodToColor: Record<Mood, string> = {
    [Mood.Joyful]: 'bg-green-400',
    [Mood.Content]: 'bg-sky-400',
    [Mood.Neutral]: 'bg-slate-400',
    [Mood.Sad]: 'bg-blue-500',
    [Mood.Anxious]: 'bg-purple-500',
    [Mood.Stressed]: 'bg-yellow-500',
    [Mood.Angry]: 'bg-red-500',
};

const MoodGraph: React.FC<MoodGraphProps> = ({ entries }) => {
    const validEntries = entries.filter(e => e.analysis);

    return (
        <div className="h-48 flex items-end justify-around gap-2 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            {validEntries.map(entry => (
                <div key={entry.id} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="w-full h-full flex items-end">
                       <div 
                         className={`w-full rounded-t-md transition-all duration-300 ${moodToColor[entry.analysis!.mood]}`}
                         style={{ height: `${(moodToValue[entry.analysis!.mood] / 5) * 100}%`}}
                       />
                    </div>
                    <p className="text-xs text-slate-400">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <div className="absolute bottom-12 mb-2 hidden group-hover:block px-2 py-1 bg-slate-800 text-white text-xs rounded-md shadow-lg">
                        {entry.analysis!.mood}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MoodGraph;

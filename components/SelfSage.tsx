import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { explainMentalHealthTopic } from '../services/geminiService';
import { Icon } from './common/Icon';
// A simple markdown to HTML converter
import { marked } from 'marked';

const topics = [
    'Anxiety',
    'Cognitive Distortions',
    'Mindfulness',
    'Self-Compassion',
    'Burnout',
    'Imposter Syndrome',
    'Setting Boundaries',
    'The Inner Critic',
];

const TopicCard: React.FC<{ topic: string, onSelect: (topic: string) => void }> = ({ topic, onSelect }) => (
    <button onClick={() => onSelect(topic)} className="w-full h-full text-left">
        <Card className="hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between">
            <div>
              <Icon name="book" className="w-8 h-8 text-sky-500 mb-3"/>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{topic}</h3>
            </div>
            <p className="text-sm text-sky-600 dark:text-sky-400 mt-4 font-medium">Learn more &rarr;</p>
        </Card>
    </button>
);

const SelfSage: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [explanation, setExplanation] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedTopic) {
            setExplanation('');
            return;
        }


        const fetchExplanation = async () => {
            setIsLoading(true);
            setError(null);
            setExplanation('');
            try {
                const result = await explainMentalHealthTopic(selectedTopic);
                const htmlResult = await marked.parse(result);
                setExplanation(htmlResult);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'An unknown error occurred.');
                setExplanation('');
            } finally {
                setIsLoading(false);
            }
        };

        fetchExplanation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTopic]);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">SelfSage Library</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Empower yourself with knowledge. Select a topic to learn more.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {topics.map(topic => (
                    <TopicCard key={topic} topic={topic} onSelect={setSelectedTopic} />
                ))}
            </div>

            {selectedTopic && (
                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedTopic}</h2>
                        {!isLoading && explanation && (
                           <div className="flex items-center gap-2 text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">
                               <Icon name="selfSage" className="w-3 h-3"/>
                               <span>Source Verified</span>
                           </div>
                        )}
                    </div>
                    {isLoading && <Spinner />}
                    {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
                    {explanation && (
                         <div
                            className="prose prose-slate dark:prose-invert max-w-none prose-h2:text-xl prose-h2:font-semibold"
                            dangerouslySetInnerHTML={{ __html: explanation }}
                        />
                    )}
                </Card>
            )}
        </div>
    );
};

export default SelfSage;
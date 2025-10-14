import React, { useState } from 'react';
import { Icon } from './Icon';

interface FeedbackProps {
    onSubmit: (feedback: { rating: 'good' | 'bad'; comment: string }) => void;
}

const Feedback: React.FC<FeedbackProps> = ({ onSubmit }) => {
    const [rating, setRating] = useState<'good' | 'bad' | null>(null);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleRatingClick = (newRating: 'good' | 'bad') => {
        // Allow user to select a rating, but not change it after selection
        if (!rating) {
            setRating(newRating);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating) {
            onSubmit({ rating, comment });
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className="mt-4 text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2 animate-fade-in-up">
                <Icon name="selfSage" className="w-4 h-4" />
                <span>Thank you for your feedback!</span>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Was this analysis helpful?</p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleRatingClick('good')}
                    disabled={!!rating}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 active:scale-90 disabled:cursor-default ${
                        rating === 'good'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                            : 'text-slate-500 bg-slate-100 hover:bg-green-100 hover:text-green-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-green-900/50 dark:hover:text-green-400 disabled:opacity-50'
                    }`}
                    aria-label="Helpful"
                >
                    <Icon name="thumbUp" className="w-3.5 h-3.5" />
                    <span>Helpful</span>
                </button>
                <button
                    onClick={() => handleRatingClick('bad')}
                    disabled={!!rating}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 active:scale-90 disabled:cursor-default ${
                        rating === 'bad'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                            : 'text-slate-500 bg-slate-100 hover:bg-red-100 hover:text-red-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-red-900/50 dark:hover:text-red-400 disabled:opacity-50'
                    }`}
                    aria-label="Not Helpful"
                >
                    <Icon name="thumbDown" className="w-3.5 h-3.5" />
                    <span>Not Helpful</span>
                </button>
            </div>

            {rating && (
                <form onSubmit={handleSubmit} className="mt-4 space-y-3 animate-fade-in-up">
                    <div>
                        <label htmlFor={`feedback-comment-${rating}`} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                            Why was this {rating === 'good' ? 'helpful' : 'unhelpful'}? (Optional)
                        </label>
                        <textarea
                            id={`feedback-comment-${rating}`}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Your feedback helps us improve..."
                            className="w-full h-20 p-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition duration-150 resize-none text-sm dark:text-slate-200 dark:placeholder-slate-400"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-1.5 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition"
                        >
                            Submit Feedback
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Feedback;
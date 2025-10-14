import React, { useState, useEffect } from 'react';

interface CalmModeProps {
    isOpen: boolean;
    onClose: () => void;
}

const BreathingExercise: React.FC = () => {
    const [instruction, setInstruction] = useState('Get ready...');
    const [key, setKey] = useState(0);

    useEffect(() => {
        const cycle = ['Breathe in...', 'Hold', 'Breathe out...', 'Hold'];
        let currentIndex = -1;

        const nextStep = () => {
            currentIndex = (currentIndex + 1) % 4;
            setInstruction(cycle[currentIndex]);
            setKey(prev => prev + 1); // Re-trigger animation
        };
        
        const timer = setInterval(nextStep, 4000);
        nextStep();

        return () => clearInterval(timer);
    }, []);

    const isHolding = instruction === 'Hold';
    const isBreathingIn = instruction === 'Breathe in...';

    return (
        <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
                <div className="absolute w-full h-full bg-sky-200 dark:bg-sky-800 rounded-full opacity-50"></div>
                <div 
                    key={key}
                    className="w-24 h-24 bg-sky-400 dark:bg-sky-600 rounded-full"
                    style={{
                        animation: isHolding ? 'none' : `breath 4s ease-in-out forwards`,
                        transform: isBreathingIn ? 'scale(1)' : 'scale(1.5)',
                    }}
                ></div>
            </div>
            <p className="text-2xl font-medium text-slate-700 dark:text-slate-200">{instruction}</p>
        </div>
    );
};


const CalmMode: React.FC<CalmModeProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Calm Space</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Focus on your breath. Follow the guide.</p>
                </div>
                <BreathingExercise />
            </div>
            <style>{`
                @keyframes breath {
                    from { transform: scale(1); }
                    to { transform: scale(1.5); }
                }
            `}</style>
        </div>
    );
};

export default CalmMode;

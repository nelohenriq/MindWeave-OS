import React from 'react';
import Card from './common/Card';
import { Icon } from './common/Icon';

interface OnboardingModalProps {
    onClose: () => void;
}

const FeatureHighlight: React.FC<{ icon: React.ComponentProps<typeof Icon>['name'], title: string, description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-sky-100 dark:bg-sky-900/50 rounded-lg flex items-center justify-center">
            <Icon name={icon} className="w-6 h-6 text-sky-600 dark:text-sky-400" />
        </div>
        <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-lg">
                <Card className="shadow-2xl">
                    <div className="text-center">
                        <Icon name="logo" className="w-12 h-12 text-sky-500 mx-auto mb-3" />
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome to MindWeave OS</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Your AI-powered journey through the landscape of your mind.</p>
                    </div>

                    <div className="my-8 space-y-6">
                        <FeatureHighlight 
                            icon="journal"
                            title="AI Journal"
                            description="Understand your thoughts and emotions with gentle, AI-powered insights."
                        />
                        <FeatureHighlight 
                            icon="echoMind"
                            title="EchoMind Companion"
                            description="Talk through your feelings in a safe, non-judgmental conversational space."
                        />
                         <FeatureHighlight 
                            icon="selfSage"
                            title="SelfSage Library"
                            description="Empower yourself with knowledge about mental health and coping strategies."
                        />
                    </div>
                    
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-center gap-2">
                            <Icon name="shield" className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Privacy First. Always.</h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Your data is processed on your device and is never shared without your explicit consent.
                        </p>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition"
                        >
                            Get Started
                        </button>
                    </div>
                </Card>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default OnboardingModal;
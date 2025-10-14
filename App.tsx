import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Journal from './components/Journal';
import EchoMind from './components/EchoMind';
import SelfSage from './components/SelfSage';
import Reports from './components/Reports';
import CalmMode from './components/CalmMode';
import SharedEntry from './components/SharedEntry';
import Header from './components/Header';
import OnboardingModal from './components/OnboardingModal';
import { View } from './types';
import { useJournal } from './hooks/useJournal';

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [isCalmModeOpen, setIsCalmModeOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const journalHook = useJournal();
    const [shareData, setShareData] = useState<string | null>(null);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const shareParam = urlParams.get('share');
        if (shareParam) {
            setShareData(shareParam);
            return; // Don't show onboarding if viewing a shared link
        }
        
        const hasOnboarded = localStorage.getItem('mindweave_onboarded');
        if (!hasOnboarded) {
            setShowOnboarding(true);
        }
    }, []);

    const handleCloseOnboarding = () => {
        localStorage.setItem('mindweave_onboarded', 'true');
        setShowOnboarding(false);
    };

    if (shareData) {
        return <SharedEntry data={shareData} />;
    }

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard journalEntries={journalHook.entries} setActiveView={setActiveView} />;
            case 'journal':
                return <Journal 
                            entries={journalHook.entries}
                            addEntry={journalHook.addEntry}
                            isLoading={journalHook.isLoading}
                            error={journalHook.error}
                            updateJournalEntryFeedback={journalHook.updateJournalEntryFeedback}
                        />;
            case 'echoMind':
                return <EchoMind />;
            case 'selfSage':
                return <SelfSage />;
            case 'reports':
                return <Reports entries={journalHook.entries} />;
            default:
                return <Dashboard journalEntries={journalHook.entries} setActiveView={setActiveView} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                onCalmClick={() => setIsCalmModeOpen(true)}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    activeView={activeView}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
            <CalmMode isOpen={isCalmModeOpen} onClose={() => setIsCalmModeOpen(false)} />
            {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
        </div>
    );
};

export default App;
import React from 'react';
import { Icon } from './common/Icon';
import { View } from '../types';

interface HeaderProps {
    activeView: View;
    onMenuClick: () => void;
}

const viewTitles: Record<View, string> = {
    dashboard: 'Dashboard',
    journal: 'AI Journal',
    echoMind: 'EchoMind Companion',
    selfSage: 'SelfSage Library',
    reports: 'Progress Reports',
};

const Header: React.FC<HeaderProps> = ({ activeView, onMenuClick }) => {
    return (
        <header className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-700 md:hidden">
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">{viewTitles[activeView]}</h1>
            <button
                onClick={onMenuClick}
                className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Open menu"
            >
                <Icon name="menu" className="w-6 h-6" />
            </button>
        </header>
    );
};

export default Header;
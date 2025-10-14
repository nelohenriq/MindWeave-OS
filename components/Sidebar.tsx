import React from 'react';
import { View } from '../types';
import { Icon } from './common/Icon';
import Card from './common/Card';
import { useTheme } from '../hooks/useTheme';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onCalmClick: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  viewName: View;
  label: string;
  activeView: View;
  onClick: (view: View) => void;
}> = ({ viewName, label, activeView, onClick }) => {
  const isActive = activeView === viewName;
  return (
    <button
      onClick={() => onClick(viewName)}
      className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
        isActive
          ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-semibold'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100'
      }`}
    >
      <Icon name={viewName} className="h-5 w-5 mr-3" />
      <span>{label}</span>
    </button>
  );
};

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button 
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100 transition-colors duration-200"
        >
            <div className="flex items-center">
                <Icon name="theme" className="h-5 w-5 mr-3"/>
                <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
            </div>
            <div className="w-10 h-6 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center px-1">
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-4' : ''}`}/>
            </div>
        </button>
    )
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onCalmClick, isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      ></div>

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 border-r border-slate-200/80 dark:border-slate-700 p-4 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2 px-2 pb-6">
          <Icon name="logo" className="h-8 w-8 text-sky-600 dark:text-sky-400" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">MindWeave OS</h1>
        </div>
        <nav className="flex flex-col gap-2">
          <NavItem
            viewName="dashboard"
            label="Dashboard"
            activeView={activeView}
            onClick={(view) => { setActiveView(view); setIsSidebarOpen(false); }}
          />
          <NavItem
            viewName="journal"
            label="AI Journal"
            activeView={activeView}
            onClick={(view) => { setActiveView(view); setIsSidebarOpen(false); }}
          />
          <NavItem
            viewName="echoMind"
            label="EchoMind"
            activeView={activeView}
            onClick={(view) => { setActiveView(view); setIsSidebarOpen(false); }}
          />
          <NavItem
            viewName="selfSage"
            label="SelfSage Library"
            activeView={activeView}
            onClick={(view) => { setActiveView(view); setIsSidebarOpen(false); }}
          />
          <NavItem
            viewName="reports"
            label="Progress Reports"
            activeView={activeView}
            onClick={(view) => { setActiveView(view); setIsSidebarOpen(false); }}
          />
        </nav>
        <div className="mt-auto space-y-4">
           <button
              onClick={() => { onCalmClick(); setIsSidebarOpen(false); }}
              className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-left transition-colors duration-200 bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/80 font-semibold"
          >
              <Icon name="calm" className="h-5 w-5 mr-3" />
              <span>Emergency Calm</span>
          </button>
          
          <ThemeToggle />

          <Card className="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                  Your AI-powered journey through the landscape of your mind.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  Privacy-first. Always.
              </p>
          </Card>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
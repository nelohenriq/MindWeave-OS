import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-none border border-slate-200/80 dark:border-slate-700 p-4 sm:p-6 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
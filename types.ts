import { ReactNode } from "react";

export enum Mood {
    Joyful = 'Joyful',
    Content = 'Content',
    Neutral = 'Neutral',
    Sad = 'Sad',
    Anxious = 'Anxious',
    Stressed = 'Stressed',
    Angry = 'Angry',
}

export interface CopingStrategy {
    title: string;
    description: string;
}

export interface JournalAnalysis {
    mood: Mood;
    keyInsight: string;
    thoughtPatterns: string[];
    copingStrategies: CopingStrategy[];
}

export interface JournalFeedback {
    rating: 'good' | 'bad';
    comment: string;
}

export interface JournalEntry {
    id: string;
    date: string; // ISO string
    text: string;
    analysis: JournalAnalysis | null;
    feedback?: JournalFeedback;
    isAnalyzing?: boolean;
}

export interface SharedJournalPayload {
    entry: JournalEntry;
    expiresAt: number; // JS timestamp
}

export type View = 'dashboard' | 'journal' | 'echoMind' | 'selfSage' | 'reports';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    feedback?: 'good' | 'bad' | 'pending';
}
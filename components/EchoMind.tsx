import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import Card from './common/Card';
import { createEchoMindChat } from '../services/geminiService';
import { Chat } from '@google/genai';
import { Icon } from './common/Icon';
import Spinner from './common/Spinner';
import Feedback from './common/Feedback';

const EchoMind: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hello, I'm EchoMind. I'm here to listen. What's on your mind today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        chatRef.current = createEchoMindChat();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    // FIX: Refactored handleSend to provide a true streaming experience.
    // The UI now updates as chunks of the AI's response are received,
    // rather than waiting for the entire response to complete.
    const handleSend = async () => {
        if (!input.trim() || !chatRef.current) return;

        const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiMessageId = Date.now().toString() + 'ai';
        setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: 'ai' }]);

        try {
            const result = await chatRef.current.sendMessageStream({ message: input });
            let fullResponse = '';
            for await (const chunk of result) {
                fullResponse += chunk.text;
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === aiMessageId ? { ...msg, text: fullResponse } : msg
                    )
                );
            }

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiMessageId ? { ...msg, feedback: 'pending' } : msg
                )
            );
        } catch (error) {
            console.error("Error sending message to EchoMind:", error);
            const errorMessage: Message = { id: aiMessageId, text: "I'm having a little trouble connecting right now. Please try again in a moment.", sender: 'ai' };
            setMessages(prev => prev.map(m => m.id === aiMessageId ? errorMessage : m));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSend();
        }
    };

    const handleFeedback = (messageId: string, feedback: 'good' | 'bad') => {
        setMessages(prev =>
            prev.map(msg => (msg.id === messageId ? { ...msg, feedback } : msg))
        );
        console.log(`Feedback for message ${messageId}:`, feedback);
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
             <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">EchoMind Companion</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">A safe space to explore your thoughts through conversation.</p>
            </div>
            <Card className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                               {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center flex-shrink-0"><Icon name="echoMind" className="w-5 h-5 text-sky-600 dark:text-sky-400"/></div>}
                                <div className={`max-w-md p-3 rounded-2xl ${
                                    msg.sender === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
                                }`}>
                                    {isLoading && msg.sender === 'ai' && msg.text === '' ? <Spinner size="sm" /> : <p className="text-sm">{msg.text}</p>}
                                </div>
                            </div>
                            {msg.sender === 'ai' && msg.feedback === 'pending' && (
                                <div className="ml-10">
                                    <Feedback onSubmit={({ rating }) => handleFeedback(msg.id, rating)} />
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="w-full pl-4 pr-12 py-3 bg-transparent border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 dark:text-slate-200 dark:placeholder-slate-400"
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-sky-600 text-white rounded-full hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition flex items-center justify-center"
                        >
                            <Icon name="send" className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default EchoMind;

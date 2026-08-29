import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, MessageSquare } from 'lucide-react';
import { Button } from '../Button';

const promptSuggestions = [
  "Make this trip cheaper",
  "Add more adventure",
  "Give us more free time",
  "Replace an activity"
];

export const TripAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm your TripTastic AI assistant. How can I help customize your group journey?" }
  ]);

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text }];
    setMessages(newMsgs);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: `I've noted your request: "${text}". I can easily adjust the itinerary or suggest alternate spots around your group's preferences.` }
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-2xl flex items-center gap-2.5 font-heading font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform"
      >
        <Sparkles className="w-4 h-4" />
        <span>AI Assistant</span>
      </button>

      {/* Chat Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-[9999] w-full max-w-md sm:w-[400px] h-[520px] rounded-3xl bg-surface border border-primary/40 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-black/5 dark:bg-white/5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase text-text-main">TripTastic AI</h4>
                  <span className="text-[10px] text-accent font-semibold uppercase">Active Assistant</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-black/5 text-text-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${m.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-black/5 dark:bg-white/5 text-text-main rounded-bl-none border border-border'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Prompts */}
            <div className="px-4 py-2 border-t border-border flex gap-1.5 overflow-x-auto scrollbar-none">
              {promptSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-semibold whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-border bg-surface flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask TripTastic AI..."
                className="flex-grow p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-xs text-text-main focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => handleSend()}
                className="p-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
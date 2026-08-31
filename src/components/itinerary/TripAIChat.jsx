import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { chatWithAI } from '../../services/api';

const promptSuggestions = [
  "Make this trip cheaper",
  "Add more adventure activities",
  "Best local food to try",
  "What to pack for this trip?",
];

export const TripAIChat = ({ itinerary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: `Hello! I'm your TripTastic AI assistant. I can help you refine your ${itinerary?.destination?.name || 'trip'} itinerary. What would you like to adjust?` }
  ]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const newMsgs = [...messages, { sender: 'user', text }];
    setMessages(newMsgs);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await chatWithAI(itinerary, text);
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: err.message || "I'm having a bit of trouble right now. Please try again in a moment!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        id="ai-chat-trigger"
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
            <div className="p-4 bg-black/5 dark:bg-white/5 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase text-text-main">TripTastic AI</h4>
                  <span className="text-[10px] text-accent font-semibold uppercase">Active Assistant</span>
                </div>
              </div>
              <button id="ai-chat-close" onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-black/5 text-text-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-black/5 dark:bg-white/5 text-text-main rounded-bl-none border border-border'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl rounded-bl-none bg-black/5 dark:bg-white/5 border border-border flex items-center gap-2 text-text-secondary">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            <div className="px-4 py-2 border-t border-border flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {promptSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-semibold whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-border bg-surface flex gap-2 shrink-0">
              <input
                id="ai-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask TripTastic AI…"
                disabled={isLoading}
                className="flex-grow p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border text-xs text-text-main focus:outline-none focus:border-primary disabled:opacity-50"
              />
              <button
                id="ai-chat-send"
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
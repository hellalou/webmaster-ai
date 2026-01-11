
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Globe, ExternalLink } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Message } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'model', 
      text: 'Hi! I am WebMaster AI. How can I help you optimize your website today?', 
      timestamp: new Date() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const needsSearch = /latest|news|current|today|ranking|competitor|weather|price/i.test(input);
      let responseText: string;
      let sources: { title: string, uri: string }[] = [];

      if (needsSearch) {
        setIsSearching(true);
        const result = await geminiService.searchGrounding(input);
        responseText = result.text;
        sources = result.sources;
        setIsSearching(false);
      } else {
        const history = messages.slice(-6).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));
        responseText = await geminiService.chatWithAI(input, history);
      }

      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I encountered an error. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-[400px] h-[600px] bg-ash-medium rounded-3xl shadow-2xl border border-ash-border flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-ash-medium p-4 text-azure flex items-center justify-between border-b border-ash-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-azure/10 rounded-xl border border-azure/20">
                <Sparkles className="w-5 h-5 text-azure" />
              </div>
              <div>
                <h3 className="font-bold">Assistant</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-azure/40">AI-powered Engine</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-ash-light rounded-lg text-azure/40">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-ash">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                  m.role === 'user' 
                    ? 'btn-metallic text-white shadow-lg rounded-tr-none border border-azure/20' 
                    : 'bg-ash-medium text-azure-light shadow-sm border border-ash-border rounded-tl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-ash-border space-y-2">
                      <p className="text-[10px] font-bold text-azure/30 uppercase tracking-widest flex items-center">
                        <Globe className="w-3 h-3 mr-1" /> Sources
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {m.sources.map((src, idx) => (
                          <a 
                            key={idx} 
                            href={src.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] bg-ash-light hover:bg-ash-border text-azure px-2 py-1 rounded flex items-center transition-colors border border-ash-border"
                          >
                            <ExternalLink className="w-2 h-2 mr-1" />
                            {src.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  <span className={`block mt-2 text-[10px] ${m.role === 'user' ? 'text-white/40' : 'text-azure/20'}`}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-ash-medium text-azure/40 shadow-sm border border-ash-border rounded-2xl rounded-tl-none p-4 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-azure rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-azure rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-azure rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  {isSearching && <span className="text-[10px] text-azure/30 font-medium italic">Searching live web...</span>}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-ash-medium border-t border-ash-border">
            <div className="flex items-center space-x-2 bg-ash rounded-2xl px-4 py-2 border border-ash-border focus-within:border-azure/40 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message WebMaster AI..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2 text-azure placeholder:text-azure/20"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 btn-metallic text-white rounded-xl hover:opacity-90 transition-colors disabled:opacity-30 border border-azure/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 border border-azure/10 ${
          isOpen ? 'btn-metallic rotate-90 scale-110' : 'bg-ash-medium hover:btn-metallic hover:scale-110'
        }`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageSquare className={`w-6 h-6 ${isOpen ? 'text-white' : 'text-azure'}`} />}
      </button>
    </div>
  );
};

export default ChatBot;

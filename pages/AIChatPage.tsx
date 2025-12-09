import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { generateResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { generateId, cn } from '../lib/utils';

export const AIChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am your AI assistant powered by Gemini. How can I help you today?',
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateResponse(input);
      
      const modelMessage: ChatMessage = {
        id: generateId(),
        role: 'model',
        text: responseText || "I couldn't generate a response.",
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'model',
        text: "Sorry, I encountered an error connecting to the API.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-slate-100 py-4">
          <CardTitle className="flex items-center text-lg">
            <Bot className="h-5 w-5 mr-2 text-blue-600" />
            Gemini Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-3 max-w-[80%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                msg.role === 'user' ? "bg-blue-600 text-white" : "bg-green-600 text-white"
              )}>
                {msg.role === 'user' ? <UserIcon className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className={cn(
                "p-3 rounded-lg text-sm",
                msg.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-slate-100 text-slate-800 rounded-tl-none"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 mr-auto max-w-[80%]">
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                 <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="p-3 rounded-lg bg-slate-100 text-slate-800 rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t border-slate-100 bg-white">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

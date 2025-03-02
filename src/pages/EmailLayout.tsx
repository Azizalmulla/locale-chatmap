
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Paperclip, ArrowUp, Mail, FileText, Check, User, Bell, MessageSquare, ShoppingCart, Settings, Grid, SquareUser } from 'lucide-react';
import Map from '@/components/Map';
import ChatInput from '@/components/ChatInput';
import ChatMessage from '@/components/ChatMessage';
import { useRetroMode } from './Index';
import { toast } from 'sonner';

interface ChatMessage {
  content: string;
  isAI: boolean;
}

// Base coordinates for Kuwait City
const DEFAULT_COORDINATES: [number, number] = [47.9774, 29.3759];
const DEFAULT_ZOOM: number = 11;

const EmailLayout = () => {
  const { isRetroMode } = useRetroMode();
  
  // State for map coordinates and zoom
  const [coordinates, setCoordinates] = useState<[number, number]>(DEFAULT_COORDINATES);
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
  
  // Chat messages state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { content: message, isAI: false }]);

      // Check if API key is set
      if (!localStorage.getItem('openai_api_key')) {
        toast.error('Please set your OpenAI API key first');
        setIsLoading(false);
        return;
      }

      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          content: "Thanks for your message. I'm here to help with any questions about Kuwait or other locations.", 
          isAI: true 
        }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to process your request. Please try again.');
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="email-layout">
      {/* Navigation Sidebar */}
      <div className="nav-sidebar">
        <div className="mb-6">
          <img src="https://i.pravatar.cc/40" alt="Avatar" className="rounded-md w-8 h-8" />
        </div>
        <Mail className="nav-icon active" />
        <FileText className="nav-icon" />
        <Check className="nav-icon" />
        <User className="nav-icon" />
        <Bell className="nav-icon" />
        <MessageSquare className="nav-icon" />
        <ShoppingCart className="nav-icon" />
        <Settings className="nav-icon" />
        <div className="mt-auto mb-4">
          <Grid className="nav-icon" />
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="main-content">
        {/* Compose Panel (Left - Larger) */}
        <div className="compose-panel">
          <div className="panel-header">
            <div className="panel-title">
              <h2>Map</h2>
              <p>Explore locations</p>
            </div>
            <button className="text-white opacity-60 hover:opacity-100">
              <X size={18} />
            </button>
          </div>
          
          <div className="email-form">
            <div className="form-group">
              <label>To</label>
              <input type="text" value="hello@gmail.com" readOnly />
            </div>
            
            <div className="form-group">
              <label>Subject</label>
              <input type="text" value="Investment Banking" readOnly />
            </div>
            
            <div className="form-group">
              <label>Body</label>
              <input type="text" value="Hi John," readOnly />
            </div>
            
            <div className="email-body">
              <Map className="w-full h-[300px] rounded-lg mt-4" coordinates={coordinates} zoom={zoom} />
              <p className="my-4">I saw your email on investments and was wondering how I could get started down the same path.</p>
              <p className="my-4">Please get back to me as soon as you can!</p>
              <p className="my-2">Best,</p>
              <p>Nizzy</p>
            </div>
          </div>
          
          <div className="email-actions">
            <button className="action-button">
              <Paperclip size={16} />
              <span>2 attachments</span>
            </button>
            
            <button className="action-button">
              <Send size={16} />
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
        
        {/* Assistant Panel (Right - Smaller) */}
        <div className="assistant-panel">
          <div className="assistant-header">
            <div className="panel-title">
              <h2>Chat</h2>
              <p>Talk with your guide</p>
            </div>
            <button className="text-white opacity-60 hover:opacity-100">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-none p-4">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                content={msg.content}
                isAI={msg.isAI}
                isRetroMode={isRetroMode}
              />
            ))}
            
            {messages.length === 0 && (
              <div className="assistant-content">
                <div className="assistant-logo">
                  <SquareUser size={60} />
                </div>
                <p className="text-gray-400">Ask Zero a question...</p>
              </div>
            )}
          </div>
          
          <div className="assistant-input">
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              isRetroMode={isRetroMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailLayout;

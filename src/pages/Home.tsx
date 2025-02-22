
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { toast } from 'sonner';

interface Message {
  content: string;
  isAI: boolean;
}

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRetroMode, setIsRetroMode] = useState(false);
  
  useEffect(() => {
    const agentName = localStorage.getItem('agentName') || 'AI Assistant';
    setMessages([
      { 
        content: `Welcome to Locale! I'm ${agentName}, how can I help you discover your city today?`, 
        isAI: true 
      }
    ]);
  }, []);

  const generateResponse = async (prompt: string) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    return data.generatedText;
  };

  const mutation = useMutation({
    mutationFn: generateResponse,
    onSuccess: (aiResponse) => {
      setMessages(prev => [...prev, { content: aiResponse, isAI: true }]);
    },
    onError: (error) => {
      toast.error("Failed to generate response. Please try again.");
      console.error('Error:', error);
    }
  });

  const handleSendMessage = (content: string) => {
    setMessages(prev => [...prev, { content, isAI: false }]);
    mutation.mutate(content);
  };

  const toggleRetroMode = () => {
    setIsRetroMode(!isRetroMode);
    if (!isRetroMode) {
      toast.success("🕹️ Retro Mode Activated!");
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-screen bg-black relative ${isRetroMode ? 'retro-grid' : ''}`}>
      <button
        onClick={toggleRetroMode}
        className="absolute top-4 right-4 z-50 p-2 rounded-full transition-all duration-300 hover:scale-110"
      >
        {isRetroMode ? (
          <EyeOff className="w-6 h-6 text-[#D946EF] retro-glow" />
        ) : (
          <Eye className="w-6 h-6 text-white/50 hover:text-white" />
        )}
      </button>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col"
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              isAI={message.isAI}
              isRetroMode={isRetroMode}
            />
          ))}
          {mutation.isPending && (
            <div className={`flex items-center space-x-2 ${
              isRetroMode ? 'text-[#0FA0CE] retro-glow retro-text' : 'text-white/60'
            }`}>
              <div className="animate-pulse">Thinking...</div>
            </div>
          )}
        </div>
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={mutation.isPending}
          isRetroMode={isRetroMode}
        />
      </motion.div>
      {isRetroMode && <div className="retro-scanline absolute inset-0 pointer-events-none" />}
    </div>
  );
};

export default Home;

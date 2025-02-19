
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { toast } from 'sonner';

interface Message {
  content: string;
  isAI: boolean;
}

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([
    { content: "Welcome to Locale! I'm your AI assistant. How can I help you discover your city today?", isAI: true }
  ]);

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

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#343541]">
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
            />
          ))}
          {mutation.isPending && (
            <div className="flex items-center space-x-2 text-white/60">
              <div className="animate-pulse">Thinking...</div>
            </div>
          )}
        </div>
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={mutation.isPending}
        />
      </motion.div>
    </div>
  );
};

export default Home;


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useRetroMode } from "./Index";
import PongGame from "@/components/PongGame";
import { toast } from "sonner";

interface Message {
  content: string;
  isAI: boolean;
}

const Home = () => {
  const { isRetroMode } = useRetroMode();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const agentName = localStorage.getItem('agentName') || 'Agent';

  useEffect(() => {
    // Add welcome message on component mount
    setMessages([
      { content: `${agentName} here, how can I help you today?`, isAI: true }
    ]);
    
    if (isRetroMode) {
      setMessages(prev => [
        ...prev,
        { content: "🕹️ Retro Mode activated! Play some Pong while we chat! Use your mouse to control the paddle.", isAI: true }
      ]);
    }
  }, [isRetroMode, agentName]);

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      // Add user message to the chat
      setMessages(prev => [...prev, { content: message, isAI: false }]);

      // Send the message to the generate function
      const response = await fetch('/functions/v1/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add AI response to the chat
      setMessages(prev => [...prev, { content: data.generatedText, isAI: true }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full relative ${isRetroMode ? 'retro-grid' : ''}`}>
      {isRetroMode && <div className="retro-scanline absolute inset-0 pointer-events-none" />}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-y-auto p-4"
      >
        <div className={`max-w-4xl mx-auto ${isRetroMode ? 'space-y-6' : 'space-y-4'}`}>
          {messages.map((message, index) => (
            <ChatMessage 
              key={index}
              content={message.content}
              isAI={message.isAI}
              isRetroMode={isRetroMode}
            />
          ))}
          {isRetroMode && <PongGame />}
        </div>
      </motion.div>
      <div className={`p-4 border-t ${
        isRetroMode 
          ? 'border-[#0DF5E3]/20 bg-black/40 backdrop-blur-xl' 
          : 'border-border bg-background'
      }`}>
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isRetroMode={isRetroMode}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

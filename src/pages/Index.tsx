
import { useState } from 'react';
import { motion } from 'framer-motion';
import Map from '@/components/Map';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';

const Index = () => {
  const [messages, setMessages] = useState<Array<{ content: string; isAI: boolean }>>([
    { content: "Welcome to Locale! How can I assist you today?", isAI: true }
  ]);

  const handleSendMessage = (content: string) => {
    setMessages(prev => [...prev, { content, isAI: false }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        content: "I'm here to help you explore and discover new places. What would you like to know?", 
        isAI: true 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4">
      <Map className="w-full" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col gap-4 max-h-[calc(50vh-2rem)] min-h-[300px]"
      >
        <div className="flex-1 overflow-y-auto space-y-4 p-2">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              isAI={message.isAI}
            />
          ))}
        </div>
        
        <ChatInput onSendMessage={handleSendMessage} />
      </motion.div>
    </div>
  );
};

export default Index;

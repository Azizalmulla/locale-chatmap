
import { useState } from 'react';
import { motion } from 'framer-motion';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';

const Chat = () => {
  const agentName = localStorage.getItem('agentName') || 'Agent';
  const [messages, setMessages] = useState<Array<{ content: string; isAI: boolean }>>([
    { content: `Hello! I'm ${agentName}, how can I help you today?`, isAI: true }
  ]);

  const handleSendMessage = (content: string) => {
    setMessages(prev => [...prev, { content, isAI: false }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        content: "I'm here to help you explore and discover new places. What would you like to know?", 
        isAI: true 
      }]);
    }, 1000);
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
        </div>
        
        <ChatInput onSendMessage={handleSendMessage} />
      </motion.div>
    </div>
  );
};

export default Chat;

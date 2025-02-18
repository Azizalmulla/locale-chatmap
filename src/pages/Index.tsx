
import { useState } from 'react';
import { motion } from 'framer-motion';
import Map from '@/components/Map';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 space-y-6">
            <div className="relative w-full h-[45vh] rounded-xl shadow-2xl overflow-hidden">
              <Map className="w-full h-full" />
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex-1 flex flex-col bg-black/20 backdrop-blur-xl rounded-xl overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
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
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

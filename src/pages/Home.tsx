
import React from "react";
import { motion } from "framer-motion";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useRetroMode } from "./Index";
import PongGame from "@/components/PongGame";

const Home = () => {
  const { isRetroMode } = useRetroMode();

  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message);
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
          <ChatMessage 
            content="Welcome to the AI Guide! How can I assist you today?" 
            isAI={true}
            isRetroMode={isRetroMode}
          />
          {isRetroMode && (
            <ChatMessage 
              content="🕹️ Retro Mode activated! Play some Pong while we chat! Use your mouse to control the left paddle." 
              isAI={true}
              isRetroMode={true}
            />
          )}
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
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

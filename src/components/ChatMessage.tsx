
import { motion } from 'framer-motion';

interface ChatMessageProps {
  content: string;
  isAI?: boolean;
  isRetroMode?: boolean;
}

const ChatMessage = ({ content, isAI = false, isRetroMode = false }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-2"
    >
      <div className="max-w-3xl mx-auto">
        <div className={`
          rounded-lg p-4 
          ${isRetroMode
            ? isAI 
              ? 'retro-message retro-glow' 
              : 'bg-[#1EAEDB] text-white retro-border'
            : isAI 
              ? 'bg-black border border-white/10' 
              : 'bg-white text-black'
          }
        `}>
          <p className={`text-sm leading-relaxed ${
            isRetroMode 
              ? 'retro-text' 
              : isAI ? 'text-white' : ''
          }`}>
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;

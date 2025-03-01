
import { motion } from 'framer-motion';

interface ChatMessageProps {
  isAI?: boolean;
  isRetroMode?: boolean;
}

const ChatMessage = ({ isAI = false, isRetroMode = false }: ChatMessageProps) => {
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
              ? 'bg-black/40 border border-[#0DF5E3]/20 text-[#0DF5E3] retro-text retro-glow' 
              : 'bg-[#0DF5E3]/10 border border-[#0DF5E3]/40 text-[#0DF5E3] retro-text'
            : isAI 
              ? 'bg-black border border-white/10' 
              : 'bg-white text-black'
          }
        `}>
          <div className={`text-sm leading-relaxed ${isRetroMode ? 'retro-text' : ''}`}>
            {/* Content removed */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;


import { motion } from 'framer-motion';

interface ChatMessageProps {
  content: string;
  isAI?: boolean;
  isRetroMode?: boolean;
}

const ChatMessage = ({ content, isAI = false, isRetroMode = false }: ChatMessageProps) => {
  // Don't render anything if content is empty
  if (!content || content.trim() === '') {
    return null;
  }
  
  if (isRetroMode) {
    // Return the retro version if retro mode is active
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
            ${isAI 
              ? 'bg-black/40 border border-[#0DF5E3]/20 text-[#0DF5E3] retro-text retro-glow' 
              : 'bg-[#0DF5E3]/10 border border-[#0DF5E3]/40 text-[#0DF5E3] retro-text'
            }
          `}>
            <div className="retro-text text-sm leading-relaxed">
              {content}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Apple-esque styled messages
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`message-bubble ${isAI ? 'ai-message' : 'user-message'}`}>
        {content}
      </div>
    </motion.div>
  );
};

export default ChatMessage;

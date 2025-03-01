import { motion } from 'framer-motion';

interface ChatMessageProps {
  content: string;
  isAI?: boolean;
  isRetroMode?: boolean;
}

const ChatMessage = ({ content, isAI = false, isRetroMode = false }: ChatMessageProps) => {
  if (isRetroMode) {
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
            <p className="text-sm leading-relaxed retro-text">
              {content}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

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
            ? 'bg-black/50 text-white' 
            : 'bg-[#1EAEDB]/10 text-white'
          }
        `}>
          <p className="text-sm leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;

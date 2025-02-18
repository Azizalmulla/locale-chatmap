
import { motion } from 'framer-motion';

interface ChatMessageProps {
  content: string;
  isAI?: boolean;
}

const ChatMessage = ({ content, isAI = false }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`px-4 py-6 ${isAI ? 'bg-[#444654]' : 'bg-transparent'}`}
    >
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-200 leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;

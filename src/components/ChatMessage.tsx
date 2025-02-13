
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
      className={`message-bubble max-w-[80%] ${isAI ? 'ai-message' : 'user-message'}`}
    >
      <p className="text-sm">{content}</p>
    </motion.div>
  );
};

export default ChatMessage;

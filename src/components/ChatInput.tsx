
import { useState } from 'react';
import { Mic, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full glass-morphism rounded-lg p-3"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setIsRecording(!isRecording)}
          className={`p-2.5 rounded-full transition-colors ${
            isRecording ? 'bg-red-500/20 text-red-500' : 'hover:bg-white/5'
          }`}
        >
          <Mic className="w-5 h-5" />
        </motion.button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="p-2.5 rounded-full hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ChatInput;

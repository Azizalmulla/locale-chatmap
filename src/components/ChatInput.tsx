
import { useState } from 'react';
import { Mic, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isRetroMode?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false, isRetroMode = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 border-t ${
        isRetroMode 
          ? 'border-[#D946EF] bg-[#1A1F2C]' 
          : 'border-white/10 bg-[#343541]'
      }`}
    >
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setIsRecording(!isRecording)}
          className={`p-2 rounded-lg transition-colors ${
            isRetroMode
              ? isRecording
                ? 'bg-[#D946EF]/20 text-[#D946EF] retro-glow'
                : 'hover:bg-[#D946EF]/20 text-[#D946EF]'
              : isRecording
              ? 'bg-red-500/20 text-red-500'
              : 'hover:bg-white/5 text-gray-400'
          }`}
          disabled={disabled}
        >
          <Mic className="w-5 h-5" />
        </motion.button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className={`flex-1 px-4 py-3 rounded-lg text-sm
            ${isRetroMode 
              ? 'retro-input retro-text text-[#F97316] placeholder:text-[#F97316]/50' 
              : 'bg-[#40414F] text-gray-200 placeholder:text-gray-400 focus:ring-1 focus:ring-white/20'
            } focus:outline-none transition-colors disabled:opacity-50`}
          disabled={disabled}
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className={`p-2 rounded-lg transition-colors ${
            isRetroMode
              ? 'text-[#0FA0CE] hover:bg-[#0FA0CE]/20 retro-glow'
              : 'hover:bg-white/5 text-gray-400'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!message.trim() || disabled}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ChatInput;

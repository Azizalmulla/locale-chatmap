import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isRetroMode?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false, isRetroMode = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info('Processing audio...');
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      console.log('Processing audio...');
      const openaiApiKey = localStorage.getItem('openai_api_key');
      
      if (!openaiApiKey) {
        throw new Error('OpenAI API key is not set');
      }
      
      // Create a FormData object and append the audio file
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('model', 'whisper-1');
      
      // Call OpenAI's Whisper API directly
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Whisper API error: ${errorData.error?.message || response.status}`);
      }
      
      const data = await response.json();
      
      if (data.text) {
        setMessage(data.text);
        toast.success('Audio transcribed successfully');
      } else {
        throw new Error('No transcription returned');
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={toggleRecording}
          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
            isRetroMode
              ? isRecording
                ? 'bg-[#0DF5E3]/20 text-[#0DF5E3] retro-glow'
                : 'hover:bg-[#0DF5E3]/20 text-[#0DF5E3]'
              : isRecording
              ? 'bg-red-500/20 text-red-500'
              : 'hover:bg-white/5 text-gray-400'
          }`}
          disabled={disabled}
        >
          {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {isRecording && (
            <span className="ml-2 text-xs">{formatTime(recordingTime)}</span>
          )}
        </motion.button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className={`flex-1 px-4 py-3 rounded-lg text-sm transition-colors
            ${isRetroMode 
              ? 'bg-black/40 border border-[#0DF5E3]/20 text-[#0DF5E3] retro-text placeholder:text-[#0DF5E3]/50' 
              : 'bg-[#40414F] text-gray-200 placeholder:text-gray-400 focus:ring-1 focus:ring-white/20'
            } focus:outline-none disabled:opacity-50`}
          disabled={disabled}
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className={`p-2 rounded-lg transition-colors ${
            isRetroMode
              ? 'text-[#0DF5E3] hover:bg-[#0DF5E3]/20 retro-glow'
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

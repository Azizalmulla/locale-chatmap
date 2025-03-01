
import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isRetroMode?: boolean;
  useFallbackMode?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false, isRetroMode = false, useFallbackMode = false }: ChatInputProps) => {
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
        
        if (useFallbackMode) {
          // In fallback mode, we'll just set a simulated message
          setMessage("I recorded an audio message but transcription is unavailable in offline mode.");
          toast.info('Voice transcription requires API connectivity.');
        } else {
          await processAudio(audioBlob);
        }
        
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
      if (!useFallbackMode) {
        toast.info('Processing audio...');
      }
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const isJsonResponse = (text: string) => {
    return text.trim().startsWith('{') || text.trim().startsWith('[');
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      console.log('Processing audio...');
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('apiKey', localStorage.getItem('openai_api_key') || '');
      
      const response = await fetch('/functions/v1/voice-chat', {
        method: 'POST',
        headers: {
          'x-openai-api-key': localStorage.getItem('openai_api_key') || ''
        },
        body: formData,
      });
      
      console.log('Voice chat response status:', response.status);
      
      const responseText = await response.text();
      console.log('Voice chat response text first 100 chars:', responseText.substring(0, 100));
      
      if (!isJsonResponse(responseText)) {
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html>')) {
          throw new Error('Received HTML instead of JSON. The API endpoint may not be deployed or configured correctly.');
        } else {
          throw new Error(`Invalid response format: ${responseText.substring(0, 100)}...`);
        }
      }
      
      const data = JSON.parse(responseText);
      console.log('Voice chat response data:', data);
      
      if (data.success && data.text) {
        setMessage(data.text);
        toast.success('Audio processed successfully');
      } else {
        throw new Error(data.error || 'No transcription returned');
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error(`Failed to process audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          } ${useFallbackMode && !isRecording ? 'opacity-50' : ''}`}
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
          placeholder={useFallbackMode ? "Chat in offline mode (limited responses)" : "Type your message..."}
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


import { useState } from 'react';
import { motion } from 'framer-motion';
import Map from '@/components/Map';
import ChatInput from '@/components/ChatInput';
import ChatMessage from '@/components/ChatMessage';
import { useRetroMode } from './Index';
import { toast } from 'sonner';

interface ChatMessage {
  content: string;
  isAI: boolean;
}

interface LocationResponse {
  message: string;
  coordinates: [number, number] | null;
  zoom: number;
}

const MapView = () => {
  const { isRetroMode } = useRetroMode();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { content: "Hello! I can help you explore locations on the map. Try asking about a specific place!", isAI: true }
  ]);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState<number>(1.5);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { content: message, isAI: false }]);

      const response = await fetch('/functions/v1/location-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data: LocationResponse = await response.json();
      
      setMessages(prev => [...prev, { content: data.message, isAI: true }]);
      
      if (data.coordinates) {
        setCoordinates(data.coordinates);
        setZoom(data.zoom);
      }
    } catch (error) {
      toast.error('Failed to process your request. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#343541] flex flex-col">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 p-4 flex flex-col gap-4"
      >
        <div className={`flex-1 rounded-lg overflow-hidden ${
          isRetroMode 
            ? 'ring-1 ring-[#0FA0CE] shadow-[0_0_15px_rgba(15,160,206,0.3)]' 
            : 'ring-1 ring-white/10'
        }`}>
          <Map className="w-full h-full" coordinates={coordinates} zoom={zoom} />
        </div>
        
        <div className="h-[300px] overflow-y-auto rounded-lg bg-black/20 backdrop-blur-xl">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              content={msg.content}
              isAI={msg.isAI}
              isRetroMode={isRetroMode}
            />
          ))}
        </div>

        <div className="w-full">
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            isRetroMode={isRetroMode}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default MapView;

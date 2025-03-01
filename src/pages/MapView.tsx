
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

// Base coordinates for popular cities
const CITY_COORDINATES: { [key: string]: { coordinates: [number, number], zoom: number } } = {
  'new york': { coordinates: [-74.006, 40.7128], zoom: 11 },
  'london': { coordinates: [-0.1278, 51.5074], zoom: 11 },
  'paris': { coordinates: [2.3522, 48.8566], zoom: 11 },
  'tokyo': { coordinates: [139.6917, 35.6895], zoom: 10 },
  'sydney': { coordinates: [151.2093, -33.8688], zoom: 11 },
  'los angeles': { coordinates: [-118.2437, 34.0522], zoom: 10 },
  'chicago': { coordinates: [-87.6298, 41.8781], zoom: 10 },
  'berlin': { coordinates: [13.4050, 52.5200], zoom: 11 },
  'rome': { coordinates: [12.4964, 41.9028], zoom: 11 },
  'madrid': { coordinates: [-3.7038, 40.4168], zoom: 11 },
};

// Function to extract location from a message
const extractLocation = (message: string): { location: string, coordinates: [number, number] | null, zoom: number } => {
  const lowercaseMsg = message.toLowerCase();
  
  // Check if any city name is mentioned in the message
  for (const city in CITY_COORDINATES) {
    if (lowercaseMsg.includes(city)) {
      return { 
        location: city, 
        coordinates: CITY_COORDINATES[city].coordinates,
        zoom: CITY_COORDINATES[city].zoom 
      };
    }
  }
  
  // Default return if no location is found
  return { location: '', coordinates: null, zoom: 1.5 };
};

const MapView = () => {
  const { isRetroMode } = useRetroMode();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { content: "Hello! I can help you explore locations on the map. Try asking about a specific place!", isAI: true }
  ]);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState<number>(1.5);
  const [isLoading, setIsLoading] = useState(false);

  const callOpenAI = async (message: string) => {
    const openaiApiKey = localStorage.getItem('openai_api_key');
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is not set');
    }
    
    // Extract potential location from message
    const { location, coordinates, zoom } = extractLocation(message);
    
    // Construct the prompt with the location information
    let prompt = message;
    if (location) {
      prompt += `\n\nNote: The user seems to be asking about ${location}.`;
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant with expertise in geography and local knowledge. Provide concise information about locations, landmarks, and places of interest. Keep responses brief and informative.' 
          },
          { role: 'user', content: prompt }
        ],
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    return {
      message: data.choices[0].message.content,
      coordinates: coordinates,
      zoom: zoom
    };
  };

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { content: message, isAI: false }]);

      // Check if API key is set
      if (!localStorage.getItem('openai_api_key')) {
        toast.error('Please set your OpenAI API key first');
        setIsLoading(false);
        return;
      }

      const response = await callOpenAI(message);
      
      setMessages(prev => [...prev, { content: response.message, isAI: true }]);
      
      if (response.coordinates) {
        setCoordinates(response.coordinates);
        setZoom(response.zoom);
      }
    } catch (error) {
      toast.error('Failed to process your request. Please try again.');
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Failed to get a response'}. Please try again.`, 
        isAI: true 
      }]);
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

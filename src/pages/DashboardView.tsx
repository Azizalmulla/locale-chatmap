
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

// Base coordinates for Kuwait City
const DEFAULT_COORDINATES: [number, number] = [47.9774, 29.3759];
const DEFAULT_ZOOM: number = 11;

const DashboardView = () => {
  const { isRetroMode } = useRetroMode();
  const agentPersonality = localStorage.getItem('agentPersonality') || '';
  
  // State for map coordinates and zoom
  const [coordinates, setCoordinates] = useState<[number, number]>(DEFAULT_COORDINATES);
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
  
  // Chat messages state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const callOpenAI = async (message: string) => {
    // Reuse the same function from ChatView.tsx
    const openaiApiKey = localStorage.getItem('openai_api_key');
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is not set');
    }
    
    // Check if any location info is in the message
    const lowercaseMsg = message.toLowerCase();
    const locationMatches = lowercaseMsg.match(/(?:in|at|to|from|near)\s+([a-z\s]+)/i);
    let locationInfo = '';
    
    if (locationMatches && locationMatches[1]) {
      locationInfo = `\n\nNote: The user seems to be asking about ${locationMatches[1]}.`;
    }
    
    // Construct the prompt with any location information
    const prompt = message + locationInfo;
    
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
            content: `You are a helpful assistant with expertise in Kuwait geography and local knowledge. Provide concise information about locations, landmarks, and places of interest in Kuwait and elsewhere if asked. Keep responses brief and informative.` 
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
      message: data.choices[0].message.content
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

      // Check if message contains a location query
      const searchTerms = message.toLowerCase().match(/(?:search|find|show|where is|locate)\s+([a-zA-Z\s]+)/i);
      if (searchTerms && searchTerms[1]) {
        try {
          // Use Mapbox Geocoding API to search for the location
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              searchTerms[1]
            )}.json?access_token=${
              'pk.eyJ1IjoiYXppemFsbXVsbGEiLCJhIjoiY203cHN0cDZkMDcyZzJqc2J2bWpoY2FocCJ9.w3V37uLN8-_q19JDcc1oug'
            }&limit=1`
          );
          
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const [longitude, latitude] = data.features[0].center;
            // Update map coordinates to show the location
            setCoordinates([longitude, latitude]);
            setZoom(12);
          }
        } catch (error) {
          console.error('Error searching location:', error);
        }
      }

      const response = await callOpenAI(message);
      
      setMessages(prev => [...prev, { content: response.message, isAI: true }]);
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
    <div className="flex-1 bg-[#1a1a1a] flex h-full overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex w-full h-full"
        style={{ marginLeft: '-0.05rem' }} // Slight negative margin to ensure no gap
      >
        {/* Map Panel (Left - 75%) */}
        <div className={`w-[75%] h-full border-r border-[#333333] flex flex-col ${
          isRetroMode 
            ? 'ring-1 ring-[#0FA0CE] shadow-[0_0_15px_rgba(15,160,206,0.3)]' 
            : ''
        }`}>
          <div className="p-4 border-b border-[#333333]">
            <h2 className={`text-xl font-semibold ${isRetroMode ? 'text-[#0DF5E3] retro-text' : 'text-white'}`}>Map</h2>
            <p className={`text-sm opacity-70 ${isRetroMode ? 'text-[#0DF5E3]/70 retro-text' : 'text-gray-400'}`}>Explore locations</p>
          </div>
          <div className="flex-1 relative">
            <Map 
              className="w-full h-full" 
              coordinates={coordinates} 
              zoom={zoom} 
            />
          </div>
        </div>
        
        {/* Chat Panel (Right - 25%) */}
        <div className="w-[25%] h-full flex flex-col bg-[#222222]">
          <div className="p-4 border-b border-[#333333]">
            <h2 className={`text-xl font-semibold ${isRetroMode ? 'text-[#0DF5E3] retro-text' : 'text-white'}`}>Chat</h2>
            <p className={`text-sm opacity-70 ${isRetroMode ? 'text-[#0DF5E3]/70 retro-text' : 'text-gray-400'}`}>Talk with your guide</p>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-none">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                content={msg.content}
                isAI={msg.isAI}
                isRetroMode={isRetroMode}
              />
            ))}
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-[#333333]">
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              isRetroMode={isRetroMode}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardView;


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
  'kuwait city': { coordinates: [47.9774, 29.3759], zoom: 11 },
  'salmiya': { coordinates: [48.0762, 29.3339], zoom: 13 },
  'hawally': { coordinates: [48.0284, 29.3328], zoom: 13 },
  'farwaniya': { coordinates: [47.9781, 29.2775], zoom: 13 },
  'ahmadi': { coordinates: [48.0753, 29.0769], zoom: 13 },
  'jahra': { coordinates: [47.6619, 29.3472], zoom: 12 },
  'fahaheel': { coordinates: [48.1302, 29.0824], zoom: 13 },
  'mahboula': { coordinates: [48.1300, 29.1446], zoom: 13 },
  'mangaf': { coordinates: [48.1260, 29.0996], zoom: 13 },
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

const getPersonalityPrompt = (personality: string): string => {
  // Base Kuwait knowledge for all personalities
  const kuwaitBase = 'You are a Kuwait guide. You have extensive knowledge about Kuwait - its history, culture, landmarks, events, restaurants, shopping, entertainment, and current happenings. You can speak Kuwaiti dialect fluently and should incorporate some Kuwaiti phrases in your responses when appropriate. You focus primarily on Kuwait-related information and redirect questions to Kuwait context when possible.';
  
  switch (personality) {
    case 'funny':
      return `${kuwaitBase} You have a fun, witty personality. Use humor in your responses, add jokes, puns, and keep the conversation lighthearted and entertaining. Incorporate Kuwaiti humor when possible.`;
    case 'chill':
      return `${kuwaitBase} You have a relaxed, laid-back personality. Keep your responses casual, use informal language, and maintain a calm, easygoing vibe. Use casual Kuwaiti expressions when appropriate.`;
    case 'professional':
      return `${kuwaitBase} You have a formal, professional personality. Provide detailed, well-structured responses with a business-like tone. Be courteous, precise, and maintain professional language while still sharing your Kuwait expertise.`;
    default:
      return kuwaitBase;
  }
};

const MapView = () => {
  const { isRetroMode } = useRetroMode();
  const agentPersonality = localStorage.getItem('agentPersonality') || '';
  
  // Create personality-specific welcome message with Kuwait focus
  let welcomeMessage = "Marhaba! I can help you explore Kuwait and other locations on the map. Where would you like to visit today?";
  if (agentPersonality === 'funny') {
    welcomeMessage = "Shlonik! Ready for a virtual tour around Kuwait? Just tell me where you want to go and I'll take you there—no traffic jams guaranteed! Shaku maku, where shall we explore today?";
  } else if (agentPersonality === 'chill') {
    welcomeMessage = "Hala, welcome to the map. Just let me know what places in Kuwait you want to check out and we'll cruise around together. Shaku maku?";
  } else if (agentPersonality === 'professional') {
    welcomeMessage = "Marhaba bik. Welcome to the interactive Kuwait map interface. I can provide geographical information and assist with location queries throughout Kuwait and beyond. Please specify a location you would like to explore.";
  }
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { content: welcomeMessage, isAI: true }
  ]);
  const [coordinates, setCoordinates] = useState<[number, number] | null>([47.9774, 29.3759]);
  const [zoom, setZoom] = useState<number>(9);
  const [isLoading, setIsLoading] = useState(false);

  const callOpenAI = async (message: string) => {
    const openaiApiKey = localStorage.getItem('openai_api_key');
    const personalityPrompt = getPersonalityPrompt(agentPersonality);
    
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
            content: `You are a helpful assistant with expertise in Kuwait geography and local knowledge. Provide concise information about locations, landmarks, and places of interest in Kuwait and elsewhere if asked. Keep responses brief and informative. ${personalityPrompt}` 
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


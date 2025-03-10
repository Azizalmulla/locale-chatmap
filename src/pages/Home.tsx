
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useRetroMode } from "./Index";
import PongGame from "@/components/PongGame";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  content: string;
  isAI: boolean;
}

const getPersonalityPrompt = (personality: string): string => {
  // Base Kuwait knowledge for all personalities
  const kuwaitBase = 'You are a Kuwait guide. You have extensive knowledge about Kuwait - its history, culture, landmarks, events, restaurants, shopping, entertainment, and current happenings. You can speak Kuwaiti dialect fluently and should incorporate some Kuwaiti phrases in your responses when appropriate. You also understand and can respond to "m3rb" or Arabizi (Arabic written with English letters and numbers like 3 for ع, 7 for ح, etc.). For example, you understand phrases like "shlon" (شلون), "3alatool" (على طول), "7abibi" (حبيبي), and "ma3ash" (معاش). You focus primarily on Kuwait-related information and redirect questions to Kuwait context when possible.';
  
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

const Home = () => {
  const { isRetroMode } = useRetroMode();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [isApiKeySet, setIsApiKeySet] = useState(!!localStorage.getItem('openai_api_key'));
  const agentName = localStorage.getItem('agentName') || 'Agent';
  const agentPersonality = localStorage.getItem('agentPersonality') || '';

  useEffect(() => {
    // Set the API key if it's provided but not already in localStorage
    if (apiKey && !localStorage.getItem('openai_api_key')) {
      localStorage.setItem('openai_api_key', apiKey);
      setIsApiKeySet(true);
    }

    // Create personality-specific welcome message with Kuwait focus
    let welcomeMessage = `Marhaba! ${agentName} here, your Kuwait guide. How can I help you explore Kuwait today?`;
    if (agentPersonality === 'funny') {
      welcomeMessage = `Shlonik! ${agentName} at your service! Ready to chat about Kuwait, share some funny stories, and maybe drop a joke or two? Shaku maku, what's on your mind today?`;
    } else if (agentPersonality === 'chill') {
      welcomeMessage = `Hala, ${agentName} here. Shaku maku? Just chilling and ready to chat about Kuwait whenever you are.`;
    } else if (agentPersonality === 'professional') {
      welcomeMessage = `Marhaba bik. I am ${agentName}, your professional Kuwait guide and assistant. How may I be of service regarding Kuwait today?`;
    }

    // Add welcome message on component mount
    setMessages([
      { content: welcomeMessage, isAI: true }
    ]);
    
    if (isRetroMode) {
      setMessages(prev => [
        ...prev,
        { content: "🕹️ Retro Mode activated! Play some Pong while we chat! Use your mouse to control the paddle.", isAI: true }
      ]);
    }
  }, [isRetroMode, agentName, apiKey, agentPersonality]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setIsApiKeySet(true);
      toast.success('API key saved successfully!');
    } else {
      toast.error('Please enter a valid API key');
    }
  };

  const callOpenAI = async (message: string) => {
    const openaiApiKey = localStorage.getItem('openai_api_key');
    const personalityPrompt = getPersonalityPrompt(agentPersonality);
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is not set');
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
            content: `You are ${agentName}, a helpful AI assistant focused on providing information about Kuwait - its history, culture, local areas, current events, giving recommendations, and answering questions related to Kuwait. ${personalityPrompt}` 
          },
          { role: 'user', content: message }
        ],
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  };

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      // Add user message to the chat
      setMessages(prev => [...prev, { content: message, isAI: false }]);

      // If no API key is set, show a toast
      if (!localStorage.getItem('openai_api_key')) {
        toast.error('Please set your OpenAI API key first');
        setIsLoading(false);
        return;
      }

      console.log('Sending message to OpenAI...');
      
      try {
        // Call OpenAI API directly
        const generatedText = await callOpenAI(message);
        setMessages(prev => [...prev, { content: generatedText, isAI: true }]);
      } catch (error) {
        console.error('Error calling OpenAI:', error);
        toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to get a response'}`);
        // Add error message to chat
        setMessages(prev => [...prev, { 
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Failed to get a response'}. Please check your API key and try again.`, 
          isAI: true 
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to get a response'}`);
      // Add error message to chat
      setMessages(prev => [...prev, { 
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Failed to get a response'}. Please try again.`, 
        isAI: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full relative ${isRetroMode ? 'retro-grid' : ''}`}>
      {isRetroMode && <div className="retro-scanline absolute inset-0 pointer-events-none" />}
      
      {!isApiKeySet && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-4 bg-black/30 backdrop-blur-md rounded-lg mx-auto max-w-md mt-4"
        >
          <h3 className="text-lg font-semibold mb-2">Set Your OpenAI API Key</h3>
          <p className="text-sm text-gray-400 mb-4">This is required for chat and voice functionality to work.</p>
          <form onSubmit={handleApiKeySubmit} className="flex flex-col gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="bg-black/40 border-gray-700"
            />
            <Button type="submit" className={isRetroMode ? 'bg-[#0DF5E3] text-black' : ''}>
              Save API Key
            </Button>
          </form>
        </motion.div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-y-auto p-4"
      >
        <div className={`max-w-4xl mx-auto ${isRetroMode ? 'space-y-6' : 'space-y-4'}`}>
          {messages.map((message, index) => (
            <ChatMessage 
              key={index}
              content={message.content}
              isAI={message.isAI}
              isRetroMode={isRetroMode}
            />
          ))}
          {isRetroMode && <PongGame />}
        </div>
      </motion.div>
      <div className={`p-4 border-t ${
        isRetroMode 
          ? 'border-[#0DF5E3]/20 bg-black/40 backdrop-blur-xl' 
          : 'border-border bg-background'
      }`}>
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isRetroMode={isRetroMode}
            disabled={isLoading || !isApiKeySet}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;


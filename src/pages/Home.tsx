
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

const Home = () => {
  const { isRetroMode } = useRetroMode();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [isApiKeySet, setIsApiKeySet] = useState(!!localStorage.getItem('openai_api_key'));
  const agentName = localStorage.getItem('agentName') || 'Agent';

  useEffect(() => {
    // Set the API key if it's provided but not already in localStorage
    if (apiKey && !localStorage.getItem('openai_api_key')) {
      localStorage.setItem('openai_api_key', apiKey);
      setIsApiKeySet(true);
    }

    // Add welcome message on component mount
    setMessages([
      { content: `${agentName} here, how can I help you today?`, isAI: true }
    ]);
    
    if (isRetroMode) {
      setMessages(prev => [
        ...prev,
        { content: "🕹️ Retro Mode activated! Play some Pong while we chat! Use your mouse to control the paddle.", isAI: true }
      ]);
    }
  }, [isRetroMode, agentName, apiKey]);

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
            content: `You are ${agentName}, a helpful AI assistant focused on providing information about local areas, giving recommendations, and answering questions.` 
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

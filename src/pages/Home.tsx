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
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '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');
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

  const isJsonResponse = (text: string) => {
    // Check if the response is likely JSON or HTML
    return text.trim().startsWith('{') || text.trim().startsWith('[');
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

      console.log('Sending message to generate function...');
      
      // Send the message to the generate function
      const response = await fetch('/functions/v1/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-openai-api-key': localStorage.getItem('openai_api_key') || ''
        },
        body: JSON.stringify({ 
          prompt: message,
          apiKey: localStorage.getItem('openai_api_key')
        }),
      });

      console.log('Response status:', response.status);
      
      // Get the response text first to check if it's JSON or HTML
      const responseText = await response.text();
      console.log('Response text first 100 chars:', responseText.substring(0, 100));
      
      // Check if the response is likely HTML (error page)
      if (!isJsonResponse(responseText)) {
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html>')) {
          throw new Error('Received HTML instead of JSON. The API endpoint may not be deployed or configured correctly.');
        } else {
          throw new Error(`Invalid response format: ${responseText.substring(0, 100)}...`);
        }
      }
      
      // If we got here, the response should be valid JSON
      const data = JSON.parse(responseText);
      console.log('Response data:', data);
      
      // Add AI response to the chat
      if (data.generatedText) {
        setMessages(prev => [...prev, { content: data.generatedText, isAI: true }]);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No response text received');
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

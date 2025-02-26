
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shuffle, ArrowRight, Keyboard } from 'lucide-react';

const suggestedNames = ['Atlas', 'Nova', 'Echo', 'Sage'];
const randomNames = [
  'Luna', 'Orion', 'Aria', 'Zephyr', 'Cyrus', 'Lyra', 
  'Felix', 'Aurora', 'Neo', 'Iris', 'Thea', 'Atlas'
];

const AgentSetup = () => {
  const [agentName, setAgentName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyboardTips, setShowKeyboardTips] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentName.trim()) {
      localStorage.setItem('agentName', agentName.trim());
      navigate('/app');
    }
  };

  const getRandomName = () => {
    const randomIndex = Math.floor(Math.random() * randomNames.length);
    setAgentName(randomNames[randomIndex]);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [agentName]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.8 8.544l1.414 1.414 9.9-9.9h-2.77zm22.314 0L53.2 8.544 51.785 9.958l-9.9-9.9h2.77zm-16.657 0L36.143 8.544l-1.414 1.414L25.272 0h2.828zm11 0L48.143 8.544l-1.415 1.414L37.272 0h2.828zm-5.343 0L42.143 8.544l-1.414 1.414L31.272 0h2.828zm-11 0L24.143 8.544l-1.414 1.414L13.272 0h2.828zm-5.344 0L18.142 8.544l-1.414 1.414L7.272 0h2.828z' fill='%23FFFFFF' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      }} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-md p-8 relative z-10"
      >
        {/* Eye Logo */}
        <div className="w-32 h-16 mx-auto mb-8">
          <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M10 50 Q100 -20 190 50 Q100 120 10 50" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M20 50 Q100 0 180 50 Q100 100 20 50" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M30 50 Q100 20 170 50 Q100 80 30 50" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M40 50 Q100 35 160 50 Q100 65 40 50" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="100" cy="50" r="10" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        <div className="text-center space-y-3 mb-8">
          <motion.h1 
            className="text-4xl font-semibold tracking-wide"
            style={{
              background: 'linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0.8))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Name Your AI Companion
          </motion.h1>
          <p className="text-white/60 text-lg">
            Begin your journey with a personalized AI assistant
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Input
              type="text"
              placeholder="Name your AI companion..."
              value={agentName}
              onChange={(e) => {
                setAgentName(e.target.value);
                setIsTyping(true);
              }}
              className="h-[56px] px-4 bg-white/5 border-white/10 text-lg text-white placeholder:text-white/40 rounded-xl transition-all duration-300
                focus:ring-2 focus:ring-white/20 focus:bg-white/10
                group-hover:bg-white/10"
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white hover:bg-white/10"
              onClick={getRandomName}
            >
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>

          {/* Suggested Names */}
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedNames.map((name) => (
              <motion.button
                key={name}
                type="button"
                onClick={() => setAgentName(name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-full bg-white/5 text-white/80 text-sm hover:bg-white/10 transition-all duration-200"
              >
                {name}
              </motion.button>
            ))}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="submit"
                  className="w-full h-14 text-lg font-medium rounded-xl relative overflow-hidden group bg-white/10"
                  disabled={!agentName.trim()}
                >
                  <motion.span 
                    className="relative z-10 flex items-center gap-2 text-white"
                    whileHover={{ x: 5 }}
                  >
                    Meet Your Agent
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Give your AI a unique identity for a more personal experience</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>

        {/* Keyboard Shortcuts */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: showKeyboardTips ? 1 : 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-sm flex items-center gap-2"
        >
          <Keyboard className="w-4 h-4" />
          <span>Press Enter to continue</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AgentSetup;

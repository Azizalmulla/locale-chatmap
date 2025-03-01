
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
import { ArrowRight, Keyboard } from 'lucide-react';

const AgentSetup = () => {
  const [agentName, setAgentName] = useState('');
  const [showKeyboardTips, setShowKeyboardTips] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentName.trim()) {
      localStorage.setItem('agentName', agentName.trim());
      navigate('/personality');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && agentName.trim()) {
      localStorage.setItem('agentName', agentName.trim());
      navigate('/personality');
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowKeyboardTips(true);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-md p-8 relative z-10"
      >
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
          <h1 className="text-[#f5e7c1] text-4xl font-normal lowercase tracking-wide">
            name your agent
          </h1>
          <p className="text-[#f5e7c1]/60 text-lg font-normal lowercase">
            begin your journey with a personalized ai agent
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Input
              type="text"
              placeholder="name your agent..."
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-[56px] px-4 bg-white/5 border-white/10 text-lg text-[#f5e7c1] lowercase font-normal placeholder:text-[#f5e7c1]/40 rounded-xl transition-all duration-300
                focus:ring-2 focus:ring-white/20 focus:bg-white/10
                group-hover:bg-white/10"
              autoFocus
            />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="submit"
                  className="w-full h-14 text-lg font-normal lowercase rounded-xl relative overflow-hidden group bg-white/10"
                  disabled={!agentName.trim()}
                >
                  <motion.span 
                    className="relative z-10 flex items-center gap-2 text-[#f5e7c1]"
                    whileHover={{ x: 5 }}
                  >
                    meet your agent
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="lowercase font-normal">
                <p>give your ai a unique identity for a more personal experience</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: showKeyboardTips ? 1 : 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#f5e7c1]/40 text-sm flex items-center gap-2 lowercase font-normal"
        >
          <Keyboard className="w-4 h-4" />
          <span>press enter to continue</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AgentSetup;

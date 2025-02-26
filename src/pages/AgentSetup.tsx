
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shuffle } from 'lucide-react';

const suggestedNames = ['Atlas', 'Nova', 'Echo', 'Sage'];
const randomNames = [
  'Luna', 'Orion', 'Aria', 'Zephyr', 'Cyrus', 'Lyra', 
  'Felix', 'Aurora', 'Neo', 'Iris', 'Thea', 'Atlas'
];

const AgentSetup = () => {
  const [agentName, setAgentName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentName.trim()) {
      localStorage.setItem('agentName', agentName.trim());
      navigate('/app');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #0D1117 0%, #2D1B4E 100%)`,
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            animate={{
              x: [
                mousePosition.x + Math.random() * 200 - 100,
                mousePosition.x + Math.random() * 200 - 100
              ],
              y: [
                mousePosition.y + Math.random() * 200 - 100,
                mousePosition.y + Math.random() * 200 - 100
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md p-8 relative z-10"
      >
        {/* AI Visual Representation */}
        <motion.div
          animate={{
            scale: isTyping ? 1.05 : 1,
            opacity: isTyping ? 0.8 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-[#7B68EE] to-[#4F46E5] shadow-lg"
        >
          <motion.div
            animate={{
              borderRadius: isTyping ? "30%" : "50%",
            }}
            className="w-full h-full backdrop-blur-sm bg-white/10"
          />
        </motion.div>

        <div className="text-center space-y-3 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Name Your AI Companion
          </h1>
          <p className="text-white/60">
            Create a unique bond by giving your AI assistant a personal name
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Name your AI companion..."
              value={agentName}
              onChange={(e) => {
                setAgentName(e.target.value);
                setIsTyping(true);
              }}
              className="h-[50px] bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-[#7B68EE]/50 transition-all"
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
              <button
                key={name}
                type="button"
                onClick={() => setAgentName(name)}
                className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm hover:bg-white/20 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="submit"
                  className="w-full h-12 text-lg font-medium rounded-xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #7B68EE 0%, #4F46E5 100%)',
                  }}
                  disabled={!agentName.trim()}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Meet Your Agent →
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Personalize your AI experience with a unique name</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AgentSetup;

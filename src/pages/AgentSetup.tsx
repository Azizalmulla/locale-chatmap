
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const navigate = useNavigate();
  const orbitRef = useRef<HTMLDivElement>(null);

  // Transform mouse position for parallax effect
  const rotateX = useTransform(mouseY, [0, window.innerHeight], [5, -5]);
  const rotateY = useTransform(mouseX, [0, window.innerWidth], [-5, 5]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentName.trim()) {
      localStorage.setItem('agentName', agentName.trim());
      navigate('/app');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);

    // Update particle positions if orb exists
    if (orbitRef.current) {
      const rect = orbitRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      updateParticles(x, y);
    }
  };

  const getRandomName = () => {
    const randomIndex = Math.floor(Math.random() * randomNames.length);
    setAgentName(randomNames[randomIndex]);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const currentIndex = suggestedNames.indexOf(agentName);
        const nextIndex = (currentIndex + 1) % suggestedNames.length;
        setAgentName(suggestedNames[nextIndex]);
      }
      if (e.key === '?') {
        setShowKeyboardTips(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [agentName]);

  // Particle system animation
  const updateParticles = (x: number, y: number) => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle: Element) => {
      const speed = isTyping ? 2 : 1;
      (particle as HTMLElement).style.transform = `translate(${(x - 50) * speed}px, ${(y - 50) * speed}px)`;
    });
  };

  // Reset typing state after delay
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
        background: `
          linear-gradient(120deg, #0A0C1B, #1F1135),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")
        `,
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Accent Lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8A7CFF] opacity-[0.05] blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#6E4FD1] opacity-[0.05] blur-[100px] rounded-full" />

      {/* Geometric Patterns */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.8 8.544l1.414 1.414 9.9-9.9h-2.77zm22.314 0L53.2 8.544 51.785 9.958l-9.9-9.9h2.77zm-16.657 0L36.143 8.544l-1.414 1.414L25.272 0h2.828zm11 0L48.143 8.544l-1.415 1.414L37.272 0h2.828zm-5.343 0L42.143 8.544l-1.414 1.414L31.272 0h2.828zm-11 0L24.143 8.544l-1.414 1.414L13.272 0h2.828zm-5.344 0L18.142 8.544l-1.414 1.414L7.272 0h2.828z' fill='%238A7CFF' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      }} />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ rotateX, rotateY }}
        className="w-full max-w-md p-8 relative z-10 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10"
      >
        {/* AI Visual Representation */}
        <motion.div
          ref={orbitRef}
          animate={{
            scale: isTyping ? 1.05 : 1,
            opacity: isTyping ? 0.8 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="w-32 h-32 mx-auto mb-8 rounded-full relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #8A7CFF 0%, #6E4FD1 50%, #B4A0FF 100%)`,
            boxShadow: `
              0 0 25px rgba(138, 124, 255, 0.15),
              inset 0 0 15px rgba(138, 124, 255, 0.2)
            `,
          }}
        >
          {/* Particle System */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="particle absolute w-2 h-2 bg-white/30 rounded-full"
              animate={{
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                scale: isTyping ? [1, 1.2, 1] : 1,
                opacity: isTyping ? [0.3, 0.6, 0.3] : 0.3,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          ))}
        </motion.div>

        <div className="text-center space-y-3 mb-8">
          <motion.h1 
            className="text-4xl font-semibold tracking-wide"
            style={{
              background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.8))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 1px 2px rgba(138, 124, 255, 0.3)',
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
              className="h-[56px] px-4 bg-white/10 border-transparent backdrop-blur-xl text-lg text-white placeholder:text-white/40 rounded-xl transition-all duration-300
                focus:ring-2 focus:ring-[#8A7CFF]/50 focus:bg-white/15
                group-hover:bg-white/15"
              style={{
                boxShadow: '0 0 20px rgba(138, 124, 255, 0.1)',
              }}
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
              onClick={getRandomName}
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            {agentName.length > 0 && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-sm text-white/40"
              >
                {agentName.length}/20
              </motion.span>
            )}
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
                className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm hover:bg-white/20 transition-colors duration-200"
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
                  className="w-full h-14 text-lg font-medium rounded-xl relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #6E4FD1 0%, #8A7CFF 100%)',
                    boxShadow: '0 0 20px rgba(138, 124, 255, 0.2)',
                  }}
                  disabled={!agentName.trim()}
                >
                  <motion.span 
                    className="relative z-10 flex items-center gap-2"
                    whileHover={{ x: 5 }}
                  >
                    Meet Your Agent
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
          <span>Tab to cycle suggestions • Enter to continue • ? for help</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AgentSetup;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight } from 'lucide-react';

const personalities = [
  { value: 'funny', label: 'Funny - A witty Kuwait guide with humor' },
  { value: 'chill', label: 'Chill - A relaxed, casual Kuwait guide' },
  { value: 'professional', label: 'Professional - A formal, detailed Kuwait guide' }
];

const AgentPersonality = () => {
  const [personality, setPersonality] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (personality) {
      localStorage.setItem('agentPersonality', personality);
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#222222]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="w-32 h-16 mx-auto mb-8">
          <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M10 50 Q100 -20 190 50 Q100 120 10 50" stroke="#1EAEDB" strokeWidth="2" fill="none"/>
            <path d="M20 50 Q100 0 180 50 Q100 100 20 50" stroke="#1EAEDB" strokeWidth="2" fill="none"/>
            <path d="M30 50 Q100 20 170 50 Q100 80 30 50" stroke="#1EAEDB" strokeWidth="2" fill="none"/>
            <path d="M40 50 Q100 35 160 50 Q100 65 40 50" stroke="#1EAEDB" strokeWidth="2" fill="none"/>
            <circle cx="100" cy="50" r="10" stroke="#1EAEDB" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        <div className="text-center space-y-3 mb-8">
          <h1 className="text-white text-4xl font-normal lowercase tracking-wide">
            choose personality
          </h1>
          <p className="text-[#9F9EA1] text-lg font-normal lowercase">
            select your kuwait guide's personality style
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Select onValueChange={setPersonality} value={personality}>
              <SelectTrigger className="h-[56px] px-4 bg-[#33353F] border-[#444444] text-lg text-white lowercase font-normal placeholder:text-[#9F9EA1] rounded-xl transition-all duration-300
                focus:ring-2 focus:ring-[#1EAEDB]/30 focus:bg-[#2D2F3A] hover:bg-[#2D2F3A]">
                <SelectValue placeholder="select a personality..." className="lowercase font-normal" />
              </SelectTrigger>
              <SelectContent className="bg-[#222222]/90 border-[#444444]">
                {personalities.map((p) => (
                  <SelectItem 
                    key={p.value} 
                    value={p.value}
                    className="text-white/90 lowercase font-normal focus:bg-[#1EAEDB]/10 focus:text-white"
                  >
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="submit"
                  className="w-full h-14 text-lg font-normal lowercase rounded-xl relative overflow-hidden group bg-[#1EAEDB]/10"
                  disabled={!personality}
                >
                  <motion.span 
                    className="relative z-10 flex items-center gap-2 text-white"
                    whileHover={{ x: 5 }}
                  >
                    continue
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-[#1EAEDB]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="lowercase font-normal">
                <p>choose how your kuwait guide ai will interact with you</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      </motion.div>
    </div>
  );
};

export default AgentPersonality;

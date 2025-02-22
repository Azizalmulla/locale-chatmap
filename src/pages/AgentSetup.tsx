
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AgentSetup = () => {
  const [agentName, setAgentName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentName.trim()) {
      localStorage.setItem('agentName', agentName.trim());
      navigate('/app');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-black"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Name Your Agent</h1>
          <p className="text-white/60">Give your AI assistant a name to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter agent name..."
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            autoFocus
          />
          <Button 
            type="submit"
            className="w-full"
            disabled={!agentName.trim()}
          >
            Continue to Dashboard
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AgentSetup;

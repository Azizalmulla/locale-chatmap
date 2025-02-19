
import { motion } from 'framer-motion';
import { Compass, MessageSquare, Map as MapIcon, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "AI Assistant",
    description: "Chat with our AI to discover local recommendations",
    icon: MessageSquare,
    to: "/app/chat",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    title: "Interactive Map",
    description: "Explore your city through our interactive map",
    icon: MapIcon,
    to: "/app/map",
    color: "bg-green-500/10 text-green-500"
  },
  {
    title: "Trending Places",
    description: "See what's popular in your area",
    icon: TrendingUp,
    to: "/app/trending",
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    title: "Local Discovery",
    description: "Find hidden gems near you",
    icon: Compass,
    to: "/app/map",
    color: "bg-orange-500/10 text-orange-500"
  }
];

const Home = () => {
  return (
    <div className="flex-1 p-8 bg-[#343541]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Welcome to Locale</h1>
          <p className="text-white/60 mt-2">Discover and explore your city like never before</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link 
              key={feature.title}
              to={feature.to}
              className="block"
            >
              <motion.div 
                whileHover={{ scale: 1.02, translateY: -4 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;

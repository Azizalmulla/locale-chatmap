
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import AgentSetup from './pages/AgentSetup';
import AgentPersonality from './pages/AgentPersonality';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import MapView from './pages/MapView';
import ChatView from './pages/ChatView';
import DashboardView from './pages/DashboardView';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<AgentSetup />} />
        <Route path="/personality" element={<AgentPersonality />} />
        <Route path="/app" element={<Index />}>
          <Route index element={<DashboardView />} />
          <Route path="chat" element={<ChatView />} />
          <Route path="map" element={<MapView />} />
          <Route path="trending" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

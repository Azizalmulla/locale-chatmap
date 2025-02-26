
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import AgentSetup from './pages/AgentSetup';
import AgentPersonality from './pages/AgentPersonality';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import MapView from './pages/MapView';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<AgentSetup />} />
        <Route path="/personality" element={<AgentPersonality />} />
        <Route path="/app" element={<Index />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<Home />} />
          <Route path="map" element={<MapView />} />
          <Route path="trending" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import AgentSetup from './pages/AgentSetup';
import AgentPersonality from './pages/AgentPersonality';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import MapView from './pages/MapView';
import SignInPage from './pages/SignIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/signin" element={<Navigate to="/sign-in" replace />} />
        
        {/* Protected Routes */}
        <Route
          path="/setup"
          element={
            <>
              <SignedIn>
                <AgentSetup />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/personality"
          element={
            <>
              <SignedIn>
                <AgentPersonality />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/app"
          element={
            <>
              <SignedIn>
                <Index />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        >
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

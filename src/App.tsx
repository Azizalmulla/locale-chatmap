
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
import { SignUp } from '@clerk/clerk-react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/signin" element={<Navigate to="/sign-in" replace />} />
        <Route 
          path="/sign-up" 
          element={
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black">
              <SignUp 
                signInUrl="/sign-in"
                redirectUrl="/setup"
                appearance={{
                  elements: {
                    formButtonPrimary: 
                      "bg-white hover:bg-white/90 text-black",
                    card: "bg-black/50 backdrop-blur-xl border border-white/10",
                    headerTitle: "text-white",
                    headerSubtitle: "text-white/60",
                    socialButtonsBlockButton: "text-white border-white/20",
                    formFieldLabel: "text-white/80",
                    formFieldInput: "bg-white/10 border-white/20 text-white",
                    dividerLine: "bg-white/20",
                    dividerText: "text-white/60",
                    footer: "text-white/60",
                  }
                }}
              />
            </div>
          }
        />
        <Route path="/signup" element={<Navigate to="/sign-up" replace />} />
        
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

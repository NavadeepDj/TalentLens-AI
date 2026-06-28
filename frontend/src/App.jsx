import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import PipelineDashboard from './pages/PipelineDashboard';
import Rankings from './pages/Rankings';
import Honeypots from './pages/Honeypots';
import HowItWorks from './pages/HowItWorks';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page — no sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard pages — with sidebar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<PipelineDashboard />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/honeypots" element={<Honeypots />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Route>
      </Routes>
    </Router>
  );
}

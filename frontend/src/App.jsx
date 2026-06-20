import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';
import CandidateView from './pages/CandidateView';
import MatchResults from './pages/MatchResults';
import HiddenTalent from './pages/HiddenTalent';
import AddCandidate from './pages/AddCandidate';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page — no sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard pages — with sidebar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidates/:id" element={<CandidateView />} />
          <Route path="/match" element={<MatchResults />} />
          <Route path="/discover" element={<HiddenTalent />} />
          <Route path="/add" element={<AddCandidate />} />
        </Route>
      </Routes>
    </Router>
  );
}

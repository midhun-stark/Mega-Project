import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EmotionProvider } from './context/EmotionContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Mood from './pages/Mood';
import Chat from './pages/Chat';
import Games from './pages/Games';
import MemoryGame from './pages/MemoryGame';
import Thaayam from './pages/Thaayam';
import Pallanguli from './pages/Pallanguli';
import VoiceJournal from './pages/VoiceJournal';
import DailyRoutine from './pages/DailyRoutine';
import Medicine from './pages/Medicine';
import Stories from './pages/Stories';
import FamilyConnect from './pages/FamilyConnect';
import SoundManager from './components/SoundManager';
import './App.css';

function App() {
    return (
        <Router>
            <EmotionProvider>
                <div className="app-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/mood" element={<Mood />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="/games/memory" element={<MemoryGame />} />
                        <Route path="/games/thaayam" element={<Thaayam />} />
                        <Route path="/games/pallanguli" element={<Pallanguli />} />
                        <Route path="/journal" element={<VoiceJournal />} />
                        <Route path="/routine" element={<DailyRoutine />} />
                        <Route path="/medicine" element={<Medicine />} />
                        <Route path="/stories" element={<Stories />} />
                        <Route path="/family" element={<FamilyConnect />} />
                    </Routes>
                    <NavBar />
                    <SoundManager />
                </div>
            </EmotionProvider>
        </Router>
    );
}

export default App;

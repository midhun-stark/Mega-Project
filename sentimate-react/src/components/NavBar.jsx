import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Heart, Grid, Mic } from 'lucide-react';
import { useEmotion } from '../context/EmotionContext';

export default function NavBar() {
    const { currentEmotion } = useEmotion();
    const location = useLocation();

    const navStyle = {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '90px',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        zIndex: 1000,
    };

    const navItemStyle = (isActive) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: isActive ? currentEmotion.color : '#9E9E9E',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
    });

    const micButtonStyle = {
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        backgroundColor: currentEmotion.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        boxShadow: `0 8px 20px ${currentEmotion.color}66`,
        marginTop: '-40px', // Floating effect
        border: '6px solid white',
        cursor: 'pointer',
    };

    return (
        <nav style={navStyle}>
            <Link to="/" style={navItemStyle(location.pathname === '/')}>
                <Home size={32} />
                <span style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>Home</span>
            </Link>

            <Link to="/games" style={navItemStyle(location.pathname === '/games')}>
                <Grid size={32} />
                <span style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>Games</span>
            </Link>

            <Link to="/journal" style={micButtonStyle}>
                <Mic size={32} />
            </Link>

            <Link to="/mood" style={navItemStyle(location.pathname === '/mood')}>
                <Heart size={32} />
                <span style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>Mood</span>
            </Link>

            <Link to="/chat" style={navItemStyle(location.pathname === '/chat')}>
                <MessageCircle size={32} />
                <span style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>Companion</span>
            </Link>
        </nav>
    );
}

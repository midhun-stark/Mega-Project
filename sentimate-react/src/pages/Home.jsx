import AIAvatar from '../components/AIAvatar';
import { useEmotion } from '../context/EmotionContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const { currentEmotion } = useEmotion();
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: '2rem', paddingBottom: '120px' }}
        >
            <header style={{ marginTop: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#757575', fontWeight: 400 }}>Good Morning,</h2>
                <h1 style={{ fontSize: '2.5rem', color: '#333', margin: '0.5rem 0' }}>Amma & Appa</h1>
            </header>

            <AIAvatar />

            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                <p style={{ fontSize: '1.25rem', color: '#555', maxWidth: '300px', margin: '0 auto' }}>
                    I am feeling <strong style={{ color: currentEmotion.color }}>{currentEmotion.label}</strong> today.
                    How about you?
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                <DashboardCard
                    title="Start Day"
                    icon="🌞"
                    color="#FFD54F"
                    onClick={() => navigate('/routine')}
                />
                <DashboardCard
                    title="Medicine"
                    icon="💊"
                    color="#81C784"
                    onClick={() => navigate('/medicine')}
                />
                <DashboardCard
                    title="Stories"
                    icon="📖"
                    color="#64B5F6"
                    onClick={() => navigate('/stories')}
                />
                <DashboardCard
                    title="Family"
                    icon="👨‍👩‍👧"
                    color="#E57373"
                    onClick={() => navigate('/family')}
                />
            </div>
        </motion.div>
    );
}

function DashboardCard({ title, icon, color, onClick }) {
    // Glassmorphism Style
    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '24px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    return (
        <motion.div
            onClick={onClick}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -5, boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.1)' }}
            style={glassStyle}
        >
            <div style={{
                fontSize: '2rem',
                marginBottom: '0.5rem',
                backgroundColor: 'rgba(255,255,255,0.8)', // Inner contrast
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 10px ${color}40`
            }}>
                {icon}
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#444', marginTop: '0.5rem' }}>{title}</span>
        </motion.div>
    )
}

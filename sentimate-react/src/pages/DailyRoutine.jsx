import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Sunrise, Coffee, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEmotion } from '../context/EmotionContext';

export default function DailyRoutine() {
    const { currentEmotion } = useEmotion();

    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
    };

    const tasks = [
        { time: '7:00 AM', task: 'Wake up & Drink Water', icon: <Sunrise color="#FF9800" /> },
        { time: '7:30 AM', task: 'Morning Walk', icon: <Sun color="#FFC107" /> },
        { time: '8:00 AM', task: 'Breakfast', icon: <Coffee color="#795548" /> },
    ];

    return (
        <div style={{ padding: '2rem', paddingBottom: '120px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <Link to="/" style={{ color: '#555', marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={32} />
                </Link>
                <h1 style={{ margin: 0, fontSize: '2rem' }}>Good Morning</h1>
            </div>

            <div style={glassStyle}>
                <h2 style={{ marginTop: 0, color: '#444' }}>Today's Plan</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>A fresh start for a beautiful day.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tasks.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.2 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.5)',
                                padding: '1rem',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.5)'
                            }}
                        >
                            <div style={{
                                background: 'white',
                                padding: '10px',
                                borderRadius: '50%',
                                marginRight: '1rem',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                            }}>
                                {item.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', color: '#888', fontWeight: 600 }}>{item.time}</div>
                                <div style={{ fontSize: '1.2rem', color: '#333' }}>{item.task}</div>
                            </div>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: currentEmotion.color
                                }}
                            >
                                <CheckCircle size={32} />
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

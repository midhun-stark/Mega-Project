import { useEmotion } from '../context/EmotionContext';
import { motion } from 'framer-motion';

export default function Mood() {
    const { emotions, setEmotion, currentEmotion } = useEmotion();

    return (
        <div style={{ padding: '2rem', paddingBottom: '120px' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>How are you feeling?</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '1rem'
            }}>
                {Object.values(emotions).map((emo) => (
                    <motion.div
                        key={emo.id}
                        onClick={() => setEmotion(emo)}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: currentEmotion.id === emo.id ? `3px solid ${emo.color}` : '3px solid transparent',
                            boxShadow: 'var(--shadow-card)',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{emo.icon}</div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#555' }}>{emo.label}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

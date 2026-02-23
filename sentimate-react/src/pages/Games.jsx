import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Games() {
    const navigate = useNavigate();

    const games = [
        { title: 'Memory Lane', desc: 'Match symbols', icon: '🧠', path: '/games/memory', color: '#FFF9C4' },
        { title: 'Thaayam', desc: 'Classic Dice Game', icon: '🎲', path: '/games/thaayam', color: '#E1BEE7' },
        { title: 'Pallanguli', desc: 'Traditional Board', icon: '🌰', path: '/games/pallanguli', color: '#C8E6C9' },
    ];

    return (
        <div style={{ padding: '2rem', paddingBottom: '120px' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>Games</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Sharpen your mind with these classics.</p>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {games.map((game, idx) => (
                    <motion.div
                        key={idx}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => !game.comingSoon && navigate(game.path)}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: 'var(--shadow-card)',
                            borderLeft: `8px solid ${game.comingSoon ? '#ddd' : game.color}`,
                            cursor: game.comingSoon ? 'default' : 'pointer',
                            opacity: game.comingSoon ? 0.7 : 1
                        }}
                    >
                        <div style={{
                            fontSize: '2.5rem',
                            marginRight: '1.5rem',
                            backgroundColor: game.color,
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {game.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', color: '#333' }}>{game.title}</h3>
                            <p style={{ margin: 0, color: '#777' }}>
                                {game.comingSoon ? 'Coming Soon...' : game.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

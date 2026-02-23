import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Headphones, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Stories() {
    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
    };

    const stories = [
        { title: 'The Old Banyan Tree', author: 'Kalki', duration: '15 mins', type: 'Audio', color: '#FFF3E0' },
        { title: 'Ponniyin Selvan (Ch. 1)', author: 'Kalki', duration: '20 mins', type: 'Audio', color: '#E1F5FE' },
        { title: 'Tenali Raman Wisdom', author: 'Folklore', duration: '10 mins', type: 'Read', color: '#F3E5F5' },
    ];

    return (
        <div style={{ padding: '2rem', paddingBottom: '120px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <Link to="/" style={{ color: '#555', marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={32} />
                </Link>
                <h1 style={{ margin: 0, fontSize: '2rem' }}>Stories</h1>
            </div>

            <div style={glassStyle}>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Listen to tales from the past.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {stories.map((story, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                display: 'flex'
                            }}
                        >
                            <div style={{ width: '80px', background: story.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {story.type === 'Audio' ? <Headphones size={30} color="#555" /> : <BookOpen size={30} color="#555" />}
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: '#333' }}>{story.title}</h3>
                                    <p style={{ margin: '0.4rem 0', color: '#888', fontSize: '0.9rem' }}>{story.author} • {story.duration}</p>
                                </div>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%', background: '#f5f5f5',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#333'
                                }}>
                                    <Play size={20} fill="#333" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

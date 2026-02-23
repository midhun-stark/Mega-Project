import { motion } from 'framer-motion';
import { ArrowLeft, Pill, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Medicine() {
    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
    };

    const meds = [
        { name: 'Calcium Vitamin', time: 'After Breakfast', type: 'Tablet', color: '#E8F5E9' },
        { name: 'Blood Pressure', time: '1:00 PM', type: 'Tablet', color: '#FFEBEE' },
        { name: 'Sugar Control', time: 'Before Dinner', type: 'Injection', color: '#E3F2FD' },
    ];

    return (
        <div style={{ padding: '2rem', paddingBottom: '120px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <Link to="/" style={{ color: '#555', marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={32} />
                </Link>
                <h1 style={{ margin: 0, fontSize: '2rem' }}>Medicine</h1>
            </div>

            <div style={glassStyle}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 80, height: 80, background: '#FFEBEE', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pill size={40} color="#E57373" />
                    </div>
                    <h3 style={{ marginTop: '1rem' }}>Next Dose: 1:00 PM</h3>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {meds.map((med, i) => (
                        <motion.div
                            key={i}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                background: 'rgba(255,255,255,0.8)',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderLeft: `6px solid ${med.name === 'Blood Pressure' ? '#E57373' : '#81C784'}`
                            }}
                        >
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>{med.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', marginTop: '0.4rem' }}>
                                    <Clock size={16} />
                                    <span>{med.time}</span>
                                </div>
                            </div>
                            <div style={{
                                background: med.color,
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: '#555'
                            }}>
                                {med.type}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

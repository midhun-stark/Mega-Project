import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Video, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FamilyConnect() {
    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
    };

    const family = [
        { name: 'Ravi (Son)', status: 'Online', lastSeen: 'Now', color: '#BBDEFB' },
        { name: 'Priya (Daughter)', status: 'Away', lastSeen: '2h ago', color: '#F8BBD0' },
        { name: 'Grandkids', status: 'Offline', lastSeen: 'Yesterday', color: '#E1BEE7' },
    ];

    return (
        <div style={{ padding: '2rem', paddingBottom: '120px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <Link to="/" style={{ color: '#555', marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={32} />
                </Link>
                <h1 style={{ margin: 0, fontSize: '2rem' }}>Family</h1>
            </div>

            <div style={glassStyle}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <p style={{ fontSize: '1.2rem', color: '#555' }}>Stay connected with your loved ones.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {family.map((member, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{
                                width: 60, height: 60, borderRadius: '50%', background: member.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', marginRight: '1rem'
                            }}>
                                {member.name.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, color: '#333' }}>{member.name}</h3>
                                <p style={{ margin: '0.3rem 0', color: member.status === 'Online' ? '#4CAF50' : '#999', fontSize: '0.9rem' }}>
                                    {member.status === 'Online' ? '● Online' : `Last seen ${member.lastSeen}`}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ padding: '10px', background: '#E3F2FD', borderRadius: '50%', color: '#2196F3', cursor: 'pointer' }}>
                                    <Phone size={24} />
                                </div>
                                <div style={{ padding: '10px', background: '#E8F5E9', borderRadius: '50%', color: '#4CAF50', cursor: 'pointer' }}>
                                    <Video size={24} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useEmotion } from '../context/EmotionContext';

export default function AIAvatar() {
    const { currentEmotion } = useEmotion();

    // Animation variants based on emotion
    const variants = {
        joyful: { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0], borderRadius: ["40%", "50%", "40%"] },
        calm: { scale: [1, 1.05, 1], borderRadius: ["50%", "45%", "50%"] },
        sad: { scale: [1, 0.95, 1], y: [0, 5, 0] },
        neutral: { scale: [1, 1.02, 1] },
        default: { scale: [1, 1.05, 1] }
    };

    const activeVariant = variants[currentEmotion.id] || variants.default;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <motion.div
                animate={activeVariant}
                transition={{
                    duration: currentEmotion.id === 'joyful' ? 2 : 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    width: '200px',
                    height: '200px',
                    background: `conic-gradient(from 0deg, ${currentEmotion.color}, white, ${currentEmotion.color})`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 60px ${currentEmotion.color}40`,
                    position: 'relative'
                }}
            >
                <div style={{
                    width: '180px',
                    height: '180px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '80px'
                }}>
                    {currentEmotion.icon}
                </div>

                {/* Breathing Ring */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: `2px solid ${currentEmotion.color}`,
                        zIndex: -1
                    }}
                />
            </motion.div>
        </div>
    );
}

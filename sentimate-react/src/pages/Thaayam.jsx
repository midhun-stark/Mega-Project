import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEmotion } from '../context/EmotionContext';

// Simple path mapping for a 5x5 grid (0-24 indices)
// Outer ring then inner ring then center (12)
// For MVP, we will use a linear path visual representation on top of the grid
const PLAYER_PATH = [20, 21, 22, 23, 24, 19, 14, 9, 4, 3, 2, 1, 0, 5, 10, 15, 16, 17, 18, 13, 8, 7, 6, 11, 12];
const AI_PATH = [4, 3, 2, 1, 0, 5, 10, 15, 20, 21, 22, 23, 24, 19, 14, 9, 8, 7, 6, 11, 16, 17, 18, 13, 12];

export default function Thaayam() {
    const { setEmotionById } = useEmotion();
    // Game State
    const [playerPos, setPlayerPos] = useState(-1); // Index in path, -1 = start
    const [aiPos, setAiPos] = useState(-1);
    const [diceValue, setDiceValue] = useState(null);
    const [turn, setTurn] = useState('player'); // 'player' or 'ai'
    const [log, setLog] = useState("Roll to start!");
    const [isRolling, setIsRolling] = useState(false);
    const [shells, setShells] = useState([false, false, false, false]); // For visual representation

    // Start game effect
    useEffect(() => {
        setEmotionById('neutral');
    }, []);

    const rollDice = () => {
        if (isRolling) return;
        setIsRolling(true);

        // Animate shells
        let rollInterval = setInterval(() => {
            setShells(prev => prev.map(() => Math.random() > 0.5));
        }, 100);

        setTimeout(() => {
            clearInterval(rollInterval);

            // Calculate real roll
            // Traditional probability logic simplified: 
            // 0 open = 8, 1 open = 1 (Thaayam), 2=2, 3=3, 4=4
            const rollCount = Math.floor(Math.random() * 5); // 0 to 4 open shells

            // Determine final shell state
            const finalShells = Array(4).fill(false).map((_, i) => i < rollCount);
            // Randomize positions for visual realism
            setShells(finalShells.sort(() => Math.random() - 0.5));

            let value = rollCount;
            if (value === 0) value = 8;

            setDiceValue(value);
            processMove(value);
            setIsRolling(false);
        }, 1000);
    };

    const processMove = (roll) => {
        if (turn === 'player') {
            let nextIndex = playerPos + roll;

            // Rule: Need Thaayam (1) to start? Let's skip that for ease of play for elderly, 
            // OR make it so any roll moves, but 1/5/12 are special. 
            // Let's keep it simple: Just move.

            if (nextIndex >= PLAYER_PATH.length - 1) {
                nextIndex = PLAYER_PATH.length - 1;
                setLog(`You rolled ${roll}. You Reached the Mountain! 🏔️`);
                setEmotionById('joyful');
            } else {
                setLog(`You rolled ${roll}. Moving forward.`);
            }
            setPlayerPos(nextIndex);

            // Extra turn on 1 or 8? Traditional rule.
            if (roll === 1 || roll === 8) {
                setLog(`You rolled ${roll} (Thaayam/Eight)! Roll again.`);
                // Keep turn
            } else {
                setTimeout(() => setTurn('ai'), 1500);
            }

        } else {
            // AI Turn
            let nextIndex = aiPos + roll;
            if (nextIndex >= AI_PATH.length - 1) {
                nextIndex = AI_PATH.length - 1;
                setLog(`Opponent rolled ${roll}. They reached the Mountain.`);
                setEmotionById('anxious');
            } else {
                setLog(`Opponent rolled ${roll}.`);
            }
            setAiPos(nextIndex);

            if (roll === 1 || roll === 8) {
                setLog(`Opponent rolled ${roll}! They roll again.`);
                setTimeout(() => aiTurn(), 1500); // Recursive AI turn
            } else {
                setTimeout(() => setTurn('player'), 1000);
                setLog("Your turn!");
            }
        }
    };

    // Trigger AI roll automatically
    useEffect(() => {
        if (turn === 'ai' && !isRolling) {
            aiTurn();
        }
    }, [turn]);

    const aiTurn = () => {
        setTimeout(rollDice, 1000);
    };

    return (
        <div style={{ padding: '1rem', paddingBottom: '120px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Link to="/games" style={{ color: '#555', textDecoration: 'none' }}>
                    <ArrowLeft size={28} />
                </Link>
                <h2 style={{ margin: 0 }}>Thaayam 🎲</h2>
                <div style={{ width: 28 }}></div> {/* Spacer */}
            </div>

            <div style={{ marginBottom: '1rem', minHeight: '2rem', color: '#666', fontWeight: 500 }}>
                {log}
            </div>

            {/* The Board */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '4px',
                maxWidth: '350px',
                margin: '0 auto',
                backgroundColor: '#e0e0e0',
                padding: '4px',
                borderRadius: '8px'
            }}>
                {Array.from({ length: 25 }).map((_, index) => {
                    const isCenter = index === 12;
                    const isSafe = [0, 4, 12, 20, 24].includes(index); // Corners and center

                    let content = null;
                    if (PLAYER_PATH[playerPos] === index && AI_PATH[aiPos] === index) {
                        content = <span style={{ fontSize: '1.2rem' }}>⚔️</span>; // Clash
                    } else if (PLAYER_PATH[playerPos] === index) {
                        content = <motion.div layoutId="p1" style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-joyful)', border: '2px solid #333' }} />;
                    } else if (AI_PATH[aiPos] === index) {
                        content = <motion.div layoutId="p2" style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-sad)', border: '2px solid #333' }} />;
                    } else if (isCenter) {
                        content = "🏔️";
                    } else if (isSafe) {
                        content = "✖️";
                    }

                    return (
                        <div
                            key={index}
                            style={{
                                aspectRatio: '1',
                                backgroundColor: isCenter ? '#fff9c4' : (isSafe ? '#f5f5f5' : 'white'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                color: '#ccc'
                            }}
                        >
                            {content}
                        </div>
                    );
                })}
            </div>

            {/* Controls */}
            <div style={{ marginTop: '2rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                }}>
                    {shells.map((isOpen, i) => (
                        <motion.div
                            key={i}
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            style={{
                                width: '40px',
                                height: '60px',
                                backgroundColor: isOpen ? '#fff' : '#8d6e63', // White inside, brown outside
                                border: '2px solid #5d4037',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {isOpen && <div style={{ width: 4, height: 30, background: '#ccc', borderRadius: 2 }}></div>}
                        </motion.div>
                    ))}
                </div>

                {turn === 'player' && (
                    <button
                        onClick={rollDice}
                        disabled={isRolling}
                        style={{
                            backgroundColor: 'var(--color-joyful)',
                            color: '#333',
                            padding: '1rem 3rem',
                            borderRadius: '30px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            opacity: isRolling ? 0.7 : 1
                        }}
                    >
                        {isRolling ? 'Rolling...' : 'Roll Shells'}
                    </button>
                )}

                {turn === 'ai' && (
                    <p style={{ fontStyle: 'italic', color: '#888' }}>Companion is thinking...</p>
                )}
            </div>
        </div>
    );
}

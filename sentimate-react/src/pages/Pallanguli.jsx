import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEmotion } from '../context/EmotionContext';

// 14 pits total. 0-6 (Player, bottom row, right to left or left to right), 7-13 (AI, top row)
// Traditional Pallanguli: 7 pits per side.
// Indexing: 
// AI:      13 12 11 10  9  8  7
// Player:   0  1  2  3  4  5  6
// Movement is usually Counter-Clockwise.

export default function Pallanguli() {
    const { setEmotionById } = useEmotion();
    const [board, setBoard] = useState(Array(14).fill(5)); // 5 seeds per pit initially
    const [playerStore, setPlayerStore] = useState(0);
    const [aiStore, setAiStore] = useState(0);
    const [turn, setTurn] = useState('player'); // 'player' or 'ai'
    const [isAnimating, setIsAnimating] = useState(false);
    const [log, setLog] = useState("Select a cup to sow seeds.");
    const [lastSown, setLastSown] = useState(null); // To highlight activity

    useEffect(() => {
        setEmotionById('calm'); // Strategy games focus
    }, []);

    const handleCupClick = (index) => {
        if (isAnimating || turn !== 'player') return;
        if (index > 6) return; // Can only click own row (0-6)
        if (board[index] === 0) return; // Cannot start from empty

        playMove(index, 'player');
    };

    const playMove = async (startIndex, currentTurn) => {
        setIsAnimating(true);
        let newBoard = [...board];
        let seeds = newBoard[startIndex];
        newBoard[startIndex] = 0;

        setLog(currentTurn === 'player' ? "Sowing..." : "Companion is sowing...");

        let currentIndex = startIndex;

        // Simulate Sowing Animation Step-by-Step
        // In a real implementation this would be a recursive timeout loop, 
        // for MVP we calculate result but visually delay updates slightly or just show end state for speed
        // Let's do a semi-visual approach: simple sowing loop.

        // A simple mechanics version: 
        // Just simple Mancala style: Sow until you land in empty? 
        // Pallanguli is complex (continues if land in non-empty). 
        // Let's implement: "Sow seeds. If last seed lands in non-empty, pick up that cup and continue. If empty, end turn."
        // Max chains: 5 to prevent infinite loops in bug cases for MVP.

        let chainCount = 0;
        while (seeds > 0 && chainCount < 10) {
            // Step forward
            currentIndex = (currentIndex + 1) % 14;
            newBoard[currentIndex]++;
            seeds--;

            // Update visual board for "tick" effect (fast)
            setBoard([...newBoard]);
            setLastSown(currentIndex);
            await new Promise(r => setTimeout(r, 200)); // Animation delay

            // Check continuation condition
            if (seeds === 0) {
                // Landed.
                if (newBoard[currentIndex] > 1) {
                    // Continue!
                    setLog("Picking up more seeds...");
                    await new Promise(r => setTimeout(r, 400));
                    seeds = newBoard[currentIndex];
                    newBoard[currentIndex] = 0;
                    setBoard([...newBoard]);
                    chainCount++;
                } else {
                    // Empty cup -> End Turn.
                    // In some variants, you capture the opposite? 
                    // Let's keep it simple: Turn ends.
                    setLog(currentTurn === 'player' ? "Turn ended." : "Companion finished turn.");
                }
            }
        }

        setBoard(newBoard);
        setIsAnimating(false);

        // Switch Turn
        if (currentTurn === 'player') {
            setTurn('ai');
        } else {
            setTurn('player');
            setLog("Your turn.");
        }
    };

    // AI Turn Logic
    useEffect(() => {
        if (turn === 'ai' && !isAnimating) {
            // Simple AI: Pick random non-empty cup from 7-13
            const validMoves = [];
            for (let i = 7; i < 14; i++) {
                if (board[i] > 0) validMoves.push(i);
            }

            if (validMoves.length > 0) {
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                setTimeout(() => playMove(randomMove, 'ai'), 1000);
            } else {
                // Verify game over or pass
                setTurn('player');
            }
        }
    }, [turn, isAnimating]);

    return (
        <div style={{ padding: '1rem', paddingBottom: '120px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Link to="/games" style={{ color: '#555', textDecoration: 'none' }}>
                    <ArrowLeft size={28} />
                </Link>
                <h2 style={{ margin: 0 }}>Pallanguli 🌰</h2>
                <div style={{ width: 28 }}></div>
            </div>

            <p style={{ minHeight: '1.5rem', color: '#666' }}>{log}</p>

            {/* Game Board Surface */}
            <div style={{
                backgroundColor: '#8D6E63',
                borderRadius: '40px',
                padding: '20px',
                marginTop: '2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                maxWidth: '500px',
                margin: '2rem auto'
            }}>

                {/* Row 1 (AI) - Indices 13 down to 7 */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
                    {[13, 12, 11, 10, 9, 8, 7].map(idx => (
                        <Pit
                            key={idx}
                            count={board[idx]}
                            isAi={true}
                            isActive={lastSown === idx}
                        />
                    ))}
                </div>

                {/* Row 2 (Player) - Indices 0 to 6 */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {[0, 1, 2, 3, 4, 5, 6].map(idx => (
                        <Pit
                            key={idx}
                            count={board[idx]}
                            isAi={false}
                            onClick={() => handleCupClick(idx)}
                            clickable={turn === 'player' && board[idx] > 0}
                            isActive={lastSown === idx}
                        />
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#999' }}>
                    Goal: Keep the flow moving. Sow seeds counter-clockwise.
                </p>
            </div>
        </div>
    );
}

function Pit({ count, isAi, onClick, clickable, isActive }) {
    // Generate random seed positions for visual realism
    const [seeds, setSeeds] = useState([]);

    useEffect(() => {
        setSeeds(Array(count).fill(0).map(() => ({
            x: Math.random() * 30 - 15,
            y: Math.random() * 30 - 15,
            rotation: Math.random() * 360
        })));
    }, [count]);

    return (
        <motion.div
            onClick={onClick}
            animate={{
                scale: isActive ? 1.1 : 1,
                borderColor: isActive ? '#FFD700' : 'rgba(0,0,0,0.1)'
            }}
            style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#5D4037', // Dark wood hole
                boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: clickable ? 'pointer' : 'default',
                opacity: (clickable || isAi) ? 1 : 0.7,
                border: '3px solid transparent'
            }}
        >
            <AnimatePresence>
                {seeds.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                            position: 'absolute',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#FFCC80', // Seed color
                            transform: `translate(${s.x}px, ${s.y}px)`,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Number badge for clarity */}
            <div style={{
                position: 'absolute',
                bottom: '-20px',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '10px'
            }}>
                {count}
            </div>
        </motion.div>
    );
}

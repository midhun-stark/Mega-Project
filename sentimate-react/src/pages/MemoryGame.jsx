import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion } from '../context/EmotionContext';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const CARDS_DATA = [
    { id: 1, content: '🪔', name: 'Deepam' },
    { id: 2, content: '🐘', name: 'Elephant' },
    { id: 3, content: '🥭', name: 'Mango' },
    { id: 4, content: '🎼', name: 'Music' },
    { id: 5, content: '🍵', name: 'Tea' },
    { id: 6, content: '🏏', name: 'Cricket' },
    { id: 7, content: '🚌', name: 'Bus' },
    { id: 8, content: '🏠', name: 'Home' },
];

export default function MemoryGame() {
    const { setEmotionById } = useEmotion();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [won, setWon] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        // Duplicate and shuffle
        const shuffled = [...CARDS_DATA, ...CARDS_DATA]
            .sort(() => Math.random() - 0.5)
            .map((card, index) => ({ ...card, uniqueId: index }));

        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setWon(false);
        setDisabled(false);
        setEmotionById('neutral'); // Reset emotion to focused/neutral
    };

    const handleClick = (id) => {
        if (disabled || flipped.includes(id) || solved.includes(id)) return;

        if (flipped.length === 0) {
            setFlipped([id]);
            return;
        }

        setFlipped([flipped[0], id]);
        setDisabled(true);
        checkForMatch(id);
    };

    const checkForMatch = (secondId) => {
        const [firstId] = flipped;
        const firstCard = cards.find(card => card.uniqueId === firstId);
        const secondCard = cards.find(card => card.uniqueId === secondId);

        if (firstCard.id === secondCard.id) {
            setSolved([...solved, firstId, secondId]);
            setFlipped([]);
            setDisabled(false);

            // Joyful feedback on match!
            if (solved.length + 2 === cards.length) {
                setWon(true);
                setEmotionById('joyful');
            }
        } else {
            setTimeout(() => {
                setFlipped([]);
                setDisabled(false);
            }, 1000);
        }
    };

    return (
        <div style={{ padding: '1rem', paddingBottom: '120px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Link to="/games" style={{ color: '#555', textDecoration: 'none' }}>
                    <ArrowLeft size={28} />
                </Link>
                <h2 style={{ margin: 0 }}>Memory Lane</h2>
                <div onClick={initializeGame} style={{ cursor: 'pointer', color: '#555' }}>
                    <RefreshCw size={24} />
                </div>
            </div>

            <p style={{ marginBottom: '2rem', color: '#666' }}>Match the symbols to keep your mind sharp.</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.8rem',
                maxWidth: '400px',
                margin: '0 auto'
            }}>
                {cards.map((card) => (
                    <Card
                        key={card.uniqueId}
                        item={card}
                        isFlipped={flipped.includes(card.uniqueId) || solved.includes(card.uniqueId)}
                        isSolved={solved.includes(card.uniqueId)}
                        onClick={() => handleClick(card.uniqueId)}
                    />
                ))}
            </div>

            {won && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        backgroundColor: 'var(--color-joyful-bg)',
                        borderRadius: '16px',
                        color: '#333'
                    }}
                >
                    <h3>🎉 Wonderful!</h3>
                    <p>You have a sharp memory!</p>
                    <button
                        onClick={initializeGame}
                        style={{
                            backgroundColor: 'var(--color-joyful)',
                            color: '#333',
                            padding: '0.8rem 2rem',
                            borderRadius: '30px',
                            marginTop: '0.5rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Play Again
                    </button>
                </motion.div>
            )}
        </div>
    );
}

function Card({ item, isFlipped, isSolved, onClick }) {
    return (
        <div style={{ perspective: '1000px', height: '80px' }} onClick={onClick}>
            <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Front (Hidden) */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#37474F',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-card)',
                    cursor: 'pointer'
                }}>
                    <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>❓</span>
                </div>

                {/* Back (Revealed) */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: isSolved ? 'var(--color-joyful-bg)' : 'white',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'rotateY(180deg)',
                    boxShadow: 'var(--shadow-card)',
                    border: isSolved ? '2px solid var(--color-joyful)' : '2px solid transparent'
                }}>
                    <span style={{ fontSize: '2.5rem' }}>{item.content}</span>
                </div>
            </motion.div>
        </div>
    );
}

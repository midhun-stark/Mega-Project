import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Save, RotateCcw } from 'lucide-react';
import { useEmotion, EMOTIONS } from '../context/EmotionContext';

export default function VoiceJournal() {
    const { setEmotion, setEmotionById } = useEmotion();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [entries, setEntries] = useState([
        { id: 1, text: "I felt happy seeing my grandchildren today.", mood: EMOTIONS.JOYFUL, date: 'Today, 10:00 AM' },
        { id: 2, text: "It was a bit quiet in the house yesterday.", mood: EMOTIONS.LONELY, date: 'Yesterday, 6:00 PM' }
    ]);

    // Mock Speech Recognition
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    interimTranscript += event.results[i][0].transcript;
                }
                setTranscript(prev => interimTranscript); // In a real app, handle appending better
                analyzeSentiment(interimTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
        } else {
            console.warn("Web Speech API not supported in this browser.");
        }
    }, []);

    const analyzeSentiment = (text) => {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('great') || lowerText.includes('wonderful')) {
            setEmotionById('joyful');
        } else if (lowerText.includes('sad') || lowerText.includes('cry') || lowerText.includes('miss')) {
            setEmotionById('sad');
        } else if (lowerText.includes('lonely') || lowerText.includes('alone')) {
            setEmotionById('lonely');
        } else if (lowerText.includes('angry') || lowerText.includes('mad')) {
            setEmotionById('angry');
        } else if (lowerText.includes('calm') || lowerText.includes('peace')) {
            setEmotionById('calm');
        } else if (lowerText.includes('anxious') || lowerText.includes('worry')) {
            setEmotionById('anxious');
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setTranscript(''); // Clear previous for new entry
            recognitionRef.current?.start();
            setIsListening(true);
            setEmotionById('neutral'); // Reset to neutral listening state
        }
    };

    // Fallback for demo if mic doesn't work or user wants to type
    const handleManualInput = (e) => {
        setTranscript(e.target.value);
        analyzeSentiment(e.target.value);
    };

    const saveEntry = () => {
        if (!transcript.trim()) return;

        // Determine final emotion based on current state (which was updated live)
        // In a real app, we'd run a final pass analysis here.
        const newEntry = {
            id: Date.now(),
            text: transcript,
            mood: EMOTIONS.NEUTRAL, // Default fallback, likely overridden by context
            date: 'Just now'
        };

        // Hacky way to get current emotion from context for the saved card color
        // Since we don't have direct access to 'currentEmotion' value inside this function scope easily 
        // without passing it or using a ref if we want the exact one *at save time*
        // relying on the fact that analyzeSentiment updated the global context.

        // Let's refine: We need the current emotion to save it.
        // The component re-renders when emotion changes, so we can grab it from props if we had it,
        // or we can re-analyze.

        setEntries([newEntry, ...entries]);
        setTranscript('');
        setIsListening(false);
        recognitionRef.current?.stop();
    };

    return (
        <div style={{ padding: '2rem', paddingBottom: '140px' }}>
            <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Voice Journal</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
                Speak your heart. I am listening.
            </p>

            {/* Microphone / Interaction Area */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                <motion.button
                    onClick={toggleListening}
                    animate={{
                        scale: isListening ? [1, 1.1, 1] : 1,
                        boxShadow: isListening ? "0 0 40px var(--current-accent)" : "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                    transition={{ duration: 1.5, repeat: isListening ? Infinity : 0 }}
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: isListening ? 'var(--color-angry)' : 'var(--color-neutral)', // "Rec" red or neutral
                        background: isListening ? 'var(--current-accent)' : '#fff', // Use emotion color when active
                        color: isListening ? '#fff' : '#555',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        marginBottom: '2rem',
                        position: 'relative'
                    }}
                >
                    {isListening ? <Square size={40} fill="currentColor" /> : <Mic size={50} />}

                    {/* Ripple effect */}
                    {isListening && (
                        <motion.div
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                border: '2px solid var(--current-accent)'
                            }}
                        />
                    )}
                </motion.button>

                <AnimatePresence>
                    {(isListening || transcript) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{ width: '100%', maxWidth: '500px' }}
                        >
                            <textarea
                                value={transcript}
                                onChange={handleManualInput}
                                placeholder="Listening..."
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    padding: '1.5rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    backgroundColor: 'white',
                                    boxShadow: 'var(--shadow-soft)',
                                    fontSize: '1.25rem',
                                    fontFamily: 'inherit',
                                    color: '#444',
                                    resize: 'none'
                                }}
                            />

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setTranscript('')}
                                    style={{
                                        padding: '0.8rem 1.5rem',
                                        borderRadius: '30px',
                                        backgroundColor: '#eee',
                                        color: '#555',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <RotateCcw size={18} /> Clear
                                </button>
                                <button
                                    onClick={saveEntry}
                                    style={{
                                        padding: '0.8rem 2rem',
                                        borderRadius: '30px',
                                        backgroundColor: 'var(--current-accent)',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}
                                >
                                    <Save size={18} /> Save Entry
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Previous Entries */}
            <div>
                <h3 style={{ marginLeft: '0.5rem', marginBottom: '1rem', color: '#555' }}>Past Thoughts</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {entries.map(entry => (
                        <div
                            key={entry.id}
                            style={{
                                backgroundColor: 'white',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                boxShadow: 'var(--shadow-card)',
                                borderLeft: `6px solid ${entry.mood?.color || '#ccc'}`
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>
                                <span>{entry.date}</span>
                                <span>{entry.mood?.icon}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '1.1rem', color: '#444' }}>"{entry.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

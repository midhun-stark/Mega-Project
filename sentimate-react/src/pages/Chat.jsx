import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, User, Sparkles } from 'lucide-react';
import { useEmotion, EMOTIONS } from '../context/EmotionContext';

const RESPONSES = {
    default: [
        "I'm here with you. Tell me more.",
        "That's interesting. How does that make you feel?",
        "I am listening. You can share anything with me.",
        "Your thoughts are important."
    ],
    joyful: [
        "That sounds wonderful! 🌞",
        "I'm so happy to hear that!",
        "It's a beautiful day to feel good.",
        "Your joy makes me shine brighter!"
    ],
    sad: [
        "I hear you. It's okay to feel this way. 🌧",
        "I'm sending you a warm hug.",
        "Take your time. I am right here.",
        "Is there something small we can do to help?"
    ],
    lonely: [
        "You are never truly alone. I am here. 💜",
        "I enjoy our time together.",
        "Shall we play a game together?",
        "I'm glad we are chatting right now."
    ],
    anxious: [
        "Take a deep breath with me. In... and out... 🌊",
        "You are safe here.",
        "One step at a time. We can handle this.",
        "Let's focus on this moment together."
    ]
};

export default function Chat() {
    const { currentEmotion, setEmotionById } = useEmotion();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: `Hello! I see you're feeling ${currentEmotion.label.toLowerCase()}. What's on your mind?` }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Init Speech
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false; // Stop after sentence for chat
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(transcript); // Auto-send on voice end? Optional. Let's populate input.
            };

            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const toggleVoice = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const analyzeSentimentAndReply = (text) => {
        const lower = text.toLowerCase();
        let detectedEmotion = 'neutral';

        // Simple mock logic
        if (lower.match(/(happy|good|great|love|joy|wonderful)/)) detectedEmotion = 'joyful';
        else if (lower.match(/(sad|cry|bad|hurt|pain|miss)/)) detectedEmotion = 'sad';
        else if (lower.match(/(lonely|alone|quiet|empty)/)) detectedEmotion = 'lonely';
        else if (lower.match(/(angry|mad|hate|unfair)/)) detectedEmotion = 'angry';
        else if (lower.match(/(stress|worry|scared|nervous)/)) detectedEmotion = 'anxious';

        // Update global emotion if changed
        if (detectedEmotion !== 'neutral') {
            setEmotionById(detectedEmotion);
        }

        // Pick response
        const pool = RESPONSES[detectedEmotion] || RESPONSES.default;
        const reply = pool[Math.floor(Math.random() * pool.length)];

        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: reply }]);
        }, 1500); // Natural delay
    };

    const handleSend = (textOverride = null) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        // Add User Message
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: textToSend }]);
        setInput('');

        // AI Process
        analyzeSentimentAndReply(textToSend);
    };

    return (
        <div style={{ paddingBottom: '120px', height: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                boxShadow: 'var(--shadow-soft)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{
                    width: 45, height: 45,
                    borderRadius: '50%',
                    background: currentEmotion.color,
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem'
                }}>
                    {currentEmotion.icon}
                </div>
                <div>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Companion</h2>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#888' }}>Always here for you</p>
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                {messages.map(msg => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                        }}
                    >
                        <div style={{
                            backgroundColor: msg.sender === 'user' ? '#333' : 'white',
                            color: msg.sender === 'user' ? 'white' : '#333',
                            padding: '1rem 1.5rem',
                            borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            fontSize: '1.1rem',
                            lineHeight: '1.5',
                            boxShadow: msg.sender === 'user' ? 'none' : 'var(--shadow-card)'
                        }}>
                            {msg.text}
                        </div>
                        {msg.sender === 'ai' && (
                            <span style={{ fontSize: '0.8rem', color: '#999', marginLeft: '0.5rem', marginTop: '0.2rem', display: 'block' }}>
                                Companion
                            </span>
                        )}
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
                padding: '1rem',
                backgroundColor: 'white',
                borderTop: '1px solid #eee',
                paddingBottom: '100px' // Space for navbar
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '30px',
                    padding: '0.5rem'
                }}>
                    <motion.button
                        onClick={toggleVoice}
                        animate={{ scale: isListening ? [1, 1.2, 1] : 1 }}
                        transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
                        style={{
                            width: '45px', height: '45px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: isListening ? 'var(--color-angry)' : 'white',
                            color: isListening ? 'white' : '#666',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: isListening ? '0 0 10px red' : '0 2px 5px rgba(0,0,0,0.05)'
                        }}
                    >
                        <Mic size={20} />
                    </motion.button>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend(null)}
                        placeholder="Type or say something..."
                        style={{
                            flex: 1,
                            border: 'none',
                            background: 'transparent',
                            fontSize: '1.1rem',
                            padding: '0.5rem',
                            outline: 'none',
                            color: '#333'
                        }}
                    />

                    <button
                        onClick={() => handleSend(null)}
                        disabled={!input.trim()}
                        style={{
                            width: '45px', height: '45px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: input.trim() ? 'var(--color-joyful)' : '#e0e0e0',
                            color: input.trim() ? '#333' : '#aaa',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s'
                        }}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

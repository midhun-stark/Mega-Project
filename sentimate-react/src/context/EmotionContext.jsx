import { createContext, useContext, useState, useEffect } from 'react';

const EmotionContext = createContext();

export const EMOTIONS = {
    JOYFUL: { id: 'joyful', label: 'Joyful', color: 'var(--color-joyful)', bg: 'var(--color-joyful-bg)', icon: '🌞' },
    CONTENT: { id: 'content', label: 'Content', color: 'var(--color-content)', bg: 'var(--color-content-bg)', icon: '🌿' },
    NEUTRAL: { id: 'neutral', label: 'Neutral', color: 'var(--color-neutral)', bg: 'var(--color-neutral-bg)', icon: '☁️' },
    SAD: { id: 'sad', label: 'Sad', color: 'var(--color-sad)', bg: 'var(--color-sad-bg)', icon: '🌧' },
    ANGRY: { id: 'angry', label: 'Angry', color: 'var(--color-angry)', bg: 'var(--color-angry-bg)', icon: '🔴' },
    ANXIOUS: { id: 'anxious', label: 'Anxious', color: 'var(--color-anxious)', bg: 'var(--color-anxious-bg)', icon: '🌊' },
    LONELY: { id: 'lonely', label: 'Lonely', color: 'var(--color-lonely)', bg: 'var(--color-lonely-bg)', icon: '💜' },
    CALM: { id: 'calm', label: 'Calm', color: 'var(--color-calm)', bg: 'var(--color-calm-bg)', icon: '🍃' },
    HOPEFUL: { id: 'hopeful', label: 'Hopeful', color: 'var(--color-hopeful)', bg: 'var(--color-hopeful-bg)', icon: '🌅' },
    OVERWHELMED: { id: 'overwhelmed', label: 'Overwhelmed', color: 'var(--color-overwhelmed)', bg: 'var(--color-overwhelmed-bg)', icon: '🌫' },
};

export function EmotionProvider({ children }) {
    const [currentEmotion, setCurrentEmotion] = useState(EMOTIONS.NEUTRAL);

    useEffect(() => {
        // Update CSS variables or body classes if needed for global transitions
        document.body.style.backgroundColor = currentEmotion.bg;
        document.body.style.setProperty('--current-accent', currentEmotion.color);
    }, [currentEmotion]);

    const setEmotionById = (id) => {
        const emotion = Object.values(EMOTIONS).find(e => e.id === id);
        if (emotion) setCurrentEmotion(emotion);
    };

    return (
        <EmotionContext.Provider value={{ currentEmotion, setEmotion: setCurrentEmotion, setEmotionById, emotions: EMOTIONS }}>
            {children}
        </EmotionContext.Provider>
    );
}

export function useEmotion() {
    return useContext(EmotionContext);
}

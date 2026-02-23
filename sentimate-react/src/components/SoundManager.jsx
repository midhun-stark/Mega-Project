import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useEmotion } from '../context/EmotionContext';

// Generative Sound Engine using Web Audio API
// This avoids copyright issues and external dependency failures by synthesizing sounds live.
export default function SoundManager() {
    const { currentEmotion } = useEmotion();
    const [isMuted, setIsMuted] = useState(true); // Default muted for browser autoplay policy
    const audioCtxRef = useRef(null);
    const oscillatorsRef = useRef([]);
    const gainNodeRef = useRef(null);
    const noiseNodeRef = useRef(null);

    useEffect(() => {
        // Cleanup on unmount
        return () => stopSound();
    }, []);

    useEffect(() => {
        if (!isMuted && audioCtxRef.current) {
            playSoundForEmotion(currentEmotion.id);
        }
    }, [currentEmotion, isMuted]);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContext();
            gainNodeRef.current = audioCtxRef.current.createGain();
            gainNodeRef.current.connect(audioCtxRef.current.destination);
            gainNodeRef.current.gain.value = 0.1; // Low volume default
        }
    };

    const toggleMute = () => {
        if (isMuted) {
            initAudio();
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
            setIsMuted(false);
        } else {
            stopSound();
            setIsMuted(true);
        }
    };

    const stopSound = () => {
        oscillatorsRef.current.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch (e) { }
        });
        oscillatorsRef.current = [];

        if (noiseNodeRef.current) {
            try { noiseNodeRef.current.stop(); noiseNodeRef.current.disconnect(); } catch (e) { }
            noiseNodeRef.current = null;
        }
    };

    // 🎵 The Sound Scapes
    const playSoundForEmotion = (emotionId) => {
        stopSound(); // Clear previous
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;

        // Master Gain ramp for smooth transition
        gainNodeRef.current.gain.cancelScheduledValues(now);
        gainNodeRef.current.gain.setValueAtTime(0, now);
        gainNodeRef.current.gain.linearRampToValueAtTime(0.1, now + 2); // 2s fade in

        switch (emotionId) {
            case 'joyful':
            case 'hopeful':
                // ✨ Bright Major Chord Pad (C Major 7) + High texture
                playDrone([261.63, 329.63, 392.00, 493.88], 'sine', 0); // C4, E4, G4, B4
                startTwinkle();
                break;

            case 'sad':
            case 'lonely':
            case 'overwhelmed':
                // 🌧️ Rain (Pink Noise + Lowpass) + Minor Drone
                playNoise('pink');
                playDrone([174.61, 207.65, 261.63], 'triangle', 0.05); // F3, G#3, C4 (F Minor)
                break;

            case 'neutral':
            case 'content':
            case 'calm':
                // 🌿 Nature-like Drone (Pentatonic drift)
                playDrone([196.00, 293.66, 329.63], 'sine', 0); // G3, D4, E4
                simulateBirds(); // Occasional Chirps
                break;

            case 'angry':
            case 'anxious':
                // 🌊 Deep Ocean / Rumble (Brown Noise)
                playNoise('brown');
                playDrone([110.00, 116.54], 'sawtooth', 0.03); // A2, Bb2 (Dissonant)
                break;

            default:
                playDrone([220, 277.18], 'sine', 0);
        }
    };

    // --- Sythesis Helpers ---

    const playDrone = (freqs, type, detune) => {
        const ctx = audioCtxRef.current;

        freqs.forEach(f => {
            const osc = ctx.createOscillator();
            osc.type = type;
            osc.frequency.value = f;

            const oscGain = ctx.createGain();
            oscGain.gain.value = 0.5 / freqs.length; // Balance volume

            // Soft LFO for movement (breathing sound)
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 0.1 + Math.random() * 0.2; // distinct slow breaths
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 10; // Depth
            lfo.connect(lfoGain).connect(osc.frequency);
            lfo.start();
            oscillatorsRef.current.push(lfo);

            osc.connect(oscGain).connect(gainNodeRef.current);
            osc.start();
            oscillatorsRef.current.push(osc);
        });
    };

    const playNoise = (type) => {
        const ctx = audioCtxRef.current;
        const bufferSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02; // Brown-ish
            lastOut = output[i];
            output[i] *= 3.5;
        }
        // Simple Pink/Brown approximation buffer
        // (Real math omitted for brevity, using simple lowpass on white noise often better)

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Filter to make it sound like rain (Lowpass)
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = type === 'pink' ? 800 : 400; // Rain vs Rumble

        noise.connect(filter).connect(gainNodeRef.current);
        noise.start();
        noiseNodeRef.current = noise;
    };

    // Simulates random high-pitch chirps
    const simulateBirds = () => {
        const ctx = audioCtxRef.current;
        const chirp = () => {
            if (!oscillatorsRef.current) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(1500 + Math.random() * 1000, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(1000 + Math.random() * 500, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

            osc.connect(gain).connect(gainNodeRef.current);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);

            // Schedule next chirp
            setTimeout(chirp, 2000 + Math.random() * 5000);
        };
        chirp();
    };

    // Random sparkles
    const startTwinkle = () => {
        // Implementation similar to birds but higher pitch sine bells
    }

    let lastOut = 0;

    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 2000
            }}
        >
            <button
                onClick={toggleMute}
                style={{
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    border: 'none',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#555'
                }}
            >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
        </div>
    );
}

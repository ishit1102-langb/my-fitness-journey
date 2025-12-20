// Sound effects using Web Audio API
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Play a note with given frequency and duration
const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.log('Audio not supported');
  }
};

// Play multiple notes in sequence
const playMelody = (notes: { freq: number; duration: number; delay: number }[], type: OscillatorType = 'sine') => {
  notes.forEach(({ freq, duration, delay }) => {
    setTimeout(() => playTone(freq, duration, type), delay);
  });
};

export const sounds = {
  // Simple click/tap sound
  tap: () => {
    playTone(800, 0.05, 'sine', 0.2);
  },
  
  // Success sound for workout logged
  success: () => {
    playMelody([
      { freq: 523, duration: 0.1, delay: 0 },    // C5
      { freq: 659, duration: 0.1, delay: 80 },   // E5
      { freq: 784, duration: 0.15, delay: 160 }, // G5
    ], 'sine');
  },
  
  // Celebration fanfare for goal achieved
  celebration: () => {
    playMelody([
      { freq: 523, duration: 0.15, delay: 0 },    // C5
      { freq: 659, duration: 0.15, delay: 100 },  // E5
      { freq: 784, duration: 0.15, delay: 200 },  // G5
      { freq: 1047, duration: 0.3, delay: 350 },  // C6
      { freq: 784, duration: 0.1, delay: 500 },   // G5
      { freq: 1047, duration: 0.4, delay: 600 },  // C6
    ], 'triangle');
  },
  
  // Level up / achievement sound
  achievement: () => {
    playMelody([
      { freq: 392, duration: 0.1, delay: 0 },    // G4
      { freq: 523, duration: 0.1, delay: 80 },   // C5
      { freq: 659, duration: 0.1, delay: 160 },  // E5
      { freq: 784, duration: 0.2, delay: 240 },  // G5
      { freq: 1047, duration: 0.3, delay: 400 }, // C6
    ], 'square');
  },
  
  // Steps added sound
  steps: () => {
    playMelody([
      { freq: 440, duration: 0.08, delay: 0 },   // A4
      { freq: 554, duration: 0.12, delay: 60 },  // C#5
    ], 'sine');
  },
};

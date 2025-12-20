// Haptic feedback utilities using Vibration API
export const haptics = {
  // Light tap for button presses
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  
  // Medium feedback for actions
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  },
  
  // Strong feedback for important actions
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },
  
  // Success pattern for celebrations
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30, 50, 50]);
    }
  },
  
  // Achievement unlocked pattern
  celebration: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50, 100, 100, 100, 200]);
    }
  },
};

export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light') => {
  if (typeof window === 'undefined' || !window.navigator || !window.navigator.vibrate) return;

  try {
    switch (type) {
      case 'light':
        window.navigator.vibrate(10);
        break;
      case 'medium':
        window.navigator.vibrate(20);
        break;
      case 'heavy':
        window.navigator.vibrate(30);
        break;
      case 'success':
        window.navigator.vibrate([10, 60, 20]);
        break;
      case 'warning':
        window.navigator.vibrate([20, 60, 20, 60, 20]);
        break;
    }
  } catch (e) {
    // Ignore errors as some browsers block vibrate unless user interacts
  }
};

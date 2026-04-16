export function isNativePlatform(): boolean {
  try {
    // Only check if Capacitor global is available (injected by native shell)
    return typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
}

export async function initCapacitor() {
  if (!isNativePlatform()) return;

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#1a1625' });
  } catch {
    // StatusBar not available
  }

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch {
    // SplashScreen not available
  }

  try {
    const { Keyboard } = await import('@capacitor/keyboard');
    Keyboard.addListener('keyboardWillShow', () => {
      document.body.classList.add('keyboard-open');
    });
    Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-open');
    });
  } catch {
    // Keyboard not available
  }
}

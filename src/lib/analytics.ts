export function trackEvent(action: string, params?: Record<string, unknown>) {
  try {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', action, params || {});
    } else {
      // no-op in non-browser or if gtag not loaded
    }
  } catch (err) {
    console.warn('trackEvent error', err);
  }
}



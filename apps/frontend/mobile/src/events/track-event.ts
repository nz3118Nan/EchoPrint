export function trackEvent(name: string, properties?: Record<string, string>) {
  console.info("[event]", name, properties);
}

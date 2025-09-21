const isBrowser = typeof window !== "undefined";

export function readSessionStorage(key: string): string | null {
  if (!isBrowser) {
    return null;
  }

  try {
    return window.sessionStorage.getItem(key);
  } catch (error) {
    console.warn(`[storage] Failed to read key "${key}":`, error);
    return null;
  }
}

export function writeSessionStorage(key: string, value: string) {
  if (!isBrowser) {
    return;
  }

  try {
    window.sessionStorage.setItem(key, value);
  } catch (error) {
    console.warn(`[storage] Failed to write key "${key}":`, error);
  }
}

export function removeSessionStorage(key: string) {
  if (!isBrowser) {
    return;
  }

  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] Failed to remove key "${key}":`, error);
  }
}

export function buildStorageKey(prefix: string, suffix: string): string {
  return `${prefix}:${suffix}`;
}

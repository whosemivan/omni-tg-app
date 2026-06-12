import { useState, useEffect } from 'react';

const STORAGE_KEY = 'omni-theme';

export function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem(STORAGE_KEY) === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  return { dark, toggle: () => setDark((v) => !v) };
}

import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ma'lumotlar hozircha telefon xotirasida saqlanadi (keyin serverga ulanadi).
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (raw) setValue(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
      });
  }, [key]);

  useEffect(() => {
    if (loaded.current) AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, [key, value]);

  return [value, setValue] as const;
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

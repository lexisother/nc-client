import { clear, del, get, set } from 'idb-keyval';
import { useEffect, useState } from 'react';

class LocalStorage {
  public async get<T>(key: string, defaultValue: any | null = null): Promise<T> {
    let value = await get(key);

    if (!value) {
      value = defaultValue;
    }

    return value as unknown as T;
  }

  public async set(key: string, value: any): Promise<void> {
    await set(key, value);
  }

  public async remove(key: string): Promise<void> {
    await del(key);
  }

  public async clear(): Promise<void> {
    await clear();
  }
}

export const Storage = new LocalStorage();

export function useIdb(key: string, initialState: any): [any, (v: any) => void] {
  const [item, setItem] = useState(initialState);
  useEffect(() => {
    Storage.get(key).then((v) => v === undefined || setItem(v));
  }, [key]);

  return [
    item,
    (v: any) => {
      setItem(v);
      return Storage.set(key, v);
    },
  ];
}

'use client';

/**
 * Mock Firebase Implementation (TSX)
 * Centralized Auth Context to ensure synchronization across components.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// --- INITIAL DATA SEEDING ---
const INITIAL_USERS = [
  { id: 'user_1', name: 'Alex', age: 26, city: 'London', interests: ['AI', 'Jazz', 'Coding'], bio: 'AI researcher and jazz pianist looking for harmonic resonance.', onboarded: true, soulVector: 'Analytical harmonic explorer' },
  { id: 'user_2', name: 'Sam', age: 29, city: 'NYC', interests: ['Coding', 'Music', 'Hiking'], bio: 'Full-stack developer who loves mountain trails and modular synths.', onboarded: true, soulVector: 'Digital nature enthusiast' },
  { id: 'user_3', name: 'Jordan', age: 24, city: 'Berlin', interests: ['Art', 'Philosophy', 'Techno'], bio: 'Digital artist exploring the intersection of ethics and aesthetic.', onboarded: true, soulVector: 'Philosophical creative signal' },
  { id: 'user_4', name: 'Casey', age: 31, city: 'Tokyo', interests: ['Gaming', 'Photography', 'Sushi'], bio: 'Street photographer and competitive gamer based in Shibuya.', onboarded: true, soulVector: 'Visual interactive strategist' },
];

const getDb = () => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem('soulmatter_db');
  if (!stored) {
    const initialDb = { users: INITIAL_USERS, interactions: [], chat_messages: {} };
    localStorage.setItem('soulmatter_db', JSON.stringify(initialDb));
    return initialDb;
  }
  return JSON.parse(stored);
};

// --- AUTH CONTEXT ---

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('soulmatter_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: any) => {
    localStorage.setItem('soulmatter_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('soulmatter_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseClientProvider');
  }
  return context;
}

// --- MOCK FIRESTORE ---

export function useFirestore() {
  return null;
}

export function useCollection(queryInfo: any) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const queryKey = JSON.stringify(queryInfo);

  useEffect(() => {
    if (!queryInfo) {
      setLoading(false);
      return;
    }

    const fetchData = () => {
      const db = getDb();
      const collectionName = queryInfo.collection;
      let items = db[collectionName] || [];

      if (queryInfo.where) {
        items = items.filter((item: any) => {
          const [field, op, value] = queryInfo.where;
          if (op === '==') return item[field] === value;
          if (op === 'includes') return item[field]?.includes(value);
          return true;
        });
      }

      setData((prev) => {
        const nextStr = JSON.stringify(items);
        const prevStr = JSON.stringify(prev);
        return nextStr === prevStr ? prev : items;
      });
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [queryKey]);

  return { data, loading };
}

export function useDoc(docInfo: any) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const docKey = JSON.stringify(docInfo);

  useEffect(() => {
    if (!docInfo) {
      setLoading(false);
      return;
    }

    const fetchData = () => {
      const db = getDb();
      const collection = db[docInfo.collection] || [];
      const item = collection.find((i: any) => i.id === docInfo.id);
      
      setData((prev) => {
        const nextStr = JSON.stringify(item || null);
        const prevStr = JSON.stringify(prev);
        return nextStr === prevStr ? prev : (item || null);
      });
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [docKey]);

  return { data, loading };
}

export const mockDb = {
  add: (collectionName: string, data: any) => {
    const db = getDb();
    if (!db[collectionName]) db[collectionName] = [];
    const newItem = { ...data, id: Math.random().toString(36).substr(2, 9) };
    db[collectionName].push(newItem);
    localStorage.setItem('soulmatter_db', JSON.stringify(db));
    return newItem;
  },
  set: (collectionName: string, id: string, data: any) => {
    const db = getDb();
    if (!db[collectionName]) db[collectionName] = [];
    const index = db[collectionName].findIndex((i: any) => i.id === id);
    if (index > -1) {
      db[collectionName][index] = { ...db[collectionName][index], ...data };
    } else {
      db[collectionName].push({ ...data, id });
    }
    localStorage.setItem('soulmatter_db', JSON.stringify(db));
  },
  update: (collectionName: string, id: string, data: any) => {
    const db = getDb();
    const collection = db[collectionName] || [];
    const index = collection.findIndex((i: any) => i.id === id);
    if (index > -1) {
      collection[index] = { ...collection[index], ...data };
      db[collectionName] = collection;
      localStorage.setItem('soulmatter_db', JSON.stringify(db));
    }
  }
};

export const initializeFirebase = () => ({
  firebaseApp: {} as any,
  firestore: {} as any,
  auth: {} as any,
});

export function useAuth() { return null; }
export function useFirebase() { return {} as any; }
export function useFirebaseApp() { return {} as any; }
export function useFirestoreInstance() { return {} as any; }

export * from './provider';

"use client";

import { useSyncExternalStore } from "react";

export type Session =
  | {
      role: "admin";
      name: "Administrator";
      email: string;
    }
  | {
      role: "teacher";
      name: string;
      email: string;
      teacherId: number;
    };

type AuthState = {
  session: Session | null;
  ready: boolean;
};

const SESSION_KEY = "classflow-session";
let state: AuthState = { session: null, ready: false };
const serverState: AuthState = { session: null, ready: false };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function load() {
  if (state.ready || typeof window === "undefined") return;
  const saved = localStorage.getItem(SESSION_KEY);
  let session: Session | null = null;
  if (saved) {
    try {
      session = JSON.parse(saved) as Session;
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }
  state = {
    session,
    ready: true,
  };
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  load();
  return () => listeners.delete(listener);
}

export function useAuth() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  );

  return {
    ...snapshot,
    signIn(session: Session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      state = { session, ready: true };
      notify();
    },
    signOut() {
      localStorage.removeItem(SESSION_KEY);
      state = { session: null, ready: true };
      notify();
    },
  };
}

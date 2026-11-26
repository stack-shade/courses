'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { LinkProvider, Theme, type LinkComponentType } from '@astryxdesign/core';
import { neutralTheme } from '@astryxdesign/theme-neutral';

interface ThemeCtx {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const StackShadeThemeContext = createContext<ThemeCtx>({
  mode: 'light',
  toggleTheme: () => {},
});

export function useStackShadeTheme() {
  return useContext(StackShadeThemeContext);
}

export function AstryxProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('ss-theme');
    const initial = saved === 'dark' ? 'dark' : 'light';
    setMode(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ss-theme', next);
  };

  return (
    <StackShadeThemeContext.Provider value={{ mode, toggleTheme }}>
      <Theme theme={neutralTheme} mode={mode}>
        <LinkProvider component={NextLink as unknown as LinkComponentType}>
          {children}
        </LinkProvider>
      </Theme>
    </StackShadeThemeContext.Provider>
  );
}

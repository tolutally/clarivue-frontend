import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';
type ThemeBrand = 'default' | 'university' | 'corporate';

interface ThemeContextType {
  mode: ThemeMode;
  brand: ThemeBrand;
  setMode: (mode: ThemeMode) => void;
  setBrand: (brand: ThemeBrand) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [brand, setBrand] = useState<ThemeBrand>('default');

  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    
    root.setAttribute('data-brand', brand);
    
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    const savedBrand = localStorage.getItem('theme-brand') as ThemeBrand;
    
    if (savedMode) setMode(savedMode);
    if (savedBrand) setBrand(savedBrand);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-brand', brand);
    localStorage.setItem('theme-brand', brand);
  }, [brand]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ mode, brand, setMode, setBrand, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

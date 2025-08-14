import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Theme, ClientFeatures } from '../types';

interface ThemeContextType {
  currentClient: string;
  theme: Theme;
  features: ClientFeatures;
  setClient: (clientId: string) => void;
}

const clientThemes: Record<string, Theme> = {
  'client-a': {
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '4px',
    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px'
    }
  },
  'client-b': {
    primaryColor: '#28a745',
    secondaryColor: '#dc3545',
    fontFamily: 'Georgia, serif',
    borderRadius: '8px',
    spacing: {
      small: '12px',
      medium: '20px',
      large: '32px'
    }
  },
  'default': {
    primaryColor: '#3B82F6',
    secondaryColor: '#6B7280',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '6px',
    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px'
    }
  }
};

const clientFeatures: Record<string, ClientFeatures> = {
  'client-a': {
    showPagination: true,
    allowSorting: true,
    showSearch: true,
    exportData: false,
    rowActions: ['edit', 'delete']
  },
  'client-b': {
    showPagination: false,
    allowSorting: false,
    showSearch: true,
    exportData: true,
    rowActions: ['view', 'edit']
  },
  'default': {
    showPagination: true,
    allowSorting: true,
    showSearch: true,
    exportData: true,
    rowActions: ['view', 'edit', 'delete']
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentClient, setCurrentClient] = useState<string>('default');

  const theme = clientThemes[currentClient] || clientThemes.default;
  const features = clientFeatures[currentClient] || clientFeatures.default;

  const setClient = (clientId: string) => {
    setCurrentClient(clientId);
  };

  return (
    <ThemeContext.Provider value={{ currentClient, theme, features, setClient }}>
      <div
        style={{
          '--primary-color': theme.primaryColor,
          '--secondary-color': theme.secondaryColor,
          '--font-family': theme.fontFamily,
          '--border-radius': theme.borderRadius,
          '--spacing-sm': theme.spacing.small,
          '--spacing-md': theme.spacing.medium,
          '--spacing-lg': theme.spacing.large,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
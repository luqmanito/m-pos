import React, {createContext, ReactNode, useContext, useState} from 'react';

// Loading Context ====================================================

interface LoadingContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({children}) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{loading, setLoading}}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Primary Color Context ====================================================

type PrimaryColor = string;

interface PrimaryColorContextType {
  primaryColor: PrimaryColor;
  secondaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
  setSecondaryColor: (color: PrimaryColor) => void;
}

const PrimaryColorContext = createContext<PrimaryColorContextType | undefined>(
  undefined,
);

interface PrimaryColorProviderProps {
  children: ReactNode;
}

// Create a provider component
export const PrimaryColorProvider: React.FC<PrimaryColorProviderProps> = ({
  children,
}) => {
  const [secondaryColor, setSecondaryColor] = useState<PrimaryColor>('#ffe96c');
  const [primaryColor, setPrimaryColor] = useState('#29B9DC');

  return (
    <PrimaryColorContext.Provider
      value={{
        primaryColor,
        secondaryColor,
        setSecondaryColor,
        setPrimaryColor,
      }}>
      {children}
    </PrimaryColorContext.Provider>
  );
};
export {PrimaryColorContext};

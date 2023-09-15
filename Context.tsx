import React, {createContext, ReactNode, useContext, useState} from 'react';

// Create a context
interface LoadingContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
// Define the props type for the LoadingProvider component
interface LoadingProviderProps {
  children: ReactNode;
}
// Create a provider component
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

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Create the context
const ProfileContext = createContext<{ value: any; setValue: React.Dispatch<React.SetStateAction<any>> } | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

// Create a provider
export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [value, setValue] = useState();

  return (
    <ProfileContext.Provider value={{ value, setValue }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext)!;

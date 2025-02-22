'use client'; 
import { createContext, useContext, useState } from 'react'

export const langs = [
  { title: "DE", locale: "de-DE"},
  { title: "EN", locale: "en"}
];


interface LanguageContextType {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}
const initialLanguageContext:LanguageContextType = {
  language: 'DE',
  setLanguage: () => {}
}

export const LanguageContext = createContext<LanguageContextType>(initialLanguageContext)

export function LanguageProvider({ children }: {children: React.ReactNode,}) {
  const [language, setLanguage] = useState('DE');
  
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context)
    throw new Error('useLanguage must be used inside a `LanguageProvider`')

  return context
}
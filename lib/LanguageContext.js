import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext('DE')

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('DE')
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
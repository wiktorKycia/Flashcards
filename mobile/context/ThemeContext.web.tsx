import { Appearance } from 'react-native'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
    theme: ThemeMode
    isReady: boolean
    setTheme: (mode: ThemeMode) => Promise<void>
    toggleTheme: () => Promise<void>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
const STORAGE_KEY = 'settings.theme'

const getSystemTheme = (): ThemeMode =>
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'

const readStoredTheme = (): ThemeMode | null => {
    if (typeof window === 'undefined') {
        return null
    }
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') {
        return stored
    }
    return null
}

const writeStoredTheme = (value: ThemeMode) => {
    if (typeof window === 'undefined') {
        return
    }
    window.localStorage.setItem(STORAGE_KEY, value)
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>('light')
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const storedTheme = readStoredTheme()
        if (storedTheme) {
            setThemeState(storedTheme)
        } else {
            const fallback = getSystemTheme()
            setThemeState(fallback)
            writeStoredTheme(fallback)
        }
        setIsReady(true)
    }, [])

    const setTheme = async (mode: ThemeMode) => {
        setThemeState(mode)
        writeStoredTheme(mode)
    }

    const toggleTheme = async () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark'
        await setTheme(nextTheme)
    }

    const value = useMemo(
        () => ({ theme, isReady, setTheme, toggleTheme }),
        [theme, isReady]
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => {
    const ctx = useContext(ThemeContext)
    if (!ctx) {
        throw new Error('useTheme must be used inside ThemeProvider')
    }
    return ctx
}


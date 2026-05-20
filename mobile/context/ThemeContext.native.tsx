import * as SQLite from 'expo-sqlite'
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
const DATABASE_NAME = 'app.db'
const SETTINGS_ROW_ID = 1

const db = SQLite.openDatabaseSync(DATABASE_NAME)

const getSystemTheme = (): ThemeMode =>
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'

const ensureThemeRow = async (): Promise<ThemeMode> => {
    await db.execAsync(
        'CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY NOT NULL, theme TEXT NOT NULL)'
    )

    const stored = await db.getFirstAsync<{ theme: string }>(
        'SELECT theme FROM settings WHERE id = ? LIMIT 1',
        [SETTINGS_ROW_ID]
    )

    if (stored?.theme) {
        return stored.theme === 'dark' ? 'dark' : 'light'
    }

    const initialTheme = getSystemTheme()
    await db.runAsync('INSERT INTO settings (id, theme) VALUES (?, ?)', [
        SETTINGS_ROW_ID,
        initialTheme
    ])

    return initialTheme
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>('light')
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        let isMounted = true

        const load = async () => {
            try {
                const storedTheme = await ensureThemeRow()
                if (isMounted) {
                    setThemeState(storedTheme)
                }
            } catch {
                if (isMounted) {
                    setThemeState(getSystemTheme())
                }
            } finally {
                if (isMounted) {
                    setIsReady(true)
                }
            }
        }

        load()

        return () => {
            isMounted = false
        }
    }, [])

    const setTheme = async (mode: ThemeMode) => {
        setThemeState(mode)
        await db.runAsync('UPDATE settings SET theme = ? WHERE id = ?', [
            mode,
            SETTINGS_ROW_ID
        ])
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



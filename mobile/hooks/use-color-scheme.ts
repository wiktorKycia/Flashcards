import { useColorScheme as useSystemColorScheme } from 'react-native'

import { useTheme } from '@/context/ThemeContext'

export const useColorScheme = () => {
    const systemTheme = useSystemColorScheme() ?? 'light'
    const { theme, isReady } = useTheme()

    return isReady ? theme : systemTheme
}

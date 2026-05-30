import { useEffect, useState } from 'react'
import { useColorScheme as useRNColorScheme } from 'react-native'

import { useTheme } from '@/context/ThemeContext'

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
    const [hasHydrated, setHasHydrated] = useState(false)
    const { theme, isReady } = useTheme()

    useEffect(() => {
        setHasHydrated(true)
    }, [])

    const colorScheme = useRNColorScheme() ?? 'light'

    if (!hasHydrated || !isReady) {
        return colorScheme
    }

    return theme
}

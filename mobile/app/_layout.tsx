import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import AuthProvider, { useAuth } from '@/context/AuthContext'
import ThemeProviderContext, { useTheme } from '@/context/ThemeContext'
import QueryProvider from '@/providers/QueryProvider'
import { ThemedText } from '@/components/themed-text'

export const unstable_settings = {
    anchor: '(tabs)'
}

const RootStack = () => {
    const { theme, isReady: themeReady } = useTheme()
    const { isReady: authReady } = useAuth()

    if (!themeReady || !authReady) {
        return (
            <View
                style={[
                    styles.splash,
                    theme === 'dark'
                        ? styles.splashDark
                        : styles.splashLight
                ]}
            >
                <ActivityIndicator size="large" color="#22c55e" />
                <ThemedText style={styles.splashText}>Loading...</ThemedText>
            </View>
        )
    }

    return (
        <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="modal"
                    options={{ presentation: 'modal', title: 'Modal' }}
                />
                <Stack.Screen name="login" options={{ title: 'Login' }} />
                <Stack.Screen name="register" options={{ title: 'Register' }} />
                <Stack.Screen name="knowledgeTest" options={{ title: 'Test wiedzy' }} />
                <Stack.Screen name="matchChallenge" options={{ title: 'Wyzwanie dopasowywania' }} />
            </Stack>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
    )
}

export default function RootLayout() {
    return (
        <ThemeProviderContext>
            <QueryProvider>
                <AuthProvider>
                    <RootStack />
                </AuthProvider>
            </QueryProvider>
        </ThemeProviderContext>
    )
}

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    },
    splashDark: {
        backgroundColor: '#121613'
    },
    splashLight: {
        backgroundColor: '#ffffff'
    },
    splashText: {
        color: '#a0ada2'
    }
})

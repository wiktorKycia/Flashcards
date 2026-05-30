import { Image } from 'expo-image'
import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'

import { HelloWave } from '@/components/hello-wave'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { API_BASE_URL } from '@/lib/auth'
import { Link } from 'expo-router'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'


type ApiResponse = {
    content?: string
}

export default function HomeScreen() {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]
    const [apiMessage, setApiMessage] = useState<string | null>(null)
    const [apiError, setApiError] = useState<string | null>(null)
    const [apiLoading, setApiLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        let isActive = true

        const load = async () => {
            try {
                setApiLoading(true)
                setApiError(null)

                const response = await fetch(`${API_BASE_URL}/`, {
                    signal: controller.signal
                })
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                const data = (await response.json()) as ApiResponse
                if (isActive) {
                    setApiMessage(data.content ?? 'No content')
                }
            } catch (error) {
                if (!isActive) {
                    return
                }
                if (error instanceof Error && error.name === 'AbortError') {
                    return
                }
                setApiError(
                    error instanceof Error ? error.message : 'Unknown error'
                )
            } finally {
                if (isActive) {
                    setApiLoading(false)
                }
            }
        }

        load()

        return () => {
            isActive = false
            controller.abort()
        }
    }, [])

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: palette.surface, dark: palette.surface }}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Flashcards</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Home</ThemedText>
                <ThemedText>
                    Your learning dashboard will live here.
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Backend status</ThemedText>
                {apiLoading ? (
                    <ThemedText>Loading...</ThemedText>
                ) : apiError ? (
                    <ThemedText
                        type="defaultSemiBold"
                        style={{ color: palette.error }}
                    >
                        Error: {apiError}
                    </ThemedText>
                ) : (
                    <ThemedText>{apiMessage}</ThemedText>
                )}
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Account</ThemedText>
                <ThemedView style={styles.authButtons}>
                    <Link href="../login" asChild>
                        <ThemedText
                            style={{
                                ...styles.authButtonText,
                                backgroundColor: palette.tint,
                                color: palette.textButtons
                            }}
                        >
                            Login
                        </ThemedText>
                    </Link>
                    <Link href="../register" asChild>
                        <ThemedText
                            style={{
                                ...styles.authButtonSecondaryText,
                                borderColor: palette.tint,
                                color: palette.tint
                            }}
                        >
                            Register
                        </ThemedText>
                    </Link>
                </ThemedView>
            </ThemedView>
        </ParallaxScrollView>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8
    },
    authButtons: {
        flexDirection: 'row',
        gap: 12
    },
    authButtonText: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        overflow: 'hidden',
        fontWeight: '700'
    },
    authButtonSecondaryText: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        overflow: 'hidden',
        fontWeight: '700'
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute'
    }
})

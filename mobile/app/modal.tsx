import { Link } from 'expo-router'
import { StyleSheet } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

export default function ModalScreen() {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    return (
        <ThemedView
            style={[styles.container, { backgroundColor: palette.background }]}
        >
            <ThemedText type="title">This is a modal</ThemedText>
            <Link
                href="/"
                dismissTo
                style={{ ...styles.link, borderColor: palette.tint }}
            >
                <ThemedText type="link" style={{ color: palette.tint }}>
                    Go to home screen
                </ThemedText>
            </Link>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    link: {
        marginTop: 15,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 8
    }
})

import { Pressable, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import LoginScreen from '../login'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

export default function SettingsScreen() {
    const { token, user, logout } = useAuth()
    const { theme, toggleTheme, isReady } = useTheme()
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    if (!token) {
        return <LoginScreen />
    }

    return (
        <ThemedView
            style={[
                styles.screen,
                { backgroundColor: palette.background }
            ]}
        >
            <View
                style={[
                    styles.card,
                    { borderColor: palette.border, backgroundColor: palette.surface }
                ]}
            >
                <ThemedText type="subtitle">User settings</ThemedText>
                <ThemedText
                    style={[styles.secondaryText, { color: palette.textSecondary }]}
                >
                    Theme: {isReady ? theme : 'loading'}
                </ThemedText>
                <ThemedText
                    style={[styles.secondaryText, { color: palette.textSecondary }]}
                >
                    User: {user?.name ?? 'Unknown'} (ID: {user?.id ?? '-'})
                </ThemedText>
                <Pressable
                    onPress={toggleTheme}
                    style={({ pressed }) => [
                        styles.button,
                        { backgroundColor: palette.tint },
                        pressed && styles.buttonPressed
                    ]}
                    disabled={!isReady}
                >
                    <ThemedText
                        style={[styles.buttonText, { color: palette.textButtons }]}
                    >
                        {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
                    </ThemedText>
                </Pressable>
                <Pressable
                    onPress={logout}
                    style={({ pressed }) => [
                        styles.button,
                        styles.logoutButton,
                        { backgroundColor: palette.danger },
                        pressed && styles.buttonPressed
                    ]}
                >
                    <ThemedText
                        style={[styles.buttonText, { color: palette.textButtons }]}
                    >
                        Log out
                    </ThemedText>
                </Pressable>
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 24,
        justifyContent: 'center'
    },
    card: {
        padding: 24,
        borderRadius: 16,
        borderWidth: 1
    },
    secondaryText: {
        marginTop: 8
    },
    button: {
        marginTop: 16,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center'
    },
    logoutButton: {},
    buttonPressed: {
        opacity: 0.9
    },
    buttonText: {
        fontWeight: '700'
    }
})

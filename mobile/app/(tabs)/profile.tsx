import { Pressable, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuth } from '@/context/AuthContext'
import LoginScreen from '../login'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function ProfileScreen() {
    const { token, user, logout } = useAuth()
    const colorScheme = useColorScheme() ?? 'light'

    if (!token) {
        return <LoginScreen />
    }

    return (
        <ThemedView
            style={[
                styles.screen,
                colorScheme === 'dark' ? styles.screenDark : styles.screenLight
            ]}
        >
            <View
                style={[
                    styles.card,
                    colorScheme === 'dark' ? styles.cardDark : styles.cardLight
                ]}
            >
                <ThemedText type="subtitle">User profile</ThemedText>
                <ThemedText style={styles.secondaryText}>
                    Name: {user?.name ?? 'Unknown'}
                </ThemedText>
                <ThemedText style={styles.secondaryText}>
                    ID: {user?.id ?? '-'}
                </ThemedText>
                <Pressable
                    onPress={logout}
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed
                    ]}
                >
                    <ThemedText style={styles.buttonText}>Log out</ThemedText>
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
    screenDark: {
        backgroundColor: '#121613'
    },
    screenLight: {
        backgroundColor: '#ffffff'
    },
    card: {
        padding: 24,
        borderRadius: 16,
        borderWidth: 1
    },
    cardDark: {
        borderColor: '#2a3d30',
        backgroundColor: '#1e2621'
    },
    cardLight: {
        borderColor: '#88d0d0',
        backgroundColor: '#f0fff4'
    },
    secondaryText: {
        marginTop: 8
    },
    button: {
        marginTop: 16,
        backgroundColor: '#ef4444',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center'
    },
    buttonPressed: {
        backgroundColor: '#dc2626'
    },
    buttonText: {
        color: '#e3f0e3',
        fontWeight: '700'
    }
})

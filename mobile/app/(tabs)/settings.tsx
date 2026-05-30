import { router } from 'expo-router'
import type { ReactNode } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from 'react-native'

import UserAccountForm from '@/components/UserAccountForm/UserAccountForm'
import UserPasswordForm from '@/components/UserPasswordForm/UserPasswordForm'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'
import LoginScreen from '../login'

function SettingsSection({
    title,
    children
}: {
    title: string
    children: ReactNode
}) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    return (
        <View
            style={[
                styles.section,
                { borderColor: palette.border, backgroundColor: palette.surface }
            ]}
        >
            <ThemedText type="subtitle">{title}</ThemedText>
            {children}
        </View>
    )
}

export default function SettingsScreen() {
    const { token, user, logout } = useAuth()
    const { theme, toggleTheme, isReady } = useTheme()
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    if (!token) {
        return <LoginScreen />
    }

    if (!user) {
        return <LoginScreen />
    }

    return (
        <ThemedView style={[styles.screen, { backgroundColor: palette.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: 'padding', android: undefined })}
                style={styles.keyboard}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <ThemedText type="title" style={styles.pageTitle}>
                        Ustawienia użytkownika
                    </ThemedText>

                    <SettingsSection title="Dane">
                        <UserAccountForm />
                    </SettingsSection>

                    <SettingsSection title="Hasło">
                        <UserPasswordForm />
                    </SettingsSection>

                    <SettingsSection title="Wygląd">
                        <ThemedText style={{ color: palette.textSecondary }}>
                            Motyw: {isReady ? (theme === 'dark' ? 'ciemny' : 'jasny') : 'ładowanie'}
                        </ThemedText>
                        <Pressable
                            onPress={toggleTheme}
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: palette.tint },
                                pressed && styles.buttonPressed,
                                !isReady && styles.buttonDisabled
                            ]}
                            disabled={!isReady}
                        >
                            <ThemedText
                                style={[styles.buttonText, { color: palette.textButtons }]}
                            >
                                {theme === 'dark'
                                    ? 'Przełącz na jasny'
                                    : 'Przełącz na ciemny'}
                            </ThemedText>
                        </Pressable>
                    </SettingsSection>

                    <SettingsSection title="Akcje">
                        <Pressable
                            onPress={() => router.push('/(tabs)/profile')}
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: palette.tint },
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <ThemedText
                                style={[styles.buttonText, { color: palette.textButtons }]}
                            >
                                Zobacz profil
                            </ThemedText>
                        </Pressable>
                        <Pressable
                            onPress={logout}
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: palette.danger },
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <ThemedText
                                style={[styles.buttonText, { color: palette.textButtons }]}
                            >
                                Wyloguj
                            </ThemedText>
                        </Pressable>
                    </SettingsSection>
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    keyboard: {
        flex: 1
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 48,
        gap: 20
    },
    pageTitle: {
        marginBottom: 4
    },
    section: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        gap: 16
    },
    button: {
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center'
    },
    buttonPressed: {
        opacity: 0.9
    },
    buttonDisabled: {
        opacity: 0.7
    },
    buttonText: {
        fontWeight: '700'
    }
})

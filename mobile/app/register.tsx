import { Link, router } from 'expo-router'
import { useState } from 'react'
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { registerUser } from '@/lib/auth'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

export default function RegisterScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    const handleSubmit = async () => {
        if (!name || !email || !password) {
            setError('Podaj nazwę użytkownika, e-mail oraz hasło.')
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            await registerUser({ name, email, password })
            router.replace('../login')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Nieznany błąd')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ThemedView
            style={[
                styles.screen,
                { backgroundColor: palette.background }
            ]}
        >
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: 'padding', android: undefined })}
                style={styles.keyboard}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        style={[
                            styles.card,
                            {
                                backgroundColor: palette.surface,
                                borderColor: palette.border
                            }
                        ]}
                    >
                        <ThemedText type="title" style={styles.title}>
                            Zarejestruj się
                        </ThemedText>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="login"
                            placeholderTextColor={palette.textSecondary}
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="name"
                            style={[
                                styles.input,
                                {
                                    backgroundColor: palette.surface,
                                    borderColor: palette.border,
                                    color: palette.text
                                }
                            ]}
                        />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="e-mail"
                            placeholderTextColor={palette.textSecondary}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            style={[
                                styles.input,
                                {
                                    backgroundColor: palette.surface,
                                    borderColor: palette.border,
                                    color: palette.text
                                }
                            ]}
                        />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="hasło"
                            placeholderTextColor={palette.textSecondary}
                            secureTextEntry
                            textContentType="newPassword"
                            style={[
                                styles.input,
                                {
                                    backgroundColor: palette.surface,
                                    borderColor: palette.border,
                                    color: palette.text
                                }
                            ]}
                        />
                        {error ? (
                            <ThemedText style={[styles.errorText, { color: palette.error }]}>
                                {error}
                            </ThemedText>
                        ) : null}
                        <Pressable
                            onPress={handleSubmit}
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: palette.tint },
                                pressed && styles.buttonPressed,
                                isLoading && styles.buttonDisabled
                            ]}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={palette.textButtons} />
                            ) : (
                                <ThemedText
                                    style={[styles.buttonText, { color: palette.textButtons }]}
                                >
                                    Utwórz konto
                                </ThemedText>
                            )}
                        </Pressable>
                        <ThemedText
                            style={[styles.linkText, { color: palette.textSecondary }]}
                        >
                            Posiadasz już konto?{' '}
                            <Link href="../login" style={[styles.link, { color: palette.tint }]}>
                                Zaloguj się
                            </Link>
                        </ThemedText>
                    </View>
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
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32
    },
    card: {
        borderRadius: 16,
        padding: 28,
        gap: 16,
        borderWidth: 1
    },
    title: {
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16
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
        fontSize: 16,
        fontWeight: '700'
    },
    linkText: {
        textAlign: 'center'
    },
    link: {},
    errorText: {}
})

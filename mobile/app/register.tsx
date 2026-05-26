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

export default function RegisterScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const colorScheme = useColorScheme() ?? 'light'

    const handleSubmit = async () => {
        if (!name || !email || !password) {
            setError('Provide name, email, and password.')
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            await registerUser({ name, email, password })
            router.replace('../login')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ThemedView
            style={[
                styles.screen,
                colorScheme === 'dark' ? styles.screenDark : styles.screenLight
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
                            colorScheme === 'dark'
                                ? styles.cardDark
                                : styles.cardLight
                        ]}
                    >
                        <ThemedText type="title" style={styles.title}>
                            Register
                        </ThemedText>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="login"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="name"
                            style={[
                                styles.input,
                                colorScheme === 'dark'
                                    ? styles.inputDark
                                    : styles.inputLight
                            ]}
                        />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="email"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            style={[
                                styles.input,
                                colorScheme === 'dark'
                                    ? styles.inputDark
                                    : styles.inputLight
                            ]}
                        />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="password"
                            secureTextEntry
                            textContentType="newPassword"
                            style={[
                                styles.input,
                                colorScheme === 'dark'
                                    ? styles.inputDark
                                    : styles.inputLight
                            ]}
                        />
                        {error ? (
                            <ThemedText style={styles.errorText}>
                                {error}
                            </ThemedText>
                        ) : null}
                        <Pressable
                            onPress={handleSubmit}
                            style={({ pressed }) => [
                                styles.button,
                                pressed && styles.buttonPressed,
                                isLoading && styles.buttonDisabled
                            ]}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#e3f0e3" />
                            ) : (
                                <ThemedText style={styles.buttonText}>
                                    Create account
                                </ThemedText>
                            )}
                        </Pressable>
                        <ThemedText style={styles.linkText}>
                            Already have an account?{' '}
                            <Link href="../login" style={styles.link}>
                                Login
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
    screenDark: {
        backgroundColor: '#121613'
    },
    screenLight: {
        backgroundColor: '#ffffff'
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
    cardDark: {
        backgroundColor: '#1e2621',
        borderColor: '#2a3d30'
    },
    cardLight: {
        backgroundColor: '#f0fff4',
        borderColor: '#88d0d0'
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
    inputDark: {
        backgroundColor: '#1e2621',
        borderColor: '#2a3d30',
        color: '#e8f3ea'
    },
    inputLight: {
        backgroundColor: '#f0fff4',
        borderColor: '#88d0d0',
        color: '#3c4a3e'
    },
    button: {
        backgroundColor: '#22c55e',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center'
    },
    buttonPressed: {
        backgroundColor: '#009e3b'
    },
    buttonDisabled: {
        opacity: 0.7
    },
    buttonText: {
        color: '#e3f0e3',
        fontSize: 16,
        fontWeight: '700'
    },
    linkText: {
        textAlign: 'center',
        color: '#a0ada2'
    },
    link: {
        color: '#22c55e'
    },
    errorText: {
        color: '#f87171'
    }
})

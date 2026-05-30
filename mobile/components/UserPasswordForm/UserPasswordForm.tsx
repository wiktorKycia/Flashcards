import { useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

import FormField from '@/components/FormField/FormField'
import { ThemedText } from '@/components/themed-text'
import { useAuth } from '@/context/AuthContext'
import { useChangePassword } from '@/hooks/useChangePassword'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

export default function UserPasswordForm() {
    const { user } = useAuth()
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]
    const changePassword = useChangePassword()

    const [passwordDraft, setPasswordDraft] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    async function handlePasswordSave() {
        if (!user) {
            return
        }

        const currentPassword = passwordDraft.currentPassword.trim()
        const newPassword = passwordDraft.newPassword.trim()
        const confirmPassword = passwordDraft.confirmPassword.trim()

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('Uzupełnij wszystkie pola')
            setPasswordMessage(null)
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Hasła nie są zgodne')
            setPasswordMessage(null)
            return
        }

        setIsChangingPassword(true)
        setPasswordError(null)
        setPasswordMessage(null)

        try {
            const result = await changePassword.mutateAsync({
                id: user.id,
                currentPassword,
                newPassword
            })

            setPasswordDraft({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            setPasswordMessage(result.message)
        } catch {
            setPasswordError('Nie udało się zmienić hasła')
        } finally {
            setIsChangingPassword(false)
        }
    }

    return (
        <View style={styles.form}>
            <FormField
                label="Aktualne hasło"
                value={passwordDraft.currentPassword}
                onChangeText={(value) =>
                    setPasswordDraft((prev) => ({ ...prev, currentPassword: value }))
                }
                secureTextEntry
            />
            <FormField
                label="Nowe hasło"
                value={passwordDraft.newPassword}
                onChangeText={(value) =>
                    setPasswordDraft((prev) => ({ ...prev, newPassword: value }))
                }
                secureTextEntry
            />
            <FormField
                label="Powtórz hasło"
                value={passwordDraft.confirmPassword}
                onChangeText={(value) =>
                    setPasswordDraft((prev) => ({ ...prev, confirmPassword: value }))
                }
                secureTextEntry
            />
            <Pressable
                onPress={handlePasswordSave}
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: palette.tint },
                    pressed && styles.buttonPressed,
                    isChangingPassword && styles.buttonDisabled
                ]}
                disabled={isChangingPassword}
            >
                {isChangingPassword ? (
                    <ActivityIndicator color={palette.textButtons} />
                ) : (
                    <ThemedText style={[styles.buttonText, { color: palette.textButtons }]}>
                        Zmień hasło
                    </ThemedText>
                )}
            </Pressable>
            {passwordError ? (
                <ThemedText style={{ color: palette.error }}>{passwordError}</ThemedText>
            ) : null}
            {passwordMessage ? (
                <ThemedText style={{ color: palette.accent2 }}>{passwordMessage}</ThemedText>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    form: {
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

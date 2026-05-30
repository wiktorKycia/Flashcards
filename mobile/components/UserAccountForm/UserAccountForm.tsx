import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

import FormField from '@/components/FormField/FormField'
import { ThemedText } from '@/components/themed-text'
import { useAuth } from '@/context/AuthContext'
import { useUpdateUser } from '@/hooks/useUpdateUser'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

interface UserDraft {
    name: string
    email: string
}

export default function UserAccountForm() {
    const { user, updateStoredUser } = useAuth()
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    const { data, isLoading, isError } = useUserInfo(user?.id)
    const updateUser = useUpdateUser()

    const [draft, setDraft] = useState<UserDraft | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [saveMessage, setSaveMessage] = useState<string | null>(null)

    useEffect(() => {
        if (isLoading || isError || !data) {
            return
        }

        if (draft) {
            return
        }

        setDraft({
            name: data.name,
            email: data.email
        })
    }, [data, draft, isError, isLoading])

    function handleFieldChange(field: 'name' | 'email', value: string) {
        setDraft((prev) => {
            if (!prev) {
                return prev
            }

            return {
                ...prev,
                [field]: value
            }
        })
    }

    async function handleSave() {
        if (!draft || !user) {
            return
        }

        const name = draft.name.trim()
        const email = draft.email.trim()

        if (!name || !email) {
            setSaveError('Uzupełnij nazwę użytkownika i email')
            setSaveMessage(null)
            return
        }

        setIsSaving(true)
        setSaveError(null)
        setSaveMessage(null)

        try {
            const updatedUser = await updateUser.mutateAsync({
                id: user.id,
                name,
                email
            })

            setDraft({
                name: updatedUser.name,
                email: updatedUser.email
            })
            await updateStoredUser({ id: updatedUser.id, name: updatedUser.name })
            setSaveMessage('Zapisano zmiany')
        } catch {
            setSaveError('Nie udało się zapisać zmian')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading && !draft) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="small" color={palette.tint} />
            </View>
        )
    }

    if (isError) {
        return <ThemedText style={{ color: palette.error }}>Wystąpił błąd</ThemedText>
    }

    return (
        <View style={styles.form}>
            <FormField
                label="Nazwa użytkownika"
                value={draft?.name ?? ''}
                onChangeText={(value) => handleFieldChange('name', value)}
                autoCapitalize="words"
            />
            <FormField
                label="Email"
                value={draft?.email ?? ''}
                onChangeText={(value) => handleFieldChange('email', value)}
                keyboardType="email-address"
            />
            <Pressable
                onPress={handleSave}
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: palette.tint },
                    pressed && styles.buttonPressed,
                    (isSaving || !draft) && styles.buttonDisabled
                ]}
                disabled={isSaving || !draft}
            >
                {isSaving ? (
                    <ActivityIndicator color={palette.textButtons} />
                ) : (
                    <ThemedText style={[styles.buttonText, { color: palette.textButtons }]}>
                        Zapisz
                    </ThemedText>
                )}
            </Pressable>
            {saveError ? (
                <ThemedText style={{ color: palette.error }}>{saveError}</ThemedText>
            ) : null}
            {saveMessage ? (
                <ThemedText style={{ color: palette.accent2 }}>{saveMessage}</ThemedText>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    form: {
        gap: 16
    },
    loading: {
        paddingVertical: 16,
        alignItems: 'center'
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

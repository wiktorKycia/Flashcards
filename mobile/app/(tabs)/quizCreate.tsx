import { router } from 'expo-router'
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

import FormField from '@/components/FormField/FormField'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuth } from '@/context/AuthContext'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useCreateQuiz } from '@/hooks/useCreateQuiz'
import { useReplaceQuizFlashcards } from '@/hooks/useReplaceQuizFlashcards'
import { Colors } from '@/constants/theme'
import LoginScreen from '../login'

interface DraftFlashcard {
    clientId: string
    front: string
    back: string
}

interface QuizDraft {
    quiz: {
        name: string
        description: string
        frontLanguage: string
        backLanguage: string
    }
    flashcards: DraftFlashcard[]
}

function createClientId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function createEmptyDraft(): QuizDraft {
    return {
        quiz: {
            name: '',
            description: '',
            frontLanguage: '',
            backLanguage: ''
        },
        flashcards: [
            {
                clientId: createClientId(),
                front: '',
                back: ''
            }
        ]
    }
}

export default function QuizCreateScreen() {
    const { token, user } = useAuth()
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]
    const [draft, setDraft] = useState<QuizDraft>(createEmptyDraft)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const createQuiz = useCreateQuiz()
    const replaceQuizFlashcards = useReplaceQuizFlashcards()

    if (!token) {
        return <LoginScreen />
    }

    function handleQuizFieldChange(
        field: 'name' | 'description' | 'frontLanguage' | 'backLanguage',
        value: string
    ) {
        setDraft((prev) => ({
            ...prev,
            quiz: {
                ...prev.quiz,
                [field]: value
            }
        }))
    }

    function handleFlashcardChange(clientId: string, field: 'front' | 'back', value: string) {
        setDraft((prev) => ({
            ...prev,
            flashcards: prev.flashcards.map((flashcard) =>
                flashcard.clientId === clientId ? { ...flashcard, [field]: value } : flashcard
            )
        }))
    }

    function handleFlashcardRemove(clientId: string) {
        setDraft((prev) => ({
            ...prev,
            flashcards: prev.flashcards.filter((flashcard) => flashcard.clientId !== clientId)
        }))
    }

    function handleFlashcardAdd() {
        setDraft((prev) => ({
            ...prev,
            flashcards: [
                ...prev.flashcards,
                {
                    clientId: createClientId(),
                    front: '',
                    back: ''
                }
            ]
        }))
    }

    async function handleSave() {
        if (!user) return

        const name = draft.quiz.name.trim()
        const frontLanguage = draft.quiz.frontLanguage.trim()
        const backLanguage = draft.quiz.backLanguage.trim()

        if (!name || !frontLanguage || !backLanguage) {
            setSaveError('Uzupełnij nazwę quizu oraz oba języki')
            return
        }

        setIsSaving(true)
        setSaveError(null)

        try {
            const description = draft.quiz.description.trim()
            const created = await createQuiz.mutateAsync({
                name,
                description: description.length ? description : null,
                frontLanguage,
                backLanguage,
                authorId: user.id
            })

            await replaceQuizFlashcards.mutateAsync({
                quizId: created.id,
                flashcards: draft.flashcards.map((flashcard) => ({
                    front: flashcard.front,
                    back: flashcard.back
                }))
            })

            setDraft(createEmptyDraft())
            router.replace('/(tabs)')
        } catch {
            setSaveError('Nie udało się zapisać zmian')
        } finally {
            setIsSaving(false)
        }
    }

    const primaryButtonStyle = [styles.primaryButton, { backgroundColor: palette.tint }]

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
                            Nowy quiz
                        </ThemedText>

                        <FormField
                            label="Nazwa quizu:"
                            value={draft.quiz.name}
                            onChangeText={(value) => handleQuizFieldChange('name', value)}
                            placeholder="Angielski, dział 2, lekcja 1"
                        />

                        <FormField
                            label="Opis:"
                            value={draft.quiz.description}
                            onChangeText={(value) => handleQuizFieldChange('description', value)}
                            multiline
                        />

                        <View style={styles.languageRow}>
                            <View style={styles.languageField}>
                                <FormField
                                    label="Język przodu:"
                                    value={draft.quiz.frontLanguage}
                                    onChangeText={(value) =>
                                        handleQuizFieldChange('frontLanguage', value)
                                    }
                                    placeholder="en"
                                />
                            </View>
                            <View style={styles.languageField}>
                                <FormField
                                    label="Język tyłu:"
                                    value={draft.quiz.backLanguage}
                                    onChangeText={(value) =>
                                        handleQuizFieldChange('backLanguage', value)
                                    }
                                    placeholder="pl"
                                />
                            </View>
                        </View>

                        <View style={styles.flashcardsSection}>
                            <View style={styles.sectionHeader}>
                                <ThemedText type="subtitle">Fiszki</ThemedText>
                                <Pressable
                                    onPress={handleFlashcardAdd}
                                    style={({ pressed }) => [
                                        styles.addButton,
                                        { backgroundColor: palette.accent3 },
                                        pressed && styles.buttonPressed
                                    ]}
                                >
                                    <ThemedText style={{ color: palette.textButtons }}>
                                        Dodaj fiszkę
                                    </ThemedText>
                                </Pressable>
                            </View>

                            {draft.flashcards.map((flashcard) => (
                                <View
                                    key={flashcard.clientId}
                                    style={[
                                        styles.flashcardRow,
                                        {
                                            borderColor: palette.border,
                                            backgroundColor: palette.background
                                        }
                                    ]}
                                >
                                    <TextInput
                                        placeholder={`Przód (${draft.quiz.frontLanguage || '…'})`}
                                        placeholderTextColor={palette.textSecondary}
                                        value={flashcard.front}
                                        onChangeText={(value) =>
                                            handleFlashcardChange(
                                                flashcard.clientId,
                                                'front',
                                                value
                                            )
                                        }
                                        style={[
                                            styles.flashcardInput,
                                            {
                                                borderColor: palette.border,
                                                color: palette.text,
                                                backgroundColor: palette.surface
                                            }
                                        ]}
                                    />
                                    <TextInput
                                        placeholder={`Tył (${draft.quiz.backLanguage || '…'})`}
                                        placeholderTextColor={palette.textSecondary}
                                        value={flashcard.back}
                                        onChangeText={(value) =>
                                            handleFlashcardChange(
                                                flashcard.clientId,
                                                'back',
                                                value
                                            )
                                        }
                                        style={[
                                            styles.flashcardInput,
                                            {
                                                borderColor: palette.border,
                                                color: palette.text,
                                                backgroundColor: palette.surface
                                            }
                                        ]}
                                    />
                                    <Pressable
                                        onPress={() => handleFlashcardRemove(flashcard.clientId)}
                                        style={({ pressed }) => [
                                            styles.removeButton,
                                            { backgroundColor: palette.danger },
                                            pressed && styles.buttonPressed
                                        ]}
                                    >
                                        <ThemedText style={{ color: palette.textButtons }}>
                                            Usuń
                                        </ThemedText>
                                    </Pressable>
                                </View>
                            ))}
                        </View>

                        {saveError ? (
                            <ThemedText style={{ color: palette.error }}>{saveError}</ThemedText>
                        ) : null}
                        <View style={styles.formActions}>
                            <Pressable
                                onPress={handleSave}
                                disabled={isSaving}
                                style={({ pressed }) => [
                                    ...primaryButtonStyle,
                                    pressed && styles.buttonPressed,
                                    isSaving && styles.buttonDisabled
                                ]}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color={palette.textButtons} />
                                ) : (
                                    <ThemedText
                                        style={[
                                            styles.primaryButtonText,
                                            { color: palette.textButtons }
                                        ]}
                                    >
                                        Zapisz
                                    </ThemedText>
                                )}
                            </Pressable>
                        </View>
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
        padding: 24,
        paddingBottom: 48
    },
    card: {
        borderRadius: 16,
        padding: 24,
        gap: 20,
        borderWidth: 1
    },
    title: {
        textAlign: 'center',
        marginBottom: 4
    },
    languageRow: {
        flexDirection: 'row',
        gap: 12
    },
    languageField: {
        flex: 1
    },
    flashcardsSection: {
        gap: 12
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
    },
    flashcardRow: {
        gap: 10,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1
    },
    flashcardInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16
    },
    addButton: {
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    removeButton: {
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center'
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 8
    },
    primaryButton: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        minWidth: 120
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700'
    },
    buttonPressed: {
        opacity: 0.9
    },
    buttonDisabled: {
        opacity: 0.5
    }
})

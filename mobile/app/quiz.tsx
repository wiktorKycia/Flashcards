import { useEffect } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

import AttachedFlashcardsMode from '@/components/AttachedFlashcardsMode/AttachedFlashcardsMode'
import ListedFlashcards from '@/components/ListedFlashcards/ListedFlashcards'
import SaveQuizToggle from '@/components/SaveQuizToggle/SaveQuizToggle'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuth } from '@/context/AuthContext'
import { useQuizData } from '@/hooks/useQuizData'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

export default function QuizScreen() {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]
    const { user, token } = useAuth()
    const isLoggedIn = !!token
    const { id } = useLocalSearchParams<{ id?: string }>()

    const quizId = id != null ? parseInt(id, 10) : NaN
    const isValidQuizId = Number.isFinite(quizId) && quizId > 0

    useEffect(() => {
        if (!isValidQuizId) {
            router.back()
        }
    }, [isValidQuizId])

    const { data, isLoading, isError, error, refetch } = useQuizData(
        isValidQuizId ? quizId : 0,
        user?.id
    )

    if (!isValidQuizId) {
        return null
    }

    const learnButtonStyle = [
        styles.learnButton,
        { backgroundColor: palette.tint }
    ]

    return (
        <ThemedView style={[styles.screen, { backgroundColor: palette.background }]}>
            {isError && (
                <ThemedText style={[styles.status, { color: palette.error }]}>
                    wystąpił błąd{error?.message ? `: ${error.message}` : ''}
                </ThemedText>
            )}
            {isLoading && (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={palette.tint} />
                </View>
            )}
            {!isLoading && !isError && data && (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.titleRow}>
                        <ThemedText type="title" style={styles.title}>
                            {data.quiz.name || 'Quiz bez nazwy'}
                        </ThemedText>
                        {isLoggedIn && user ? (
                            <SaveQuizToggle quizId={quizId} userId={user.id} />
                        ) : null}
                    </View>
                    {data.quiz.description ? (
                        <ThemedText
                            style={[styles.description, { color: palette.textSecondary }]}
                        >
                            {data.quiz.description}
                        </ThemedText>
                    ) : null}

                    <View style={styles.learnButtons}>
                        <Pressable
                            onPress={() =>
                                router.push({
                                    pathname: '/knowledgeTest',
                                    params: { id: String(quizId) }
                                })
                            }
                            style={({ pressed }) => [
                                ...learnButtonStyle,
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <ThemedText
                                style={[styles.learnButtonText, { color: palette.textButtons }]}
                            >
                                Ucz się
                            </ThemedText>
                        </Pressable>
                        <Pressable
                            onPress={() =>
                                router.push({
                                    pathname: '/matchChallenge',
                                    params: { id: String(quizId) }
                                })
                            }
                            style={({ pressed }) => [
                                ...learnButtonStyle,
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <ThemedText
                                style={[styles.learnButtonText, { color: palette.textButtons }]}
                            >
                                Dopasowania
                            </ThemedText>
                        </Pressable>
                    </View>

                    <AttachedFlashcardsMode
                        quizId={quizId}
                        flashcards={data.flashcards.map((flashcard) => ({
                            database_id: flashcard.id,
                            front: flashcard.front,
                            back: flashcard.back,
                            isKnown: flashcard.isKnown
                        }))}
                        onProgressReset={refetch}
                    />

                    <ListedFlashcards
                        flashcards={data.flashcards.map((flashcard) => ({
                            database_id: flashcard.id,
                            front: flashcard.front,
                            back: flashcard.back
                        }))}
                    />
                </ScrollView>
            )}
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 48
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 8
    },
    title: {
        flex: 1
    },
    description: {
        marginBottom: 16
    },
    learnButtons: {
        gap: 12,
        marginBottom: 24
    },
    learnButton: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center'
    },
    learnButtonText: {
        fontSize: 16,
        fontWeight: '700'
    },
    buttonPressed: {
        opacity: 0.9
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    status: {
        padding: 24
    }
})

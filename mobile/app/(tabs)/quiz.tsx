import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'

import ListedFlashcards from '@/components/ListedFlashcards/ListedFlashcards'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuth } from '@/context/AuthContext'
import { useQuizData } from '@/hooks/useQuizData'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

export default function QuizScreen() {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]
    const { user } = useAuth()
    const { id } = useLocalSearchParams<{ id?: string }>()

    const parsedId = id != null ? parseInt(id, 10) : 5 // u mnie 5 to działające id
    const quizId = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : 1

    const { data, isLoading, isError, error } = useQuizData(quizId, user?.id)

    return (
        <ThemedView
            style={[styles.screen, { backgroundColor: palette.background }]}
        >
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
                    <ThemedText type="title" style={styles.title}>
                        {data.quiz.name || 'Quiz bez nazwy'}
                    </ThemedText>
                    {data.quiz.description ? (
                        <ThemedText
                            style={[
                                styles.description,
                                { color: palette.textSecondary }
                            ]}
                        >
                            {data.quiz.description}
                        </ThemedText>
                    ) : null}
                    <ListedFlashcards
                        flashcards={data.flashcards.map((flashcard) => ({
                            database_id: flashcard.id,
                            front: flashcard.front,
                            back: flashcard.back
                        }))}
                    />
                    <Link href="../knowledgeTest?id=1" asChild>
                        <ThemedText
                            style={{
                                ...styles.authButtonText,
                                backgroundColor: palette.tint,
                                color: palette.textButtons
                            }}
                        >
                            Ucz się
                        </ThemedText>
                    </Link>
                    <Link href="../matchChallenge?id=1" asChild>
                        <ThemedText
                            style={{
                                ...styles.authButtonSecondaryText,
                                borderColor: palette.tint,
                                color: palette.tint
                            }}
                        >
                            Dopasowania
                        </ThemedText>
                    </Link>
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
    title: {
        marginBottom: 8
    },
    description: {
        marginBottom: 8
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    status: {
        padding: 24
    },
    authButtonText: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        overflow: 'hidden',
        fontWeight: '700'
    },
    authButtonSecondaryText: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        overflow: 'hidden',
        fontWeight: '700'
    },
})

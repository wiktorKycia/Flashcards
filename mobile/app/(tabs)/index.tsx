import { useMemo, useState } from 'react'
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native'
import { Link } from 'expo-router'
import Fuse from 'fuse.js'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { useQuizzes } from '@/hooks/useQuizzes'
import QuizPreview from '@/components/QuizPreview/QuizPreview'
import type FullQuiz from '@/types/FullQuiz'
import LikedQuizzesList from '@/components/LikedQuizzesList/LikedQuizzesList'

export default function HomeScreen() {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]
    const { token, user } = useAuth()
    const isLoggedIn = !!token

    const [searchQuery, setSearchQuery] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)

    const { data: quizzes = [], isLoading, isError } = useQuizzes()

    const filteredQuizzes = useMemo(() => {
        const query = searchQuery.trim()

        if (!query) return quizzes

        const fuseOptions = {
            keys: ['name'],
            threshold: 0.5
        }

        const fuse = new Fuse(quizzes, fuseOptions)
        const results = fuse.search(query)
        return results.map((result) => result.item)
    }, [quizzes, searchQuery])

    const displayedQuizzes = isExpanded ? filteredQuizzes : filteredQuizzes.slice(0, 10)

    return (
        <ThemedView style={[styles.screen, { backgroundColor: palette.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.header, {backgroundColor: palette.accent4}]}>
                    <ThemedText type="title">Fiszki</ThemedText>

                    {!isLoggedIn && (
                        <View style={styles.authButtons}>
                            <Link href="../login" asChild>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.authButton,
                                        { backgroundColor: palette.tint },
                                        pressed && styles.buttonPressed
                                    ]}
                                >
                                    <ThemedText style={[styles.authButtonText, { color: palette.textButtons }]}>
                                        Zaloguj się
                                    </ThemedText>
                                </Pressable>
                            </Link>
                            <Link href="../register" asChild>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.authButtonOutline,
                                        { borderColor: palette.tint },
                                        pressed && styles.buttonPressed
                                    ]}
                                >
                                    <ThemedText style={[styles.authButtonText, { color: palette.tint }]}>
                                        Zarejestruj się
                                    </ThemedText>
                                </Pressable>
                            </Link>
                        </View>
                    )}
                </View>

                <TextInput
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text)
                        setIsExpanded(false)
                    }}
                    placeholder="Wyszukaj zestaw fiszek..."
                    placeholderTextColor={palette.textSecondary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={[
                        styles.searchInput,
                        {
                            backgroundColor: palette.surface,
                            borderColor: palette.border,
                            color: palette.text
                        }
                    ]}
                />

                {isError && (
                    <ThemedText style={[styles.message, { color: palette.error }]}>
                        Wystąpił błąd podczas pobierania zestawów
                    </ThemedText>
                )}

                {isLoading && (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={palette.tint} />
                    </View>
                )}

                {!isLoading && !isError && (
                    <>
                        {filteredQuizzes.length > 0 ? (
                            <>
                                <ThemedText type="subtitle" style={styles.sectionTitle}>
                                    Znalezione zestawy fiszek
                                </ThemedText>
                                <View style={styles.quizList}>
                                    {displayedQuizzes.map((quiz: FullQuiz) => (
                                        <QuizPreview
                                            key={`quiz-preview-${quiz.id}`}
                                            quizId={quiz.id}
                                            quizName={quiz.name}
                                            quizDescription={quiz.description}
                                            likes={quiz.likes}
                                            dislikes={quiz.dislikes}
                                        />
                                    ))}
                                </View>
                                {filteredQuizzes.length > 10 && (
                                    <Pressable
                                        onPress={() => setIsExpanded(!isExpanded)}
                                        style={({ pressed }) => [
                                            styles.expandButton,
                                            { backgroundColor: palette.surface, borderColor: palette.border },
                                            pressed && styles.buttonPressed
                                        ]}
                                    >
                                        <ThemedText style={{ color: palette.tint, fontWeight: '700' }}>
                                            {isExpanded ? 'Zwiń' : 'Rozwiń'}
                                        </ThemedText>
                                    </Pressable>
                                )}
                            </>
                        ) : (
                            quizzes.length > 0 ? (
                                <ThemedText style={[styles.message, { color: palette.textSecondary }]}>
                                    Nie ma zestawów pasujących do wyszukiwania
                                </ThemedText>
                            ) : (
                                <ThemedText style={[styles.message, { color: palette.textSecondary }]}>
                                    Nie znaleziono żadnych zestawów w aplikacji
                                </ThemedText>
                            )
                        )}
                    </>
                )}

                { isLoggedIn && user &&
                    <LikedQuizzesList userId={user.id} />
                }
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 48,
        gap: 16
    },
    header: {
        gap: 12
    },
    authButtons: {
        flexDirection: 'row',
        gap: 12
    },
    authButton: {
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16
    },
    authButtonOutline: {
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16
    },
    authButtonText: {
        fontWeight: '700',
        fontSize: 14
    },
    buttonPressed: {
        opacity: 0.85
    },
    searchInput: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16
    },
    sectionTitle: {
        marginTop: 4
    },
    quizList: {
        gap: 12
    },
    expandButton: {
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 4
    },
    loading: {
        paddingVertical: 32,
        alignItems: 'center'
    },
    message: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 16
    }
})
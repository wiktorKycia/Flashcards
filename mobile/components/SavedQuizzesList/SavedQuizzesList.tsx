import { ActivityIndicator, StyleSheet, View } from 'react-native'

import ListableQuiz from '@/components/ListableQuiz/ListableQuiz'
import { ThemedText } from '@/components/themed-text'
import { useSavedQuizzes } from '@/hooks/useSavedQuizzes'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

interface SavedQuizzesListProps {
    userId: number
}

export default function SavedQuizzesList({ userId }: SavedQuizzesListProps) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]
    const { data, isLoading, isError } = useSavedQuizzes(userId)

    return (
        <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.heading}>
                Zapisane quizy
            </ThemedText>
            {isError && <ThemedText style={{ color: palette.error }}>Wystąpił błąd</ThemedText>}
            {isLoading && (
                <View style={styles.loading}>
                    <ActivityIndicator size="small" color={palette.tint} />
                </View>
            )}
            {!isError && !isLoading && data && (
                <View style={styles.list}>
                    {data.map((quiz) => (
                        <ListableQuiz
                            key={quiz.id}
                            id={quiz.id}
                            name={quiz.name}
                            description={quiz.description}
                        />
                    ))}
                    {data.length === 0 && (
                        <ThemedText style={{ color: palette.textSecondary }}>
                            Brak zapisanych quizów
                        </ThemedText>
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        gap: 12
    },
    heading: {
        marginTop: 8
    },
    list: {
        gap: 12
    },
    loading: {
        paddingVertical: 16,
        alignItems: 'center'
    }
})

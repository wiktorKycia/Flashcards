import { ActivityIndicator, StyleSheet, View } from 'react-native'

import ListableQuiz from '@/components/ListableQuiz/ListableQuiz'
import { ThemedText } from '@/components/themed-text'
import { useAuth } from '@/context/AuthContext'
import { useUserLikedQuizzes } from '@/hooks/useQuizLikes'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

interface LikedQuizzesListProps {
    userId: number
}

export default function LikedQuizzesList({ userId }: LikedQuizzesListProps) {
    const { user } = useAuth()
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]
    const { data, isLoading, isError } = useUserLikedQuizzes(userId)

    if (!user) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="small" color={palette.tint} />
            </View>
        )
    }

    return (
        <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.heading}>
                Polubione zestawy
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
                            Nie masz jeszcze polubionych zestawów fiszek
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

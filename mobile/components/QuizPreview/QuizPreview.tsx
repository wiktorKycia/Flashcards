import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { ThemedText } from '@/components/themed-text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { useUserQuizLike } from '@/hooks/useQuizLikes'

interface QuizPreviewProps {
    quizId: number
    quizName: string
    quizDescription: string | null
    likes: number
    dislikes: number
}

export default function QuizPreview({
                                        quizId,
                                        quizName,
                                        quizDescription,
                                        likes,
                                        dislikes
                                    }: QuizPreviewProps) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]
    const { user, token } = useAuth()
    const isLoggedIn = !!token

    const { data: userLike, isLoading } = useUserQuizLike(quizId, user?.id)

    const isLiked = isLoggedIn && !isLoading && userLike?.isLiked === true
    const isDisliked = isLoggedIn && !isLoading && userLike?.isLiked === false

    const truncatedDescription = quizDescription
        ? quizDescription.length > 50
            ? quizDescription.slice(0, 50).trim() + '...'
            : quizDescription
        : null

    return (
        <View
            style={[
                styles.wrapper,
                {
                    backgroundColor: palette.surface,
                    borderColor: palette.accent3
                }
            ]}
        >
            <View style={styles.topRow}>
                <ThemedText type="defaultSemiBold" style={styles.title}>
                    {quizName}
                </ThemedText>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: '/(tabs)/quiz',
                            params: { id: String(quizId) }
                        })
                    }
                    style={({ pressed }) => [
                        styles.button,
                        { backgroundColor: palette.tint },
                        pressed && styles.buttonPressed
                    ]}
                >
                    <ThemedText style={[styles.buttonText, { color: palette.textButtons }]}>
                        Otwórz zestaw
                    </ThemedText>
                </Pressable>
            </View>

            {truncatedDescription ? (
                <ThemedText style={[styles.description, { color: palette.textSecondary }]}>
                    {truncatedDescription}
                </ThemedText>
            ) : null}

            <View style={styles.votesWrapper}>
                {isLoading ? (
                    <ActivityIndicator size="small" color={palette.tint} />
                ) : (
                    <>
                        <View style={styles.likesWrapper}>
                            <ThemedText style={{ color: isLiked ? palette.tint : palette.accent2, fontWeight: 'bold' }}>
                                {likes}👍
                            </ThemedText>
                        </View>
                        <View style={styles.dislikesWrapper}>
                            <ThemedText style={{ color: isDisliked ? palette.danger : palette.error, fontWeight: 'bold' }}>
                                {dislikes}👎
                            </ThemedText>
                        </View>
                    </>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        borderWidth: 2,
        borderRadius: 10,
        padding: 12,
        gap: 8,
        width: '100%'
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8
    },
    title: {
        flex: 1,
        fontSize: 21
    },
    description: {
        fontSize: 16
    },
    button: {
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center'
    },
    buttonPressed: {
        opacity: 0.9
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '700'
    },
    votesWrapper: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    likesWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 18
    },
    dislikesWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 18
    }
})
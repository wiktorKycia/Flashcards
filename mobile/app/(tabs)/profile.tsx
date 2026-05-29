import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'

import CreatedQuizzesList from '@/components/CreatedQuizzesList/CreatedQuizzesList'
import SavedQuizzesList from '@/components/SavedQuizzesList/SavedQuizzesList'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuth } from '@/context/AuthContext'
import { useUserName } from '@/hooks/useUserName'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'
import LoginScreen from '../login'

export default function ProfileScreen() {
    const { token, user } = useAuth()
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    const userId = user?.id ?? 0
    const { data, isLoading, isError } = useUserName(userId)

    if (!token) {
        return <LoginScreen />
    }

    if (!user) {
        return (
            <ThemedView
                style={[styles.screen, { backgroundColor: palette.background }]}
            >
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={palette.tint} />
                </View>
            </ThemedView>
        )
    }

    return (
        <ThemedView style={[styles.screen, { backgroundColor: palette.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {isError && (
                    <ThemedText style={{ color: palette.error }}>
                        wystąpił błąd
                    </ThemedText>
                )}
                {isLoading && (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={palette.tint} />
                    </View>
                )}
                {!isError && !isLoading && data && (
                    <>
                        <ThemedText type="title" style={styles.title}>
                            Profil użytkownika {data.name}
                        </ThemedText>
                        <CreatedQuizzesList userId={userId} />
                        <SavedQuizzesList userId={userId} />
                    </>
                )}
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 48,
        gap: 16
    },
    title: {
        marginBottom: 8
    },
    loading: {
        paddingVertical: 32,
        alignItems: 'center'
    }
})

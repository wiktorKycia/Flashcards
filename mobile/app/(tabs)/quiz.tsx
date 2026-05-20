import { StyleSheet, View } from 'react-native'
import { useColorScheme } from '@/hooks/use-color-scheme'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export default function QuizScreen() {
    const colorScheme = useColorScheme() ?? 'light'

    return (
        <ThemedView
            style={[
                styles.screen,
                colorScheme === 'dark' ? styles.screenDark : styles.screenLight
            ]}
        >
            <View
                style={[
                    styles.card,
                    colorScheme === 'dark' ? styles.cardDark : styles.cardLight
                ]}
            >
                <ThemedText type="subtitle">Quiz</ThemedText>
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 24,
        justifyContent: 'center'
    },
    screenDark: {
        backgroundColor: '#121613'
    },
    screenLight: {
        backgroundColor: '#ffffff'
    },
    card: {
        padding: 24,
        borderRadius: 16,
        borderWidth: 1
    },
    cardDark: {
        borderColor: '#2a3d30',
        backgroundColor: '#1e2621'
    },
    cardLight: {
        borderColor: '#88d0d0',
        backgroundColor: '#f0fff4'
    }
})

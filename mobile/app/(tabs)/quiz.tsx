import { StyleSheet, View } from 'react-native'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export default function QuizScreen() {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    return (
        <ThemedView
            style={[
                styles.screen,
                { backgroundColor: palette.background }
            ]}
        >
            <View
                style={[
                    styles.card,
                    { borderColor: palette.border, backgroundColor: palette.surface }
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
    card: {
        padding: 24,
        borderRadius: 16,
        borderWidth: 1
    }
})

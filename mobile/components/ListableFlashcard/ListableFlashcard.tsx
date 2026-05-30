import { StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

interface ListableFlashcardProps {
    front: string
    back: string
}

export default function ListableFlashcard({ front, back }: ListableFlashcardProps) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    return (
        <View
            style={[
                styles.card,
                { borderColor: palette.border, backgroundColor: palette.surface }
            ]}
        >
            <ThemedText
                style={[styles.side, { color: palette.textSecondary }]}
            >
                {front}
            </ThemedText>
            <ThemedText
                style={[styles.side, { color: palette.textSecondary }]}
            >
                {back}
            </ThemedText>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 16,
        padding: 16,
        width: '100%'
    },
    side: {
        flex: 1,
        fontSize: 16,
        textAlign: 'center'
    }
})

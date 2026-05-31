import { Pressable, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

interface BigFlashcardProps {
    front: string
    back: string
    isFront: boolean
    onPress: () => void
}

export default function BigFlashcard({
    front,
    back,
    isFront,
    onPress
}: BigFlashcardProps) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    return (
        <View style={styles.container}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.card,
                    {
                        backgroundColor: palette.surface,
                        borderColor: palette.border
                    },
                    pressed && styles.cardPressed
                ]}
            >
                <ThemedText style={styles.cardText}>
                    {isFront ? front : back}
                </ThemedText>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: 200,
        marginVertical: 16
    },
    card: {
        flex: 1,
        minHeight: 200,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
    },
    cardPressed: {
        opacity: 0.92
    },
    cardText: {
        fontSize: 24,
        textAlign: 'center'
    }
})

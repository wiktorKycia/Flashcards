import { Pressable, StyleSheet } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

interface MatchCardProps {
    content: string
    status: 'idle' | 'selected' | 'correct' | 'wrong' | 'hidden'
    onClick: () => void
}

export default function MatchCard({ content, status, onClick }: MatchCardProps) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    const getBackgroundColor = () => {
        switch (status) {
            case 'selected':
                return 'skyblue'
            case 'correct':
                return 'limegreen'
            case 'wrong':
                return 'lightcoral'
            case 'hidden':
                return 'transparent'
            default:
                return palette.surface
        }
    }

    const isClickable = status === 'idle'

    return (
        <Pressable
            onPress={() => isClickable && onClick()}
            disabled={!isClickable}
            style={({ pressed }) => [
                styles.card,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: palette.border,
                    opacity: status === 'hidden' ? 0 : 1
                },
                pressed && isClickable && styles.cardPressed
            ]}
        >
            <ThemedText style={styles.content}>{content}</ThemedText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 2,
        borderRadius: 10,
        padding: 16,
        minHeight: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardPressed: {
        transform: [{ scale: 0.95 }]
    },
    content: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center'
    }
})
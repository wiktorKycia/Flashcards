import { router } from 'expo-router'
import { Pressable, StyleSheet } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

interface ListableQuizProps {
    id: number
    name: string
    description: string | null
}

function truncateDescription(description: string): string {
    return description.length > 50
        ? `${description.substring(0, 50)}...`
        : description
}

export default function ListableQuiz({ id, name, description }: ListableQuizProps) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]
    const descriptionText = description?.trim() ?? ''

    return (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: '/(tabs)/quiz',
                    params: { id: String(id) }
                })
            }
            style={({ pressed }) => [
                styles.item,
                {
                    borderColor: palette.border,
                    backgroundColor: palette.surface
                },
                pressed && styles.itemPressed
            ]}
        >
            <ThemedText type="defaultSemiBold">{name}</ThemedText>
            {descriptionText ? (
                <ThemedText
                    style={[styles.description, { color: palette.textSecondary }]}
                >
                    {truncateDescription(descriptionText)}
                </ThemedText>
            ) : null}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    item: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        gap: 4
    },
    itemPressed: {
        opacity: 0.9
    },
    description: {
        fontSize: 14
    }
})

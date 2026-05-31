import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import { useColorScheme } from '@/hooks/use-color-scheme'
import { useSavedQuizToggle } from '@/hooks/useSavedQuizToggle'
import { Colors } from '@/constants/theme'

interface SaveQuizToggleProps {
    quizId: number
    userId: number
}

/** Bookmark icon matching the web quiz save control (outline vs filled). */
function BookmarkIcon({ filled, color }: { filled: boolean; color: string }) {
    return (
        <View style={styles.iconWrap}>
            <MaterialIcons
                name={filled ? 'bookmark' : 'bookmark-border'}
                size={22}
                color={color}
            />
        </View>
    )
}

export default function SaveQuizToggle({ quizId, userId }: SaveQuizToggleProps) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]
    const { isSaved, toggle, isLoading, isMutating } = useSavedQuizToggle(userId, quizId)

    const accentColor = palette.tint

    return (
        <Pressable
            onPress={toggle}
            disabled={isLoading || isMutating}
            accessibilityLabel={isSaved ? 'Usuń z zapisanych' : 'Zapisz quiz'}
            style={({ pressed }) => [
                styles.button,
                isSaved ? styles.buttonOn : styles.buttonOff,
                {
                    borderColor: accentColor,
                    shadowColor: accentColor
                },
                pressed && styles.buttonPressed,
                (isLoading || isMutating) && styles.buttonDisabled
            ]}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={accentColor} />
            ) : (
                <BookmarkIcon filled={isSaved} color={accentColor} />
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    iconWrap: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonOn: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
        elevation: 3
    },
    buttonOff: {
        backgroundColor: 'transparent',
        borderWidth: 1
    },
    buttonPressed: {
        opacity: 0.85
    },
    buttonDisabled: {
        opacity: 0.6
    }
})

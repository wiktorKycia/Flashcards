import { StyleSheet, TextInput, View } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

interface GapTaskProps {
    task: {
        sentence: string
        phrase: string
    }
    taskId: string
    value: string
    isFirstLetter: boolean
    onChange: (taskId: string, value: string) => void
    isFinished: boolean
}

export default function GapTask({
                                    task,
                                    taskId,
                                    value,
                                    isFirstLetter,
                                    onChange,
                                    isFinished
                                }: GapTaskProps) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    const parts = task.sentence.split(/_+/)
    const phrase = isFirstLetter ? task.phrase.trim().slice(1) : task.phrase

    let isCorrect: boolean
    if (isFirstLetter) {
        isCorrect = value.trim() === phrase.trim()
    } else {
        isCorrect =
            value.trim().slice(1) === phrase.trim().slice(1) &&
            value.trim()[0]?.toLowerCase() === phrase.trim()[0]?.toLowerCase()
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.sentenceRow}>
                {isFirstLetter ? (
                    <ThemedText>{parts[0].slice(0, -1)}</ThemedText>
                ) : (
                    <ThemedText>{parts[0]}</ThemedText>
                )}
                <View style={styles.answerWrapper}>
                    {isFirstLetter && <ThemedText>{parts[0].slice(-1)}</ThemedText>}
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: palette.surface,
                                borderColor: palette.border,
                                color: palette.text
                            },
                            isFinished && isCorrect && { borderColor: 'green' },
                            isFinished && !isCorrect && { borderColor: 'red' }
                        ]}
                        value={value}
                        onChangeText={(text) => onChange(taskId, text)}
                        editable={!isFinished}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
                <ThemedText>{parts[1]}</ThemedText>
            </View>
            {isFinished && !isCorrect && (
                <ThemedText style={{ color: palette.error }}>
                    Poprawna odpowiedź: {phrase}
                </ThemedText>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 8,
        gap: 4
    },
    sentenceRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    answerWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 16,
        minWidth: 80
    }
})
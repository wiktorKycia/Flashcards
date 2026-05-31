import { Pressable, StyleSheet, View } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

interface SingleChoiceTaskProps {
    task: {
        sentence: string
        phrase1: string
        phrase2: string
        phrase3: string
        correctAnswer: string
    }
    taskId: string
    selectedValue: string
    onChange: (taskId: string, value: string) => void
    isFinished: boolean
}

export default function SingleChoiceTask({
                                             task,
                                             taskId,
                                             selectedValue,
                                             onChange,
                                             isFinished
                                         }: SingleChoiceTaskProps) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    const isCorrect = selectedValue === task.correctAnswer

    const getOptionStyle = (option: string) => {
        const isSelected = selectedValue === option
        const isCorrectOption = option === task.correctAnswer

        if (!isFinished) {
            return isSelected ? { backgroundColor: palette.accent5 } : {}
        }

        if (isCorrectOption) {
            return { backgroundColor: 'green', opacity: 0.3 }
        }

        if (isSelected) {
            return { backgroundColor: 'red', opacity: 0.3 }
        }

        return {}
    }

    return (
        <View style={styles.wrapper}>
            <ThemedText style={styles.sentence}>
                {task.sentence.split(/_+/)[0]}_____
                {task.sentence.split(/_+/)[1]}
            </ThemedText>

            <View style={styles.optionsWrapper}>
                {[task.phrase1, task.phrase2, task.phrase3].map((option) => (
                    <Pressable
                        key={option}
                        onPress={() => !isFinished && onChange(taskId, option)}
                        style={[
                            styles.option,
                            {
                                borderColor: palette.border,
                                backgroundColor: palette.surface
                            },
                            getOptionStyle(option)
                        ]}
                        disabled={isFinished}
                    >
                        <View
                            style={[
                                styles.radio,
                                { borderColor: palette.border },
                                selectedValue === option && {
                                    backgroundColor: palette.tint
                                }
                            ]}
                        />
                        <ThemedText>{option}</ThemedText>
                    </Pressable>
                ))}
            </View>

            {isFinished && !isCorrect && (
                <ThemedText style={{ color: palette.error }}>
                    Poprawna odpowiedź: {task.correctAnswer}
                </ThemedText>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 8,
        gap: 8
    },
    sentence: {
        fontSize: 16,
        marginBottom: 4
    },
    optionsWrapper: {
        gap: 8
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        gap: 12
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2
    }
})
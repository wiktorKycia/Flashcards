import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'
import GapTask from '@/components/GapTask/GapTask'
import SingleChoiceTask from '@/components/SingleChoiceTask/SingleChoiceTask'
import type { Tasks } from '@/types/TasksData'

export default function KnowledgeTestView({ data }: Tasks) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [score, setScore] = useState<number>(0)
    const [isFinished, setIsFinished] = useState<boolean>(false)

    const handleAnswerChange = (taskID: string, value: string) => {
        if (isFinished) return

        setAnswers((prev) => ({
            ...prev,
            [taskID]: value
        }))
    }

    const handleCheck = () => {
        let points = 0

        data.fillGap?.data.forEach((task, i) => {
            const id = `fill-gap${i}`
            if (
                answers[id]?.trim().slice(1) === task.phrase.trim().slice(1) &&
                answers[id]?.trim()[0]?.toLowerCase() === task.phrase.trim()[0]?.toLowerCase()
            ) {
                points++
            }
        })

        data.firstLetterGap?.data.forEach((task, i) => {
            const id = `first-letter${i}`
            if (answers[id]?.trim() === task.phrase.trim().slice(1)) {
                points++
            }
        })

        data.singleChoice?.data.forEach((task, i) => {
            const id = `single-choice${i}`
            if (answers[id]?.trim() === task.correctAnswer.trim()) {
                points++
            }
        })

        setScore(points)
        setIsFinished(true)
    }

    const handleReset = () => {
        setAnswers({})
        setScore(0)
        setIsFinished(false)
    }

    const totalQuestions =
        (data.fillGap?.data.length || 0) +
        (data.firstLetterGap?.data.length || 0) +
        (data.singleChoice?.data.length || 0)

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {data.fillGap?.data?.length ? (
                    <View style={styles.section}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>
                            Wypełnij luki
                        </ThemedText>
                        {data.fillGap.data.map((task, i) => (
                            <GapTask
                                key={`fill-gap${i}`}
                                task={task}
                                taskId={`fill-gap${i}`}
                                value={answers[`fill-gap${i}`] || ''}
                                isFirstLetter={false}
                                onChange={handleAnswerChange}
                                isFinished={isFinished}
                            />
                        ))}
                    </View>
                ) : null}

                {data.firstLetterGap?.data?.length ? (
                    <View style={styles.section}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>
                            Wypełnij luki (pierwsza litera podana)
                        </ThemedText>
                        {data.firstLetterGap.data.map((task, i) => (
                            <GapTask
                                key={`first-letter${i}`}
                                task={task}
                                taskId={`first-letter${i}`}
                                value={answers[`first-letter${i}`] || ''}
                                isFirstLetter={true}
                                onChange={handleAnswerChange}
                                isFinished={isFinished}
                            />
                        ))}
                    </View>
                ) : null}

                {data.singleChoice?.data?.length ? (
                    <View style={styles.section}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>
                            Wybierz poprawną odpowiedź
                        </ThemedText>
                        {data.singleChoice.data.map((task, i) => (
                            <SingleChoiceTask
                                key={`single-choice${i}`}
                                task={task}
                                taskId={`single-choice${i}`}
                                selectedValue={answers[`single-choice${i}`] || ''}
                                onChange={handleAnswerChange}
                                isFinished={isFinished}
                            />
                        ))}
                    </View>
                ) : null}

                {isFinished && (
                    <View style={styles.result}>
                        <ThemedText type="title">Wynik</ThemedText>
                        <ThemedText type="subtitle">
                            {score} / {totalQuestions}
                        </ThemedText>
                        <ThemedText type="subtitle">{percentage}%</ThemedText>
                    </View>
                )}

                <View style={styles.actions}>
                    {!isFinished ? (
                        <Pressable
                            onPress={handleCheck}
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: palette.tint },
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <ThemedText style={[styles.buttonText, { color: palette.textButtons }]}>
                                Sprawdź
                            </ThemedText>
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={handleReset}
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: palette.accent2 },
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <ThemedText style={[styles.buttonText, { color: palette.textButtons }]}>
                                Resetuj test
                            </ThemedText>
                        </Pressable>
                    )}
                </View>
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    scrollContent: {
        padding: 16,
        gap: 24
    },
    section: {
        gap: 12
    },
    sectionTitle: {
        marginBottom: 8
    },
    result: {
        alignItems: 'center',
        gap: 8,
        marginVertical: 16
    },
    actions: {
        marginTop: 16,
        alignItems: 'center'
    },
    button: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 32,
        alignItems: 'center',
        minWidth: 200
    },
    buttonPressed: {
        opacity: 0.9
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700'
    }
})
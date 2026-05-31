import { useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'
import KnowledgeTestSetup from '@/components/KnowledgeTestSetup/KnowledgeTestSetup'
import KnowledgeTestView from '@/components/KnowledgeTestView/KnowledgeTestView'
import { useGenerateTasks } from '@/hooks/useGenerateTasks'
import type KnowledgeTestSettings from '@/types/KnowledgeTestSettings'

export default function KnowledgeTestScreen() {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    const { id } = useLocalSearchParams<{ id?: string }>()
    const quizId = id != null ? parseInt(id, 10) : 0

    const [settings, setSettings] = useState<KnowledgeTestSettings | null>(null)
    const { mutate, data, isPending, isError, error } = useGenerateTasks()

    const handleStart = (s: KnowledgeTestSettings) => {
        setSettings(s)

        mutate({
            fillGapCount: s.fillGapCount,
            firstLetterCount: s.firstLetterCount,
            singleChoiceCount: s.singleChoiceCount,
            quizId: quizId,
            languageSide: s.flashcardsSide
        })
    }

    const hasAnyData = !!(
        data?.fillGap?.data?.length ||
        data?.firstLetterGap?.data?.length ||
        data?.singleChoice?.data?.length
    )

    if (Number.isNaN(quizId) || quizId <= 0) {
        return (
            <ThemedView style={[styles.screen, { backgroundColor: palette.background }]}>
                <ThemedText style={styles.error}>Niepoprawny identyfikator quizu</ThemedText>
            </ThemedView>
        )
    }

    return (
        <ThemedView style={[styles.screen, { backgroundColor: palette.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {!settings ? (
                    <KnowledgeTestSetup onSubmitSettings={handleStart} />
                ) : (
                    <View style={styles.content}>
                        {isPending && <View style={styles.loading}>
                            <ActivityIndicator size="large" color={palette.tint} />
                        </View>}

                        {isError && (
                            <ThemedText style={[styles.vitalInfo, { color: palette.error }]}>
                                {error?.message ?? 'Wystąpił błąd'}
                            </ThemedText>
                        )}

                        {data?.errorMessage && (
                            <ThemedText style={[styles.vitalInfo, { color: palette.error }]}>
                                {data.errorMessage}
                            </ThemedText>
                        )}

                        {data?.warning && (
                            <ThemedText style={[styles.vitalInfo, { color: palette.textSecondary }]}>
                                Uwaga: {data.warning}
                            </ThemedText>
                        )}

                        {hasAnyData && !isError ? (
                            <KnowledgeTestView data={data} />
                        ) : (
                            !isPending &&
                            !isError && (
                                <ThemedText style={styles.vitalInfo}>Brak zadań</ThemedText>
                            )
                        )}
                    </View>
                )}
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    scrollContent: {
        padding: 16,
        alignItems: 'center'
    },
    content: {
        width: '100%',
        alignItems: 'center'
    },
    vitalInfo: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16
    },
    error: {
        textAlign: 'center',
        padding: 16
    },
    loading: {
        paddingVertical: 32,
        alignItems: 'center'
    }
})
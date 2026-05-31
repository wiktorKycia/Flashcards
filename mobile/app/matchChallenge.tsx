import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'
import MatchCard from '@/components/MatchCard/MatchCard'
import { useQuizData } from '@/hooks/useQuizData'

type CardStatus = 'idle' | 'selected' | 'correct' | 'wrong' | 'hidden'

type CardItem = {
    id: string
    pairId: number
    content: string
    status: CardStatus
}

function shuffle<T>(array: T[]): T[] {
    const copied = [...array]
    for (let i = copied.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copied[i], copied[j]] = [copied[j], copied[i]]
    }
    return copied
}

export default function MatchChallengeScreen() {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    const { id } = useLocalSearchParams<{ id?: string }>()
    const quizId = id != null ? parseInt(id, 10) : 0

    const { data, isLoading, isError } = useQuizData(quizId)

    const initialCards: CardItem[] = useMemo(() => {
        if (!data?.flashcards || data.flashcards.length === 0) {
            return []
        }

        const randomizedFlashcards = shuffle(data.flashcards).slice(0, 8)

        const mapped = randomizedFlashcards.flatMap((flashcard) => [
            {
                id: `${flashcard.id}-a`,
                pairId: flashcard.id,
                content: flashcard.front,
                status: 'idle' as CardStatus
            },
            {
                id: `${flashcard.id}-b`,
                pairId: flashcard.id,
                content: flashcard.back,
                status: 'idle' as CardStatus
            }
        ])

        return shuffle(mapped)
    }, [data?.flashcards])

    const [cards, setCards] = useState<CardItem[]>([])
    const [selectedCards, setSelectedCards] = useState<CardItem[]>([])

    useEffect(() => {
        setCards(initialCards)
    }, [initialCards])

    const handleCardClick = (id: string) => {
        if (selectedCards.length >= 2) return

        const clickedCard = cards.find((card) => card.id === id)

        if (!clickedCard || clickedCard.status !== 'idle') return

        const updatedSelected = [...selectedCards, clickedCard]

        setSelectedCards(updatedSelected)

        setCards((prev) =>
            prev.map((card) => (card.id === id ? { ...card, status: 'selected' } : card))
        )

        if (updatedSelected.length !== 2) return

        const [first, second] = updatedSelected

        if (first.pairId === second.pairId && first.id !== second.id) {
            setCards((prev) =>
                prev.map((card) =>
                    card.id === first.id || card.id === second.id
                        ? { ...card, status: 'correct' }
                        : card
                )
            )

            setTimeout(() => {
                setCards((prev) =>
                    prev.map((card) =>
                        card.id === first.id || card.id === second.id
                            ? { ...card, status: 'hidden' }
                            : card
                    )
                )

                setSelectedCards([])
            }, 500)

            return
        }

        setCards((prev) =>
            prev.map((card) =>
                card.id === first.id || card.id === second.id
                    ? { ...card, status: 'wrong' }
                    : card
            )
        )

        setTimeout(() => {
            setCards((prev) =>
                prev.map((card) => (card.status === 'wrong' ? { ...card, status: 'idle' } : card))
            )

            setSelectedCards([])
        }, 700)
    }

    const isFinished = cards.length > 0 && cards.every((card) => card.status === 'hidden')
    const hasNoData =
        !isLoading && !isError && (!data?.flashcards || data.flashcards.length === 0)

    return (
        <ThemedView style={[styles.screen, { backgroundColor: palette.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ThemedText type="title" style={styles.title}>
                    Wyzwanie dopasowywania
                </ThemedText>

                {isError && (
                    <ThemedText style={{ color: palette.error }}>Wystąpił błąd</ThemedText>
                )}
                {isLoading && <View style={styles.loading}>
                    <ActivityIndicator size="large" color={palette.tint} />
                </View>}
                {hasNoData && <ThemedText>Brak dostępnych fiszek w tym zestawie</ThemedText>}
                {isFinished && (
                    <ThemedText type="subtitle" style={styles.finished}>
                        Ukończono!
                    </ThemedText>
                )}

                {!hasNoData && (
                    <View style={styles.grid}>
                        {cards.map((card) => (
                            <View key={card.id} style={styles.cardWrapper}>
                                <MatchCard
                                    content={card.content}
                                    status={card.status}
                                    onClick={() => handleCardClick(card.id)}
                                />
                            </View>
                        ))}
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
    title: {
        marginBottom: 16
    },
    grid: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 8
    },
    cardWrapper: {
        width: '48%'
    },
    finished: {
        marginVertical: 16,
        fontWeight: 'bold'
    },
    loading: {
        paddingVertical: 32,
        alignItems: 'center'
    }
})
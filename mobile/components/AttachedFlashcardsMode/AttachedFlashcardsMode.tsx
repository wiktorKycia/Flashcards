import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Switch, View } from 'react-native'

import BigFlashcard from '@/components/BigFlashcard/BigFlashcard'
import { ThemedText } from '@/components/themed-text'
import { useAuth } from '@/context/AuthContext'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useResetQuizProgress } from '@/hooks/useResetQuizProgress'
import { useUpdateFlashcardKnowledge } from '@/hooks/useUpdateFlashcardKnowledge'
import { Colors } from '@/constants/theme'
import type Flashcard from '@/types/Flashcard'

interface AttachedFlashcardsModeProps {
    quizId: number
    flashcards: Flashcard[]
    onProgressReset?: () => void
}

export default function AttachedFlashcardsMode({
    quizId,
    flashcards: initialFlashcards,
    onProgressReset
}: AttachedFlashcardsModeProps) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]
    const { user, token } = useAuth()
    const isLoggedIn = !!token

    const [flashcardsIterator, setFlashcardsIterator] = useState(0)
    const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards)
    const [unknownFlashcards, setUnknownFlashcards] = useState<Flashcard[]>(
        initialFlashcards.filter((flashcard) => !flashcard.isKnown)
    )
    const [isTrackingProgress, setIsTrackingProgress] = useState(false)
    const [finishedTrackingProgress, setFinishedTrackingProgress] = useState(
        initialFlashcards.filter((f) => !f.isKnown).length === 0
    )
    const [nextTurn, setNextTurn] = useState<Flashcard[]>([])
    const [requiresNextTurn, setRequiresNextTurn] = useState(false)
    const [isFront, setIsFront] = useState(true)
    const [isShuffled, setIsShuffled] = useState(false)

    const updateFlashcardsKnowledge = useUpdateFlashcardKnowledge()
    const resetQuizProgress = useResetQuizProgress()
    const skipPropsSyncRef = useRef(false)

    useEffect(() => {
        if (skipPropsSyncRef.current) {
            skipPropsSyncRef.current = false
            return
        }
        if (!isTrackingProgress) {
            const newUnknowns = initialFlashcards.filter((flashcard) => !flashcard.isKnown)
            setFlashcards(initialFlashcards)
            setUnknownFlashcards(newUnknowns)
            setFinishedTrackingProgress(newUnknowns.length === 0)
        }
    }, [initialFlashcards, isTrackingProgress])

    function handleShuffle() {
        if (!isShuffled) {
            const array = [...flashcards]
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                ;[array[i], array[j]] = [array[j], array[i]]
            }
            setFlashcards(array)
            setFlashcardsIterator(0)
        } else {
            setFlashcards(initialFlashcards)
            setFlashcardsIterator(0)
        }
        setIsShuffled((prev) => !prev)
        setIsFront(true)
    }

    function handleIncrement() {
        if (flashcardsIterator < flashcards.length - 1) {
            setFlashcardsIterator((prev) => prev + 1)
            setIsFront(true)
        }
    }

    function handleDecrement() {
        if (flashcardsIterator > 0) {
            setFlashcardsIterator((prev) => prev - 1)
            setIsFront(true)
        }
    }

    function handleFlashcardOnClick() {
        setIsFront((prev) => !prev)
    }

    function handleKnow(iterator: number) {
        setUnknownFlashcards((prev) =>
            prev.map((flashcard, index) =>
                index === iterator ? { ...flashcard, isKnown: true } : flashcard
            )
        )
        setFlashcardsIterator((prev) => prev + 1)
        if (iterator + 1 === unknownFlashcards.length) {
            setRequiresNextTurn(true)
        }
    }

    function handleDontKnow(iterator: number) {
        setNextTurn((prev) => [...prev, unknownFlashcards[iterator]])
        setFlashcardsIterator((prev) => prev + 1)
        if (iterator + 1 === unknownFlashcards.length) {
            setRequiresNextTurn(true)
        }
    }

    function handleNextTurn() {
        setRequiresNextTurn(false)
        setFlashcardsIterator(0)

        unknownFlashcards.forEach((flashcard) => {
            if (flashcard.isKnown && user) {
                updateFlashcardsKnowledge.mutate({
                    quizId,
                    userId: user.id,
                    flashcardId: flashcard.database_id,
                    isKnown: true
                })
            }
        })

        setUnknownFlashcards(nextTurn)
        if (nextTurn.length === 0) {
            setFinishedTrackingProgress(true)
        }
        setNextTurn([])
        setIsFront(true)
    }

    async function handleResetProgress() {
        if (!user) return

        try {
            await resetQuizProgress.mutateAsync({
                quizId,
                userId: user.id
            })

            const resetFlashcards = initialFlashcards.map((flashcard) => ({
                ...flashcard,
                isKnown: false
            }))

            skipPropsSyncRef.current = true
            setFlashcards(resetFlashcards)
            setUnknownFlashcards(resetFlashcards)
            setFlashcardsIterator(0)
            setRequiresNextTurn(false)
            setNextTurn([])
            setFinishedTrackingProgress(false)
            setIsTrackingProgress(false)
            setIsFront(true)
            onProgressReset?.()
        } catch {
            // ignore – button stays enabled for retry
        }
    }

    const actionButtonStyle = [
        styles.actionButton,
        { backgroundColor: palette.tint }
    ]

    if (flashcards.length === 0) {
        return (
            <View style={styles.empty}>
                <ThemedText style={{ color: palette.textSecondary }}>
                    Ten quiz jeszcze nie ma fiszek
                </ThemedText>
            </View>
        )
    }

    const currentBrowseCard = flashcards[flashcardsIterator]
    const currentStudyCard = unknownFlashcards[flashcardsIterator]

    return (
        <View style={styles.root}>
            {!finishedTrackingProgress && isTrackingProgress ? (
                requiresNextTurn ? (
                    <Pressable
                        onPress={handleNextTurn}
                        style={({ pressed }) => [
                            ...actionButtonStyle,
                            pressed && styles.buttonPressed
                        ]}
                    >
                        <ThemedText style={[styles.actionButtonText, { color: palette.textButtons }]}>
                            Następna tura
                        </ThemedText>
                    </Pressable>
                ) : currentStudyCard ? (
                    <>
                        <BigFlashcard
                            front={currentStudyCard.front}
                            back={currentStudyCard.back}
                            isFront={isFront}
                            onPress={handleFlashcardOnClick}
                        />
                        <View style={styles.arrowsRow}>
                            <Pressable
                                onPress={() => handleDontKnow(flashcardsIterator)}
                                style={({ pressed }) => [
                                    ...actionButtonStyle,
                                    pressed && styles.buttonPressed
                                ]}
                            >
                                <ThemedText
                                    style={[styles.actionButtonText, { color: palette.textButtons }]}
                                >
                                    nie znam
                                </ThemedText>
                            </Pressable>
                            <ThemedText style={{ color: palette.textSecondary }}>
                                {flashcardsIterator + 1} / {unknownFlashcards.length}
                            </ThemedText>
                            <Pressable
                                onPress={() => handleKnow(flashcardsIterator)}
                                style={({ pressed }) => [
                                    ...actionButtonStyle,
                                    pressed && styles.buttonPressed
                                ]}
                            >
                                <ThemedText
                                    style={[styles.actionButtonText, { color: palette.textButtons }]}
                                >
                                    znam
                                </ThemedText>
                            </Pressable>
                        </View>
                    </>
                ) : null
            ) : currentBrowseCard ? (
                <>
                    <BigFlashcard
                        front={currentBrowseCard.front}
                        back={currentBrowseCard.back}
                        isFront={isFront}
                        onPress={handleFlashcardOnClick}
                    />
                    <View style={styles.arrowsRow}>
                        <Pressable
                            onPress={handleDecrement}
                            disabled={flashcardsIterator === 0}
                            style={({ pressed }) => [
                                styles.navButton,
                                { borderColor: palette.border },
                                flashcardsIterator === 0 && styles.navButtonDisabled,
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <ThemedText>←</ThemedText>
                        </Pressable>
                        <ThemedText style={{ color: palette.textSecondary }}>
                            {flashcardsIterator + 1} / {flashcards.length}
                        </ThemedText>
                        <Pressable
                            onPress={handleIncrement}
                            disabled={flashcardsIterator >= flashcards.length - 1}
                            style={({ pressed }) => [
                                styles.navButton,
                                { borderColor: palette.border },
                                flashcardsIterator >= flashcards.length - 1 &&
                                    styles.navButtonDisabled,
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <ThemedText>→</ThemedText>
                        </Pressable>
                    </View>
                </>
            ) : null}

            <View style={styles.optionsRow}>
                {isLoggedIn && !finishedTrackingProgress && (
                    <View style={styles.trackProgress}>
                        <ThemedText style={{ color: palette.textSecondary }}>
                            Śledź postępy
                        </ThemedText>
                        <Switch
                            value={isTrackingProgress}
                            onValueChange={(value) => {
                                setIsTrackingProgress(value)
                                setFlashcardsIterator(0)
                                setIsFront(true)
                            }}
                            trackColor={{ false: palette.border, true: palette.tint }}
                        />
                    </View>
                )}
                {isLoggedIn && finishedTrackingProgress && (
                    <Pressable
                        onPress={handleResetProgress}
                        disabled={resetQuizProgress.isPending}
                        style={({ pressed }) => [
                            ...actionButtonStyle,
                            pressed && styles.buttonPressed,
                            resetQuizProgress.isPending && styles.buttonDisabled
                        ]}
                    >
                        <ThemedText style={[styles.actionButtonText, { color: palette.textButtons }]}>
                            {resetQuizProgress.isPending
                                ? 'Resetowanie...'
                                : 'Zresetuj progres'}
                        </ThemedText>
                    </Pressable>
                )}
                <Pressable
                    onPress={handleShuffle}
                    style={({ pressed }) => [
                        styles.shuffleButton,
                        {
                            borderColor: palette.tint,
                            backgroundColor: isShuffled ? palette.tint : 'transparent'
                        },
                        pressed && styles.buttonPressed
                    ]}
                >
                    <ThemedText
                        style={{
                            color: isShuffled ? palette.textButtons : palette.tint,
                            fontWeight: '600'
                        }}
                    >
                        Losowa kolejność
                    </ThemedText>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginBottom: 8
    },
    empty: {
        paddingVertical: 24,
        alignItems: 'center'
    },
    arrowsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16
    },
    optionsRow: {
        gap: 16,
        marginBottom: 8
    },
    trackProgress: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    actionButton: {
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        minWidth: 100
    },
    actionButtonText: {
        fontWeight: '700'
    },
    navButton: {
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        minWidth: 48,
        alignItems: 'center'
    },
    navButtonDisabled: {
        opacity: 0.4
    },
    shuffleButton: {
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center'
    },
    buttonPressed: {
        opacity: 0.9
    },
    buttonDisabled: {
        opacity: 0.7
    }
})

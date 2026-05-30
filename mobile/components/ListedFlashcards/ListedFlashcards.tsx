import { StyleSheet, View } from 'react-native'

import ListableFlashcard from '@/components/ListableFlashcard/ListableFlashcard'
import { ThemedText } from '@/components/themed-text'
import type FlashcardFromDatabase from '@/types/FlashcardFromDatabase'

interface ListedFlashcardsProps {
    flashcards: FlashcardFromDatabase[]
}

export default function ListedFlashcards({ flashcards }: ListedFlashcardsProps) {
    return (
        <View style={styles.root}>
            <ThemedText type="subtitle" style={styles.heading}>
                Fiszki
            </ThemedText>
            <View style={styles.list}>
                {flashcards.map((flashcard) => (
                    <ListableFlashcard
                        key={flashcard.database_id}
                        front={flashcard.front}
                        back={flashcard.back}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        marginTop: 32,
        paddingHorizontal: 8,
        gap: 16
    },
    heading: {
        fontSize: 24
    },
    list: {
        gap: 12
    }
})

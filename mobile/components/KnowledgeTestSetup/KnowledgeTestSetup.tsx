import { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'
import type KnowledgeTestSettings from '@/types/KnowledgeTestSettings'

interface KnowledgeTestSetupProps {
    onSubmitSettings: (settings: KnowledgeTestSettings) => void
}

export default function KnowledgeTestSetup({ onSubmitSettings }: KnowledgeTestSetupProps) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    const [fillGapCount, setFillGapCount] = useState(5)
    const [firstLetterCount, setFirstLetterCount] = useState(5)
    const [singleChoiceCount, setSingleChoiceCount] = useState(5)
    const [flashcardsSide, setFlashcardsSide] = useState('FRONT')

    const handleSubmit = () => {
        onSubmitSettings({
            fillGapCount,
            firstLetterCount,
            singleChoiceCount,
            flashcardsSide
        })
    }

    return (
        <ThemedView
            style={[
                styles.form,
                {
                    backgroundColor: palette.surface,
                    borderColor: palette.border
                }
            ]}
        >
            <View style={styles.field}>
                <ThemedText style={styles.label}>
                    Wybierz liczbę pytań z luką:
                </ThemedText>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: palette.background,
                            borderColor: palette.border,
                            color: palette.text
                        }
                    ]}
                    keyboardType="number-pad"
                    value={String(fillGapCount)}
                    onChangeText={(text) => setFillGapCount(Number(text) || 0)}
                />
            </View>

            <View style={styles.field}>
                <ThemedText style={styles.label}>
                    Wybierz liczbę pytań z luką z pierwszą literą:
                </ThemedText>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: palette.background,
                            borderColor: palette.border,
                            color: palette.text
                        }
                    ]}
                    keyboardType="number-pad"
                    value={String(firstLetterCount)}
                    onChangeText={(text) => setFirstLetterCount(Number(text) || 0)}
                />
            </View>

            <View style={styles.field}>
                <ThemedText style={styles.label}>
                    Wybierz liczbę pytań jednokrotnego wyboru:
                </ThemedText>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: palette.background,
                            borderColor: palette.border,
                            color: palette.text
                        }
                    ]}
                    keyboardType="number-pad"
                    value={String(singleChoiceCount)}
                    onChangeText={(text) => setSingleChoiceCount(Number(text) || 0)}
                />
            </View>

            <View style={styles.field}>
                <ThemedText style={styles.label}>
                    Wybierz stronę fiszek:
                </ThemedText>
                <Picker
                    selectedValue={flashcardsSide}
                    onValueChange={(value: string) => setFlashcardsSide(value)}
                    style={[
                        styles.picker,
                        { backgroundColor: palette.background, color: palette.text }
                    ]}
                >
                    <Picker.Item label="Przód" value="FRONT" />
                    <Picker.Item label="Tył" value="BACK" />
                </Picker>
            </View>

            <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: palette.tint },
                    pressed && styles.buttonPressed
                ]}
            >
                <ThemedText style={[styles.buttonText, { color: palette.textButtons }]}>
                    Rozpocznij
                </ThemedText>
            </Pressable>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    form: {
        width: '90%',
        maxWidth: 500,
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        gap: 16
    },
    field: {
        gap: 8
    },
    label: {
        fontSize: 16,
        fontWeight: '600'
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16
    },
    picker: {
        borderWidth: 1,
        borderRadius: 8
    },
    button: {
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8
    },
    buttonPressed: {
        opacity: 0.9
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700'
    }
})
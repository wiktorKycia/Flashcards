import { StyleSheet, TextInput, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

interface FormFieldProps {
    label: string
    value: string
    onChangeText: (value: string) => void
    secureTextEntry?: boolean
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
    keyboardType?: 'default' | 'email-address'
}

export default function FormField({
    label,
    value,
    onChangeText,
    secureTextEntry = false,
    autoCapitalize = 'none',
    keyboardType = 'default'
}: FormFieldProps) {
    const colorScheme = useColorScheme() ?? 'light'
    const palette = Colors[colorScheme]

    return (
        <View style={styles.field}>
            <ThemedText style={[styles.label, { color: palette.textSecondary }]}>
                {label}
            </ThemedText>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                autoCorrect={false}
                keyboardType={keyboardType}
                placeholderTextColor={palette.textSecondary}
                style={[
                    styles.input,
                    {
                        backgroundColor: palette.surface,
                        borderColor: palette.border,
                        color: palette.text
                    }
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    field: {
        gap: 6
    },
    label: {
        fontSize: 14,
        fontWeight: '600'
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16
    }
})

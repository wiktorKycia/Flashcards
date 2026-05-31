import { Link, router } from 'expo-router'
import { useState } from 'react'
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	TextInput,
	View
} from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuth } from '@/context/AuthContext'
import { useLogin } from '@/hooks/useLogin'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

export default function LoginScreen() {
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const { login: storeLogin } = useAuth()
	const loginMutation = useLogin()
	const colorScheme = useColorScheme() ?? 'light'
	const palette = Colors[colorScheme]

	const handleSubmit = async () => {
		if (!login || !password) {
			setError('Podaj login i hasło.')
			return
		}

		setError(null)
		loginMutation.mutate(
			{ login, password },
			{
				onSuccess: async (data) => {
					await storeLogin(data.token, data.user)
					router.replace('/(tabs)')
				},
				onError: (err) => {
					setError(err instanceof Error ? err.message : 'Nieznany błąd')
				}
			}
		)
	}

	return (
		<ThemedView
			style={[
				styles.screen,
				{ backgroundColor: palette.background }
			]}
		>
			<KeyboardAvoidingView
				behavior={Platform.select({ ios: 'padding', android: undefined })}
				style={styles.keyboard}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
				>
					<View
						style={[
							styles.card,
							{
								backgroundColor: palette.surface,
								borderColor: palette.border
							}
						]}
					>
						<ThemedText type="title" style={styles.title}>
							Login
						</ThemedText>
						<TextInput
							value={login}
							onChangeText={setLogin}
							placeholder="Login"
							placeholderTextColor={palette.textSecondary}
							autoCapitalize="none"
							autoCorrect={false}
							textContentType="username"
							style={[
								styles.input,
								{
									backgroundColor: palette.surface,
									borderColor: palette.border,
									color: palette.text
								}
							]}
						/>
						<TextInput
							value={password}
							onChangeText={setPassword}
							placeholder="Hasło"
							placeholderTextColor={palette.textSecondary}
							secureTextEntry
							textContentType="password"
							style={[
								styles.input,
								{
									backgroundColor: palette.surface,
									borderColor: palette.border,
									color: palette.text
								}
							]}
						/>
						{error ? (
							<ThemedText style={[styles.errorText, { color: palette.error }]}>
								{error}
							</ThemedText>
						) : null}
						<Pressable
							onPress={handleSubmit}
							style={({ pressed }) => [
								styles.button,
								{ backgroundColor: palette.tint },
								pressed && styles.buttonPressed,
								loginMutation.isPending && styles.buttonDisabled
							]}
							disabled={loginMutation.isPending}
						>
							{loginMutation.isPending ? (
								<ActivityIndicator color={palette.textButtons} />
							) : (
								<ThemedText
									style={[styles.buttonText, { color: palette.textButtons }]}
								>
									Zaloguj się
								</ThemedText>
							)}
						</Pressable>
						<ThemedText
							style={[styles.linkText, { color: palette.textSecondary }]}
						>
							Nie masz konta?{' '}
							<Link href="../register" style={[styles.link, { color: palette.tint }]}>
								Zarejestruj się
							</Link>
						</ThemedText>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1
	},
	keyboard: {
		flex: 1
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		paddingHorizontal: 24,
		paddingVertical: 32
	},
	card: {
		borderRadius: 16,
		padding: 28,
		gap: 16,
		borderWidth: 1
	},
	title: {
		textAlign: 'center'
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16
	},
	button: {
		borderRadius: 8,
		paddingVertical: 12,
		alignItems: 'center'
	},
	buttonPressed: {
		opacity: 0.9
	},
	buttonDisabled: {
		opacity: 0.7
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '700'
	},
	linkText: {
		textAlign: 'center'
	},
	link: {},
	errorText: {}
})

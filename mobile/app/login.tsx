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
import { loginUser } from '@/lib/auth'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function LoginScreen() {
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { login: storeLogin } = useAuth()
	const colorScheme = useColorScheme() ?? 'light'

	const handleSubmit = async () => {
		if (!login || !password) {
			setError('Provide login and password.')
			return
		}

		try {
			setIsLoading(true)
			setError(null)
			const data = await loginUser({ login, password })
			await storeLogin(data.token, data.user)
			router.replace('/(tabs)')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<ThemedView
			style={[
				styles.screen,
				colorScheme === 'dark' ? styles.screenDark : styles.screenLight
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
							colorScheme === 'dark'
								? styles.cardDark
								: styles.cardLight
						]}
					>
						<ThemedText type="title" style={styles.title}>
							Login
						</ThemedText>
						<TextInput
							value={login}
							onChangeText={setLogin}
							placeholder="login"
							autoCapitalize="none"
							autoCorrect={false}
							textContentType="username"
							style={[
								styles.input,
								colorScheme === 'dark'
									? styles.inputDark
									: styles.inputLight
							]}
						/>
						<TextInput
							value={password}
							onChangeText={setPassword}
							placeholder="password"
							secureTextEntry
							textContentType="password"
							style={[
								styles.input,
								colorScheme === 'dark'
									? styles.inputDark
									: styles.inputLight
							]}
						/>
						{error ? (
							<ThemedText style={styles.errorText}>
								{error}
							</ThemedText>
						) : null}
						<Pressable
							onPress={handleSubmit}
							style={({ pressed }) => [
								styles.button,
								pressed && styles.buttonPressed,
								isLoading && styles.buttonDisabled
							]}
							disabled={isLoading}
						>
							{isLoading ? (
								<ActivityIndicator color="#e3f0e3" />
							) : (
								<ThemedText style={styles.buttonText}>
									Login
								</ThemedText>
							)}
						</Pressable>
						<ThemedText style={styles.linkText}>
							No account yet?{' '}
							<Link href="../register" style={styles.link}>
								Register
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
	screenDark: {
		backgroundColor: '#121613'
	},
	screenLight: {
		backgroundColor: '#ffffff'
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
	cardDark: {
		backgroundColor: '#1e2621',
		borderColor: '#2a3d30'
	},
	cardLight: {
		backgroundColor: '#f0fff4',
		borderColor: '#88d0d0'
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
	inputDark: {
		backgroundColor: '#1e2621',
		borderColor: '#2a3d30',
		color: '#e8f3ea'
	},
	inputLight: {
		backgroundColor: '#f0fff4',
		borderColor: '#88d0d0',
		color: '#3c4a3e'
	},
	button: {
		backgroundColor: '#22c55e',
		borderRadius: 8,
		paddingVertical: 12,
		alignItems: 'center'
	},
	buttonPressed: {
		backgroundColor: '#009e3b'
	},
	buttonDisabled: {
		opacity: 0.7
	},
	buttonText: {
		color: '#e3f0e3',
		fontSize: 16,
		fontWeight: '700'
	},
	linkText: {
		textAlign: 'center',
		color: '#a0ada2'
	},
	link: {
		color: '#22c55e'
	},
	errorText: {
		color: '#f87171'
	}
})

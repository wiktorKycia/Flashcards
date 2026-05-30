import { useState, useRef, type ChangeEvent, useEffect } from 'react'
import styles from './AvatarUpload.module.scss'
import { useUploadAvatar } from '@/hooks/useUploadAvatar'
import { useUserProfilePicture } from '@/hooks/useUserProfilePicture'
import Container from "@/components/Container";
import profileLogo from '@/assets/placeholder-profile-picture-1.png'

interface AvatarUploadProps {
    userId: number
    onUploadSuccess?: (avatarUrl: string) => void
}

export default function AvatarUpload({ userId, onUploadSuccess }: AvatarUploadProps) {
    const uploadAvatarMutation = useUploadAvatar()
    const { data: userAvatarUrl } = useUserProfilePicture(userId)

    const [previewSrc, setPreviewSrc] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    // Keep preview in sync with fetched avatar when no file is selected
    useEffect(() => {
        if (!selectedFile && userAvatarUrl) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreviewSrc(userAvatarUrl)
        }
    }, [userAvatarUrl, selectedFile])

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setSelectedFile(file)
        setError(null)
        setSuccess(false)

        const objectUrl = URL.createObjectURL(file)
        setPreviewSrc(objectUrl)
    }

    async function handleUpload() {
        if (!selectedFile) return

        setError(null)
        setSuccess(false)

        try {
            const avatarUrl = await uploadAvatarMutation.mutateAsync(selectedFile)
            setSelectedFile(null)
            setSuccess(true)
            onUploadSuccess?.(avatarUrl)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        }
    }

    return (
        <Container cssClassName={styles.AvatarUpload}>
            <h3>Zdjęcie profilowe</h3>

            <div className={styles.AvatarWrapper}>
                <img
                    src={previewSrc || profileLogo}
                    alt="Profile avatar"
                    className={styles.Avatar}
                />

                <div
                    className={styles.AvatarOverlay}
                    onClick={() => inputRef.current?.click()}
                    role="button"
                    aria-label="Choose avatar image"
                >
                    <span>Zmień</span>
                </div>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <button className={styles.SecondaryButton} onClick={() => inputRef.current?.click()} disabled={uploadAvatarMutation.isPending}>
                Wybierz plik
            </button>

            {selectedFile && <p className={styles.Filename}>Wybrano: {selectedFile.name}</p>}

            {selectedFile && (
                <button
                    onClick={handleUpload}
                    disabled={uploadAvatarMutation.isPending}
                >
                    {uploadAvatarMutation.isPending ? 'Wysyłanie…' : 'Zapisz zdjęcie'}
                </button>
            )}

            {error && <p className="message-error">{error}</p>}
            {success && <p className="message-info">Zdjęcie zaktualizowane!</p>}
        </Container>
    )
}

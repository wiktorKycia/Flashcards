import { useState, useRef, type ChangeEvent } from 'react'
import styles from './AvatarUpload.module.scss'
import Container from "@/components/Container";
import {useAuth} from "@/context/AuthContext.tsx";

interface AvatarUploadProps {
    userId: number
    /** Called with the new avatar URL after a successful upload */
    onUploadSuccess?: (avatarUrl: string) => void
}

// ─── Component ────────────

export default function AvatarUpload({ userId, onUploadSuccess }: AvatarUploadProps) {
    // The URL shown in the <img> preview.
    // Starts as the server's current avatar (may be undefined if none set yet).
    const [previewSrc, setPreviewSrc] = useState<string>(`/api/user${userId}/avatar/`)

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const auth = useAuth()

    // ── 1. User picks a file
    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setSelectedFile(file)
        setError(null)
        setSuccess(false)

        // Show a local preview immediately — no round-trip needed
        const objectUrl = URL.createObjectURL(file)
        setPreviewSrc(objectUrl)

        // Clean up the object URL when the component unmounts or next file is chosen
        return () => URL.revokeObjectURL(objectUrl)
    }

    // ── 2. User submits ─────────────────────────────────────────────────────────
    async function handleUpload() {
        if (!selectedFile) return

        setUploading(true)
        setError(null)
        setSuccess(false)

        try {
            const formData = new FormData()
            formData.append('avatar', selectedFile)

            const res = await fetch('/api/users/avatar', {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${auth.token}`
                },
                body: formData
            })

            if (!res.ok) {
                const { error: msg } = await res.json()
                throw new Error(msg ?? 'Upload failed')
            }

            const { avatarUrl } = (await res.json()) as { avatarUrl: string }

            // Bust the browser cache by appending a timestamp
            setPreviewSrc(`${avatarUrl}?t=${Date.now()}`)
            setSelectedFile(null)
            setSuccess(true)
            onUploadSuccess?.(avatarUrl)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setUploading(false)
        }
    }

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <Container>
            <h3 className={styles.heading}>Profile Picture</h3>

            <div className={styles.avatarWrapper}>
                <img
                    src={previewSrc}
                    alt="Profile avatar"
                    className={styles.avatar}
                    // Graceful fallback if no avatar exists yet
                    onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=User+${userId}&background=random`
                    }}
                />

                <div
                    className={styles.avatarOverlay}
                    onClick={() => inputRef.current?.click()}
                    role="button"
                    aria-label="Choose avatar image"
                >
                    <span className={styles.overlayText}>Change</span>
                </div>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <button className={styles.secondaryButton} onClick={() => inputRef.current?.click()} disabled={uploading}>
                Choose file
            </button>

            {selectedFile && <p className={styles.filename}>Selected: {selectedFile.name}</p>}

            {selectedFile && (
                <button
                    className={styles.primaryButton}
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading…' : 'Upload'}
                </button>
            )}

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.successMsg}>Avatar updated!</p>}
        </Container>
    )
}



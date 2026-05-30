import React, { useState, useRef, type ChangeEvent } from 'react'

interface AvatarUploadProps {
    userId: number
    /** Called with the new avatar URL after a successful upload */
    onUploadSuccess?: (avatarUrl: string) => void
}

// ─── Component ────────────

export function AvatarUpload({ userId, onUploadSuccess }: AvatarUploadProps) {
    // The URL shown in the <img> preview.
    // Starts as the server's current avatar (may be undefined if none set yet).
    const [previewSrc, setPreviewSrc] = useState<string>(`/api/profile/avatar/${userId}`)

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

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
            // "avatar" must match the multer field name on the server
            formData.append('avatar', selectedFile)

            const res = await fetch('/api/profile/avatar', {
                method: 'POST',
                // Do NOT set Content-Type manually — the browser must add the boundary
                headers: {
                    // Replace with your real auth header / cookie strategy
                    'x-user-id': String(userId)
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
        <div style={styles.container}>
            <h3 style={styles.heading}>Profile Picture</h3>

            {/* Avatar preview */}
            <div style={styles.avatarWrapper}>
                <img
                    src={previewSrc}
                    alt="Profile avatar"
                    style={styles.avatar}
                    // Graceful fallback if no avatar exists yet
                    onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=User+${userId}&background=random`
                    }}
                />
                {/* Clicking the overlay also opens the file picker */}
                <div
                    style={styles.avatarOverlay}
                    onClick={() => inputRef.current?.click()}
                    role="button"
                    aria-label="Choose avatar image"
                >
                    <span style={styles.overlayText}>Change</span>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            {/* Explicit "Choose file" button */}
            <button style={styles.secondaryButton} onClick={() => inputRef.current?.click()} disabled={uploading}>
                Choose file
            </button>

            {selectedFile && <p style={styles.filename}>Selected: {selectedFile.name}</p>}

            {/* Upload button — only shown after a file is chosen */}
            {selectedFile && (
                <button
                    style={uploading ? { ...styles.primaryButton, opacity: 0.6 } : styles.primaryButton}
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading…' : 'Upload'}
                </button>
            )}

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.successMsg}>Avatar updated!</p>}
        </div>
    )
}

// ─── Inline styles (replace with your own CSS / Tailwind as preferred) ────────

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '24px',
        maxWidth: '280px',
        fontFamily: 'sans-serif'
    },
    heading: {
        margin: 0,
        fontSize: '1rem',
        fontWeight: 600
    },
    avatarWrapper: {
        position: 'relative',
        width: 120,
        height: 120,
        borderRadius: '50%',
        overflow: 'hidden',
        cursor: 'pointer'
    },
    avatar: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    avatarOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.2s'
    },
    overlayText: {
        color: '#fff',
        fontSize: '0.85rem',
        fontWeight: 600,
        letterSpacing: '0.05em'
    },
    filename: {
        margin: 0,
        fontSize: '0.75rem',
        color: '#555',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    primaryButton: {
        width: '100%',
        padding: '8px 16px',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.9rem'
    },
    secondaryButton: {
        width: '100%',
        padding: '8px 16px',
        background: 'transparent',
        color: '#2563eb',
        border: '1.5px solid #2563eb',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.9rem'
    },
    error: {
        margin: 0,
        color: '#dc2626',
        fontSize: '0.8rem',
        textAlign: 'center'
    },
    successMsg: {
        margin: 0,
        color: '#16a34a',
        fontSize: '0.8rem'
    }
}

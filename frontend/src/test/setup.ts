import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('@/assets/lingoSpark-logo.svg', () => ({ default: 'lingoSpark-logo.svg' }))
vi.mock('@/assets/placeholder-profile-picture-1.png', () => ({ default: 'placeholder-profile-picture.png' }))

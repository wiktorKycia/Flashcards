/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native'

const tintColorLight = '#22c55e'
const tintColorDark = '#22c55e'

export const Colors = {
    light: {
        text: '#3c4a3e',
        textSecondary: '#5c6d5f',
        textButtons: '#e3f0e3',
        background: '#ffffff',
        surface: '#f0fff4',
        tint: tintColorLight,
        accent2: '#009e3b',
        accent3: '#007816',
        accent4: '#005400',
        accent5: '#003200',
        border: '#88d0d0',
        shadow: 'rgba(20, 120, 20, 0.5)',
        error: '#dc2626',
        danger: '#ef4444',
        icon: '#5c6d5f',
        tabIconDefault: '#5c6d5f',
        tabIconSelected: tintColorLight
    },
    dark: {
        text: '#e8f3ea',
        textSecondary: '#a0ada2',
        textButtons: '#e3f0e3',
        background: '#121613',
        surface: '#1e2621',
        tint: tintColorDark,
        accent2: '#16a34a',
        accent3: '#15803d',
        accent4: '#166534',
        accent5: '#1a3a1a',
        border: '#2a3d30',
        shadow: 'rgba(74, 222, 128, 0.2)',
        error: '#f87171',
        danger: '#dc2626',
        icon: '#a0ada2',
        tabIconDefault: '#a0ada2',
        tabIconSelected: tintColorDark
    }
}

export const Fonts = Platform.select({
    ios: {
        /** iOS `UIFontDescriptorSystemDesignDefault` */
        sans: 'system-ui',
        /** iOS `UIFontDescriptorSystemDesignSerif` */
        serif: 'ui-serif',
        /** iOS `UIFontDescriptorSystemDesignRounded` */
        rounded: 'ui-rounded',
        /** iOS `UIFontDescriptorSystemDesignMonospaced` */
        mono: 'ui-monospace'
    },
    default: {
        sans: 'normal',
        serif: 'serif',
        rounded: 'normal',
        mono: 'monospace'
    },
    web: {
        sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        serif: "Georgia, 'Times New Roman', serif",
        rounded:
            "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
        mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    }
})

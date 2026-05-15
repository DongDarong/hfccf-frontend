import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const primaryPalette = {
  0: '#ffffff',
  50: 'var(--brand-primary-50)',
  100: 'var(--brand-primary-100)',
  200: 'var(--brand-primary-200)',
  300: 'var(--brand-primary-300)',
  400: 'var(--brand-primary-400)',
  500: 'var(--brand-primary-500)',
  600: 'var(--brand-primary-600)',
  700: 'var(--brand-primary-700)',
  800: 'var(--brand-primary-800)',
  900: 'var(--brand-primary-900)',
  950: 'var(--brand-primary-950)',
}

const surfacePalette = {
  0: '#ffffff',
  50: 'var(--brand-surface-50)',
  100: 'var(--brand-surface-100)',
  200: 'var(--brand-surface-200)',
  300: 'var(--brand-surface-300)',
  400: 'var(--brand-surface-400)',
  500: 'var(--brand-surface-500)',
  600: 'var(--brand-surface-600)',
  700: 'var(--brand-surface-700)',
  800: 'var(--brand-surface-800)',
  900: 'var(--brand-surface-900)',
  950: 'var(--brand-surface-950)',
}

const HopePreset = definePreset(Aura, {
  semantic: {
    primary: primaryPalette,
    focusRing: {
      width: '3px',
      style: 'solid',
      color: 'color-mix(in srgb, var(--hope-cyan) 22%, transparent)',
      offset: '1px',
      shadow: 'none',
    },
    formField: {
      borderRadius: '0.75rem',
      paddingX: '0.875rem',
      paddingY: '0.625rem',
      focusRing: {
        width: '3px',
        style: 'solid',
        color: 'color-mix(in srgb, var(--hope-cyan) 18%, transparent)',
        offset: '0',
        shadow: 'none',
      },
    },
    colorScheme: {
      light: {
        surface: surfacePalette,
        primary: {
          color: 'var(--brand-primary-500)',
          contrastColor: '#ffffff',
          hoverColor: 'var(--brand-primary-600)',
          activeColor: 'var(--brand-primary-700)',
        },
        highlight: {
          background: 'var(--brand-primary-50)',
          focusBackground: 'var(--brand-primary-100)',
          color: 'var(--brand-primary-800)',
          focusColor: 'var(--brand-primary-900)',
        },
        formField: {
          background: '#ffffff',
          disabledBackground: 'var(--brand-surface-100)',
          filledBackground: 'var(--brand-surface-50)',
          filledHoverBackground: '#ffffff',
          filledFocusBackground: '#ffffff',
          borderColor: 'var(--brand-surface-300)',
          hoverBorderColor: 'var(--brand-surface-400)',
          focusBorderColor: 'var(--brand-primary-500)',
          invalidBorderColor: 'var(--hope-red)',
          color: 'var(--hope-dark)',
          disabledColor: 'var(--brand-surface-500)',
          placeholderColor: 'var(--brand-surface-500)',
          invalidPlaceholderColor: 'var(--hope-red)',
          iconColor: 'var(--brand-surface-500)',
          shadow: '0 1px 2px 0 rgb(15 23 42 / 0.04)',
        },
        text: {
          color: 'var(--hope-dark)',
          hoverColor: 'var(--brand-surface-900)',
          mutedColor: 'var(--brand-surface-600)',
          hoverMutedColor: 'var(--brand-surface-700)',
        },
        content: {
          background: '#ffffff',
          hoverBackground: 'var(--brand-surface-50)',
          borderColor: 'var(--brand-surface-200)',
          color: 'var(--hope-dark)',
          hoverColor: 'var(--hope-dark)',
        },
        overlay: {
          select: {
            background: '#ffffff',
            borderColor: 'var(--brand-surface-200)',
            color: 'var(--hope-dark)',
          },
          popover: {
            background: '#ffffff',
            borderColor: 'var(--brand-surface-200)',
            color: 'var(--hope-dark)',
          },
          modal: {
            background: '#ffffff',
            borderColor: 'var(--brand-surface-200)',
            color: 'var(--hope-dark)',
          },
        },
        list: {
          option: {
            focusBackground: 'var(--brand-surface-50)',
            selectedBackground: 'var(--brand-primary-50)',
            selectedFocusBackground: 'var(--brand-primary-100)',
            color: 'var(--hope-dark)',
            focusColor: 'var(--hope-dark)',
            selectedColor: 'var(--brand-primary-800)',
            selectedFocusColor: 'var(--brand-primary-900)',
          },
          optionGroup: {
            background: 'var(--brand-surface-50)',
            color: 'var(--brand-surface-700)',
          },
        },
      },
    },
  },
})

export default HopePreset

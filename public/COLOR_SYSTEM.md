# Clarivue Color System Documentation

## Overview

The Clarivue dashboard uses a sophisticated theming system built on CSS custom properties (CSS variables) with TypeScript utilities for type-safe Tailwind CSS class generation. The system supports:

- Multiple brand themes (Default, University, Corporate)
- Light and dark mode
- Semantic color tokens
- Dynamic theme switching

---

## Architecture

### Layer 1: CSS Custom Properties
Base theme defined in `/frontend/styles/theme.css`

### Layer 2: TypeScript Utilities
Helper functions in `/frontend/utils/colors.ts` for type-safe class generation

### Layer 3: Application
Usage via Tailwind CSS classes with CSS variable references

---

## Base Color Palette

### Brand Colors (Default Theme)

```typescript
{
  primary: '#102C64',    // Deep Navy Blue
  accent: '#FE686D',     // Coral Red
  secondary: '#C8A0FE',  // Light Purple
  tertiary: '#B8CCF4',   // Soft Blue
}
```

### Alternative Brand Themes

#### University Theme
```typescript
{
  primary: '#8B0000',    // Dark Red
  accent: '#FFD700',     // Gold
  secondary: '#4169E1',  // Royal Blue
  tertiary: '#87CEEB',   // Sky Blue
}
```

#### Corporate Theme
```typescript
{
  primary: '#1E3A8A',    // Professional Blue
  accent: '#10B981',     // Emerald Green
  secondary: '#8B5CF6',  // Violet
  tertiary: '#06B6D4',   // Cyan
}
```

---

## CSS Variable System

### Light Mode (Default)

#### Surface Colors
```css
--surface: #ffffff
--surface-hover: #f9fafb
--surface-active: #f3f4f6
```

#### Border Colors
```css
--border: #f3f4f6
--border-medium: #e5e7eb
--border-strong: #d1d5db
```

#### Text Colors
```css
--text-primary: #111827
--text-secondary: #4b5563
--text-tertiary: #6b7280
--text-muted: #9ca3af
```

#### Brand Colors (Default)
```css
--primary: #102C64
--primary-light: rgba(16, 44, 100, 0.1)
--primary-dark: #0a1e45

--accent: #FE686D
--accent-light: rgba(254, 104, 109, 0.1)
--accent-dark: #e54a4f

--secondary: #C8A0FE
--secondary-light: rgba(200, 160, 254, 0.1)
--secondary-dark: #a87de5

--tertiary: #B8CCF4
--tertiary-light: rgba(184, 204, 244, 0.1)
--tertiary-dark: #8fa9db
```

#### Semantic Colors
```css
--success: #059669
--success-light: #ecfdf5
--success-dark: #065f46

--warning: #d97706
--warning-light: #fffbeb
--warning-dark: #92400e

--danger: #dc2626
--danger-light: #fef2f2
--danger-dark: #991b1b
```

### Dark Mode

#### Surface Colors
```css
--surface: #1f2937
--surface-hover: #374151
--surface-active: #4b5563
```

#### Border Colors
```css
--border: #374151
--border-medium: #4b5563
--border-strong: #6b7280
```

#### Text Colors
```css
--text-primary: #f9fafb
--text-secondary: #d1d5db
--text-tertiary: #9ca3af
--text-muted: #6b7280
```

#### Brand Colors (Default Dark)
```css
--primary: #3b5998
--primary-light: rgba(59, 89, 152, 0.2)
--primary-dark: #4c6ab8

--accent: #ff8a8f
--accent-light: rgba(255, 138, 143, 0.2)
--accent-dark: #ff9ea3

--secondary: #d4b5ff
--secondary-light: rgba(212, 181, 255, 0.2)
--secondary-dark: #e0c9ff

--tertiary: #c8dcf8
--tertiary-light: rgba(200, 220, 248, 0.2)
--tertiary-dark: #d6e5fa
```

---

## TypeScript Utilities

### Background Classes
```typescript
backgrounds.primary          // bg-[var(--primary)]
backgrounds.accent          // bg-[var(--accent)]
backgrounds.secondary       // bg-[var(--secondary)]
backgrounds.tertiary        // bg-[var(--tertiary)]
backgrounds.primaryLight    // bg-[var(--primary-light)]
backgrounds.accentLight     // bg-[var(--accent-light)]
backgrounds.secondaryLight  // bg-[var(--secondary-light)]
backgrounds.tertiaryLight   // bg-[var(--tertiary-light)]
backgrounds.surface         // bg-[var(--surface)]
backgrounds.surfaceHover    // bg-[var(--surface-hover)]
```

### Border Classes
```typescript
borders.primary         // border-[var(--primary)]
borders.accent          // border-[var(--accent)]
borders.secondary       // border-[var(--secondary)]
borders.tertiary        // border-[var(--tertiary)]
borders.primaryLight    // border-[var(--primary-light)]
borders.accentLight     // border-[var(--accent-light)]
borders.secondaryLight  // border-[var(--secondary-light)]
borders.tertiaryLight   // border-[var(--tertiary-light)]
borders.default         // border-[var(--border)]
borders.medium          // border-[var(--border-medium)]
borders.strong          // border-[var(--border-strong)]
```

### Text Classes
```typescript
text.primary    // text-[var(--primary)]
text.accent     // text-[var(--accent)]
text.secondary  // text-[var(--secondary)]
text.tertiary   // text-[var(--tertiary)]
text.base       // text-[var(--text-primary)]
text.muted      // text-[var(--text-secondary)]
text.subtle     // text-[var(--text-tertiary)]
text.faint      // text-[var(--text-muted)]
text.success    // text-[var(--success)]
text.warning    // text-[var(--warning)]
text.danger     // text-[var(--danger)]
```

### Hover Classes
```typescript
hover.primary         // hover:bg-[var(--primary)]
hover.accent          // hover:bg-[var(--accent)]
hover.secondary       // hover:bg-[var(--secondary)]
hover.tertiary        // hover:bg-[var(--tertiary)]
hover.primaryLight    // hover:bg-[var(--primary-light)]
hover.accentLight     // hover:bg-[var(--accent-light)]
hover.secondaryLight  // hover:bg-[var(--secondary-light)]
hover.tertiaryLight   // hover:bg-[var(--tertiary-light)]
hover.surface         // hover:bg-[var(--surface-hover)]
```

### Gradient Classes
```typescript
gradients.primary   // from-[var(--primary)] to-[var(--secondary)]
gradients.accent    // from-[var(--accent)] to-[var(--secondary)]
gradients.secondary // from-[var(--secondary)] to-[var(--tertiary)]
gradients.tertiary  // from-[var(--tertiary)] to-[var(--primary)]
gradients.success   // from-[var(--success-light)] to-[var(--surface)]
```

### Card Styles
```typescript
cardStyles.primary         // Gradient primary card with white text
cardStyles.accent          // Gradient accent card with white text
cardStyles.secondary       // Gradient secondary card with white text
cardStyles.tertiary        // Gradient tertiary card with white text
cardStyles.primaryLight    // Light primary card with border
cardStyles.accentLight     // Light accent card with border
cardStyles.secondaryLight  // Light secondary card with border
cardStyles.tertiaryLight   // Light tertiary card with border
```

### Semantic Tokens
```typescript
semantic.surface          // Background surface
semantic.border           // Default border
semantic.borderMedium     // Medium border
semantic.borderStrong     // Strong border
semantic.textPrimary      // Primary text
semantic.textSecondary    // Secondary text
semantic.textTertiary     // Tertiary text
semantic.textMuted        // Muted text

semantic.bgSubtle         // Subtle background
semantic.bgHover          // Hover background

semantic.success          // Success text
semantic.successBg        // Success background
semantic.successBorder    // Success border
semantic.successGradient  // Success gradient

semantic.warning          // Warning text
semantic.warningBg        // Warning background
semantic.warningBorder    // Warning border
semantic.highlight        // Highlight (warning-based)

semantic.danger           // Danger text
semantic.dangerBg         // Danger background
semantic.dangerBorder     // Danger border
```

---

## Usage Examples

### Basic Card Component
```tsx
import { backgrounds, borders, text, shadows } from '@/utils/colors';

<div className={`
  ${backgrounds.surface} 
  ${borders.default} 
  border 
  rounded-xl 
  p-6 
  ${shadows.sm}
`}>
  <h2 className={text.base}>Card Title</h2>
  <p className={text.muted}>Card description</p>
</div>
```

### Gradient Card
```tsx
import { cardStyles } from '@/utils/colors';

<div className={`${cardStyles.primary} rounded-xl p-6`}>
  <h2>Gradient Card</h2>
</div>
```

### Button with Hover
```tsx
import { backgrounds, hover, text } from '@/utils/colors';

<button className={`
  ${backgrounds.primary} 
  ${hover.primaryLight} 
  ${text.base} 
  px-4 
  py-2 
  rounded-lg
`}>
  Click Me
</button>
```

### Status Badge
```tsx
import { semantic } from '@/utils/colors';

<div className={`
  ${semantic.successBg} 
  ${semantic.successBorder} 
  ${semantic.success} 
  border 
  px-3 
  py-1 
  rounded-full 
  text-sm
`}>
  Active
</div>
```

### Custom Gradient
```tsx
import { gradients } from '@/utils/colors';

<div className={`
  bg-gradient-to-r 
  ${gradients.accent} 
  p-8 
  rounded-2xl
`}>
  Gradient Content
</div>
```

---

## Theme Switching

### Setting Brand Theme
Add `data-brand` attribute to the root element:
```html
<html data-brand="default">   <!-- Default theme -->
<html data-brand="university"> <!-- University theme -->
<html data-brand="corporate">  <!-- Corporate theme -->
```

### Setting Dark Mode
Add `dark` class to the root element:
```html
<html class="dark">
```

### Combined Example
```html
<html class="dark" data-brand="corporate">
```

---

## Best Practices

### 1. Use Semantic Tokens
Prefer semantic tokens over direct color references:
```tsx
// ✅ Good
<div className={semantic.surface}>

// ❌ Avoid
<div className="bg-white">
```

### 2. Maintain Theme Consistency
Use the color utilities instead of arbitrary Tailwind classes:
```tsx
// ✅ Good
<div className={backgrounds.primary}>

// ❌ Avoid
<div className="bg-[#102C64]">
```

### 3. Leverage CSS Variables
When creating custom components, use CSS variables:
```css
.custom-component {
  background: var(--primary);
  color: var(--text-primary);
}
```

### 4. Test in Multiple Themes
Always verify components work across:
- All brand themes (default, university, corporate)
- Light and dark modes
- Different viewport sizes

### 5. Use TypeScript Utilities
Import and use the type-safe utilities:
```tsx
import { backgrounds, borders, text, semantic } from '@/utils/colors';
```

---

## Color Accessibility

### Contrast Ratios
All color combinations meet WCAG 2.1 AA standards:
- Primary text: 7:1 minimum contrast
- Secondary text: 4.5:1 minimum contrast
- Interactive elements: 3:1 minimum contrast

### Testing Tools
- Chrome DevTools Color Picker
- axe DevTools
- WAVE Browser Extension

---

## Migration Guide

### From Hardcoded Colors
```tsx
// Before
<div className="bg-blue-900 text-white">

// After
import { backgrounds, text } from '@/utils/colors';
<div className={`${backgrounds.primary} ${text.base}`}>
```

### From Inline Styles
```tsx
// Before
<div style={{ backgroundColor: '#102C64' }}>

// After
import { backgrounds } from '@/utils/colors';
<div className={backgrounds.primary}>
```

---

## Shadow System

```typescript
shadows.sm  // shadow-sm  - Subtle shadows
shadows.md  // shadow-md  - Medium depth
shadows.lg  // shadow-lg  // Strong depth
```

---

## File References

- **CSS Theme**: `/frontend/styles/theme.css`
- **Color Utilities**: `/frontend/utils/colors.ts`
- **Theme Provider**: `/frontend/contexts/ThemeContext.tsx`
- **App Entry**: `/frontend/App.tsx`

---

## Support

For questions or issues with the color system:
1. Check this documentation
2. Review `/frontend/utils/colors.ts` for available utilities
3. Inspect `/frontend/styles/theme.css` for CSS variable definitions
4. Test in browser DevTools to verify computed values

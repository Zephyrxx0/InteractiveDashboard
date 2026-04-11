# Interactive Dashboard Design System

This document outlines the semantic design system and visual language used throughout the Interactive Dashboard. It is designed to be vibrant, high-fidelity, and strictly typed via Tailwind CSS and OKLCH color tokens.

## Design Philosophy
The dashboard combines **Brutalist structure** (sharp edges, solid offset shadows) with **High-Fidelity Vibrant Accents** (Teal, Red, Emerald) and a clean **White Primary** surface. It prioritizes information density and data clarity through strong typography and grid-based layouts.

## Color Tokens

### Surface & Neutral
- **Background**: `oklch(0.98 0.005 0)` (#FAFAFA) - Ultra-clean slate base.
- **Foreground**: `oklch(0.20 0.02 250)` (#1E293B) - Slate charcoal for primary readability.
- **Muted**: `oklch(0.96 0.005 250)` (#F1F5F9) - Soft grays for backgrounds and secondary containers.
- **Border**: `oklch(0.90 0.005 250)` (#E2E8F0) - Defined, low-contrast separators.

### Semantic Accents
- **Primary (Surface)**: `oklch(1 0 0)` (#FFFFFF) - Pure white for card surfaces.
- **Secondary (Action)**: `oklch(0.58 0.22 25)` (#DC2626) - Vibrant red for focus, alerts, and primary interactive elements.
- **Tertiary/Accent**: `oklch(0.70 0.16 195)` (#0EA5E9) - Teal/Cyan for info and informational badges.
- **Success**: `oklch(0.68 0.18 155)` (#22C55E) - Emerald green for positive trends.
- **Warning**: `oklch(0.75 0.16 85)` (#F59E0B) - Amber gold for attention.

## Typography
The system uses a tri-font-family approach to distinguish information layers:

| Usage | Font Family | Character |
|-------|-------------|-----------|
| **Display** | Space Grotesk | Playful, bold, high-contrast. Used for large headings and KPIs. |
| **Sans** | Inter | Clean, professional, high legibility. Used for primary UI text. |
| **Mono** | IBM Plex Mono | Structured, technical. Used for data labels, status codes, and tags. |

## Layout & Components

### Cards & Grid
- **Radius**: Tight `4px` (Small/Medium) for a precision-engineered look.
- **Shadows**: **Brutalist Stack** (`4px 4px 0px 0px`) using the border color. Hover states transition to solid accent colors.
- **Grid System**: Use of `grid-bg` (40px square grid) for background depth and organizational alignment.

### UI Accents
- **Glassmorphism**: Subtle `backdrop-blur-md` on navigation sheets and floating modals.
- **Status Badges**: Semi-transparent backgrounds with high-contrast text and solid dot indicators.
- **KPI Modules**: High-impact bold display values with mono-font trend indicators.

## Animation Guidelines
- **Transitions**: Smooth `150ms` ease-in-out for hover states and color changes.
- **Dynamic**: Use of AnimeJS for coordinated dashboard entry sequences and data-bound status pulses.

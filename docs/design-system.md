# Bavilivre UI/UX Design System

This document defines the shared visual and interaction conventions used by Bavilivre.

The goal is to keep Sprint 5 pages visually consistent and avoid redefining local UI rules in each component.

## 1. Visual direction

Bavilivre uses a modern, calm and slightly botanical visual identity.

Main principles:

- Violet for the main brand identity and primary actions
- Eucalyptus green for secondary tones, positive states and subtle surfaces
- Floral pink as a limited accent color
- Amber for warnings and unavailable states
- Red only for errors and destructive actions
- Light, low-density surfaces with clear hierarchy
- Material 3 components as the main UI foundation

## 2. Material 3 color system

Main palette:

| Role           | Color                    |
|----------------|--------------------------|
| Primary        | `#8256A3`                |
| Secondary      | `#607568`                |
| Tertiary       | `#D94F8A`                |
| Page surface   | `#F6FBF3`                |
| Subtle surface | `#F4FFF6`                |
| Error          | Material 3 error palette |

The generated Material palette is stored in:

`src/styles/_theme-colors.scss`

This generated file should not be edited manually.

Application semantic colors are defined in:

`src/styles/_colors.scss`

Use `--app-*` variables for application-specific semantic colors and `--mat-sys-*` variables for Material roles.

Avoid hard-coded UI colors inside component styles.

## 3. Typography

Bavilivre uses Roboto with the Material 3 typography scale.

| Usage              | Material role     |
|--------------------|-------------------|
| Page title         | `headline-medium` |
| Section title      | `title-large`     |
| Card title         | `title-medium`    |
| Body text          | `body-medium`     |
| Supporting text    | `body-small`      |
| Labels and buttons | `label-large`     |

Reusable typography conventions are defined in:

`src/styles/_typography.scss`

Avoid arbitrary font sizes when an existing Material typography role fits the content.

## 4. Spacing

Shared spacing tokens are defined in:

`src/styles/_tokens.scss`

Available scale:

`0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.25rem`, `1.5rem`, `2rem`, `2.5rem`, `3rem`.

Prefer these tokens instead of introducing new local spacing values.

## 5. Border radius

Standard radius tokens:

| Usage                | Token            |
|----------------------|------------------|
| Small controls       | `$radius-small`  |
| Cards and containers | `$radius-medium` |
| Large surfaces       | `$radius-large`  |
| Status chips         | `999px`          |

Border radius tokens are defined in `_tokens.scss`.

## 6. Surfaces and elevation

Use light surfaces and limited elevation.

Main conventions:

- Page background → `--app-surface-page`
- Cards → `--app-surface-card`
- Subtle toolbars and controls → `--app-surface-subtle`
- Borders → `--app-border`
- Elevated surfaces should use the shared shadow tokens from `_tokens.scss`

Avoid unnecessary shadows. Borders and surface contrast are preferred for normal cards.

## 7. Layout

Default content width:

`75rem`

Shared layout is provided by the global `.container` class.

Use logical CSS properties whenever possible:

- `margin-inline`
- `padding-inline`
- `inset-inline-start`
- `inset-inline-end`

This allows the same styles to work in LTR and RTL layouts.

## 8. Buttons

Shared button styles are defined in:

`src/styles/_buttons.scss`

Variants:

| Variant                     | Usage                                |
|-----------------------------|--------------------------------------|
| `app-button--primary`       | Main action                          |
| `app-button--secondary`     | Back, cancel, secondary action       |
| `app-button--tertiary`      | Complementary non-destructive action |
| `app-button--danger`        | Destructive action                   |
| `app-button--danger-filled` | Critical destructive confirmation    |

Prefer one dominant primary action per interaction area.

Buttons must provide hover, focus and disabled states.

## 9. Statuses

Shared status styles are defined in:

`src/styles/_statuses.scss`

Variants:

- `app-status--available` → green
- `app-status--unavailable` → amber
- `app-status--archived` → violet

Unavailable is not considered an error.

Red is reserved for actual errors and destructive actions.

## 10. Forms and controls

Prefer Angular Material controls over native equivalents when a Material component exists.

Current conventions include:

- `mat-form-field`
- `matInput`
- `mat-select`
- `mat-checkbox`
- `mat-menu`

Form errors use `mat-error`.

Application-wide Material customizations are defined in:

`src/styles/_material-overrides.scss`

Dropdowns and menus use the Bavilivre eucalyptus surface and interaction colors.

## 11. Interaction states

Interactive components must define appropriate states:

- Hover
- Keyboard focus
- Active
- Selected
- Disabled
- Success
- Warning
- Error

Keyboard focus must remain clearly visible.

Use `:focus-visible` when custom focus styling is required.

Do not rely only on color to communicate critical information.

## 12. Accessibility

Bavilivre must maintain:

- Sufficient text/background contrast
- Visible keyboard focus
- Accessible form labels and errors
- Semantic HTML
- Screen-reader announcements when appropriate
- Keyboard-accessible menus and controls

Use `role="alert"` for important dynamically displayed errors.

Use `aria-live="polite"` for non-urgent dynamic information when appropriate.

## 13. LTR and RTL

Bavilivre supports:

- French
- English
- German
- Persian

Persian uses RTL; the other supported languages use LTR.

Language changes update the document direction dynamically without reloading the application.

Angular CDK direction and the document `dir` attribute are synchronized.

Component styles should prefer logical properties rather than hard-coded `left` and `right`.

Material overlays such as menus and selects must work correctly in both directions.

## 14. Design system source files

The shared design system is organized under:

`src/styles/`

Main files:

- `_theme-colors.scss` — generated Material 3 palettes
- `_colors.scss` — semantic application colors
- `_tokens.scss` — spacing, radius, width, transitions and shadows
- `_typography.scss` — typography conventions
- `_buttons.scss` — shared buttons
- `_statuses.scss` — shared status indicators
- `_layout.scss` — common layout rules
- `_material-overrides.scss` — shared Angular Material overrides

New Sprint 5 pages should reuse these conventions instead of introducing duplicated local visual rules.

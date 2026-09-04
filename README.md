# Bavilivre Frontend

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular%20Material-Material%203-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

![RxJS](https://img.shields.io/badge/RxJS-B7178C?logo=reactivex&logoColor=white)
![Sass](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)

![i18n](https://img.shields.io/badge/i18n-FR%20%7C%20EN%20%7C%20DE%20%7C%20FA-555555)
![LTR / RTL](https://img.shields.io/badge/Layout-LTR%20%2F%20RTL-555555)

Frontend de **Bavilivre**, une plateforme web multilingue de partage de livres entre particuliers.

Le projet est développé avec **Angular 21** et repose sur une architecture frontend moderne utilisant notamment les **standalone components**, le **routing Angular**, les **services HTTP**, les **signals**, l’authentification JWT et **Angular Material 3**.

Le backend Spring Boot est développé séparément :

- Backend repository:  
  [https://github.com/Shahinbavili/Bavilivre-backend](https://github.com/Shahinbavili/Bavilivre-backend)

---

## Technologies

- Angular 21
- Angular Material 3
- Angular CDK
- TypeScript
- RxJS
- Angular Router
- Angular HTTP Client
- Standalone Components
- Signals
- SCSS
- TailwindCSS
- ngx-translate
- HTML5
- CSS3

---

## Project Goals

Bavilivre Frontend est conçu pour :

- construire une interface moderne pour une application full-stack réelle
- pratiquer Angular moderne avec standalone components et signals
- intégrer une API REST Spring Boot
- gérer l’authentification et les routes protégées
- proposer une interface multilingue
- supporter les langues FR / EN / DE / FA
- supporter dynamiquement les layouts LTR et RTL
- construire un système UI/UX cohérent avec Material 3
- maintenir une architecture frontend claire et évolutive

---

## Architecture

Le projet suit une organisation modulaire par fonctionnalités.

### `features`

Contient les fonctionnalités métier de l’application.

Exemples :

- authentication
- book catalog
- book details
- add / edit book
- my books
- archived books
- borrowed books
- lent books

---

### `core`

Contient les services et mécanismes globaux de l’application.

Exemples :

- authentication service
- API services
- HTTP interceptors
- route guards
- global application state
- application configuration

---

### `shared`

Contient les éléments réutilisables de l’interface.

Exemples :

- application layout
- header
- reusable components
- loading states
- shared UI elements
- utility helpers

---

### `assets/i18n`

Contient les fichiers de traduction.

Langues supportées :

- French (`fr`)
- English (`en`)
- German (`de`)
- Persian / Farsi (`fa`)

Le persan utilise automatiquement une mise en page **RTL**, tandis que les autres langues utilisent **LTR**.

Le changement de direction est appliqué dynamiquement sans rechargement de l’application.

---

### `styles`

Contient le système de styles partagé de Bavilivre.

Principaux fichiers :

- `_theme-colors.scss` — palettes Material 3 générées
- `_colors.scss` — couleurs sémantiques de l’application
- `_tokens.scss` — spacing, radius, widths, transitions et shadows
- `_typography.scss` — conventions typographiques
- `_buttons.scss` — boutons partagés
- `_statuses.scss` — états Available / Unavailable / Archived
- `_layout.scss` — règles de layout communes
- `_material-overrides.scss` — personnalisations globales Angular Material

---

## Current Features

### Authentication

- User registration
- User login
- JWT authentication
- Authentication persistence
- Current user loading
- Protected routes
- Automatic logout when authentication becomes invalid
- Authentication error handling

---

### Book Catalog

- Paginated catalog
- Search
- Sorting
- Language filtering
- Category filtering
- Availability filtering
- Configurable page size
- Book details page
- Ownership-aware actions

---

### User Library

- My Books
- Add Book
- Edit Book
- Archive Book
- Archived Books
- Restore archived books
- Borrowed Books
- Lent Books

Management actions are kept on the book details pages rather than catalog cards.

---

### Internationalization

- ngx-translate configuration
- French, English, German and Persian translations
- Global language switcher
- Selected language persistence
- Dynamic LTR / RTL switching
- RTL support for Angular Material menus and controls

---

### Angular Material UI

The application uses Angular Material 3 as its main UI foundation.

Implemented components include:

- Material form fields
- Material inputs
- Material selects
- Material checkboxes
- Material menus
- Material icons
- Accessible keyboard focus states

Native form controls are progressively replaced by their Material equivalents when appropriate.

---

## Design System

Bavilivre uses a dedicated **Material 3 UI/UX design system** to keep pages and components visually consistent.

The design direction combines:

- violet for the main brand identity and primary actions
- eucalyptus green for subtle surfaces, selections and positive states
- floral pink as a limited accent color
- amber for warnings and unavailable states
- red for errors and destructive actions

The design system defines:

- Material 3 color palettes
- semantic color roles
- typography conventions
- spacing tokens
- border-radius conventions
- surfaces and elevation
- page widths
- buttons
- statuses
- form controls
- menus and dropdown states
- hover, focus, selected and disabled states
- accessibility conventions
- LTR / RTL rules

Full documentation:

[View the Bavilivre Design System](docs/design-system.md)

---

## Backend Integration

The frontend communicates with the Spring Boot backend through REST APIs.

Default local backend URL:

```text
http://localhost:8080
```

The Angular environment configuration is used as the API base URL.

Example:

```ts
this.http.get(`${environment.apiBaseUrl}/api/books`);
```

---

## Run the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

Then open:

```text
http://localhost:4200
```

---

## Build

Create a production build:

```bash
ng build
```

---

## Tests

Run frontend tests:

```bash
ng test
```

---

## Development Principles

Bavilivre is developed progressively with a focus on:

- clean Angular architecture
- reusable components
- real backend integration
- maintainable code
- Material 3 consistency
- responsive design
- multilingual support
- LTR / RTL compatibility
- accessibility
- readable commits
- GitHub Issues and milestones
- incremental delivery and refactoring

Visual rules should preferably come from the shared design system rather than being redefined locally inside individual components.

---

## Next Steps

Upcoming frontend work includes:

- continue Sprint 5 page redesigns using the shared design system
- refine responsive layouts
- improve UX and interaction feedback
- complete accessibility checks
- improve error and loading states
- continue frontend testing
- prepare production deployment
- improve project documentation and portfolio presentation

---

## Author

**Shahin Bavili**

Full Stack Developer — Java / Spring Boot / Angular

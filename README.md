# Bavilivre Frontend

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?logo=reactivex&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-FR%20%7C%20EN%20%7C%20DE%20%7C%20FA-blue)
![RTL](https://img.shields.io/badge/RTL-Persian%20Support-purple)

Frontend de **Bavilivre**, une plateforme web multilingue de partage de livres entre particuliers.

Ce projet est développé avec **Angular 21** dans une approche moderne basée sur les **standalone components**, le **routing Angular**, les **services HTTP**, les **signals** et une structure frontend évolutive.

Le backend Spring Boot est développé séparément :

- Backend repository:  
  https://github.com/Shahinbavili/Bavilivre-backend

---

# Technologies

- Angular 21
- TypeScript
- RxJS
- Angular Router
- Angular HTTP Client
- Standalone Components
- Signals
- TailwindCSS
- ngx-translate
- HTML5
- CSS3

---

# Project Goals

Bavilivre Frontend est conçu pour :

- construire une interface moderne pour une application full-stack réelle
- pratiquer Angular moderne avec standalone components et signals
- intégrer une API REST Spring Boot
- gérer une interface multilingue
- supporter les langues FR / EN / DE / FA
- préparer le support RTL pour le persan
- construire une base frontend maintenable et évolutive

---

# Architecture

Le projet suit une organisation modulaire par fonctionnalités.

## Structure principale

### `features`

Contient les fonctionnalités métier de l’application.

Exemples :

- borrowed books
- lent books
- book catalog
- authentication
- user area

---

### `core`

Contient les services globaux et la configuration centrale.

Exemples :

- API services
- HTTP configuration
- shared application logic
- global providers

---

### `shared`

Contient les éléments réutilisables.

Exemples :

- reusable components
- pipes
- shared UI elements
- utility helpers

---

### `assets/i18n`

Contient les fichiers de traduction.

Langues prévues :

- French (`fr`)
- English (`en`)
- German (`de`)
- Persian / Farsi (`fa`)

---

# Current Features

## Book Sharing UI

- Borrowed books page
- Lent books page
- Backend API integration
- Display backend data in Angular components

---

## Internationalization

- ngx-translate configuration
- Translation files structure
- Language switcher
- Selected language persistence
- Persian RTL support preparation

---

## Angular Modern Practices

- Standalone components
- Lazy-loaded routes
- Angular services
- HTTP client integration
- Signals for component state
- Clean component structure

---

# Backend Integration

The frontend communicates with the Spring Boot backend through REST APIs.

Default local backend URL:

```ts
http://localhost:8080
```
Example API usage:
```ts
this.http.get('http://localhost:8080/users/1/borrowed-books');
```

---

### Run the Project

Install dependencies:
```bash
npm install
```
Start development server:
```bash
ng serve
```
Then open:
http://localhost:4200

---

### Build
```bash
ng build
```
### Tests
```bash
ng test
```

---

## Development Notes

This frontend is part of the full-stack Bavilivre project.

The project is developed progressively with a focus on:

* clean Angular structure
* real backend integration
* multilingual support
* maintainable routing
* readable commits
* GitHub Issues and milestones

---

## Next Steps

* Improve book catalog pages
* Add login/register UI
* Integrate JWT authentication
* Add protected routes
* Improve error/loading states
* Add pagination for book lists
* Polish responsive UI
* Prepare production deployment

---

## Author

Shahin Bavili

Full Stack Developer — Java / Spring Boot / Angular

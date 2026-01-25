# Project Documentation - Blog Network

This document outlines the major updates, architecture modernizations, and feature implementations performed on the Blog Network project.

## Core Mandates Addressed
- **Replaced Emojis with Material Icons:** All emojis and `lucide-angular` icons have been replaced with standard Material Design icons for a professional look.
- **Signal-Based State Management:** Migrated from legacy `BehaviorSubject` patterns to modern Angular Signals for reactive state.
- **Real Media Uploads:** Implemented a full backend/frontend flow for local image uploads, moving away from simple URL strings.
- **Form Validation:** Integrated Reactive Forms with real-time validation for authentication flows.

---

## 1. Backend Improvements (Spring Boot)

### Media Upload System
- **Controller:** `MediaController.java`
- **Endpoints:**
  - `POST /api/media/upload`: Accepts `MultipartFile`, generates a unique UUID-based filename, and stores it in the `uploads/` directory.
  - `GET /api/media/files/{filename}`: Publicly serves uploaded images with appropriate content-type probing.
- **Security:** Updated `SecurityConfig.java` to permit public access to uploaded assets while keeping upload endpoints protected.

### Feed Logic
- Enhanced `PostController` to correctly handle user feeds by combining posts from the current user and their followed authors using `FollowRepository`.

---

## 2. Frontend Modernization (Angular 21)

### State Management & Reactivity
- **Signals Migration:** 
  - `AuthService`: Uses `signal` for `currentUser` and `loggedIn` status.
  - `ThemeService`: Uses `signal` for `isDark` mode with a reactive `effect()` to sync state to `localStorage`.
- **Dependency Injection:** Adopted the `inject()` function across all components and services for cleaner, constructor-free classes.

### UI/UX & Components
- **Notifications:** A new `NotificationService` utilizing `MatSnackBar` provides consistent toast feedback for user actions (success/error).
- **Reactive Forms:** `LoginComponent` and `SignupComponent` now use `FormGroup` and `Validators` to ensure data integrity before submission.
- **Image Handling:** Centralized `getFullImageUrl()` logic to dynamically resolve backend-stored files vs. external URLs.

### Feature Updates
- **Post Editor:** Now includes a file upload button that communicates with the new Backend Media API. Shows an immediate preview of the uploaded header image.
- **Navigation Flow:** Publishing a post now triggers an automatic redirect to the feed with a success notification.

---

## 3. Tooling & Dependencies

### Added
- `@angular/material`: For `MatSnackBar` and `MatIcon`.
- `spring-boot-starter-validation`: For backend DTO validation.

### Removed / Deprecated
- `lucide-angular`: Replaced by `MatIcon` to reduce bundle size and complexity.
- Legacy `FormsModule` patterns in auth components (replaced by `ReactiveFormsModule`).

---

## 4. How to Run

### Backend
1. Ensure a `uploads/` folder exists at the root of the backend directory.
2. Run via Maven: `./mvnw spring-boot:run`.

### Frontend
1. Install dependencies: `npm install`.
2. Start development server: `npm start`.
3. Open `http://localhost:4200`.

---

*Document generated on January 24, 2026.*

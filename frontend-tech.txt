# Frontend Technology Stack & Implementation Details

## Core Framework
- **Angular v21:** The project uses a very forward-looking version of Angular.
- **Standalone Components:** All components are `standalone: true`, removing the need for `NgModule` complexity.
- **Server-Side Rendering (SSR):** Enabled via `@angular/ssr` and Express.js, improving initial load performance and SEO.

## Language & Runtime
- **TypeScript (~5.9):** Strongly typed JavaScript for type safety and better tooling.
- **Node.js:** Runtime environment for the SSR server and build tools.

## State Management
- **Angular Signals:** The primary method for state management.
  - Used `signal()` for reactive state (e.g., `currentUser`, `isDark` theme).
  - Used `computed()` for derived state.
  - Used `effect()` for side effects like syncing theme to `localStorage`.
- **RxJS:** Used for handling asynchronous streams (HTTP requests, Router events).
  - `Observables` and `Subscriptions` in Services and Components.
  - `toObservable` helper to bridge Signals and RxJS.

## Styling & UI
- **SCSS (Sass):** Custom styling with variables, mixins, and nesting.
- **Angular Material:**
  - `MatDialog`: For popups like the "Report User" modal.
  - `MatSnackBar`: For toast notifications (success/error messages).
  - `MatIcon`: For scalable SVG icons throughout the app.
- **Responsive Design:** Custom grid layouts (CSS Grid) and Flexbox used for mobile-responsiveness.
- **Dark Mode:** Fully implemented using CSS variables and a wrapper class (`.theme-dark`).

## Routing & Navigation
- **Angular Router:** Handles client-side navigation.
- **Guards:** `AdminGuard` protects the `/dashboard` route.
- **Lazy Loading:** Implied by the routing structure for better performance.

## Forms & Validation
- **Reactive Forms:** Used in Login and Signup for robust validation logic (`FormGroup`, `Validators`).
- **Template-Driven Forms:** Used for simpler interactions like posting comments or editing profiles (`[(ngModel)]`).

## HTTP & Data
- **HttpClient:** Used for all API communication.
- **Interceptors:** `AuthInterceptor` automatically attaches the JWT Bearer token to every outgoing request.

## Third-Party Libraries
- **ngx-markdown:** Renders the blog post content from Markdown text to HTML.

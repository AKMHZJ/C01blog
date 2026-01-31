# Blog Network Project - Roadmap & Progress

## ✅ Completed Requirements
- [x] **Post Publishing:** Automatic redirect to home and post list refresh after publishing.
- [x] **Auth Validation:** Added Reactive Forms with validation for Register and Login pages.
- [x] **Notifications:** Integrated `MatSnackBar` for toast notifications on success/error.
- [x] **Modern Icons:** Replaced emojis and Lucide with Angular Material Icons.
- [x] **Tech Stack Modernization:** 
    - Migrated to Angular 21 with Signals.
    - Consistently used `inject()` for dependency injection.
    - Adopted `provideAnimationsAsync()` for optimized performance.
- [x] **Media System:** Implemented a full backend file upload system (UUID-based storage) and removed hardcoded URLs.
- [x] **Style Overhaul:** Completely removed Tailwind CSS and replaced it with clean, custom SCSS and Material components.
- [x] **Post Visibility:** Hidden posts are now completely invisible to everyone (including authors) and all actions (like, comment, edit, delete) are blocked server-side.
- [x] **Email Validation:** Enforced strict regex validation for emails (must end in .com).
- [x] **Toast Notifications:** Replaced browser alerts with toast notifications for comment/post actions.
- [x] **404 Handling:** Implemented a dedicated "Page Not Found" component and handled invalid post IDs.
- [x] **Admin Guard:** unauthorized access to admin routes now triggers a toast notification and redirects to feed.

## 🛠 Backend Polish (Completed)
- [x] Refactored `PostController` to remove debug statements.
- [x] Added role-change safety in `AdminController`.
- [x] Configured multipart upload limits in `application.properties`.
- [x] Integrated `MediaController` for secure asset serving.

## 🚀 Final Verification
- [x] Fix TypeScript type safety errors in templates.
- [x] Increase build budgets for production assets.
- [x] Documentation of all major changes in `PROJECT_DOCUMENTATION.md`.

## 📌 Future Refinements (Technical Debt)
- [ ] Implement image compression on the backend before storage.
- [ ] Add unit tests for the Signal-based services.
- [ ] Implement a full "Profile Edit" page for users to change avatars/bios.
- [ ] Add a "Forgot Password" email flow.
- [ ] Use a cloud provider (S3/Cloudinary) for media storage in production.
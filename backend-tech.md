# Backend Technology Stack & Implementation Details

## Core Framework
- **Spring Boot:** The primary framework used for rapid application development.
- **Java (17+):** The programming language. Uses modern features like `record` (DTOs) and functional patterns.
- **Maven:** Dependency management and build tool.

## Database & Data Access
- **PostgreSQL:** The relational database management system.
- **Spring Data JPA:** Used for database interactions, abstracting SQL queries into Repository interfaces.
- **Hibernate:** The JPA implementation handling Object-Relational Mapping (ORM).

## Security & Authentication
- **Spring Security 6+:** robust security framework handling authentication and authorization.
- **JWT (JSON Web Token):** Implements stateless authentication.
  - Users receive a token upon login.
  - Token is validated via a custom `JwtAuthenticationFilter` on every request.
- **BCrypt:** Cryptographic hashing algorithm used to securely store passwords.
- **Role-Based Access Control (RBAC):**
  - `@PreAuthorize` or `requestMatchers` used to restrict endpoints (e.g., `/api/admin/**` is for ADMIN only).
- **CORS:** Global configuration to allow requests from the Angular frontend (`localhost:4200`).

## Architecture (Layers)
1.  **Controller Layer:** Handles HTTP requests (`@RestController`) and returns JSON responses (`ResponseEntity`).
2.  **Service Layer:** Contains business logic (`@Service`), transaction management (`@Transactional`).
3.  **Repository Layer:** Interfaces extending `JpaRepository` for DB operations.
4.  **DTOs (Data Transfer Objects):** Java Records (e.g., `LoginRequest`, `PostDto`) used to carry data between processes, ensuring the internal Entity structure isn't exposed directly.

## Cloud & Storage
- **Cloudinary:** External cloud service used for storing user-uploaded images and videos.
  - The backend receives the file, uploads it to Cloudinary using their API, and stores the resulting URL in the database.

## Validation
- **Jakarta Validation:** Annotations like `@NotNull`, `@Email`, `@Size` used in DTOs to ensure data integrity before processing.

## Key APIs
- **Post API:** CRUD operations for posts, feed generation (logic to fetch posts from followed users).
- **Auth API:** Signup and Login endpoints.
- **Admin API:** Specialized endpoints for user management, banning, and content moderation.

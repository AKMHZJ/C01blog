# Potential Interview Questions for 01Blog Project

## General / Architecture
1.  **Why did you choose a microservices/monolithic architecture?**
    *   *Hint:* This is a monolithic fullstack app. You chose it for simplicity, ease of deployment, and because the scale didn't yet require microservices.
2.  **Explain the data flow when a user creates a post.**
    *   *Answer:* Frontend sends POST request -> AuthInterceptor adds Token -> Spring Security validates Token -> Controller receives DTO -> Service handles logic (upload media, save entity) -> Repository saves to DB -> Response sent back.

## Frontend (Angular)
3.  **Why did you use Angular Signals instead of just RxJS BehaviorSubjects?**
    *   *Answer:* Signals provide a simpler, granular way to handle reactivity without managing subscriptions manually. They improve change detection performance.
4.  **What is the purpose of the `inject()` function?**
    *   *Answer:* It replaces constructor dependency injection, making the code cleaner and allowing functions (not just classes) to use dependency injection.
5.  **How are you handling user authentication on the client side?**
    *   *Answer:* We store the JWT token in `localStorage`. The `AuthService` manages the state, and an HTTP Interceptor attaches the token to every request header.
6.  **What is Server-Side Rendering (SSR) and why is it enabled?**
    *   *Answer:* SSR renders the HTML on the server before sending it to the client. This improves SEO (search engines can read the content) and First Contentful Paint (perceived speed).

## Backend (Spring Boot)
7.  **How does JWT authentication work in your application?**
    *   *Answer:* The server signs a token with a secret key upon login. It doesn't store session state. On subsequent requests, the server validates the signature of the incoming token to identify the user.
8.  **Why use DTOs (Data Transfer Objects) instead of returning Entities directly?**
    *   *Answer:* To decouple the internal database structure from the external API. It prevents infinite recursion (in circular relationships) and allows hiding sensitive data (like passwords).
9.  **How do you handle the "Feed" logic efficiently?**
    *   *Answer:* We query the `PostRepository` for posts where the `authorId` is in the list of IDs the current user follows.
10. **What is the difference between `@Controller` and `@RestController`?**
    *   *Answer:* `@RestController` includes `@ResponseBody`, meaning methods return data (JSON) directly, whereas `@Controller` is typically used for returning view templates (HTML).

## Security
11. **How are passwords stored in the database?**
    *   *Answer:* They are hashed using BCrypt. We never store plain text passwords.
12. **What prevents a user from deleting someone else's post?**
    *   *Answer:* In the `PostService`, we check if the `currentUser.id` matches the `post.author.id` (or if the user is ADMIN) before processing the delete request.

## Database
13. **Why PostgreSQL?**
    *   *Answer:* It's a powerful, open-source object-relational database known for reliability and data integrity.
14. **Explain the relationship between User and Post.**
    *   *Answer:* One-to-Many. A User can have many Posts, but a Post belongs to only one User.

## Bonus/Challenge
15. **How did you handle the media uploads?**
    *   *Answer:* I used Cloudinary. Instead of saving files to the local server disk (which is hard to scale), I upload them to the cloud and just save the URL string in my database.

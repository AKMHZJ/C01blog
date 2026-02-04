# Junior Fullstack Developer Interview Preparation Guide

## 🌟 Mindset Check
**You are not expected to know everything.**
As a Junior Developer, interviewers look for:
1.  **Fundamental Understanding:** Do you know *why* we use these tools?
2.  **Curiosity:** Are you willing to learn?
3.  **Problem Solving:** How do you approach a problem you don't know the answer to?

---

## ☕ Java Core
*Focus on the basics of the language.*

### Key Concepts
*   **OOP (Object-Oriented Programming):** Encapsulation, Inheritance, Polymorphism, Abstraction.
*   **Collections:** List, Set, Map.
*   **Java 8 Features:** Streams and Lambdas.

### Interview Questions
1.  **"What is the difference between an Interface and an Abstract Class?"**
    *   *Answer:* An abstract class can have member variables and implemented methods. An interface (pre-Java 8) only had abstract methods. We use Interfaces to define a contract (what a class can *do*) and Abstract Classes to define a base identity (what a class *is*).
2.  **"Explain `String`, `StringBuilder`, and `StringBuffer`."**
    *   *Answer:* `String` is immutable (cannot be changed). `StringBuilder` is mutable and fast but not thread-safe. `StringBuffer` is mutable and thread-safe (synchronized).
3.  **"What is the difference between `==` and `.equals()`?"**
    *   *Answer:* `==` compares references (memory address), while `.equals()` compares the actual content/values of the objects.

---

## 🍃 Spring Boot
*Focus on how it makes Java development easier.*

### Key Concepts
*   **Dependency Injection (DI):** Spring manages object creation for you.
*   **Annotations:** `@Component`, `@Service`, `@Repository`, `@Autowired`.

### Interview Questions
1.  **"What is Inversion of Control (IoC) and Dependency Injection?"**
    *   *Answer:* Instead of me creating objects using `new Service()`, I let Spring create them and inject them where needed. This makes code loosely coupled and easier to test.
2.  **"Why do we use Spring Boot instead of plain Spring?"**
    *   *Answer:* Spring Boot provides "auto-configuration." It sets up defaults (like a Tomcat server, DB connection) so I can start coding business logic immediately without writing XML configs.
3.  **"What is the difference between `@Controller` and `@RestController`?"**
    *   *Answer:* `@Controller` is used for returning Views (HTML pages). `@RestController` is a convenience annotation that combines `@Controller` and `@ResponseBody`, meaning it returns data (JSON/XML) directly (used for REST APIs).

---

## 🌐 APIs & REST
*Focus on how systems talk to each other.*

### Key Concepts
*   **HTTP Methods:** GET (read), POST (create), PUT (update full), PATCH (update partial), DELETE.
*   **Status Codes:** 200 (OK), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error).

### Interview Questions
1.  **"What makes an API 'RESTful'?"**
    *   *Answer:* It follows standard HTTP methods, it is stateless (server doesn't remember user state between requests), and it treats data as "Resources" (URLs like `/api/users`).
2.  **"What is the difference between PUT and PATCH?"**
    *   *Answer:* PUT expects the *entire* object to be sent to replace the existing one. PATCH expects only the fields that need to be changed.

---

## 🔒 Security & JWT
*Focus on protection and authentication.*

### Key Concepts
*   **Authentication vs. Authorization:** AuthN is "Who are you?" (Login). AuthZ is "What are you allowed to do?" (Permissions).
*   **Statelessness:** The server doesn't store session files.

### Interview Questions
1.  **"How does JWT (JSON Web Token) work?"**
    *   *Answer:* When a user logs in, the server generates a signed token. The client stores this token (usually LocalStorage). For every subsequent request, the client sends this token in the Header. The server verifies the signature to know who the user is without checking the DB every time.
2.  **"How do you prevent SQL Injection?"**
    *   *Answer:* Never concatenate strings in SQL queries. In Spring Data JPA, this is handled automatically by using Repositories and parameterized queries.
3.  **"Why do we hash passwords (BCrypt)?"**
    *   *Answer:* We never store passwords in plain text. If the DB is hacked, the hacker only sees useless hashes, not actual passwords.

---

## 💾 Database
*Focus on data structure.*

### Key Concepts
*   **ACID:** Atomicity, Consistency, Isolation, Durability (properties that guarantee reliable transactions).
*   **Relational vs. Non-Relational:** Tables (SQL) vs. Documents (NoSQL).

### Interview Questions
1.  **"What is the N+1 problem in Hibernate?"**
    *   *Answer:* It happens when fetching a list of items (1 query) and then accidentally triggering a separate query for *each* item's related data (N queries). We solve it using `JOIN FETCH` or EntityGraphs.
2.  **"Explain Primary Key vs. Foreign Key."**
    *   *Answer:* A Primary Key uniquely identifies a row. A Foreign Key links that row to a Primary Key in another table to create a relationship.

---

## 🚀 DevOps & Docker
*Focus on "It works on my machine... and yours too."*

### Key Concepts
*   **Containerization:** Packaging code + dependencies together.
*   **CI/CD:** Continuous Integration (Auto-testing) / Continuous Deployment.

### Interview Questions
1.  **"Why use Docker?"**
    *   *Answer:* It solves the "it works on my machine" problem. It ensures the application runs exactly the same way in Development, Testing, and Production by packaging the OS settings and libraries with the code.
2.  **"What is a Dockerfile vs. docker-compose?"**
    *   *Answer:* A `Dockerfile` describes how to build a *single* image. `docker-compose` describes how to run *multiple* containers (like Backend + Database) together as a system.

---

## ⚡ Real-time & Advanced (WebSocket / GraphQL)
*Focus on the "Why" more than the "How".*

### Interview Questions
1.  **"When would you use WebSockets instead of REST?"**
    *   *Answer:* REST is "Request-Response" (Client asks, Server answers). WebSockets allow two-way communication. I'd use WebSockets for real-time chat, live notifications, or gaming where the server needs to push data to the client instantly.
2.  **"What is GraphQL?"**
    *   *Answer:* It's an alternative to REST. In REST, you might have to hit 3 endpoints to get user data, posts, and comments. In GraphQL, you send *one* query asking exactly for what you need, and the server returns exactly that. It prevents "over-fetching" data.

---

## 🏆 How to Answer When You Don't Know
If they ask a question you don't know (e.g., "How does the Java Garbage Collector working internal memory generations work?"):

**Bad Answer:** "I don't know." (Silence).

**Junior "Pro" Answer:**
"I haven't worked deeply with the internals of Garbage Collection memory yet. However, I know it handles freeing up memory automatically so we don't have to manual deallocate memory like in C++. Usually, if I encounter a memory issue, I would use a profiler tool to investigate."

**The Formula:**
1. Admit you don't know the specific detail.
2. State what you *do* know about the general topic.
3. Explain how you would find the answer.

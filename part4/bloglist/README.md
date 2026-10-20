# Part 4 — Blog List API

A modular Express API for saving interesting blogs. It includes MongoDB persistence, user registration, password hashing, token login, creator-only deletion and automated tests. The final source implements the exercise series through 4.23; course submission and a manual REST Client/Postman check remain pending.

## Run

Use Node.js 24 and an existing development MongoDB database:

```sh
npm ci
cp .env.example .env
# Set MONGODB_URI and generate a fresh SECRET of at least 32 characters.
npm start
```

The API listens on port 3003 by default. `npm run dev` restarts it when files change. No password, database credential or production token secret is stored in the repository. Startup requires both the database connection and a suitable secret.

## Endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| POST | `/api/users` | Register with `username`, `name` and `password` |
| GET | `/api/users` | List public user details and their blogs |
| POST | `/api/login` | Return a one-hour token for valid credentials |
| GET | `/api/blogs` | List blogs and public creator details; no login required |
| POST | `/api/blogs` | Create a blog as the authenticated user |
| PUT | `/api/blogs/:id` | Update only `likes`; no ownership changes allowed |
| DELETE | `/api/blogs/:id` | Delete only when authenticated as its creator |

Send authenticated requests with `Authorization: Bearer TOKEN`. Blog fields are `title`, `author`, `url` and `likes`. Title and URL are required; likes defaults to zero. A caller cannot assign another creator through the request body.

Usernames are unique and at least three characters. Passwords are validated before hashing, must be at least three characters for this exercise, and cannot exceed bcrypt's 72-byte input limit. Bcrypt hashes are excluded from all API responses. These course-minimum password rules are not a production account-security standard.

## Structure

`index.js` connects the database and starts the server. `app.js` assembles middleware and routes without opening a database connection, which allows isolated tests. Controllers own route behavior; models define validation and JSON output. Token extraction and authenticated-user lookup are separate middleware functions.

Blog ownership is stored on the blog document. The user's blog list is a Mongoose virtual relationship populated from that field, so deletion cannot leave a stale second ownership list. Likes updates are intentionally public for the exercise; they cannot alter a blog's title, URL or creator. Production voting would require authentication, rate limiting and per-user vote tracking.

`utils/list_helper.js` implements `dummy`, `totalLikes`, `favoriteBlog`, `mostBlogs` and `mostLikes`. Empty lists return zero for totals and null for winners. Ties retain the first encountered winner.

## Tests and checks

```sh
npm run lint
npm test
```

Tests use Node's runner, SuperTest and a real disposable MongoDB process launched by `mongodb-memory-server`. Test data never shares the configured application database. No production credentials are needed. Test files run sequentially.

Coverage includes JSON output, IDs, saved blog content, default likes, missing required fields, updates, ownership restrictions, user validation, concurrent duplicate usernames, password hashing, login, invalid/expired/missing tokens, deleted users and populated relationships. Helper tests cover empty lists, single items, totals and ties.

The local sandbox cannot start MongoDB (`Operation not permitted`), so GitHub Actions provides the database-test execution environment. Helper tests and ESLint run locally. Check the latest workflow for the verified result. No test result implies that a hosted service has been deployed.

## Exercise map

| Exercises | Implementation |
| --- | --- |
| 4.1–4.2 | Runnable npm application split into routes, models, configuration and middleware |
| 4.3–4.7 | List helpers with grouped unit tests |
| 4.8–4.12 | SuperTest checks for reads, IDs, creation, default likes and required fields |
| 4.13–4.14 | Delete and likes-update endpoints with database assertions |
| 4.15–4.17 | Users, validation, hashes and populated creator/blog relationships |
| 4.18–4.23 | Login, token/user middleware, authenticated creation, creator-only deletion and updated tests |

The earlier unauthenticated creation steps are represented by their final authenticated form. Use `requests.http` for a manual demonstration after configuring a database. The application is an API only; a Blog List frontend belongs to Part 5.

## Sources

University of Helsinki, Full Stack Open, checked 20 October 2026:

- [Application structure and unit testing](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing/)
- [Testing the backend](https://fullstackopen.com/en/part4/testing_the_backend/)
- [User administration](https://fullstackopen.com/en/part4/user_administration/)
- [Token authentication](https://fullstackopen.com/en/part4/token_authentication/)

Implementation and fictional test data were prepared for these exercises without using the course's model solutions.

# Part 3 — full-stack Phonebook

The Phonebook now uses Express and MongoDB, with a React frontend served by the backend. The initial in-memory checkpoint remains in Git history. This source covers the code required through Part 3's validation and linting exercises; public deployment and Atlas verification remain pending.

## Run locally

Use Node.js 24. In this directory:

```sh
npm ci
cp .env.example .env
# Set MONGODB_URI in .env to your own development database.
npm run build:ui
npm start
```

Visit `http://localhost:3001`. The backend serves the frontend build and `/api/persons` from the same origin. For frontend development, run `npm run dev` in this directory and `npm run dev` inside `frontend` in another terminal. Vite forwards `/api` requests to port 3001.

The database connection is required. Startup waits for the connection and unique-name index before accepting requests. `.env` is ignored by Git; never commit database passwords.

## API and validation

| Method | Path | Result |
| --- | --- | --- |
| GET | `/api/persons` | All contacts with public `id` fields |
| GET | `/api/persons/:id` | One contact, or 404 |
| GET | `/info` | Database count and current server time |
| POST | `/api/persons` | Create a contact, or 400 for invalid input |
| PUT | `/api/persons/:id` | Replace the number with full schema validation |
| DELETE | `/api/persons/:id` | Delete a contact; 404 if already absent |

Names must be at least three characters and unique without case sensitivity. Numbers must contain at least eight characters, with two or three digits before a single hyphen and digits after it. For example, `040-1234567` is valid. Errors are returned as JSON and shown by the frontend without discarding the entered values.

`models/person.js` owns the Mongoose schema. A separate error middleware handles validation, duplicate-name and invalid-ID failures. Morgan uses its tiny format. Set `LOG_REQUEST_BODIES=true` only with fictional exercise data to demonstrate the POST-body logging exercise; production logs omit bodies.

## Database command line

Set `MONGODB_URI_TEMPLATE` in `.env` to your Atlas connection string with `<password>` in place of the password. The exercise CLI supports:

```sh
node --env-file=.env mongo.js PASSWORD
node --env-file=.env mongo.js PASSWORD "Grace Hopper" 040-1234567
```

The first command lists entries; the second inserts one. Both close the database connection after completion. The password is supplied at runtime and is not included in the source. Use an exercise-only database account; command-line arguments can be visible in local process listings and shell history.

## Verification

`npm run lint` runs ESLint. `npm test` starts a disposable MongoDB instance with `mongodb-memory-server`, makes real HTTP requests with SuperTest and checks persisted data. It does not connect to or erase an account database. Build the frontend first because one test verifies that the backend serves it.

The repository's `check-part3-ui.cjs` checks that server validation messages appear, entered values survive a failure, and a corrected retry succeeds. GitHub Actions runs the builds, lint and database tests. The local development sandbox cannot start the MongoDB process (`Operation not permitted`); use the workflow result for database-test status.

## Deployment status and remaining verification

On 20 October 2026, the free Atlas cluster and the free Render Frankfurt service were created. The application user is restricted to `readWrite` on the `phonebook` database and the single course cluster. Atlas allows Render's two documented outbound ranges, not all internet addresses.

The allocated URL is https://shaon-fullstack-phonebook.onrender.com. **This is not a verified working deployment.** The browser masked the generated password during transfer. The unusable connection setting was removed; Render currently needs a valid `MONGODB_URI` entered privately. No credentials are stored in this repository.

Remaining steps:

1. Set a usable database password directly in Atlas and privately enter the URI in Render, with `/phonebook` as the database name.
2. Redeploy and verify create, read, update, delete and validation through the public UI.
3. Run the matching requests in Postman or VS Code REST Client and verify the Atlas CLI exercise.
4. Only then claim deployment exercises 3.10, 3.11 and 3.21, and Atlas-specific exercise 3.12.

The Phonebook is a course demo with no authentication. Use fictional contacts only. The Blog List in Part 4 introduces authenticated operations.

## Sources

- [Node.js and Express](https://fullstackopen.com/en/part3/node_js_and_express/)
- [Deploying app to internet](https://fullstackopen.com/en/part3/deploying_app_to_internet/)
- [Saving data to MongoDB](https://fullstackopen.com/en/part3/saving_data_to_mongo_db/)
- [Validation and ESLint](https://fullstackopen.com/en/part3/validation_and_es_lint/)
- [Render Blueprint reference](https://render.com/docs/blueprint-spec)

Requirements checked on 20 October 2026. The implementation does not use course model solutions.

Verified on 20 October 2026: [GitHub Actions run 39385487673](https://github.com/ShaonInTheCloud/full-stack-open/actions/runs/39385487673) passed all builds, lint checks, UI checks and database tests. Part 3 passed 5 backend tests; Part 4 passed 27 tests.

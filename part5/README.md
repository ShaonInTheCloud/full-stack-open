# Part 5 — Reading Room

A React frontend for the Part 4 Blog List API. The final application uses routed views and styled-components, matching the current Part 5 material through 5.31. Earlier preview behavior is preserved in `BlogPreview` with its component tests; the final app uses public routed details.

## Run

Use Node.js 24. Start the Part 4 backend with its own development MongoDB database and SECRET (see its README). It listens on port 3003. In `part5/bloglist`, run:

```sh
npm ci
npm run dev
```

Vite proxies `/api` to `http://127.0.0.1:3003`. Create a development account using `POST /api/users`; the course frontend deliberately has no registration page. Use only test credentials and fictional data.

## Behavior

- `/` lists blogs in descending like order, with stable title ordering for ties.
- `/login` authenticates against the backend. The course-required session is retained in local storage and removed on logout. Passwords are never stored or logged.
- `/create` requires a signed-in user. Success returns to the list; failure keeps the entered data.
- `/blogs/:id` displays an article, including after a direct page refresh. Only signed-in users see Like; only the creator sees Delete. The backend independently enforces deletion ownership.
- Notifications expire after five seconds. Rapid mutation requests are prevented while an update is pending, and author details survive a like response.
- External links allow only HTTP/HTTPS, and open with `noopener noreferrer`.
- Forms, navigation, notifications and details use styled-components with visible focus states and responsive widths.

The Part 4 exercise API permits public updates to likes. The frontend hides this action from signed-out users as required by Part 5. Production access control must be enforced by the API, not by hiding buttons. This project is a course demonstration.

## Tests

```sh
cd part5/bloglist
npm ci
npm run build
npm run lint
npm test
```

Eight component tests cover the initial preview, expansion, repeated likes, three ownership/authentication states, unsafe links, exact form values and preserving a failed form.

The separate browser project uses Playwright and the actual Part 4 API, not mocked HTTP responses:

```sh
npm --prefix part4/bloglist ci
npm --prefix part5/bloglist ci
cd part5/e2e
npm ci
npx playwright install --with-deps chromium
npm test
```

Its harness starts a fresh `mongodb-memory-server` database and binds only to loopback. Its reset endpoint exists only in the separate test harness, never in the production app. It does not read deployment database credentials. Browser tests cover failed/successful login, refresh/logout, creation, likes, author retention, detail refresh, deletion, permissions and ordering. They run serially because each resets the isolated database.

## Verification status

20 October 2026: frontend production build, ESLint and all 8 component tests pass locally. The sandbox cannot start MongoDB, so the database-backed browser suite runs in GitHub Actions. Its result is pending at this checkpoint. Course submission, study time, the personal authorship acknowledgement and exam completion are not claimed.

## References

Requirements and API examples were checked against the University of Helsinki material on 20 October 2026:

- https://fullstackopen.com/en/part5/login_in_frontend/
- https://fullstackopen.com/en/part5/props_children_and_component_refs/
- https://fullstackopen.com/en/part5/testing_react_apps/
- https://fullstackopen.com/en/part5/end_to_end_testing/
- https://fullstackopen.com/en/part5/react_router_ui_frameworks/

Exercise requirements guide the implementation; course example solutions were not accessed.

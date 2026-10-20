# Phonebook backend — first checkpoint

This is the initial in-memory backend for Part 3, covering the implementation in exercises 3.1–3.8. It is a work in progress, not a completed Part 3 submission.

## Start

Use Node.js 24 or newer:

```sh
npm ci
npm start
```

The default port is 3001. Stop the Part 2 JSON server first, or set another `PORT`. For automatic restart during development, use `npm run dev`.

## Routes

| Method | Path | Result |
| --- | --- | --- |
| GET | `/api/persons` | All entries as JSON |
| GET | `/info` | Entry count and request processing time |
| GET | `/api/persons/:id` | One entry, or 404 |
| POST | `/api/persons` | Add a name and number, or 400 for invalid input |
| DELETE | `/api/persons/:id` | Remove an entry; 204 also applies when already absent |

POST accepts a JSON object with `name` and `number` strings. Whitespace is trimmed, extra properties are ignored, and duplicate names are checked without case sensitivity. IDs use a large random numeric range, with a collision check against existing entries. The sample contacts are the course's supplied demonstration data.

Morgan logs the tiny-format fields plus POST bodies as requested by the exercise. Use demonstration data only. Data is held in memory and resets when the server restarts.

## Check

Run `npm test` for real HTTP checks on a temporary local port. They cover reading, creating and deleting contacts, count changes, duplicate and invalid input, missing entries, repeated deletion, invalid JSON and logging. Run `npm run lint` for JavaScript syntax checks.

`requests.http` contains requests for the VS Code REST Client extension. Manual execution in that client or Postman is still pending; the automated checks use Node's HTTP client.

## Remaining work

Connect the frontend, deploy the application, add MongoDB persistence and validation, and finish the later Part 3 exercises before submitting the part. No deployment or database connection is claimed at this checkpoint.

## Reference

[Full Stack Open: Node.js and Express](https://fullstackopen.com/en/part3/node_js_and_express/) — exercise requirements and supplied sample data, checked 20 October 2026. The code is an implementation of the requirements; it does not use the course's model solutions.

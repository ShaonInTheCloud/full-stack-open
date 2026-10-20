# 0.6 — Saving in the single-page version

The page and its form handler have already loaded.

```mermaid
sequenceDiagram
    participant B as Browser
    participant S as Server
    Note over B: Save triggers submit handler
    Note over B: preventDefault stops navigation
    Note over B: Create note with content and date
    Note over B: Add locally, clear input, redraw
    B->>S: POST /exampleapp/new_note_spa (JSON)
    Note over S: Validate and store note
    S-->>B: 201 with confirmation
    Note over B: Log response; page stays loaded
```

The new note appears before the server confirms that it was saved. If the request fails, this example leaves the note on screen.


References: [Full Stack Open, Part 0](https://fullstackopen.com/en/part0/fundamentals_of_web_apps/), [example client](https://github.com/mluukkai/example_app/blob/master/public/spa.js), [example server](https://github.com/mluukkai/example_app/blob/master/index.js).

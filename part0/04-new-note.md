# 0.4 — Saving through the standard form

This starts when someone clicks Save on the open notes page. Each path belongs to `https://studies.cs.helsinki.fi`. The diagram assumes the browser cache is disabled. CSS and JavaScript downloads may overlap.

```mermaid
sequenceDiagram
    participant B as Browser
    participant S as Server
    B->>S: POST /exampleapp/new_note (form field note)
    Note over S: Store note with timestamp
    S-->>B: 302, Location /exampleapp/notes
    B->>S: GET /exampleapp/notes
    S-->>B: HTML
    B->>S: GET /exampleapp/main.css
    S-->>B: CSS
    B->>S: GET /exampleapp/main.js
    S-->>B: JavaScript
    B->>S: GET /exampleapp/data.json
    S-->>B: JSON notes
    Note over B: Callback renders list
```


References: [Full Stack Open, Part 0](https://fullstackopen.com/en/part0/fundamentals_of_web_apps/), [example client](https://github.com/mluukkai/example_app/blob/master/public/spa.js), [example server](https://github.com/mluukkai/example_app/blob/master/index.js).

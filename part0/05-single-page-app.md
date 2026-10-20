# 0.5 — Opening the single-page version

```mermaid
sequenceDiagram
    participant B as Browser
    participant S as Server
    B->>S: GET /exampleapp/spa
    S-->>B: HTML
    B->>S: GET /exampleapp/main.css
    S-->>B: CSS
    B->>S: GET /exampleapp/spa.js
    S-->>B: JavaScript
    B->>S: GET /exampleapp/data.json
    S-->>B: JSON notes
    Note over B: Parse data and redraw list
    Note over B: Register form handler on window load
```

The data response and window load are separate events; their relative timing is not guaranteed.


References: [Full Stack Open, Part 0](https://fullstackopen.com/en/part0/fundamentals_of_web_apps/), [example client](https://github.com/mluukkai/example_app/blob/master/public/spa.js), [example server](https://github.com/mluukkai/example_app/blob/master/index.js).

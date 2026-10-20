# Full Stack Open

Coursework for Full Stack Open. Part 0 contains browser/server sequence diagrams; Parts 1 and 2 contain standalone React applications. See [Part 2 setup and references](part2/README.md).

| Folder | Exercises | What is implemented |
| --- | --- | --- |
| `part1/courseinfo` | 1.1–1.5 | Course data, reusable components, props, objects and an array |
| `part1/unicafe` | 1.6–1.11 | Feedback buttons, totals, average, positive percentage and a statistics table |
| `part2/courseinfo` | 2.1–2.5 | Multiple courses, reusable modules and reduced exercise totals |
| `part2/phonebook` | 2.6–2.17 | Persistent contacts, filtering, updates, deletion and notifications |
| `part2/countries` | 2.18–2.20 | Country search, details and capital weather |
| `part1/anecdotes` | 1.12–1.14 | Random selection, individual vote counts and the most-voted item |

Each folder contains the final version of its exercise series. The projects use the Vite React JavaScript scaffold. The anecdote texts are original practice examples rather than quotations from named authors.

## Parts 3 and 4

The [Part 3 Phonebook](part3/phonebook/README.md) has MongoDB persistence, validation and an integrated React frontend. Hosting configuration is prepared; Atlas setup and public deployment remain pending.

The [Part 4 Blog List](part4/bloglist/README.md) implements the API through token authentication and creator-only deletion, with helper and database-backed API tests. Neither part has been submitted to the course portal.

## Run an app

Install Node.js 24 or newer. In a terminal, move into an app folder, for example:

```sh
cd part1/unicafe
npm ci
npm run dev
```

Open the local address printed by Vite. To build the app, run `npm run build`. Run `npm run lint` to check the source. Each app works independently. The Part 2 Phonebook also needs its local server; see its setup notes.

## Read the code

In Course Information, `App` owns the data and passes it to `Header`, `Content` and `Total`. `Content` delegates each row to `Part`. The total is 31.

In Unicafe, each button changes one counter. Statistics are calculated from those counters, so there is no separate total to keep in sync. Before the first response, the app shows an empty-state message. Good feedback contributes +1, neutral 0 and bad −1 to the average. Refreshing clears the counters.

In Anecdotes, the selected index identifies the visible text. Voting copies the vote array before updating it. The first maximum is displayed when several entries tie. Random selection can choose the current entry again. Refreshing clears the votes.

## References

University of Helsinki, Full Stack Open:

- [Introduction to React](https://fullstackopen.com/en/part1/introduction_to_react/)
- [JavaScript](https://fullstackopen.com/en/part1/java_script/)
- [A more complex state, debugging React apps](https://fullstackopen.com/en/part1/a_more_complex_state_debugging_react_apps/)
- [Course and submission information](https://fullstackopen.com/en/part0/general_info/)

Exercise requirements checked on 20 October 2026. Course Information uses the exercise's supplied data. Implementation code and practice anecdote texts are written for these projects.

## Verification

All three production builds and JavaScript checks passed on 20 October 2026. DOM interaction checks passed for:

- Course Information: course heading, all three parts and the total of 31.
- Unicafe: no-feedback state, each counter, negative and mixed averages, and positive percentage.
- Anecdotes: first and last random indices, separate vote counts, tied leaders and a changing leader.
- A fresh mount resets feedback and votes. React reported no errors during these checks.

These interaction checks use jsdom. A real-browser visual check remains pending because the test browser download failed in this environment.

To repeat the checks, first run `npm ci` in each app folder. From this top-level folder, run `npm ci`, followed by `npm test`.

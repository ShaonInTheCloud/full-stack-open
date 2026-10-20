# Part 2 — communicating with a server

Three separate React applications cover exercises 2.1–2.20. Each folder contains the final version of its exercise series.

| Application | Exercises | Features |
| --- | --- | --- |
| Course Information | 2.1–2.5 | Multiple courses, a separate Course module, reusable rows and totals calculated with `reduce` |
| Phonebook | 2.6–2.17 | Controlled forms, case-insensitive search, persistent create/update/delete operations, confirmation dialogs and success/error messages |
| Countries | 2.18–2.20 | Country search, selectable results, country details and current weather for the capital |

## Run locally

Use Node.js 24 or newer. Open a terminal in one application folder:

```sh
cd part2/courseinfo
npm ci
npm run dev
```

Open the address printed by Vite. Replace `courseinfo` with `phonebook` or `countries` to run another app. Each app also supports `npm run build` and `npm run lint`.

For Phonebook, open a second terminal in `part2/phonebook` and run:

```sh
npm run server
```

The JSON server listens at `http://localhost:3001/persons` and saves changes to `db.json`. Its sample names and numbers are demonstration data. This local exercise has no authentication; do not use it to store sensitive contacts or expose the development server publicly.

Countries needs an internet connection. It uses the course's REST Countries API and Open-Meteo's public weather endpoint. No API key or account is needed for this noncommercial exercise. Weather is modelled data, with Celsius temperature and wind speed in metres per second. Coordinates come from the country's capital information. Missing capital data is shown explicitly.

## Implementation notes

Course Information maps each course to the same component. Each part uses its own stable ID as a key. The total starts at zero, so an empty parts list also works. The supplied example courses total 42 and 10 exercises.

Phonebook keeps form values and contact state in App. The Filter, PersonForm, Persons and Notification components handle the interface. HTTP requests live in a separate service module. Adding an existing name asks whether to replace the phone number. State changes only after a successful request. If a contact was deleted elsewhere, a failed update removes the stale entry and explains what happened. Other failures keep the form values so the user can retry. Notifications disappear after five seconds.

Countries fetches the dataset once and filters it in the browser. More than ten matches require a narrower search; two to ten produce a selectable list; one opens the details directly. Changing the search clears the selection. Weather requests are cancelled when the selected country changes, preventing an earlier response from appearing under a different country.

The apps share a restrained green palette, consistent spacing, visible keyboard focus, labelled inputs and responsive layouts. Success and failure messages include text as well as different colors.

## Checks

Production builds and Oxlint checks pass for all three apps. The automated interaction checks cover:

- Course totals, rendered parts and an empty course.
- Phonebook filtering, creating, confirmed/cancelled updating and deletion, stale contacts, failed saves and failed initial loading.
- Country result limits, no results, direct and selected country details, weather units, missing coordinates, API failures and cancelled weather requests.

To repeat the interaction checks, install dependencies in all Part 1 and Part 2 app folders, then run `npm ci` and `npm test` from the repository root. Tests use jsdom and mocked HTTP responses; they do not replace a visual browser review or guarantee external API availability. A real-browser visual review remains pending because the test browser could not be installed in the development environment.

## Sources

Requirements and API documentation checked on 20 October 2026:

- University of Helsinki: [Rendering a collection, modules](https://fullstackopen.com/en/part2/rendering_a_collection_modules/)
- University of Helsinki: [Forms](https://fullstackopen.com/en/part2/forms/)
- University of Helsinki: [Getting data from server](https://fullstackopen.com/en/part2/getting_data_from_server/)
- University of Helsinki: [Altering data in server](https://fullstackopen.com/en/part2/altering_data_in_server/)
- University of Helsinki: [Adding styles to React app](https://fullstackopen.com/en/part2/adding_styles_to_react_app/)
- University of Helsinki: [REST Countries endpoints](https://studies.cs.helsinki.fi/restcountries/)
- Open-Meteo: [Weather API parameters and weather codes](https://open-meteo.com/en/docs)

Course Information uses the exercise's supplied course data. Country facts and flags come from the course API; weather comes from Open-Meteo. The application code implements these exercise requirements without using the course's model solutions.

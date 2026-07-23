# AP TET Hindi Mock Test Platform

Offline-style CBT practice platform for AP TET Paper-II(A) School Assistant Hindi. It uses only HTML, CSS, JavaScript, and local JSON data.

## Run

Open `index.html` in a modern browser. The app reads data with browser `fetch()`. Some Chromium browsers block local JSON requests from `file://` pages for security; if that occurs, use a browser that allows local-file access or a simple local static-file viewer. No application installation, backend, or account is required.

## Add a mock

Add a JSON file such as `data/mock4.json`. It must be an array of questions with `id`, `topic`, `question`, four `options`, zero-based `answer` (0 means first option), and `explanation`.

Then add one declarative card entry near the top of `app.js`:

```js
['mock4', 'Mock Test 4', 'Your description']
```

The exam engine needs no changes. Progress, answers, review marks, current question, and remaining time are stored in localStorage.

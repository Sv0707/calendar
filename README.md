# Impekable Calendar Test Task

React + TypeScript + Vite calendar app based on the provided layout.

## Features

- month / week / day / agenda views
- add event with manual date, time, title and color
- title length validation up to 30 characters
- edit existing events
- delete events
- drag & drop and resize events
- correct ordering of events by time
- overlapping events displayed side by side by FullCalendar
- persisted in `localStorage`

## Stack

- React
- TypeScript
- Vite
- FullCalendar
- Source Sans Pro

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages deploy

1. Push the project to a GitHub repository.
2. Open **Settings → Pages**.
3. In **Build and deployment**, choose **GitHub Actions**.
4. Push to `main` and the included workflow will deploy the `dist` folder automatically.

## Notes

- `vite.config.ts` uses `base: './'`, so the build works on GitHub Pages without hardcoding a repository name.
- The app ships with seed events only for demo purposes.

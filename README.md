
# Weekly Intake Form

## Project info

## About this project

This is a digital weekly intake form for IT infrastructure requests. This form is used for capturing:
- Application details
- Support needs
- Exceptions
- Location information
- Database platforms
- Server counts
- Environment requirements
- Storage needs

The form is designed to be user-friendly with Yes/No toggles, text fields, and text areas for capturing detailed information.

## Development

The only requirement is having Node.js and npm installed.

Follow these steps:

```powershell
npm install
npm run dev
```

The development command starts both the Vite app and its local API. Add multiple applications to the same weekly review with **Add another application**, then submit them together. Each application is stored as a separate SQLite record with the shared review date and its own optional PDF attachment (up to 10 MB). You can submit up to 20 applications at once. The SQLite file is created automatically at `server/data/intake.sqlite` and is excluded from Git.

For a production-style local run, build the app and start the API server:

```powershell
npm run build
npm start
```

The local SQLite server is intended for use on the same machine; it is not configured for multi-user hosting or network access.

## Technologies used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Hook Form for form state management
- date-fns for date formatting

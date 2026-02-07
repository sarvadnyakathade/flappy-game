# Flappy Night

Flappy Night is a tiny Flappy Bird-inspired game. Lose the run and the screen will show the message: **"night has been killed by u."**

## Run the game (web)

Open `index.html` directly in a browser, or run a local server:

```bash
npm install
npm run start
```

Then open `http://localhost:5173`.

## Build a Windows `.exe`

This repo includes an Electron wrapper for desktop builds.

```bash
npm install
npm run build:win
```

The Windows installer / `.exe` will appear in the `dist/` folder created by `electron-builder`.

## Build an Android `.apk`

This project includes a Capacitor config that points to the current web assets.

```bash
npm install
npx cap add android
npm run cap:sync
npm run cap:android
```

Then use Android Studio to build an APK or run on a device.

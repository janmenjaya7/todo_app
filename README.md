# Todo App

A React Native todo app built with [Expo](https://expo.dev) (SDK 58) and Expo Router.

## Features

- **Todo** – add tasks, tick them off, delete them, and search as you type
- **Home** – dashboard with progress, quick actions, and announcements
- **Profile** and **Contact** screens
- Floating glass tab bar with animated tab switching
- Liquid Glass on iOS 26+, frosted fallback on Android and older iOS
- Light and dark mode

## Get started

```bash
npm install
npx expo start
```

Scan the QR code with [Expo Go](https://expo.dev/go). If your phone can't connect to your computer, use `npx expo start --tunnel`.

## Project structure

```
src/
  app/          Routes (each file is a screen)
  components/   Screens and shared UI (glass card, glass button, tab bar)
  constants/    Theme colors, gradients, spacing
  hooks/        Color scheme and theme hooks
```

## Build an Android APK

```bash
npx eas-cli@latest build -p android --profile preview
```

## Checks

```bash
npx tsc --noEmit   # typecheck
npx expo lint      # lint
```

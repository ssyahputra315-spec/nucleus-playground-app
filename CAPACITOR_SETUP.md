# Capacitor Android Setup Guide

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Android Studio](https://developer.android.com/studio) (latest)
- Java 17+ (bundled with Android Studio)

## Setup Steps

### 1. Build the web app (REQUIRED FIRST STEP)

You MUST build the web app before adding/syncing Android platform:

```bash
npm run build
```

This creates the `.output/public` directory that Capacitor needs.

### 2. Add Android platform

```bash
npx cap add android
```

### 3. Sync web assets to native project

```bash
npx cap sync android
```

### 4. Open in Android Studio

```bash
npx cap open android
```

### 5. Run on device/emulator

In Android Studio, click the green Run ▶ button.

## Google Play Publishing

### 1. Update app identity

Edit `capacitor.config.ts`:
- `appId`: Your unique package name (e.g., `com.yourcompany.atomsimulator`)
- `appName`: Display name on the Play Store

### 2. Create signing key

```bash
keytool -genkey -v -keystore atom-simulator.keystore -alias atom-simulator -keyalg RSA -keysize 2048 -validity 10000
```

### 3. Configure signing in Android Studio

1. Go to **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Use the keystore created above
4. Build a release AAB

### 4. Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Upload the `.aab` file from `android/app/build/outputs/bundle/release/`
4. Fill in store listing, screenshots, and privacy policy
5. Submit for review

## Updating the App

After making changes:

```bash
npm run build
npx cap sync android
```

Then rebuild in Android Studio.

## Useful Commands

| Command | Description |
|---------|-------------|
| `npx cap sync` | Sync web assets + plugins |
| `npx cap copy` | Copy web assets only (faster) |
| `npx cap open android` | Open in Android Studio |
| `npx cap run android` | Build & run on connected device |

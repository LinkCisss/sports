# YM Sports

A luxury, high-fidelity sports application built with React Native and Expo. Inspired by premium sports platforms, it delivers a sleek, liquid-glass aesthetic with smooth animations and comprehensive match details.

## ✨ Features

- **Premium UI/UX:** Slate-blue palette with liquid-glass inspired components and smooth animations.
- **Match Details:** Deep dive into sports matches with custom hovering capsule headers and seamless navigation.
- **Cross-Platform:** Works natively across iOS, Android, and Web using Expo Router.
- **Backend Integration:** Powered by Supabase for reliable data management and real-time synchronization.
- **Internationalization (i18n):** Built-in multi-language support.
- **Modern Architecture:** Utilizes React Native's New Architecture with Expo SDK 54.

## 🛠 Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (v54)
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/)
- **Backend:** [Supabase](https://supabase.com/)
- **Animations:** `react-native-reanimated`
- **UI Effects:** `expo-blur`
- **Internationalization:** `i18next` & `react-i18next`

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm, yarn, or pnpm
- iOS Simulator (for Mac) or Android Studio (for Windows/Mac/Linux)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd sports
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   *(or use `yarn install` / `pnpm install`)*

3. Start the development server:
   ```bash
   npm start
   ```

### Running the App

Once the development server is running, you can press the following keys in your terminal:
- Press `a` to open on an Android emulator.
- Press `i` to open on an iOS simulator.
- Press `w` to open in a web browser.
- Scan the QR code with the Expo Go app (or a custom development build) on your physical device.

## 📁 Project Structure

```text
├── app/            # File-based routing (Expo Router pages and layouts)
├── assets/         # Static assets (images, fonts, splash screens)
├── components/     # Reusable UI components (buttons, cards, headers)
├── constants/      # App-wide constants (theme colors, layout dimensions)
├── lib/            # Library initializations (e.g., Supabase client)
├── locales/        # Internationalization dictionary files
└── utils/          # Helper functions and utilities
```

## 📝 Scripts

- `npm start` - Starts the Expo development server.
- `npm run android` - Starts the server and opens the Android app.
- `npm run ios` - Starts the server and opens the iOS app.
- `npm run web` - Starts the server and opens the Web app.

## 📄 License

This project is proprietary and confidential.

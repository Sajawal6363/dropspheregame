# DropSphere

DropSphere is a neon-themed mobile game built with Expo + React Native where the player guides a falling sphere through staircase-style levels.

## Features

- 50 progressive levels split by difficulty:
  - Easy: 1-10
  - Medium: 11-20
  - Hard: 21-30
  - Very Hard: 31-40
  - Extreme: 41-50
- Physics-like ball movement with swipe controls
- Win/Lose flow with level progression and unlock system
- Auto-saved progress, stats, and settings using local storage
- Authentication flow (login, signup, forgot password)
- Level selection grid with lock/completion states
- Settings for sound/music/vibration/language and reset progress
- Profile and leaderboard experiences
- Info screens: privacy policy, terms, FAQ, contact support

## Theme

- Primary: `#6C5CE7`
- Secondary: `#00D2FF`
- Accent: `#FF3CAC`
- Success: `#00FFAB`
- Danger: `#FF4D4D`
- Background gradient: `#0F2027 → #203A43 → #2C5364`

## Tech Stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- AsyncStorage for persistent app state
- Context-based game/settings state management

## Project Structure

- `app/` routes and screens
- `context/GameContext.tsx` game progress, auth, and level logic
- `context/SettingsContext.tsx` app settings persistence
- `constants/colors.ts` shared neon color system and gradients

## Run Locally

### Prerequisites

- Node.js 20+ recommended
- npm

### Install

```bash
npm install
```

### Start

```bash
npm run start
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npx tsc --noEmit
```

## Main User Flow

1. Splash screen loads and routes user by auth state.
2. User logs in/signs up.
3. Home shows progress and actions (Start, Resume, Level Select).
4. Game screen runs active level mechanics.
5. Win unlocks next level; Lose offers retry.
6. Settings/Profile/Leaderboard and info pages are available from navigation.

## Notes

- Current auth and backend interactions are mocked for app-flow completeness.
- Progress is persisted locally and restored on app launch.

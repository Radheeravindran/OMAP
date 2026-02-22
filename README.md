# Zlip - Mood-Driven Intracity Discovery

Zlip is a mobile application designed to transform spontaneous ideas into structured outings. Pick a mood, get personalized recommendations, and follow an AI-crafted itinerary for a stress-free city explore.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment**
   Ensure your `.env` file has your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Run

- **Expo Go (development)**  
   ```bash
   npm start
   ```  
   Then scan the QR code with Expo Go (Android) or the Camera app (iOS).

- **Web**  
   ```bash
   npm run web
   ```

- **Production Builds (EAS)**
   ```bash
   npm i -g eas-cli
   eas build:configure
   npm run build:android # or build:ios
   ```

## Features

- **Mood Selection** — Calm, Romantic, Fun, Nature, Foodie, Spiritual, Adventure, Social.
- **Smart Discovery** — Top 5 places within 8 km, open now, ranked by mood match, distance, and rating.
- **AI Itineraries** — Chat with AI to generate optimized travel plans.
- **Maps** — Internal map visualization and deep links to Google Maps.

# 💕 LoveDZ — Algerian Dating Progressive Web App

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Capacitor](https://img.shields.io/badge/Capacitor-5.x-119EFF.svg?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8.svg?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Service Worker](https://img.shields.io/badge/Service_Worker-Offline_Ready-FF6F00.svg?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

A mobile-first dating & matchmaking Progressive Web App built for Algeria. Features swipe-based interactions, real-time messaging, offline capabilities, and native iOS/Android wrappers via Capacitor.

---

## 🌟 Features

- **📱 Progressive Web App (PWA)**: Installable directly from the browser — no app store needed. Full offline support via Service Worker caching.
- **💖 Swipe-Based Matching**: Tinder-style card swiping for profile discovery and matching.
- **💬 Real-Time Messaging**: In-app chat system for matched users.
- **🇩🇿 Localized for Algeria**: French-language UI, wilaya-based location filtering, and culturally adapted design.
- **📲 Native Mobile Wrappers**: Capacitor integration for publishing to iOS App Store and Google Play Store.
- **🔔 Push Notifications & Shortcuts**: App shortcuts for Messages and Likes directly from the home screen.
- **🎨 Modern UI/UX**: Vibrant `#ff6b6b` theme, portrait-locked orientation, smooth animations and transitions.

---

## 🏗️ Architecture

```
tinder-dz/
├── index.html              # Main SPA (~45KB, full application)
├── manifest.json           # PWA manifest (icons, shortcuts, metadata)
├── sw.js                   # Service Worker for offline caching
├── capacitor.config.json   # Capacitor native bridge configuration
├── package.json            # Dependencies & build scripts
├── css/                    # Stylesheets & animations
├── js/                     # Application logic & components
├── .github/                # GitHub Actions / CI workflows
├── generate-icons.html     # Icon generator utility
└── GUIDE-IPA.md            # Step-by-step iOS .ipa build guide
```

---

## 🚀 Quick Start

### Run as PWA (Browser)

```bash
# Clone the repository
git clone https://github.com/zinosem/tinder-dz.git
cd tinder-dz

# Install dependencies
npm install

# Start local server
npm start
```

Then open `http://localhost:3000` and click **"Add to Home Screen"** for the full app experience.

### Build for iOS / Android (Capacitor)

```bash
# Add platforms
npm run cap:add:ios
npm run cap:add:android

# Sync web assets to native projects
npm run cap:sync

# Open in Xcode / Android Studio
npm run cap:open:ios
npm run cap:open:android
```

> See [GUIDE-IPA.md](GUIDE-IPA.md) for detailed iOS `.ipa` build instructions.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| **PWA** | Service Worker, Web App Manifest, Cache API |
| **Native Bridge** | Capacitor 5.x (iOS + Android) |
| **Deployment** | Static hosting (Vercel, Netlify, or any CDN) |

---

## 📄 License

Distributed under the MIT License.

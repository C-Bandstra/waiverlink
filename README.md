# WaiverLink

**WaiverLink** is a lightweight, modular digital waiver system built to replace outdated physical waivers used by businesses in gear rental, demos, and liability-sensitive workflows.

The system is designed to be frictionless for guests, easy to manage for staff, and deeply extensible for tracking, analytics, and potential customer conversion.

## 🚀 Goals

- Minimal input required from end-users (like signing a paper waiver)
- Guest-first flow with no login required
- Easily pluggable into existing business systems
- Reusable and dynamic data structures for multiple industries
- Lightweight admin interface for real-time tracking and management

## 🧱 Tech Stack

- **Frontend:** React (Vite) + TypeScript + TailwindCSS
- **Backend:** Firebase (Auth + Firestore)
- **Hosting:** Vercel or Firebase Hosting (TBD)

## 🗺️ Structure (Planned)

- `/components` – Reusable UI elements  
- `/features` – Waiver flow, admin dashboard, guest tracking  
- `/lib` – Firebase, utils, helper functions  
- `/types` – App-wide TypeScript models  
- `/pages` – Route-based pages (if using Next/Vite SPA)

## 🧪 Current Status

- 🟡 Initial scaffolding and configuration
- 🟡 Basic waiver UI prototype
- 🟡 Dynamic business configuration proof-of-concept

## 🔜 Upcoming Features

- Signature capture
- Database write on submit
- Active demo tracking (admin)
- Guest profile export & analytics

## 🛠️ Dev Setup

```bash
git clone https://github.com/yourusername/waiverlink.git
cd waiverlink
npm install
npm run dev

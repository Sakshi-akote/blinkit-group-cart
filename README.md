# Blinkit Shared Group Cart & Bill Split

A collaborative grocery cart web application inspired by Blinkit where roommates and friends can add items together, join via personalized invite links (`?user=`), and automatically split handling/delivery charges.

## Key Features
- **Collaborative Shared Cart:** Real-time polling sync (`2s` interval) for shared items, quantities, and user attribution (`Added by`).
- **Dynamic Invite Links:** Generates personalized URLs with `?user=` query parameters to automatically switch/join as an active user.
- **Automated Bill Splitting:** Calculates item totals and splits handling/delivery charges equally among active ordering users, complete with an order confirmation breakdown modal.
- **Responsive Store Catalog:** Product cards with thumbnails, graceful `onError` fallbacks, and single-line `+ ADD` controls.

## Tech Stack
- **Frontend:** React, Tailwind CSS, JavaScript (ES6+)
- **Backend:** Python (Flask) REST API

## Run Locally
1. Start the Flask backend server on `http://127.0.0.1:5000`.
2. In the frontend directory, run:
   ```bash
   npm install
   npm run dev
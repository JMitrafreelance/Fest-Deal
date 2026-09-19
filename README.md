# Dealzy — Affiliate E-commerce Starter

## Architecture
- `frontend/`: static HTML/CSS/JavaScript. Host this on GitHub Pages.
- `backend/`: Node.js/Express API. Deploy this on Render.
- Database: MongoDB Atlas. Do NOT upload a MongoDB database file to GitHub.
- Product buy buttons use each product's `amazonUrl`; replace demo URLs with your own Amazon affiliate URLs.
- Telegram: https://t.me/webbdeal

## 1. MongoDB Atlas
Create a MongoDB Atlas cluster and database. Copy the connection string.

## 2. Render
Create a Web Service from the `backend` folder/repository.
Build command: `npm install`
Start command: `npm start`

Add Render environment variables:
`MONGODB_URI`
`JWT_SECRET`
`ADMIN_USERNAME=Admin`
`ADMIN_PASSWORD=Ecom12@`
`FRONTEND_URL=https://YOUR-USERNAME.github.io/YOUR-REPO`

Change the password before production.

## 3. GitHub Pages
Upload the `frontend` files to a GitHub repository. In `index.html` and `admin.html`, replace:
`https://YOUR-RENDER-SERVICE.onrender.com/api`
with your actual Render API URL.

Enable GitHub Pages for the repository.

## 4. Admin
Open `/admin.html`.
Default credentials configured by the example:
Username: `Admin`
Password: `Ecom12@`

Products and blog posts are stored in MongoDB and can be created, edited, and deleted from the dashboard.

## Important
GitHub Pages cannot execute Node.js or MongoDB. The working production setup is:
Browser → GitHub Pages frontend → Render API → MongoDB Atlas.

Never put MongoDB passwords, JWT secrets, Razorpay secrets, or other private keys in the public GitHub frontend.

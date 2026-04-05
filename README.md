# 🚀 TradeVault — Deployment Guide

## What You're Deploying
A full-stack Trading Journal & Strategy Repository with:
- Real signup/signin with encrypted passwords
- MongoDB database for all data
- Strategy CRUD (create, edit, delete)
- Trade journal with lot size calculator
- Performance dashboard with calendar
- Hosted on Vercel (free)

---

## 📋 STEP 1: Get a Free MongoDB Database (5 minutes)

1. Go to **https://www.mongodb.com/atlas** and click **"Try Free"**
2. Create an account (use Google sign-in for speed)
3. Choose **FREE / M0 Sandbox** cluster
4. Select a region close to you (e.g., Mumbai for India)
5. Click **"Create Deployment"**
6. It will ask you to create a **Database User**:
   - Username: `tradevault` (or anything you want)
   - Password: Click **"Autogenerate"** and **COPY THIS PASSWORD** somewhere safe
   - Click **"Create Database User"**
7. For **"Where would you like to connect from?"**:
   - Click **"Allow Access from Anywhere"** (adds 0.0.0.0/0)
   - Click **"Finish and Close"**
8. Now click **"Connect"** on your cluster
9. Choose **"Drivers"**
10. You'll see a connection string like:
    ```
    mongodb+srv://tradevault:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
    ```
11. **Replace `<password>` with the password you copied** in step 6
12. **Add `/tradevault` before the `?`** so it looks like:
    ```
    mongodb+srv://tradevault:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/tradevault?retryWrites=true&w=majority
    ```
13. **SAVE THIS FULL STRING** — this is your `MONGODB_URI`

---

## 📋 STEP 2: Push Code to GitHub (3 minutes)

1. Go to **https://github.com** and sign in (or create account)
2. Click the **"+"** icon → **"New repository"**
3. Name it `tradevault`, keep it **Private**, click **"Create"**
4. Open **Terminal** (Mac) or **Command Prompt** (Windows) on your computer
5. Navigate to where you extracted this ZIP file:
   ```bash
   cd path/to/tradevault
   ```
6. Run these commands one by one:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/tradevault.git
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username)

---

## 📋 STEP 3: Deploy to Vercel (3 minutes)

1. Go to **https://vercel.com** and sign in with GitHub
2. Click **"Add New Project"**
3. Find and select your `tradevault` repository
4. **IMPORTANT — Add Environment Variables** before deploying:
   
   Click **"Environment Variables"** and add these 3:

   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | Your MongoDB connection string from Step 1 |
   | `NEXTAUTH_SECRET` | Go to https://generate-secret.vercel.app/32 and copy the result |
   | `NEXTAUTH_URL` | Leave blank for now (Vercel auto-detects) |

5. Click **"Deploy"**
6. Wait 1-2 minutes for the build to complete
7. 🎉 **Your app is live!** Vercel gives you a URL like `tradevault.vercel.app`

---

## 📋 STEP 4: Set NEXTAUTH_URL (1 minute)

1. After deploy, copy your Vercel URL (e.g., `https://tradevault-abc123.vercel.app`)
2. In Vercel dashboard → **Settings** → **Environment Variables**
3. Add or update:
   - Name: `NEXTAUTH_URL`
   - Value: `https://tradevault-abc123.vercel.app` (your actual URL)
4. Click **"Redeploy"** from the Deployments tab (click ⋯ → Redeploy)

---

## ✅ YOU'RE DONE!

Your TradeVault is now live with:
- ✅ Real user accounts (signup/signin)
- ✅ MongoDB database storing everything
- ✅ Strategies persist forever
- ✅ Trade history saved permanently
- ✅ Dashboard pulls from real data
- ✅ Free hosting on Vercel
- ✅ Free database on MongoDB Atlas

---

## 🔧 Running Locally (Optional, for Development)

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your MongoDB URI and a secret in `.env.local`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run development server:
   ```bash
   npm run dev
   ```
5. Open **http://localhost:3000**

---

## 📁 Project Structure

```
tradevault/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.js  ← Login/session handling
│   │   │   └── signup/route.js          ← User registration
│   │   ├── strategies/route.js          ← Strategy CRUD API
│   │   └── trades/route.js              ← Trade CRUD API
│   ├── globals.css                      ← All styles
│   ├── layout.js                        ← Root layout
│   └── page.js                          ← Entire frontend app
├── components/
│   └── AuthProvider.js                  ← NextAuth wrapper
├── lib/
│   ├── api.js                           ← Frontend API helper
│   └── mongodb.js                       ← Database connection
├── models/
│   ├── User.js                          ← User schema
│   ├── Strategy.js                      ← Strategy schema
│   └── Trade.js                         ← Trade schema
├── .env.example                         ← Environment template
├── package.json                         ← Dependencies
├── next.config.js                       ← Next.js config
├── tailwind.config.js                   ← Tailwind config
└── README.md                            ← This file
```

---

## ❓ Troubleshooting

**"MONGODB_URI not defined" error:**
→ Make sure you added the environment variable in Vercel settings

**"No account found" when signing in:**
→ You need to Sign Up first, then Sign In

**Build fails on Vercel:**
→ Check that all 3 environment variables are set correctly
→ Make sure MONGODB_URI has the actual password (not `<password>`)

**Blank page after deploy:**
→ Check Vercel logs (Deployments → click latest → Function Logs)
→ Usually means MongoDB URI is wrong

**Need help?** The most common issue is the MongoDB connection string. Make sure:
1. You replaced `<password>` with your actual password
2. You added `/tradevault` before the `?` in the URI
3. You enabled "Allow Access from Anywhere" in MongoDB Atlas

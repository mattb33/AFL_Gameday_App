# 🚀 Quick Start: Deploy Your AFL App in 10 Minutes

## Step-by-Step (Copy & Paste Ready)

### 1️⃣ Create GitHub Account & Repository

1. Go to **github.com**
2. Sign up (free)
3. After login, click **"+"** (top right) → **"New repository"**
4. Name it: `afl-gameday-app`
5. Keep it **public**
6. ✅ Create repository

### 2️⃣ Upload Your Files

You need these files in your GitHub repo:

```
afl-gameday-app/
├── public/
│   └── index.html
├── src/
│   ├── afl_gameday_app.jsx
│   └── index.js
├── package.json
├── .gitignore
└── README.md (optional)
```

**To upload:**
1. In your new GitHub repo, click **"Add file"** → **"Upload files"**
2. Download these files from the files I provided:
   - `afl_gameday_app.jsx` → goes in `src/` folder
   - `package.json`
   - `.gitignore`
   - `public_index.html` → rename to `index.html` and put in `public/` folder
   - `src_index.js` → rename to `index.js` and put in `src/` folder
3. Click **"Commit changes"**

### 3️⃣ Deploy with Vercel

1. Go to **vercel.com**
2. Click **"Sign Up"**
3. Select **"Continue with GitHub"**
4. Authorize Vercel to access GitHub
5. Click **"Import Project"**
6. Find and click **"afl-gameday-app"** repository
7. Click **"Import"**
8. Vercel will auto-detect React - just click **"Deploy"**
9. ⏳ Wait ~60 seconds for build to complete

### 4️⃣ Your App is Live! 🎉

- **URL appears:** `https://afl-gameday-app.vercel.app`
- Click the URL to test
- Share this URL with anyone (works on mobile immediately)

---

## 📱 Use on Mobile

### iPhone
1. Open Safari
2. Paste your Vercel URL
3. Click **Share** (bottom) → **"Add to Home Screen"**
4. Name: "AFL Gameday"
5. Click **"Add"**
6. Now in your home screen like a native app!

### Android
1. Open Chrome
2. Paste your Vercel URL
3. Click **⋮** (menu) → **"Install app"**
4. Confirm
5. Now in your home screen like a native app!

---

## 🔄 Making Changes Later

Once deployed:

1. **Edit files on GitHub** directly (or download, edit locally, re-upload)
2. **Commit changes**
3. Vercel automatically redeploys (~30 seconds)
4. **Refresh app on mobile** - changes appear instantly

Example: Update team list → Edit `afl_gameday_app.jsx` → Commit → Done!

---

## ⚡ What You Get (Free, Forever)

✅ Unlimited deployments  
✅ Unlimited bandwidth  
✅ Automatic HTTPS  
✅ Global CDN (fast everywhere)  
✅ Auto-builds on every commit  
✅ Custom domain support (upgrade later)  
✅ Analytics & logs  
✅ No credit card needed  

---

## 🆘 Troubleshooting

| Error | Fix |
|-------|-----|
| "Build failed" | Check package.json is in root folder, not in a subfolder |
| App blank/white | Check `public/index.html` exists with `<div id="root"></div>` |
| "Module not found: lucide-react" | Ensure lucide-react is in package.json dependencies |
| Tailwind not styling | Check script tag in public/index.html: `<script src="https://cdn.tailwindcss.com"></script>` |
| Can't access on mobile | Use full Vercel URL (not localhost) |
| Changes not appearing | Wait for Vercel to redeploy (check Deployments tab), then hard refresh on mobile |

---

## 📋 File Folder Structure Reference

```
afl-gameday-app/                    ← GitHub repo root
│
├── public/
│   └── index.html                  ← Rename from public_index.html
│
├── src/
│   ├── afl_gameday_app.jsx         ← Your main app component
│   └── index.js                    ← Rename from src_index.js
│
├── package.json                    ← Dependencies list
├── .gitignore                      ← Ignore node_modules etc
└── README.md                       ← Optional info file
```

---

## 🎯 One-Liner If You Know Git

```bash
git clone <your-repo>
cd afl-gameday-app
# Add files per structure above
git add .
git commit -m "Initial commit"
git push
# Then connect to Vercel via vercel.com
```

---

## 💡 Pro Tips

1. **Custom Domain** (free)
   - Buy domain from GoDaddy, Namecheap, etc.
   - Vercel Settings → Domains → Add
   - Costs ~$10/year for domain only

2. **Environment Variables** (if needed later)
   - Vercel Settings → Environment Variables
   - Use for API keys, team colors, etc.

3. **Version Control**
   - Always commit before major changes
   - Easy to revert if something breaks

4. **Offline Mode** (advanced, optional)
   - Can add PWA (Progressive Web App) features later
   - Allows app to work offline

---

## Next Steps

✅ Deploy today  
✅ Test on your phone during a game  
✅ Gather feedback from other coaches  
✅ Customize team list  
✅ Plan improvements  

**You're set! Your AFL coaching app is now mobile-ready!** 🏈

# Hosting Your AFL Gameday App - Free & Trial Options

## Quick Comparison

| Service | Type | Free Tier | Setup Time | Mobile Ready | Recommendation |
|---------|------|-----------|-----------|--------------|-----------------|
| **Vercel** | Static/Full Stack | Yes (unlimited) | 2 min | ✅ Perfect | ⭐ BEST for this app |
| **Netlify** | Static/Full Stack | Yes (unlimited) | 2 min | ✅ Perfect | ⭐ BEST (Alternative) |
| **GitHub Pages** | Static Only | Yes | 5 min | ✅ Good | Basic option |
| **Firebase Hosting** | Static/Full Stack | Yes (generous) | 3 min | ✅ Perfect | Good backup |
| **Replit** | Full Stack | Yes (limited) | 1 min | ✅ Good | Quick testing |
| **Heroku** | Full Stack | No (ended free tier) | — | ✅ | ❌ Not recommended |

---

## 🌟 RECOMMENDED: Vercel (Easiest & Best)

### Why Vercel?
- **Completely free forever** for personal use
- **Instant deployment** from GitHub
- **Fast global CDN** - great for mobile
- **Auto-updates** when you push to GitHub
- **Perfect for React apps**
- **Custom domain support** (even on free tier)

### Setup Steps:

#### 1. Create GitHub Account (if needed)
- Go to github.com and sign up
- Free account is fine

#### 2. Create a GitHub Repository
```
1. Log in to GitHub
2. Click "+" → "New repository"
3. Name it "afl-gameday-app"
4. Click "Create repository"
```

#### 3. Upload Your App Files
```
1. Click "Add file" → "Upload files"
2. Upload these files:
   - afl_gameday_app.jsx
   - package.json (see template below)
   - .gitignore (see template below)
3. Commit with message: "Initial commit"
```

#### 4. Create package.json
Save this as `package.json` in your repo:
```json
{
  "name": "afl-gameday-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

#### 5. Create .gitignore
Save this as `.gitignore`:
```
node_modules/
build/
dist/
.env
.env.local
.DS_Store
```

#### 6. Create public/index.html
Create `public/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="AFL Gameday Coaching App" />
    <title>AFL Gameday App</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

#### 7. Create src/index.js
Create `src/index.js`:
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import AFLGamedayApp from './afl_gameday_app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AFLGamedayApp />
  </React.StrictMode>
);
```

#### 8. Move your app file
Move `afl_gameday_app.jsx` to `src/` folder in your repo

#### 9. Deploy with Vercel
```
1. Go to vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel to access GitHub
4. Click "Import Project"
5. Select your "afl-gameday-app" repository
6. Click "Import"
7. Click "Deploy"
```

**That's it!** Vercel will build and deploy in ~60 seconds.

Your app will be live at: `https://afl-gameday-app.vercel.app`

---

## 🚀 ALTERNATIVE: Netlify (Just as Good)

### Quick Setup:
1. Go to **netlify.com**
2. Click "Sign up" → connect GitHub
3. Click "New site from Git"
4. Select your GitHub repo
5. Set build command: `npm run build`
6. Set publish directory: `build`
7. Click "Deploy"

**URL:** `https://your-site-name.netlify.app`

### Advantages over Vercel:
- Slightly better free form handling
- More generous rate limits
- Manual deployments if needed

---

## 📱 Accessing on Mobile

Once deployed:

### iPhone
1. Open Safari
2. Go to your Vercel/Netlify URL
3. Click Share → "Add to Home Screen"
4. Name it "AFL Gameday"
5. Access like a native app

### Android
1. Open Chrome/Firefox
2. Go to your Vercel/Netlify URL
3. Click menu (⋮) → "Install app" OR "Add to Home Screen"
4. Access like a native app

---

## 🔄 Making Updates

### After deploying with Vercel:

1. Make changes to files in GitHub repo
2. Commit and push: 
   ```
   git add .
   git commit -m "Updated feature"
   git push
   ```
3. Vercel automatically redeploys (~30 seconds)
4. Refresh your app on mobile

---

## Other Options (Less Recommended)

### Firebase Hosting
- **Pros:** Fast, Google-backed, generous free tier
- **Cons:** Requires more setup
- **Setup time:** 5-10 minutes
- **Best for:** Advanced features, backend

### Netlify Starter Sites
- **Pros:** Drag-and-drop deploy
- **Cons:** Limited features
- **Setup time:** 2 minutes
- **Best for:** Quick testing

### Replit
- **Pros:** No setup, live coding
- **Cons:** Limited bandwidth, slower
- **Setup time:** 1 minute
- **Best for:** Development/testing only

---

## 🎯 My Recommendation: Vercel

**Best for your situation because:**
1. ✅ Completely free, forever
2. ✅ Fastest deployment (GitHub integration)
3. ✅ Excellent mobile experience
4. ✅ Auto-updates when you change code
5. ✅ Custom domain support
6. ✅ Works perfectly with React apps
7. ✅ Great performance (global CDN)
8. ✅ No credit card needed

**Total time to live:** ~10 minutes

---

## File Structure Summary

```
afl-gameday-app/
├── public/
│   └── index.html
├── src/
│   ├── afl_gameday_app.jsx
│   └── index.js
├── package.json
├── .gitignore
└── sample_team_list.csv
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Module not found" | Ensure files are in correct folders (src/) |
| "Tailwind not working" | Check `<script src="https://cdn.tailwindcss.com"></script>` in index.html |
| "Lucide icons missing" | Make sure `lucide-react` is in package.json dependencies |
| Slow on mobile | Wait for build to complete (~2 min), clear cache |
| Can't access on mobile | Ensure you're on same WiFi OR use full Vercel URL (not localhost) |

---

## Next Steps After Hosting

1. **Custom Domain** (optional)
   - Vercel: Settings → Domains → Add your domain
   - Free domain: Get one from Freenom.com or similar

2. **HTTPS** (automatic on Vercel)
   - All Vercel deployments are automatically HTTPS

3. **Mobile Optimization**
   - App is already mobile-optimized
   - Can add PWA features later for offline support

4. **Backup & Source Control**
   - Keep GitHub repo updated
   - Never lose code again!

---

## Getting Help

- **Vercel Docs:** vercel.com/docs
- **Netlify Docs:** docs.netlify.com
- **React Docs:** react.dev
- **Tailwind Docs:** tailwindcss.com/docs

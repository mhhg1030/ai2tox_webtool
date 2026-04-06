# Nano-Tumor Database — Frontend

React app hosted on GitHub Pages, backed by Supabase.

---

## Quick Start (local dev)

```bash
npm install
cp .env.example .env
# Fill in your Supabase URL and anon key in .env
npm run dev
```

## Deploy to GitHub Pages

### One-time setup
1. Push this repo to GitHub
2. Go to repo Settings → Pages → Source: **GitHub Actions**
3. Add your Supabase secrets in repo Settings → Secrets → Actions:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Update `REPO_NAME` in `vite.config.js` to match your repo name

### Every deploy
Just push to `main` — GitHub Actions builds and deploys automatically.

## Set up Google Login

1. Go to [Supabase Dashboard](https://supabase.com) → Authentication → Providers → Google
2. Enable Google provider
3. Add your Google OAuth Client ID and Secret
   - Create credentials at [console.cloud.google.com](https://console.cloud.google.com)
4. Set Authorized redirect URI to:
   ```
   https://YOUR_USERNAME.github.io/nano-tumor-db/
   ```

## Project Structure

```
src/
  lib/
    supabase.js      ← Supabase client (paste your keys in .env)
    AuthContext.jsx  ← Google login state
    mockData.js      ← Sample data (replace with Supabase queries later)
  components/
    Navbar.jsx
  pages/
    Home.jsx
    Dashboard.jsx    ← Main data table + filter panel
    Tutorial.jsx
    Contact.jsx
```

## Next Step: Connect Real Data

When you're ready to add your database, see `src/lib/mockData.js` — 
replace the `MOCK_PARTICLES` array with a Supabase query like:

```js
const { data } = await supabase.from('nanoparticles').select('*')
```

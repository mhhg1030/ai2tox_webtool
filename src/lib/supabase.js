import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS
// 1. Go to https://supabase.com and create a free project
// 2. In your project: Settings → API
// 3. Copy "Project URL" and "anon public" key
// 4. Create a file called .env in your project root:
//
//    VITE_SUPABASE_URL=https://xxxx.supabase.co
//    VITE_SUPABASE_ANON_KEY=your-anon-key-here
//
// 5. For Google login:
//    - Supabase Dashboard → Authentication → Providers → Google → Enable
//    - Add your Google OAuth Client ID + Secret
//    - Set redirect URL to: https://YOUR_USERNAME.github.io/nano-tumor-db/
// ─────────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️  Supabase env vars not set. See src/lib/supabase.js for setup instructions.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

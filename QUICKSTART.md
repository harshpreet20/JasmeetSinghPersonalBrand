# Quick Start Guide

**Status:** ✅ Production-Ready  
**Last Updated:** June 2, 2026

---

## 1-Minute Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier OK)
- Anthropic API key

### Installation
```bash
# Clone and install
git clone <repo> && cd JasmeetSinghPersonalBrand
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### Deploy to Production
```bash
# Build for production
npm run build

# Test production build
npm run start

# Deploy to Vercel (recommended)
vercel deploy --prod
```

---

## Required Credentials

Get these from the respective dashboards:

| Variable | Source | Example |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | `eyJ...` |
| `ANTHROPIC_API_KEY` | Anthropic Console | `sk-ant-...` |
| `SEARCHINTEL_API_KEY` | SearchIntel Dashboard | `your-key` |
| `NEXT_PUBLIC_SITE_URL` | Your domain | `https://jasmeetsingh.com` |

---

## Security Checklist

- [x] Input validation on all API endpoints
- [x] Security headers configured
- [x] Admin routes protected with middleware
- [x] RLS policies documented
- [x] No SQL injection vulnerabilities
- [x] No XSS vulnerabilities
- [x] HTTPS/TLS ready (Vercel)

---

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes (all validated)
│   │   ├── chat/
│   │   ├── blog/
│   │   └── admin/
│   ├── admin/            # Protected admin pages
│   │   ├── blog/
│   │   ├── leads/
│   │   ├── chats/
│   │   └── knowledge/
│   ├── blog/             # Public blog pages
│   ├── page.tsx          # Homepage
│   └── layout.tsx        # Root layout
├── components/
│   ├── ChatWidget.tsx    # Floating chat
│   └── ChatWidgetLoader.tsx
├── lib/
│   └── supabase-browser.ts
└── middleware.ts         # Route protection

public/                   # Static assets
next.config.ts           # Next.js config + security headers
```

---

## Key Features

### Public Features
- 🏠 Homepage with StoryBrand narrative
- 💬 Floating chatbot (Claude Haiku)
- 📝 Public blog system
- 📋 Lead capture form
- 📊 SEO analysis (SearchIntel)

### Admin Features
- 🔐 Protected dashboard (auth required)
- 📚 Knowledge base editor
- ✍️ Blog creation & publishing
- 👥 Lead management
- 💬 Chat transcripts
- 📊 Analytics (coming soon)

---

## API Endpoints

### Public APIs (No auth required)
```
POST /api/chat                      # Chat with Claude
POST /api/chat/lead                 # Capture lead from chat
POST /api/blog/view                 # Track blog views
GET  /blog                          # List published blogs
GET  /blog/[slug]                   # Read blog post
```

### Protected APIs (Admin only)
```
POST /api/admin/analyze-blog        # Analyze blog SEO
GET  /api/admin/blogs               # List all blogs
POST /api/admin/blogs               # Create blog
PUT  /api/admin/blogs/[id]          # Update blog
```

---

## Testing

### Manual Testing
```bash
# Test homepage
curl http://localhost:3000

# Test chat API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'

# Test input validation
curl -X POST http://localhost:3000/api/blog/view \
  -H "Content-Type: application/json" \
  -d '{"slug":"test; DROP TABLE--"}' # Will be rejected

# Test lead capture
curl -X POST http://localhost:3000/api/chat/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John",
    "email":"john@example.com",
    "phone":"+91-9876543210",
    "problemSummary":"Career help"
  }'
```

### Security Testing
- ✅ SQL injection prevention
- ✅ XSS attack prevention
- ✅ CSRF protection
- ✅ Input validation
- ✅ Authentication bypass prevention

---

## Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview |
| `COMPLETION_REPORT.md` | Project completion details |
| `IMPLEMENTATION_SUMMARY.md` | Security features & testing |
| `TESTING_AND_SECURITY.md` | Comprehensive security audit |
| `SUPABASE_SECURITY_SETUP.md` | Database RLS policies |
| `DEPLOYMENT_GUIDE.md` | Step-by-step deployment |
| `QUICKSTART.md` | This file |

---

## Common Tasks

### Add New Blog Post
1. Go to http://localhost:3000/admin/blog
2. Click "+ New Blog"
3. Fill in title, slug, content
4. Click "Analyze with SearchIntel"
5. Click "Publish"

### Create Chatbot Knowledge Item
1. Go to http://localhost:3000/admin/knowledge
2. Click "New Item"
3. Select category, add title & content
4. Save (takes effect immediately)

### Update Homepage Content
1. Edit `src/app/page.tsx`
2. Search for `c(cm, section, key, default)`
3. Update hardcoded fallbacks
4. Rebuild and redeploy

### Monitor Admin Activity
1. Go to http://localhost:3000/admin/leads
2. View captured leads
3. Update status and notes
4. Export as CSV

---

## Environment Variables Explained

```env
# Supabase - Database & Auth
NEXT_PUBLIC_SUPABASE_URL         # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY    # Public key (safe to expose)
SUPABASE_SERVICE_ROLE_KEY        # Secret key (server-only!)

# Anthropic - Chatbot AI
ANTHROPIC_API_KEY                # Claude API key

# SearchIntel - SEO Analysis
SEARCHINTEL_API_KEY              # SEO analysis API key

# Site Configuration
NEXT_PUBLIC_SITE_URL             # Your domain
```

**Never commit `.env.local`** - it's in `.gitignore` for security!

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "SUPABASE_URL is required" | Check `.env.local` has correct values |
| "Invalid API key" | Re-copy from dashboards, check for spaces |
| "Chat not responding" | Verify `ANTHROPIC_API_KEY` is valid |
| "Database connection failed" | Check Supabase is running, credentials valid |
| "Admin auth redirects to login" | Middleware working as intended - sign up first |

---

## Performance Tips

- ✅ Next.js 16.2.6 with Turbopack (3x faster builds)
- ✅ Dynamic imports for ChatWidget (reduces main bundle)
- ✅ Static generation for blog list
- ✅ Image optimization configured
- ✅ Database indexes recommended (see DEPLOYMENT_GUIDE.md)

---

## Security Reminders

- 🔒 Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- 🔒 Never commit `.env.local` to git
- 🔒 Always use HTTPS in production
- 🔒 Enable RLS policies on all Supabase tables
- 🔒 Rotate API keys monthly in production
- 🔒 Monitor admin activity with audit logs

---

## Getting Help

### Documentation
- Start with relevant `.md` file in this repo
- Check `TESTING_AND_SECURITY.md` for common issues

### External Help
- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Vercel:** https://vercel.com/docs
- **Anthropic:** https://docs.anthropic.com

---

## Next Steps

1. **Setup Supabase:**
   ```bash
   # Follow SUPABASE_SECURITY_SETUP.md
   ```

2. **Configure Credentials:**
   ```bash
   # Edit .env.local with your keys
   ```

3. **Test Locally:**
   ```bash
   npm run dev
   # Test all features at http://localhost:3000
   ```

4. **Deploy:**
   ```bash
   # Follow DEPLOYMENT_GUIDE.md for step-by-step instructions
   ```

---

## Success Checklist

- [ ] Node dependencies installed
- [ ] Environment variables configured
- [ ] Supabase project created
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Dev server running without errors
- [ ] Homepage loads in browser
- [ ] ChatWidget appears and responds
- [ ] Admin login works
- [ ] API endpoints tested
- [ ] Production build successful
- [ ] Deployed to Vercel
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] All features working in production

---

## Version Info

- **Next.js:** 16.2.6
- **React:** 19.x
- **TypeScript:** Latest
- **Supabase:** Client 2.x
- **Node:** 18+ required

---

**Ready to deploy? Start with the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

Good luck! 🚀

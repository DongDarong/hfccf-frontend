# Quick Start: Deploy HFCCF in 30 Minutes

## 🎯 Goal
Get your HFCCF system live on Vercel + Railway in 30 minutes.

---

## ⏱️ Timeline

| Step | Time | Task |
|------|------|------|
| 1 | 2 min | Create Railway account & project |
| 2 | 3 min | Add MySQL database |
| 3 | 5 min | Configure environment variables |
| 4 | 5 min | Run migrations |
| 5 | 2 min | Create Vercel account & project |
| 6 | 3 min | Set environment variables |
| 7 | 5 min | Wait for builds to complete |
| 8 | 3 min | Verify deployment |

**Total**: ~30 minutes

---

## 🚀 Quick Deploy

### Step 1: Backend (5 minutes)

```bash
# Visit railway.app
# Sign up with GitHub

# Create project from:
# DongDarong/hfccf-backend
# Select: release/one-month-hosting branch

# Add MySQL service
# Copy .env.railway values to Railway Variables

# Run migrations:
# In Railway Shell:
php artisan migrate --force
```

**Save**: Your backend URL
```
https://your-project-xxxx.railway.app
```

### Step 2: Frontend (5 minutes)

```bash
# Visit vercel.com
# Sign up with GitHub

# Import project:
# DongDarong/hfccf-frontend

# Set environment variable:
VITE_API_BASE_URL=https://your-project-xxxx.railway.app/api

# Click Deploy
# Wait 5-10 minutes
```

**Your frontend URL**:
```
https://your-project.vercel.app
```

### Step 3: Test (3 minutes)

```bash
# Visit your Vercel URL
# Open DevTools (F12)
# Check console for errors
# Try logging in
```

---

## 📋 Required Credentials

### GitHub
- Email: dngdarong@gmail.com
- Repos: DongDarong/hfccf-frontend & hfccf-backend

### Railway Account
- Free tier: $5 credit/month (enough for dev/staging)
- Cost: ~$15-20/month for production MySQL

### Vercel Account
- Free tier: Sufficient for production Vue frontend
- Cost: $0 (free)

---

## 🔑 Key Environment Variables

### Backend (Railway)
```env
APP_KEY=base64:xxxxxx (generate with: php artisan key:generate --show)
APP_URL=https://your-backend.railway.app
DB_CONNECTION=mysql
DB_HOST=${{ MYSQL_HOST }}
DB_PORT=${{ MYSQL_PORT }}
DB_DATABASE=${{ MYSQL_DATABASE }}
DB_USERNAME=${{ MYSQL_USER }}
DB_PASSWORD=${{ MYSQL_PASSWORD }}
```

### Frontend (Vercel)
```env
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

---

## ✅ Verification Checklist

- [ ] Backend URL responds to: `curl https://backend/api/auth/me`
- [ ] Frontend loads without errors
- [ ] No CORS errors in console
- [ ] Database migrations ran successfully
- [ ] Login page appears

---

## 🆘 Quick Troubleshooting

**Frontend won't connect to API:**
- Check VITE_API_BASE_URL is correct
- Check backend is running (test with curl)
- Check browser console for CORS errors

**Build fails on Railway:**
- Check Procfile syntax
- Verify PHP version 8.3+
- Check composer.json dependencies

**Build fails on Vercel:**
- Check Node version 18+
- Verify environment variables set
- Check .vercelignore isn't too aggressive

---

## 📚 Full Guides

- **Backend**: See DEPLOYMENT-RAILWAY.md
- **Frontend**: See DEPLOYMENT.md
- **Complete**: See DEPLOYMENT-COMPLETE.md

---

## 🎉 You're Done!

Your HFCCF system is now live in production!

**Next Steps** (Optional):
1. Set up custom domains
2. Enable monitoring
3. Configure backups
4. Add Cloudflare R2 for file storage

**Questions?** See the full deployment guides or Railway/Vercel docs.

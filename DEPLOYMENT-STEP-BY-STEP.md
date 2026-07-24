# Step-by-Step Deployment Guide
**Status**: Starting Production Deployment  
**Target**: Vercel (Frontend) + Railway (Backend)  
**Estimated Time**: 30-40 minutes

---

## 📋 Pre-Deployment Checklist

Before starting, verify you have:
- [ ] GitHub account logged in
- [ ] Vercel account created (free tier: https://vercel.com/signup)
- [ ] Railway account created (free tier: https://railway.app/signup)
- [ ] Both PRs merged to main
- [ ] Email access for confirmations

---

## 🚀 PART 1: Backend Deployment (Railway) - 15 minutes

### Step 1.1: Create Railway Account
If you haven't already:
1. Go to https://railway.app
2. Click "Start Project"
3. Sign up with GitHub (DongDarong account)
4. Authorize Railway to access GitHub
5. ✅ Account ready

### Step 1.2: Create New Project
1. Click **"New Project"** (top right)
2. Select **"Deploy from GitHub repo"**
3. Select **DongDarong/hfccf-backend**
4. Select branch: **main** (now has latest code)
5. Click **"Deploy"**
6. ⏳ Wait 2-3 minutes for initial setup

### Step 1.3: Add MySQL Database
1. In Railway Dashboard, click **"Add Service"**
2. Select **"Database"** → **"MySQL"**
3. Wait 2-3 minutes for database to initialize
4. ✅ Database created

### Step 1.4: Configure Environment Variables
In Railway Dashboard → Project → Variables, add these:

```env
APP_ENV=production
APP_DEBUG=false
APP_NAME="HFCCF Backend"
APP_URL=${{ RAILWAY_PUBLIC_DOMAIN }}
DB_CONNECTION=mysql
DB_HOST=${{ MYSQL_HOST }}
DB_PORT=${{ MYSQL_PORT }}
DB_DATABASE=${{ MYSQL_DATABASE }}
DB_USERNAME=${{ MYSQL_USER }}
DB_PASSWORD=${{ MYSQL_PASSWORD }}
SANCTUM_STATEFUL_DOMAINS=${{ RAILWAY_PUBLIC_DOMAIN }}
```

**Copy these values from the MySQL service card in Railway Dashboard.**

### Step 1.5: Generate APP_KEY

Run this locally in terminal/PowerShell:
```bash
cd C:\laragon\www\hfccf-backend
php artisan key:generate --show
```

Output will look like: `base64:xxxxxxxxxxxxx`

Copy that value and add to Railway variables:
```env
APP_KEY=base64:xxxxxxxxxxxxx
```

### Step 1.6: Run Database Migrations

In Railway Dashboard:
1. Click the **railway-app** service (your backend)
2. Click **"Shell"** tab (or **"Logs"** then find Shell option)
3. Run these commands one by one:

```bash
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

⏳ Wait for each command to complete (2-3 minutes total)

### Step 1.7: Verify Backend Deployment

In Railway Dashboard:
1. Find your project domain (looks like: `https://hfccf-backend-xxxx.railway.app`)
2. Test API endpoint:

```bash
curl https://your-backend-url.railway.app/api/auth/me
```

Should return: `401 Unauthorized` (expected - no auth token)

**✅ Backend deployed and working!**

**Save this URL**: `https://your-backend-url.railway.app`  
You'll need it for frontend configuration.

---

## 🎨 PART 2: Frontend Deployment (Vercel) - 10 minutes

### Step 2.1: Create Vercel Account
If you haven't already:
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Sign up with GitHub"
4. Authorize Vercel
5. ✅ Account ready

### Step 2.2: Import Project
1. In Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select: **DongDarong/hfccf-frontend**
4. Click **"Import"**

### Step 2.3: Configure Project Settings

In Import Project page:

**Build Settings** (should auto-fill):
- Framework: **Vue**
- Build Command: **`npm run build`**
- Output Directory: **`dist`**
- Install Command: **`npm ci --legacy-peer-deps`**

**Environment Variables**: Add one variable:

Name: `VITE_API_BASE_URL`  
Value: `https://your-backend-url.railway.app/api`

(Use the backend URL from Step 1.7)

### Step 2.4: Deploy

1. Click **"Deploy"** button
2. ⏳ Wait 8-10 minutes for build to complete
3. See "Congratulations! Your project has been successfully deployed"
4. ✅ Frontend deployed!

**Your frontend URL will be shown**: `https://your-project.vercel.app`

---

## ✅ PART 3: Verify Deployment - 5 minutes

### Verification Checklist

**Backend:**
```bash
# Test API endpoint
curl https://your-backend-url.railway.app/api/auth/me
# Expected: 401 Unauthorized (OK, no token)

# Check routes
curl https://your-backend-url.railway.app/api/preschool/teachers
# Expected: 401 Unauthorized (OK, no token)
```

**Frontend:**
1. Visit: `https://your-project.vercel.app`
2. Open DevTools (F12)
3. Go to **Console** tab
4. Check for errors (should be none)
5. Go to **Network** tab
6. Reload page
7. Look for API calls to your backend URL
8. Verify no CORS errors

**Login Test:**
1. On frontend, go to login page
2. Try logging in with test credentials
3. Should see: Either login success or API error (not CORS error)

**✅ Both systems deployed and communicating!**

---

## 📊 Deployment Summary

| Component | Status | URL |
|-----------|--------|-----|
| Backend | ✅ Deployed | `https://your-backend.railway.app` |
| Frontend | ✅ Deployed | `https://your-project.vercel.app` |
| Database | ✅ Running | Railway MySQL |
| API Health | ✅ Working | `/api/auth/me` returns 401 |

---

## 🆘 Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# In Railway Shell, verify database:
php artisan tinker
>>> DB::connection()->getPdo();
# Should show connection details
```

**Migration Failed:**
```bash
# Rerun migrations
php artisan migrate:reset --force
php artisan migrate --force
```

**Routes Not Loading:**
```bash
php artisan route:cache
php artisan config:cache
```

### Frontend Issues

**API Connection Failed:**
1. Check `VITE_API_BASE_URL` in Vercel Settings
2. Verify backend URL is correct
3. Test with curl command above
4. Check browser console for CORS errors

**Build Failed on Vercel:**
1. Check Node version: need 18+
2. Check for missing environment variables
3. Review build logs in Vercel
4. Verify .vercelignore isn't hiding critical files

**CORS Errors:**
1. Backend CORS might need configuration
2. Check `SANCTUM_STATEFUL_DOMAINS` is set correctly
3. Verify frontend domain matches configuration

---

## 📱 Post-Deployment Steps

### 1. Set Custom Domains (Optional)

**Frontend Custom Domain:**
- Vercel Dashboard → Settings → Domains
- Add your domain (e.g., hfccf.yourdomain.com)
- Follow DNS configuration

**Backend Custom Domain:**
- Railway Dashboard → Networking
- Add domain
- Update frontend `VITE_API_BASE_URL` with new domain

### 2. Monitor Performance

**Vercel:**
- Enable Analytics: Project Settings → Analytics
- Monitor deployment time and page load

**Railway:**
- Monitor CPU/Memory usage
- Check deployment logs regularly
- Set up error alerts

### 3. Backup & Recovery

**Database Backups:**
- Railway: Auto-backups enabled (free tier)
- Verify: Railway Dashboard → MySQL → Backups

**Code Backups:**
- GitHub: Already backed up in repository
- All deployment config in repository

### 4. Security Checklist

- [ ] `APP_DEBUG=false` (production)
- [ ] `APP_ENV=production`
- [ ] `APP_KEY` is unique
- [ ] Database passwords are strong
- [ ] No secrets in git
- [ ] CORS whitelist configured
- [ ] HTTPS enforced

---

## 🎉 Deployment Complete!

Your HFCCF system is now live in production!

**System URLs:**
- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-backend.railway.app/api`
- **Admin Panel**: `https://your-project.vercel.app/admin`

**Next Steps:**
1. Test all features in production
2. Load test with production data
3. Monitor for errors
4. Set up automated backups
5. Plan for scaling (if needed)

---

## 📞 Support

**Documentation:**
- Frontend: DEPLOYMENT.md
- Backend: DEPLOYMENT-RAILWAY.md
- Complete: DEPLOYMENT-COMPLETE.md

**External Help:**
- Vercel: https://vercel.com/support
- Railway: https://railway.app/support
- GitHub: https://github.com/DongDarong/hfccf-frontend/issues

---

## ✨ Production Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] MySQL database initialized
- [ ] Migrations run successfully
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Backend and frontend communicating
- [ ] Login functionality working
- [ ] Reports generating correctly
- [ ] No console errors
- [ ] Performance acceptable

**Status**: 🟢 **PRODUCTION READY**

Congratulations! Your HFCCF system is live! 🚀

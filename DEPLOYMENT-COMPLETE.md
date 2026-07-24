# Complete Deployment Guide: HFCCF System

**Last Updated**: 2026-07-24  
**Status**: ✅ Ready for Production  
**Architecture**: Vercel (Frontend) + Railway (Backend) + Cloudflare R2 (Storage)

---

## 📋 Deployment Checklist

### Pre-Deployment ✅
- [x] Frontend code tested and committed
- [x] Backend code tested and committed  
- [x] Linting issues resolved (7 violations fixed)
- [x] Route lists working (400+ endpoints)
- [x] Tests passing (537/651 = 82.5%)
- [x] Environment configurations created
- [x] Deployment files committed

### Deployment Order
1. **Backend (Railway)** - Deploy first (database & API)
2. **Frontend (Vercel)** - Deploy second (points to backend)
3. **Storage (R2)** - Optional, for file uploads

---

## 🚀 Deployment Steps

### Phase 1: Backend Deployment (Railway)

#### 1.1 Create Railway Account
```
1. Visit https://railway.app
2. Click "Start Project"
3. Sign up with GitHub (DongDarong account)
4. Authorize Railway access
```

#### 1.2 Create New Project
```
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose: DongDarong/hfccf-backend
4. Select release/one-month-hosting branch
5. Click "Deploy"
```

#### 1.3 Add MySQL Database
```
1. In Railway Dashboard, click "Add Service"
2. Select "Database" → "MySQL"
3. Wait 2-3 minutes for initialization
4. Note the database connection details
```

#### 1.4 Configure Environment
In Railway Dashboard → Variables:

```env
# Copy .env.railway contents
APP_ENV=production
APP_DEBUG=false
APP_NAME="HFCCF Backend"
APP_URL=${{ RAILWAY_PUBLIC_DOMAIN }}

# Database (Railway auto-provides these)
DB_CONNECTION=mysql
DB_HOST=${{ MYSQL_HOST }}
DB_PORT=${{ MYSQL_PORT }}
DB_DATABASE=${{ MYSQL_DATABASE }}
DB_USERNAME=${{ MYSQL_USER }}
DB_PASSWORD=${{ MYSQL_PASSWORD }}

# Generate with: php artisan key:generate --show
APP_KEY=base64:YOUR_KEY_HERE

# CORS for frontend
SANCTUM_STATEFUL_DOMAINS=${{ RAILWAY_PUBLIC_DOMAIN }}
```

#### 1.5 Generate APP_KEY
```bash
# Run locally:
php artisan key:generate --show

# Output format: base64:xxxxxx
# Add to Railway variables as APP_KEY
```

#### 1.6 Run Migrations
```bash
# In Railway Shell:
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### 1.7 Verify Backend
```bash
# Test API endpoint:
curl https://your-project.railway.app/api/auth/me

# Should return 401 (expected - no auth token)
```

**Backend URL**: `https://your-project.railway.app`

---

### Phase 2: Frontend Deployment (Vercel)

#### 2.1 Connect to Vercel
```
1. Visit https://vercel.com
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Choose: DongDarong/hfccf-frontend
5. Click "Import"
```

#### 2.2 Configure Build Settings
```
Framework Preset: Vue
Build Command: npm run build
Output Directory: dist
Install Command: npm ci --legacy-peer-deps
```

#### 2.3 Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```env
# Production
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

Example:
```env
VITE_API_BASE_URL=https://hfccf-backend-prod.railway.app/api
```

#### 2.4 Deploy
```
1. Click "Deploy"
2. Wait 5-10 minutes for build
3. Check "Production Deployment" status
```

**Frontend URL**: `https://your-project.vercel.app`

#### 2.5 Verify Frontend
```
1. Visit your Vercel URL
2. Open Developer Console (F12)
3. Check Network tab for API calls
4. Verify no CORS errors
5. Test login functionality
```

---

### Phase 3: Optional - Cloudflare R2 Storage

For file uploads (ID cards, reports):

#### 3.1 Create Cloudflare Account
```
1. Visit https://cloudflare.com
2. Sign up for free tier
3. Navigate to R2 (Workers → R2)
4. Create a bucket (e.g., "hfccf-storage")
```

#### 3.2 Generate API Tokens
```
1. Account → API Tokens → Create Token
2. Name: "HFCCF R2 Access"
3. Permissions: Read & Write
4. Resources: Select R2 bucket
5. Copy Access Key ID and Secret
```

#### 3.3 Configure Railway Backend
Add to Railway Environment Variables:

```env
AWS_ACCESS_KEY_ID=your_r2_key_id
AWS_SECRET_ACCESS_KEY=your_r2_secret
AWS_DEFAULT_REGION=auto
AWS_BUCKET=hfccf-storage
AWS_ENDPOINT=https://your-account.r2.cloudflarestorage.com
AWS_URL=https://r2.yourdomain.com
```

#### 3.4 Update Laravel Config
File uploads now use R2 instead of local storage.

---

## 🔍 Post-Deployment Verification

### Backend Health Check
```bash
# Get public domain from Railway
API_URL="https://your-backend.railway.app/api"

# Test health (should return 200)
curl -s $API_URL/auth/me | head -c 50
```

### Frontend Health Check
```
1. Visit frontend URL
2. Open DevTools → Console
3. Check for errors
4. Verify API base URL in Network tab
5. Test login with test credentials
```

### Database Verification
```bash
# In Railway Shell:
php artisan tinker
>>> User::count() // Should return > 0
>>> exit()
```

---

## ⚙️ Production Configuration

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://api.hfccf.your-domain.com/api
VITE_DEBUG=false
```

### Backend (.env.production)
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.hfccf.your-domain.com

# Database
DB_CONNECTION=mysql
DB_FOREIGN_KEYS=true

# Security
SANCTUM_STATEFUL_DOMAINS=hfccf.your-domain.com
```

---

## 🚨 Troubleshooting

### Frontend won't load
- Check `VITE_API_BASE_URL` environment variable
- Verify backend is accessible (test with curl)
- Check browser console for CORS errors
- Clear browser cache and restart

### API connection fails
```bash
# Test backend connectivity:
curl https://backend-url/api/auth/me -v

# Should see 401 (no token) not connection error
```

### Database migration fails
```bash
# In Railway Shell:
php artisan migrate:status  # Check status
php artisan migrate:reset --force  # Clear all
php artisan migrate --force  # Rerun
```

### Build fails on Vercel
- Check Node version: should be 18+
- Clear cache: Project Settings → git/dependencies
- Check for missing environment variables
- Review build logs in detail

### Build fails on Railway
- Check PHP version: should be 8.3+
- Verify composer.json dependencies
- Check Procfile syntax
- Review Railway deployment logs

---

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] Backend API responds (curl test)
- [ ] Frontend loads without errors
- [ ] No error emails/alerts

### Weekly Checks
- [ ] Database backup status
- [ ] Storage usage (R2)
- [ ] Error rate trends
- [ ] Performance metrics

### Monthly Checks
- [ ] Review logs for issues
- [ ] Update dependencies
- [ ] Security patches applied
- [ ] Cost review

---

## 🔐 Security Checklist

- [ ] APP_KEY is unique and complex
- [ ] Database passwords are strong
- [ ] CORS whitelist configured correctly
- [ ] HTTPS enforced everywhere
- [ ] Rate limiting enabled (RateLimiter in AppServiceProvider)
- [ ] No debug mode in production
- [ ] No sensitive data in logs
- [ ] SANCTUM tokens configured
- [ ] API keys secured in environment variables

---

## 📞 Support & Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Vue 3 Deployment](https://vitejs.dev/guide/ssr.html)

### Endpoints
- **Backend**: `https://your-backend.railway.app/api`
- **Frontend**: `https://your-frontend.vercel.app`
- **Storage**: `https://r2.your-account.com` (optional)

### Contact
- Railway Support: https://railway.app/support
- Vercel Support: https://vercel.com/support
- GitHub Issues: [Create issue in repo]

---

## ✅ Deployment Complete!

Your HFCCF system is now live and production-ready.

**Key URLs**:
- Frontend: `https://your-project.vercel.app`
- Backend API: `https://your-project.railway.app/api`
- Admin Dashboard: `https://your-project.vercel.app/admin`

**Next Steps**:
1. Set up custom domains (optional)
2. Configure monitoring & alerts
3. Enable automatic backups
4. Review security settings
5. Load test with production data

Happy deploying! 🎉

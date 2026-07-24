# Frontend Deployment to Vercel

## Prerequisites
- Vercel account (free tier available at vercel.com)
- GitHub account with access to this repository
- Backend API deployed and running (get the URL)

## Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click "New Project"
4. Select "Import Git Repository"
5. Select `DongDarong/hfccf-frontend`
6. Click "Import"

## Step 2: Configure Project

1. **Framework Preset**: Vue
2. **Root Directory**: `./` (default)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm ci --legacy-peer-deps`

## Step 3: Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_BASE_URL=https://your-backend-domain.railway.app/api
```

Example for Railway backend:
```
VITE_API_BASE_URL=https://hfccf-backend-prod.railway.app/api
```

## Step 4: Deploy

Click "Deploy" and wait for the build to complete (5-10 minutes).

**Your frontend URL**: `https://hfccf-frontend.vercel.app`

## Step 5: Verify Deployment

1. Visit your Vercel URL
2. Check browser console for API connection errors
3. Verify all features are working

## Troubleshooting

### Build Fails
- Check Node.js version: `node --version` (should be 18+)
- Clear cache: Delete `node_modules` and `dist`, run `npm ci`

### API Connection Issues
- Verify `VITE_API_BASE_URL` environment variable
- Check backend is running and accessible
- Check CORS configuration on backend

### Performance Issues
- Enable Vercel Analytics
- Check build output size
- Review Lighthouse scores

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vue 3 + Vite Deployment](https://vitejs.dev/guide/ssr.html)
- [CORS Configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## Post-Deployment

1. **Configure Custom Domain** (optional):
   - Vercel Dashboard → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Set up CI/CD**:
   - Automatic deployments on push to `main`
   - Preview deployments on pull requests

3. **Monitor Performance**:
   - Enable Vercel Analytics
   - Monitor API response times
   - Check error rates

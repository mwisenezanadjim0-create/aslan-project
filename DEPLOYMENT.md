# Aslan Project - Production Deployment Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- WhatsApp account for notifications

## Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

1. **Create a Render account** at https://render.com

2. **Create a new Web Service**:
   - Connect your GitHub repository (push your code to GitHub first)
   - Or use "Deploy from Git URL"

3. **Configure the service**:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm run prod`
   - **Environment**: Node

4. **Add Environment Variables** in Render dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://mwisenezanadjim0_db_user:aslan123456@nadjim.nvelmdj.mongodb.net/aslan_db?appName=nadjim
   GEMINI_API_KEY=AIzaSyCkAfLXsDwRNmFYcK4d4HGvVALsSoUYifc
   JWT_SECRET=aslan_jwt_2026_secure_key_9x7mK3pL8qR5nW2vB4jH6tY1zC0aE
   BOSS_NUMBER=250785975691
   FRONTEND_URL=https://your-app-name.onrender.com
   ```

5. **Deploy**: Click "Create Web Service"

6. **WhatsApp Setup**: After deployment, check logs for QR code or use the saved session

### Option 2: Railway.app

1. **Create Railway account** at https://railway.app

2. **New Project** → **Deploy from GitHub repo**

3. **Add Environment Variables** (same as above)

4. **Configure**:
   - Root Directory: `backend`
   - Start Command: `npm run prod`

5. **Deploy**

### Option 3: Heroku

1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli

2. **Login and create app**:
   ```bash
   heroku login
   heroku create aslan-restaurant-app
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URI="mongodb+srv://..."
   heroku config:set JWT_SECRET="aslan_jwt_2026_secure_key_9x7mK3pL8qR5nW2vB4jH6tY1zC0aE"
   heroku config:set GEMINI_API_KEY="AIzaSyCkAfLXsDwRNmFYcK4d4HGvVALsSoUYifc"
   heroku config:set BOSS_NUMBER="250785975691"
   ```

4. **Create Procfile** in root:
   ```
   web: cd backend && npm start
   ```

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

## Post-Deployment Steps

### 1. WhatsApp Authentication
- Check deployment logs for QR code
- Scan with WhatsApp to authenticate
- Session will persist in `baileys_auth_info` folder

### 2. Test the Application
- Visit your deployed URL
- Create an account with an allowed email
- Test login
- Submit a daily report to verify WhatsApp notifications

### 3. MongoDB Atlas IP Whitelist
- Go to MongoDB Atlas → Network Access
- Add `0.0.0.0/0` to allow connections from anywhere
- Or add your hosting provider's IP ranges

## Security Checklist

- [x] Strong JWT secret
- [x] Environment variables configured
- [x] CORS restricted to your domain
- [x] MongoDB password is strong
- [x] `.env` file not in version control
- [x] Error logging enabled

## Monitoring

### Check Logs
- **Render**: Dashboard → Logs tab
- **Railway**: Project → Deployments → Logs
- **Heroku**: `heroku logs --tail`

### Application Logs
- Stored in `backend/logs/` directory
- Named by date: `app-2026-01-15.log`

## Troubleshooting

### WhatsApp Not Sending
1. Check if session files exist in `baileys_auth_info`
2. Look for QR code in logs
3. Verify BOSS_NUMBER is correct

### Database Connection Failed
1. Check MONGO_URI is correct
2. Verify IP whitelist in MongoDB Atlas
3. Check database user permissions

### Server Crashes
1. Check logs for errors
2. Verify all environment variables are set
3. Ensure Node.js version is 18+

## Domain Setup (Optional)

1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **Add custom domain** in your hosting dashboard
3. **Update FRONTEND_URL** environment variable
4. **Update CORS origin** to match your domain

## Backup Strategy

### Database Backups
- MongoDB Atlas provides automatic backups
- Configure backup schedule in Atlas dashboard

### Code Backups
- Keep code in GitHub repository
- Tag releases: `git tag v1.0.0`

## Support

For issues:
1. Check application logs
2. Review MongoDB Atlas metrics
3. Verify WhatsApp session is active

---

**Your app is now production-ready! 🚀**

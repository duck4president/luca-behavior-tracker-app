# Azure Static Web App Deployment Guide

## 🚀 Deploy Luca's Behavior Tracker to Azure

Since you've already worked with Azure Static Web Apps, here's the streamlined process for deploying this React app.

## Prerequisites ✅
- Azure account with active subscription
- GitHub account (recommended for CI/CD)
- Azure CLI or Azure portal access

## Method 1: GitHub Integration (Recommended)

### Step 1: Push to GitHub
```bash
cd luca-behavior-tracker
git init
git add .
git commit -m "Initial commit - Luca behavior tracker with IEP scores"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/luca-behavior-tracker.git
git push -u origin main
```

### Step 2: Create Azure Static Web App
1. **Go to Azure Portal** → Create Resource → Static Web App
2. **Configure**:
   - **Name**: `luca-behavior-tracker`
   - **Region**: Choose closest to you
   - **Source**: GitHub
   - **Repository**: Select your `luca-behavior-tracker` repo
   - **Branch**: `main`
   - **Build Presets**: `React`
   - **App location**: `/` 
   - **Output location**: `build`

3. **Deploy**: Azure will automatically set up GitHub Actions

### Step 3: Environment Variables
In Azure Portal → Your Static Web App → Configuration:

```
REACT_APP_SUPABASE_URL=https://kqmykrdlxuntxjiiguze.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxbXlrcmRseHVudHhqaWlndXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTY5MTcsImV4cCI6MjA3ODk3MjkxN30.GkLmthNnV1XBm2oBsavY62VYDIZhdjQbsvUDwu5SNqM
```

## Method 2: Azure CLI (Quick Deploy)

### Build Production Version
```bash
cd luca-behavior-tracker
npm run build
```

### Deploy with Azure CLI
```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Login to Azure
az login

# Create and deploy
az staticwebapp create \
  --name luca-behavior-tracker \
  --resource-group YOUR_RESOURCE_GROUP \
  --source . \
  --location "East US 2" \
  --branch main \
  --app-location "/" \
  --output-location "build"
```

## Method 3: Manual Upload (Fastest for Testing)

### 1. Build the App
```bash
cd luca-behavior-tracker
npm run build
```

### 2. Create Static Web App in Portal
- Create Resource → Static Web App
- Choose "Other" for source
- Skip GitHub integration

### 3. Upload Build Folder
- Drag and drop the entire `build` folder to the deployment center
- Or use Azure CLI: `az staticwebapp deploy --app-name YOUR_APP_NAME --source ./build`

## Important Configuration

### Custom Domain (Optional)
- In Azure Portal → Your Static Web App → Custom domains
- Add your domain and configure DNS

### SSL Certificate
- Automatically provided by Azure (Let's Encrypt)
- HTTPS enforced by default

### Performance Optimization
The app is already optimized with:
- ✅ Production React build
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Gzip compression (Azure handles this)

## Mobile Accessibility Features

### Already Implemented:
- ✅ **Responsive Design**: Works perfectly on phones
- ✅ **Touch-friendly Interface**: Large buttons and touch targets
- ✅ **Mobile Form Handling**: Scrollable forms with proper viewport
- ✅ **Date Pickers**: Native mobile date inputs
- ✅ **Fast Loading**: Optimized bundle sizes

### PWA Features (Optional Enhancement):
If you want app-like experience on phones, we can add:
- Install prompts
- Offline capability
- Push notifications
- Home screen icon

## Post-Deployment

### 1. Test Your Deployment
Your app will be available at: `https://YOUR_APP_NAME.azurestaticapps.net`

### 2. Mobile Testing
- Open on your phone's browser
- Test all functionality:
  - Daily entry forms (especially IEP scores)
  - Chart interactions
  - Date range picker
  - Medication management

### 3. Bookmark on Phone
- Add to home screen for easy access
- Works like a native app

## Cost Estimation
- **Free Tier**: 100GB bandwidth, 500MB storage (likely sufficient)
- **Standard Tier**: $9/month if you need more resources

## Security Notes
- Environment variables are secure in Azure
- Supabase handles data security
- HTTPS enforced automatically
- No sensitive data in client code

## Need Help?
- Azure Static Web Apps docs: https://docs.microsoft.com/en-us/azure/static-web-apps/
- Your app is already mobile-ready!

---

**Your behavior tracker will be accessible from anywhere with internet! 📱**

# 🔧 Fix Azure Supabase Connection - Environment Variables Setup

## 🎯 **PROBLEM**: Web app is deployed but can't connect to Supabase
## ✅ **SOLUTION**: Add environment variables to Azure Static Web App

---

## 📋 **STEP-BY-STEP INSTRUCTIONS:**

### **Step 1: Go to Azure Portal**
1. Open https://portal.azure.com
2. Navigate to your Static Web App resource (`luca-behavior-tracker`)

### **Step 2: Access Configuration**
1. In the left sidebar, click **"Configuration"**
2. You'll see the **"Application settings"** tab

### **Step 3: Add Environment Variables**
Click **"+ Add"** and add these **EXACT** variables:

#### **Variable 1:**
- **Name**: `REACT_APP_SUPABASE_URL`
- **Value**: `https://kqmykrdlxuntxjiiguze.supabase.co`

#### **Variable 2:**  
- **Name**: `REACT_APP_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxbXlrcmRseHVudHhqaWlndXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTY5MTcsImV4cCI6MjA3ODk3MjkxN30.GkLmthNnV1XBm2oBsavY62VYDIZhdjQbsvUDwu5SNqM`

### **Step 4: Save Configuration**
1. Click **"Save"** at the top
2. Azure will automatically trigger a new deployment
3. Wait 2-3 minutes for deployment to complete

---

## 🚨 **CRITICAL NOTES:**

### **✅ EXACT NAMES REQUIRED:**
- Names MUST start with `REACT_APP_` (React requirement)
- Names are case-sensitive
- No extra spaces or characters

### **✅ VALUES MUST MATCH EXACTLY:**
- Copy-paste from the values above
- No trailing spaces
- Full URLs and keys

---

## 🔍 **HOW TO VERIFY IT WORKED:**

### **Method 1: Check Browser Developer Tools**
1. Open your deployed app
2. Press F12 (Developer Tools)
3. Go to **Console** tab
4. If you see Supabase errors, env vars aren't set correctly

### **Method 2: Test App Functionality**
1. Try creating a new entry
2. Check if existing data loads
3. Verify charts display data

### **Method 3: Check Azure Logs**
1. In Azure Portal → Your Static Web App → **"Log stream"**
2. Look for build/deployment success messages

---

## 🔧 **TROUBLESHOOTING:**

### **If it still doesn't work:**

#### **Check 1: Variable Names**
- Must be exactly: `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`
- No typos, extra characters, or wrong case

#### **Check 2: Wait for Deployment**
- After saving config, Azure triggers new build
- Can take 3-5 minutes to complete
- Check GitHub Actions tab in your repo for build status

#### **Check 3: Redeploy if Needed**
- Go to GitHub → Your repo → Actions tab
- If build failed, push a small change to trigger rebuild
- Or in Azure Portal → Deployment Center → "Sync"

---

## 🎯 **EXPECTED RESULT:**

After following these steps:
- ✅ Existing entries will load and display
- ✅ Charts will show your historical data  
- ✅ New entries can be created and saved
- ✅ All functionality works identically to local development

---

**Need help with any of these steps? Let me know which step you're on!**

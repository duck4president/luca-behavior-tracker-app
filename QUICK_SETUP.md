# Quick Setup Checklist

## 🚀 Get Started in 5 Minutes

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com) → New Project
- Name: `luca-behavior-tracker`
- Save your database password!

### 2. Get Your Keys
- Settings → API in Supabase dashboard
- Copy: **Project URL** & **Anon Key**

### 3. Create `.env` File
Create `luca-behavior-tracker/.env` with:
```
REACT_APP_SUPABASE_URL=your-url-here
REACT_APP_SUPABASE_ANON_KEY=your-key-here
```

### 4. Run Database Setup
- Open SQL Editor in Supabase
- Copy all content from `database-setup.sql`
- Paste and click "Run"

### 5. Restart App
```bash
cd luca-behavior-tracker
npm start
```

### 6. Test It!
- Click "Today's Entry"
- Fill out form (including IEP Score!)
- Save entry
- Check Supabase → Table Editor → daily_entries

## ✅ What Works After Setup

- **Daily behavior tracking** with IEP scores (1-72)
- **Medication logging** 
- **Tantrum behavior details**
- **Historical data storage**
- **Form validation and error handling**

## 🆘 Need Help?

See detailed `SUPABASE_SETUP_GUIDE.md` for troubleshooting and step-by-step instructions.

---

**Ready to track Luca's behavior progress! 📊**

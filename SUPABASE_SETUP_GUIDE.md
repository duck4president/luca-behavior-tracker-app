# Supabase Setup Guide for Luca's Behavior Tracker

## Step 1: Create Supabase Account and Project

1. **Go to Supabase**: Visit [https://supabase.com](https://supabase.com)
2. **Sign Up/Login**: Create a free account or login if you already have one
3. **Create New Project**:
   - Click "New Project"
   - Choose your organization (or create one)
   - Project name: `luca-behavior-tracker`
   - Database password: Choose a strong password (save it somewhere safe)
   - Region: Choose closest to your location
   - Click "Create new project"

## Step 2: Get Your Project Credentials

1. **Navigate to Settings**: In your project dashboard, go to Settings → API
2. **Copy these values**:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. **Create `.env` file**: In your project root (`luca-behavior-tracker/`), create a file named `.env`
2. **Add your credentials**:

```env
REACT_APP_SUPABASE_URL=https://your-project-url.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace with your actual values from Step 2**

## Step 4: Set Up Database Schema

1. **Go to SQL Editor**: In Supabase dashboard, navigate to SQL Editor
2. **Create New Query**: Click "New Query"
3. **Copy and Paste**: Copy the entire contents of `database-setup.sql` and paste into the SQL editor
4. **Run Query**: Click "Run" to create all tables and setup

## Step 5: Enable Row Level Security (Optional but Recommended)

If you want to add security later, you can enable RLS by running these commands in SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tantrum_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_annotations ENABLE ROW LEVEL SECURITY;

-- Create policies (allows all operations for now - modify as needed)
CREATE POLICY "Allow all operations" ON daily_entries FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON medications FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON daily_medications FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON tantrum_behaviors FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON chart_annotations FOR ALL USING (true);
```

## Step 6: Test the Connection

1. **Restart Dev Server**: Stop the running dev server (Ctrl+C) and restart it:
   ```bash
   cd luca-behavior-tracker
   npm start
   ```

2. **Test the App**:
   - Go to http://localhost:3000 (or whatever port it shows)
   - Click "Today's Entry"
   - Fill out the form including the IEP Score
   - Click "Save Entry"
   - You should see a success message

3. **Verify in Supabase**:
   - Go to Supabase Dashboard → Table Editor
   - Check the `daily_entries` table
   - You should see your entry with the IEP score

## Step 7: Add Sample Medications (Optional)

In the SQL Editor, you can add some sample medications:

```sql
INSERT INTO medications (name, is_active) VALUES 
    ('Morning Vitamin D', TRUE),
    ('Evening Melatonin', TRUE),
    ('Omega-3 Fish Oil', TRUE),
    ('Magnesium', TRUE);
```

## Troubleshooting

### Common Issues:

1. **"Invalid API Key" Error**:
   - Double-check your environment variables in `.env`
   - Make sure there are no extra spaces
   - Restart your dev server after changing `.env`

2. **"Failed to fetch" Error**:
   - Check your Project URL is correct
   - Make sure your project is active in Supabase dashboard

3. **Database Connection Issues**:
   - Verify you ran the `database-setup.sql` script completely
   - Check the Tables tab in Supabase to ensure tables were created

4. **Environment Variables Not Loading**:
   - Make sure `.env` file is in the root directory (`luca-behavior-tracker/.env`)
   - File should start with `REACT_APP_`
   - Restart dev server after changes

### Getting Help:

- Check Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- View logs in Supabase Dashboard → Logs
- Check browser console (F12) for JavaScript errors

## What You'll Be Able to Do After Setup:

✅ **Save daily behavior entries** with all ratings and IEP scores
✅ **Track medications** and whether they were taken each day  
✅ **Log tantrum behaviors** with detailed breakdowns
✅ **View historical data** (future chart features)
✅ **Manage medications** through the app interface

Your behavior tracking data will be securely stored in Supabase and accessible from any device!

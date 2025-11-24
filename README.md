# Lucas Behavior Tracker

<!-- Trigger deployment to pick up Azure environment variables -->

A mobile-friendly web application for tracking daily behavior patterns, medications, and progress over time. Built specifically for tracking neurodivergent children's behaviors with a focus on simplicity and long-term sustainability.

## Features

- **Daily Check-ins**: Quick, easy daily behavior logging
- **Medication Tracking**: Persistent medication checklists that carry forward
- **Visual Analytics**: Interactive charts showing behavior trends over time
- **Tantrum Tracking**: Detailed tracking of tantrum behaviors (screaming, swearing, throwing, hitting, threatening)
- **Multiple Metrics**: Track overall day quality, tantrum severity, and focus levels
- **Time Windows**: View data by week, month, or all time
- **Mobile Optimized**: Designed for mobile-first usage
- **Daily Notifications**: Browser notifications to remind you to complete daily check-ins

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Azure Static Web Apps
- **Notifications**: Web Push API

## Setup Instructions

### 1. Prerequisites

- Node.js 16+ installed
- A Supabase account and project
- An Azure account (for deployment)

### 2. Database Setup

1. Create a new project in [Supabase](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `database-setup.sql` and run it
4. This will create all necessary tables and indexes

### 3. Environment Configuration

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### 4. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### 5. Deployment to Azure Static Web Apps

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to Azure Static Web Apps
3. Configure environment variables in Azure for your Supabase credentials

## Usage Guide

### Daily Check-in Process

1. Click "Today's Entry" or the daily check-in card
2. Complete the form:
   - **Medications**: Check off medications/supplements taken
   - **Overall Day**: Rate 1-7 (1 = poor, 7 = excellent)
   - **Tantrum Severity**: Rate 1-7 (1 = minimal, 7 = severe)
   - **Tantrum Behaviors**: Check applicable behaviors
   - **Focus Level**: Rate 1-7 (1 = poor focus, 7 = excellent focus)
   - **Notes**: Add any additional observations
3. Save the entry

### Managing Medications

1. Click "Manage Meds" in the header
2. Add new medications/supplements
3. Toggle medications active/inactive as needed
4. Active medications will appear in daily check-ins

### Viewing Analytics

1. Use the metric selector to switch between Overall, Tantrums, and Focus
2. Use time window controls to view 7 days, 30 days, or all time
3. Click on any chart point to view/edit that day's entry
4. Colors represent score ranges:
   - Red (1-2): Poor
   - Yellow (3-4): Fair  
   - Green (5-7): Good

### Notifications

- Browser notifications will remind you daily at 7 PM
- Click "Test Notification" to test the notification system
- Grant permission when prompted for notifications to work

## App Architecture

```
src/
├── components/
│   ├── DailyForm.tsx          # Daily check-in form
│   ├── MedicationManager.tsx  # Medication management
│   └── BehaviorChart.tsx      # Interactive charts
├── utils/
│   ├── supabase.ts           # Database functions
│   ├── dateHelpers.ts        # Date utilities
│   └── notifications.ts      # Notification system
└── App.tsx                   # Main application
```

## Database Schema

- **daily_entries**: Main behavior tracking entries
- **medications**: Available medications/supplements
- **daily_medications**: Junction table for daily med tracking
- **tantrum_behaviors**: Detailed tantrum behavior tracking
- **chart_annotations**: Future feature for chart notes

## Customization

### Adding New Behavior Metrics

1. Add columns to `daily_entries` table
2. Update TypeScript interfaces in `utils/supabase.ts`
3. Add form fields in `DailyForm.tsx`
4. Update chart visualization in `BehaviorChart.tsx`

### Changing Notification Times

Modify the `scheduleDailyReminder()` call in `utils/notifications.ts`:
```typescript
scheduleDailyReminder(19, 0) // 7:00 PM
```

### Styling Customization

The app uses Tailwind CSS with a minimalistic black and white design with blue accents. Modify `tailwind.config.js` to change the color scheme.

## Support

For issues or questions, check the console for error messages and ensure:
1. Supabase credentials are correctly configured
2. Database tables have been created using the provided SQL
3. Browser notifications are enabled
4. The app has network connectivity

## License

This project is built for personal use. Modify and adapt as needed for your specific requirements.

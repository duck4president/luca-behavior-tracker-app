# IEP Score Implementation

## Overview
Added an IEP score field to the daily behavior tracking form to capture raw behavioral scores from 1-72, representing daily behavior tracking with a maximum score of 72.

## Changes Made

### 1. Database Schema (`database-setup.sql`)
- Added `iep_score INTEGER CHECK (iep_score >= 1 AND iep_score <= 72)` column to `daily_entries` table
- Field is optional (nullable) to maintain backward compatibility

### 2. TypeScript Interface (`src/utils/supabase.ts`)
- Updated `DailyEntry` interface to include `iep_score?: number`
- Made field optional to handle existing entries without IEP scores

### 3. Form Component (`src/components/DailyForm.tsx`)
- Added `iep_score: number` to the `FormData` interface
- Set default value to 36 (middle of 1-72 range)
- Created custom number input field with:
  - Min/max validation (1-72)
  - Real-time score display (X/72)
  - Clear labeling and help text
  - Centered, large font styling for easy input
- Updated form submission logic to include IEP score in both create and update operations
- Added proper loading of existing IEP scores with fallback to default value

### 4. User Interface Features
- **Input Field**: Large, centered number input with validation
- **Visual Feedback**: Real-time display of current score out of 72
- **Validation**: Automatic clamping of values to 1-72 range
- **Help Text**: Clear explanation of scoring (1 = lowest, 72 = highest)
- **Consistent Styling**: Matches existing form design patterns

## Database Migration Required
To use this feature with existing data, run the updated `database-setup.sql` or execute this SQL command:

```sql
ALTER TABLE daily_entries 
ADD COLUMN iep_score INTEGER CHECK (iep_score >= 1 AND iep_score <= 72);
```

## Usage
1. Open the daily form by clicking on any date
2. Find the "IEP Score" section between Focus Level and Notes
3. Enter a score from 1-72 representing the day's behavioral score
4. The form shows the current score as "X/72" for easy reference
5. Save the entry as normal

## Technical Notes
- Field is optional in the database and TypeScript interfaces
- Default value is 36 (middle of range) for new entries
- Existing entries without IEP scores will load with the default value
- Form validation ensures only valid scores (1-72) can be submitted
- Fully integrated with existing form submission and data loading logic

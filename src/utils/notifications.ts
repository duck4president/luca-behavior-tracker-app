// Notification utilities for daily reminders

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

export const sendDailyReminder = (message?: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Daily Check-in Reminder', {
      body: message || "Time to log Lucas's daily behavior check-in!",
      icon: '/favicon.ico',
      tag: 'daily-reminder',
      requireInteraction: true
    })
  }
}

export const scheduleDailyReminder = (hour: number = 19, minute: number = 0) => {
  // Calculate milliseconds until next reminder time
  const now = new Date()
  const reminderTime = new Date()
  reminderTime.setHours(hour, minute, 0, 0)

  // If reminder time has passed today, schedule for tomorrow
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1)
  }

  const timeUntilReminder = reminderTime.getTime() - now.getTime()

  setTimeout(() => {
    sendDailyReminder()
    // Schedule the next reminder for tomorrow
    setTimeout(scheduleDailyReminder, 24 * 60 * 60 * 1000)
  }, timeUntilReminder)

  console.log(`Next reminder scheduled for: ${reminderTime.toLocaleString()}`)
}

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered successfully:', registration)
      return registration
    } catch (error) {
      console.log('Service Worker registration failed:', error)
      return null
    }
  }
  return null
}

// Initialize notifications on app load
export const initializeNotifications = async () => {
  const hasPermission = await requestNotificationPermission()
  
  if (hasPermission) {
    // Schedule daily reminders at 7 PM
    scheduleDailyReminder(19, 0)
    
    // Register service worker for background notifications
    await registerServiceWorker()
  }
  
  return hasPermission
}

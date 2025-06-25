// src/utils/medicineStatus.js

/**
 * Given a schedule entry, its daily logs, and a target date,
 * compute exactly the same status string as the Dashboard:
 *  - If there’s a log entry (taken/missed), return that.
 *  - Else if date is outside the medicine’s start–end window: "N/A"
 *  - Else if date is before today: "Missed"
 *  - Else: "Pending"
 *
 * @param {{startDate:string,endDate:string}} med  — your medicine object
 * @param {Object} logsForDay  — logs[YYYY-MM-DD]?[medKey]
 * @param {Date} date          — the day we’re computing for
 * @param {Date} now           — current Date
 * @returns {string}           — one of "Taken", "Missed", "Pending", "N/A"
 */
export function computeDailyStatus(med, logsForDay, date, now = new Date()) {
    const dateKey = date.toISOString().split("T")[0];
    // 1) If user logged it, use that
    if (logsForDay?.status) {
      // capitalize first letter
      return logsForDay.status.charAt(0).toUpperCase() + logsForDay.status.slice(1);
    }
  
    // Parse window
    const start = med.startDate ? new Date(med.startDate) : null;
    const end   = med.endDate   ? new Date(med.endDate)   : null;
    // outside window?
    if (!start || !end || date < start || date > end) {
      return "N/A";
    }
  
    // Zero out times for comparison
    const today = new Date(now);
    today.setHours(0,0,0,0);
    const dayZero = new Date(date);
    dayZero.setHours(0,0,0,0);
  
    if (dayZero < today) return "Missed";
    return "Pending";
  }
  
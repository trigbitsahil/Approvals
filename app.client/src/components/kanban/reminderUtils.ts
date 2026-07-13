import { ReminderService } from "@/api/services/ReminderService";

/**
 * Synchronizes the reminder for an event when the event's start date/time changes.
 * It maintains the existing relative offset between the reminder and the start time.
 */
export const syncReminderWithEvent = async (
  eventId: string,
  newStartDateISO: string,
  oldStartDateISO: string | null | undefined,
  eventTitle?: string | null,
  eventDesc?: string | null
) => {
  if (!oldStartDateISO) return;

  try {
    const response = await ReminderService.getApiVReminder("1", "Events", eventId);
    if (response.success && response.data && response.data.length > 0) {
      const reminder = response.data[0];
      if (reminder.reminderDate && reminder.reminderId) {
        const oldStart = new Date(oldStartDateISO);
        const oldReminder = new Date(reminder.reminderDate);
        
        // Calculate offset (minutes)
        const offsetMs = oldStart.getTime() - oldReminder.getTime();
        
        // Apply offset to new start date
        const newStart = new Date(newStartDateISO);
        const newReminderDate = new Date(newStart.getTime() - offsetMs);

        await ReminderService.putApiVReminder("1", {
          reminderId: reminder.reminderId,
          name: eventTitle || reminder.name || "Reminder",
          description: eventDesc || reminder.description || "Event Reminder",
          reminderDate: newReminderDate.toISOString(),
          category: "Events",
          categoryId: eventId,
        } as any);
        
        console.log(`Synced reminder for event ${eventId} to ${newReminderDate.toISOString()}`);
      }
    }
  } catch (error) {
    console.error("Failed to sync reminder with event move:", error);
  }
};

/**
 * Notifier - Handles notification logic for study room reservations
 * This class manages notification formatting, timing, and priority calculations
 * for the StudyRez booking application.
 */

export interface ReservationNotification {
	reservationId: string;
	roomName: string;
	startTime: Date;
	endTime: Date;
	userName: string;
}

export interface NotificationSettings {
	reminderMinutes: number[];
	urgentThreshold: number;
	enabled: boolean;
}

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export type NotificationType =
	| "reminder"
	| "confirmation"
	| "cancellation"
	| "upcoming";

export class Notifier {
	private defaultSettings: NotificationSettings = {
		reminderMinutes: [60, 15],
		urgentThreshold: 15,
		enabled: true,
	};

	/**
	 * Formats a reservation notification message for display
	 * @param notification - The reservation notification data
	 * @param type - The type of notification (reminder, confirmation, etc.)
	 * @returns Formatted notification message string
	 */
	formatNotification(
		notification: ReservationNotification,
		type: NotificationType,
	): string {
		const roomName = notification.roomName;
		const userName = notification.userName;
		const startTime = this.formatTime(notification.startTime);

		switch (type) {
			case "reminder":
				return `Reminder: ${userName}, your reservation for ${roomName} starts at ${startTime}`;
			case "confirmation":
				return `Confirmed: ${userName} has booked ${roomName} starting at ${startTime}`;
			case "cancellation":
				return `Cancelled: ${userName}'s reservation for ${roomName} at ${startTime} has been cancelled`;
			case "upcoming":
				return `Upcoming: ${userName}'s reservation for ${roomName} starts soon at ${startTime}`;
			default:
				return `${userName} - ${roomName} at ${startTime}`;
		}
	}

	/**
	 * Determines if a reminder notification should be sent based on time until reservation
	 * @param startTime
	 * @param reminderMinutes
	 * @param currentTime
	 */
	shouldSendReminder(
		startTime: Date,
		reminderMinutes: number[],
		currentTime: Date = new Date(),
	): boolean {
		const minutesUntil = this.calculateMinutesUntil(startTime, currentTime);

		return reminderMinutes.some(
			(threshold) =>
				minutesUntil <= threshold && minutesUntil > threshold - 1,
		);
	}

	/**
	 * Calculates the number of minutes until a reservation starts
	 * @param startTime
	 * @param currentTime
	 */
	calculateMinutesUntil(
		startTime: Date,
		currentTime: Date = new Date(),
	): number {
		const diffMs = startTime.getTime() - currentTime.getTime();
		return Math.floor(diffMs / (1000 * 60));
	}

	/**
	 * Determines the priority level of a notification based on time until reservation
	 * @param startTime
	 * @param urgentThreshold
	 * @param currentTime
	 */
	getNotificationPriority(
		startTime: Date,
		urgentThreshold: number = 15,
		currentTime: Date = new Date(),
	): NotificationPriority {
		const minutesUntil = this.calculateMinutesUntil(startTime, currentTime);

		if (minutesUntil < 0) {
			return "low"; // Already started
		}
		if (minutesUntil <= urgentThreshold) {
			return "urgent";
		}
		if (minutesUntil <= 60) {
			return "high";
		}
		if (minutesUntil <= 1440) {
			// 24 hours
			return "medium";
		}
		return "low";
	}

	/**
	 * Validates notification settings to ensure they are valid
	 * @param settings
	 */
	validateNotificationSettings(settings: NotificationSettings): {
		isValid: boolean;
		errors: string[];
	} {
		const errors: string[] = [];

		if (!Array.isArray(settings.reminderMinutes)) {
			errors.push("reminderMinutes must be an array");
		} else {
			if (settings.reminderMinutes.length === 0) {
				errors.push("reminderMinutes array cannot be empty");
			}
			settings.reminderMinutes.forEach((min, index) => {
				if (typeof min !== "number" || min < 0) {
					errors.push(
						`reminderMinutes[${index}] must be a non-negative number`,
					);
				}
			});
		}

		if (
			typeof settings.urgentThreshold !== "number" ||
			settings.urgentThreshold < 0
		) {
			errors.push("urgentThreshold must be a non-negative number");
		}

		if (typeof settings.enabled !== "boolean") {
			errors.push("enabled must be a boolean");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Groups notifications by their type for batch processing
	 * @param notifications
	 */
	groupNotificationsByType(
		notifications: Array<{
			notification: ReservationNotification;
			type: NotificationType;
		}>,
	): Record<NotificationType, ReservationNotification[]> {
		const grouped: Record<NotificationType, ReservationNotification[]> = {
			reminder: [],
			confirmation: [],
			cancellation: [],
			upcoming: [],
		};

		notifications.forEach(({ notification, type }) => {
			if (grouped[type]) {
				grouped[type].push(notification);
			}
		});

		return grouped;
	}

	/**
	 * Formats time remaining until reservation in a human-readable format
	 * @param startTime
	 * @param currentTime
	 */
	formatTimeRemaining(
		startTime: Date,
		currentTime: Date = new Date(),
	): string {
		const minutesUntil = this.calculateMinutesUntil(startTime, currentTime);

		if (minutesUntil < 0) {
			return "Started";
		}
		if (minutesUntil === 0) {
			return "Starting now";
		}
		if (minutesUntil < 60) {
			return `${minutesUntil} minute${minutesUntil !== 1 ? "s" : ""}`;
		}

		const hours = Math.floor(minutesUntil / 60);
		const minutes = minutesUntil % 60;

		if (minutes === 0) {
			return `${hours} hour${hours !== 1 ? "s" : ""}`;
		}

		return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`;
	}

	/**
	 * Determines if an urgent notification should be sent
	 * @param startTime
	 * @param settings
	 * @param currentTime
	 */
	shouldSendUrgentNotification(
		startTime: Date,
		settings?: Partial<NotificationSettings>,
		currentTime: Date = new Date(),
	): boolean {
		const finalSettings = { ...this.defaultSettings, ...settings };

		if (!finalSettings.enabled) {
			return false;
		}

		const minutesUntil = this.calculateMinutesUntil(startTime, currentTime);
		const priority = this.getNotificationPriority(
			startTime,
			finalSettings.urgentThreshold,
			currentTime,
		);

		return priority === "urgent" && minutesUntil >= 0;
	}

	/**
	 * Formats a Date object into a readable time string
	 * @param date - The date to format
	 */
	private formatTime(date: Date): string {
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? "PM" : "AM";
		const displayHours = hours % 12 || 12;
		const displayMinutes = minutes.toString().padStart(2, "0");

		return `${displayHours}:${displayMinutes} ${ampm}`;
	}
}

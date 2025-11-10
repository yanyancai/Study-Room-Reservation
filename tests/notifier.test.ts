import type {
	NotificationSettings,
	NotificationType,
	ReservationNotification,
} from "@/lib/notifer";
import { Notifier } from "@/lib/notifer";

describe("notifier", () => {
	let helper: Notifier;

	beforeEach(() => {
		helper = new Notifier();
	});

	describe("formatNotification", () => {
		it("should format reminder notification correctly", () => {
			const notification: ReservationNotification = {
				reservationId: "res-1",
				roomName: "Study Room 101",
				startTime: new Date("2024-01-15T14:30:00"),
				endTime: new Date("2024-01-15T16:30:00"),
				userName: "John Doe",
			};
			const type: NotificationType = "reminder";

			const result = helper.formatNotification(notification, type);

			expect(result).toContain("Reminder");
			expect(result).toContain("John Doe");
			expect(result).toContain("Study Room 101");
			expect(result).toContain("2:30 PM");
		});

		it("should format confirmation notification correctly", () => {
			const notification: ReservationNotification = {
				reservationId: "res-2",
				roomName: "Quiet Room 205",
				startTime: new Date("2024-01-15T10:00:00"),
				endTime: new Date("2024-01-15T12:00:00"),
				userName: "Jane Smith",
			};
			const type: NotificationType = "confirmation";

			const result = helper.formatNotification(notification, type);

			expect(result).toContain("Confirmed");
			expect(result).toContain("Jane Smith");
			expect(result).toContain("Quiet Room 205");
			expect(result).toContain("10:00 AM");
		});

		it("should format cancellation notification correctly", () => {
			const notification: ReservationNotification = {
				reservationId: "res-3",
				roomName: "Group Study Room 301",
				startTime: new Date("2024-01-15T15:00:00"),
				endTime: new Date("2024-01-15T17:00:00"),
				userName: "Bob Johnson",
			};
			const type: NotificationType = "cancellation";

			const result = helper.formatNotification(notification, type);

			expect(result).toContain("Cancelled");
			expect(result).toContain("Bob Johnson");
			expect(result).toContain("Group Study Room 301");
		});

		it("should format upcoming notification correctly", () => {
			const notification: ReservationNotification = {
				reservationId: "res-4",
				roomName: "Silent Room 402",
				startTime: new Date("2024-01-15T09:00:00"),
				endTime: new Date("2024-01-15T11:00:00"),
				userName: "Alice Brown",
			};
			const type: NotificationType = "upcoming";

			const result = helper.formatNotification(notification, type);

			expect(result).toContain("Upcoming");
			expect(result).toContain("Alice Brown");
			expect(result).toContain("Silent Room 402");
		});
	});

	describe("shouldSendReminder", () => {
		it("should return true when time matches reminder threshold exactly", () => {
			const currentTime = new Date("2024-01-15T13:00:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 60 minutes later
			const reminderMinutes = [60, 15];

			const result = helper.shouldSendReminder(
				startTime,
				reminderMinutes,
				currentTime,
			);

			expect(result).toBe(true);
		});

		it("should return true when time matches 15-minute threshold", () => {
			const currentTime = new Date("2024-01-15T13:45:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 15 minutes later
			const reminderMinutes = [60, 15];

			const result = helper.shouldSendReminder(
				startTime,
				reminderMinutes,
				currentTime,
			);

			expect(result).toBe(true);
		});

		it("should return false when time does not match any threshold", () => {
			const currentTime = new Date("2024-01-15T13:30:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 30 minutes later
			const reminderMinutes = [60, 15];

			const result = helper.shouldSendReminder(
				startTime,
				reminderMinutes,
				currentTime,
			);

			expect(result).toBe(false);
		});

		it("should return false when reservation has already started", () => {
			const currentTime = new Date("2024-01-15T14:30:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 30 minutes ago
			const reminderMinutes = [60, 15];

			const result = helper.shouldSendReminder(
				startTime,
				reminderMinutes,
				currentTime,
			);

			expect(result).toBe(false);
		});
	});

	describe("calculateMinutesUntil", () => {
		it("should return correct minutes when reservation is in the future", () => {
			const currentTime = new Date("2024-01-15T10:00:00");
			const startTime = new Date("2024-01-15T11:30:00"); // 90 minutes later

			const result = helper.calculateMinutesUntil(startTime, currentTime);

			expect(result).toBe(90);
		});

		it("should return 0 when reservation starts now", () => {
			const currentTime = new Date("2024-01-15T10:00:00");
			const startTime = new Date("2024-01-15T10:00:00");

			const result = helper.calculateMinutesUntil(startTime, currentTime);

			expect(result).toBe(0);
		});

		it("should return negative value when reservation has already started", () => {
			const currentTime = new Date("2024-01-15T10:30:00");
			const startTime = new Date("2024-01-15T10:00:00"); // 30 minutes ago

			const result = helper.calculateMinutesUntil(startTime, currentTime);

			expect(result).toBe(-30);
		});

		it("should handle exact minute boundaries correctly", () => {
			const currentTime = new Date("2024-01-15T10:00:00");
			const startTime = new Date("2024-01-15T10:01:00"); // Exactly 1 minute later

			const result = helper.calculateMinutesUntil(startTime, currentTime);

			expect(result).toBe(1);
		});
	});

	describe("getNotificationPriority", () => {
		it("should return urgent when time is within urgent threshold", () => {
			const currentTime = new Date("2024-01-15T13:50:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 10 minutes later
			const urgentThreshold = 15;

			const result = helper.getNotificationPriority(
				startTime,
				urgentThreshold,
				currentTime,
			);

			expect(result).toBe("urgent");
		});

		it("should return high when time is within 1 hour", () => {
			const currentTime = new Date("2024-01-15T13:30:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 30 minutes later
			const urgentThreshold = 15;

			const result = helper.getNotificationPriority(
				startTime,
				urgentThreshold,
				currentTime,
			);

			expect(result).toBe("high");
		});

		it("should return medium when time is within 24 hours", () => {
			const currentTime = new Date("2024-01-15T10:00:00");
			const startTime = new Date("2024-01-15T20:00:00"); // 10 hours later
			const urgentThreshold = 15;

			const result = helper.getNotificationPriority(
				startTime,
				urgentThreshold,
				currentTime,
			);

			expect(result).toBe("medium");
		});

		it("should return low when time is more than 24 hours away", () => {
			const currentTime = new Date("2024-01-15T10:00:00");
			const startTime = new Date("2024-01-17T10:00:00"); // 2 days later
			const urgentThreshold = 15;

			const result = helper.getNotificationPriority(
				startTime,
				urgentThreshold,
				currentTime,
			);

			expect(result).toBe("low");
		});

		it("should return low when reservation has already started", () => {
			const currentTime = new Date("2024-01-15T14:30:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 30 minutes ago
			const urgentThreshold = 15;

			const result = helper.getNotificationPriority(
				startTime,
				urgentThreshold,
				currentTime,
			);

			expect(result).toBe("low");
		});
	});

	describe("validateNotificationSettings", () => {
		it("should return valid for correct settings", () => {
			const settings: NotificationSettings = {
				reminderMinutes: [60, 15],
				urgentThreshold: 15,
				enabled: true,
			};

			const result = helper.validateNotificationSettings(settings);

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("should return invalid when reminderMinutes is not an array", () => {
			const settings = {
				reminderMinutes: "not-an-array",
				urgentThreshold: 15,
				enabled: true,
			} as unknown as NotificationSettings;

			const result = helper.validateNotificationSettings(settings);

			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it("should return invalid when reminderMinutes array is empty", () => {
			const settings: NotificationSettings = {
				reminderMinutes: [],
				urgentThreshold: 15,
				enabled: true,
			};

			const result = helper.validateNotificationSettings(settings);

			expect(result.isValid).toBe(false);
			expect(result.errors).toContain(
				"reminderMinutes array cannot be empty",
			);
		});

		it("should return invalid when reminderMinutes contains negative values", () => {
			const settings: NotificationSettings = {
				reminderMinutes: [60, -15],
				urgentThreshold: 15,
				enabled: true,
			};

			const result = helper.validateNotificationSettings(settings);

			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it("should return invalid when urgentThreshold is negative", () => {
			const settings: NotificationSettings = {
				reminderMinutes: [60, 15],
				urgentThreshold: -5,
				enabled: true,
			};

			const result = helper.validateNotificationSettings(settings);

			expect(result.isValid).toBe(false);
			expect(result.errors).toContain(
				"urgentThreshold must be a non-negative number",
			);
		});

		it("should return invalid when enabled is not a boolean", () => {
			const settings = {
				reminderMinutes: [60, 15],
				urgentThreshold: 15,
				enabled: "true",
			} as unknown as NotificationSettings;

			const result = helper.validateNotificationSettings(settings);

			expect(result.isValid).toBe(false);
			expect(result.errors).toContain("enabled must be a boolean");
		});
	});

	describe("groupNotificationsByType", () => {
		it("should group notifications by their type correctly", () => {
			const notifications = [
				{
					notification: {
						reservationId: "res-1",
						roomName: "Room 101",
						startTime: new Date("2024-01-15T10:00:00"),
						endTime: new Date("2024-01-15T12:00:00"),
						userName: "User 1",
					},
					type: "reminder" as NotificationType,
				},
				{
					notification: {
						reservationId: "res-2",
						roomName: "Room 102",
						startTime: new Date("2024-01-15T11:00:00"),
						endTime: new Date("2024-01-15T13:00:00"),
						userName: "User 2",
					},
					type: "confirmation" as NotificationType,
				},
				{
					notification: {
						reservationId: "res-3",
						roomName: "Room 103",
						startTime: new Date("2024-01-15T12:00:00"),
						endTime: new Date("2024-01-15T14:00:00"),
						userName: "User 3",
					},
					type: "reminder" as NotificationType,
				},
			];

			const result = helper.groupNotificationsByType(notifications);

			expect(result.reminder).toHaveLength(2);
			expect(result.confirmation).toHaveLength(1);
			expect(result.cancellation).toHaveLength(0);
			expect(result.upcoming).toHaveLength(0);
		});

		it("should return empty arrays for all types when input is empty", () => {
			const notifications: Array<{
				notification: ReservationNotification;
				type: NotificationType;
			}> = [];

			const result = helper.groupNotificationsByType(notifications);

			expect(result.reminder).toHaveLength(0);
			expect(result.confirmation).toHaveLength(0);
			expect(result.cancellation).toHaveLength(0);
			expect(result.upcoming).toHaveLength(0);
		});
	});

	describe("formatTimeRemaining", () => {
		it("should format minutes correctly when less than 60 minutes", () => {
			const currentTime = new Date("2024-01-15T13:45:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 15 minutes later

			const result = helper.formatTimeRemaining(startTime, currentTime);

			expect(result).toBe("15 minutes");
		});

		it("should format singular minute correctly", () => {
			const currentTime = new Date("2024-01-15T13:59:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 1 minute later

			const result = helper.formatTimeRemaining(startTime, currentTime);

			expect(result).toBe("1 minute");
		});

		it("should format hours correctly when no minutes remainder", () => {
			const currentTime = new Date("2024-01-15T12:00:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 2 hours later

			const result = helper.formatTimeRemaining(startTime, currentTime);

			expect(result).toBe("2 hours");
		});

		it("should format hours and minutes correctly", () => {
			const currentTime = new Date("2024-01-15T12:00:00");
			const startTime = new Date("2024-01-15T14:30:00"); // 2 hours 30 minutes later

			const result = helper.formatTimeRemaining(startTime, currentTime);

			expect(result).toBe("2 hours 30 minutes");
		});

		it("should return 'Starting now' when time is exactly 0", () => {
			const currentTime = new Date("2024-01-15T14:00:00");
			const startTime = new Date("2024-01-15T14:00:00");

			const result = helper.formatTimeRemaining(startTime, currentTime);

			expect(result).toBe("Starting now");
		});

		it("should return 'Started' when reservation has already begun", () => {
			const currentTime = new Date("2024-01-15T14:30:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 30 minutes ago

			const result = helper.formatTimeRemaining(startTime, currentTime);

			expect(result).toBe("Started");
		});
	});

	describe("shouldSendUrgentNotification", () => {
		it("should return true when notification is urgent and enabled", () => {
			const currentTime = new Date("2024-01-15T13:50:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 10 minutes later
			const settings: Partial<NotificationSettings> = {
				enabled: true,
				urgentThreshold: 15,
			};

			const result = helper.shouldSendUrgentNotification(
				startTime,
				settings,
				currentTime,
			);

			expect(result).toBe(true);
		});

		it("should return false when notifications are disabled", () => {
			const currentTime = new Date("2024-01-15T13:50:00");
			const startTime = new Date("2024-01-15T14:00:00");
			const settings: Partial<NotificationSettings> = {
				enabled: false,
				urgentThreshold: 15,
			};

			const result = helper.shouldSendUrgentNotification(
				startTime,
				settings,
				currentTime,
			);

			expect(result).toBe(false);
		});

		it("should return false when notification is not urgent", () => {
			const currentTime = new Date("2024-01-15T12:00:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 2 hours later
			const settings: Partial<NotificationSettings> = {
				enabled: true,
				urgentThreshold: 15,
			};

			const result = helper.shouldSendUrgentNotification(
				startTime,
				settings,
				currentTime,
			);

			expect(result).toBe(false);
		});

		it("should return false when reservation has already started", () => {
			const currentTime = new Date("2024-01-15T14:30:00");
			const startTime = new Date("2024-01-15T14:00:00"); // 30 minutes ago
			const settings: Partial<NotificationSettings> = {
				enabled: true,
				urgentThreshold: 15,
			};

			const result = helper.shouldSendUrgentNotification(
				startTime,
				settings,
				currentTime,
			);

			expect(result).toBe(false);
		});
	});
});

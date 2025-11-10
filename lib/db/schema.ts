import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

// Auto-generated tables by better-auth

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const verifications = pgTable("verifications", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const buildings = pgTable("buildings", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	image: text("image").notNull().default(""),
});

export type Building = typeof buildings.$inferSelect;

export const rooms = pgTable("rooms", {
	id: serial("id").primaryKey(),
	number: integer("number").notNull(),
	capacity: integer("capacity"),
	buildingId: integer("building_id")
		.notNull()
		.references(() => buildings.id, { onDelete: "cascade" }),
});

export const roomsRelations = relations(rooms, ({ one }) => ({
	building: one(buildings, {
		fields: [rooms.buildingId],
		references: [buildings.id],
	}),
}));

export type Room = typeof rooms.$inferSelect;

export const statusEnum = pgEnum("reservation_status", [
	"confirmed",
	"cancelled",
]);

export type ReservationStatus = (typeof statusEnum.enumValues)[number];

export const reservations = pgTable("reservations", {
	id: serial("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	roomId: integer("room_id")
		.notNull()
		.references(() => rooms.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	description: text("description"),
	inviteCode: text("invite_code").notNull().unique(),
	status: statusEnum("status").default("confirmed").notNull(),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
	reservations: many(reservations),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
	room: one(rooms, { fields: [reservations.roomId], references: [rooms.id] }),
	user: one(users, { fields: [reservations.userId], references: [users.id] }),
}));

export type Reservation = typeof reservations.$inferSelect;

export interface FullRoom extends Room {
	building: Building;
}

export interface FullReservation extends Reservation {
	room: FullRoom;
}

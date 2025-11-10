CREATE TYPE "public"."reservation_status" AS ENUM('confirmed', 'cancelled');--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "status" "reservation_status" DEFAULT 'confirmed' NOT NULL;
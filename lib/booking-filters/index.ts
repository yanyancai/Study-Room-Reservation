export type BookingStatus = "current" | "history" | "canceled";

export interface Booking {
  id: string; date: string; time: string;
  roomNumber: string; location: string; image: string;
  status: BookingStatus;
}

export interface BookingFilter {
  matches(b: Booking): boolean;
}

export class CurrentFilter implements BookingFilter {
  matches(b: Booking) { return b.status === "current"; }
}
export class HistoryFilter implements BookingFilter {
  matches(b: Booking) { return b.status === "history"; }
}
export class CanceledFilter implements BookingFilter {
  matches(b: Booking) { return b.status === "canceled"; }
}

export function getFilter(status: BookingStatus): BookingFilter {
  switch (status) {
    case "current":  return new CurrentFilter();
    case "history":  return new HistoryFilter();
    case "canceled": return new CanceledFilter();
  }
}
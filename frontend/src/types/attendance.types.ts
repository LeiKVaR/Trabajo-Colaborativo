export type AttendanceStatus = "CHECKED_IN" | "ON_BREAK" | "CHECKED_OUT";

export type DayStatus =
  | "present"
  | "late"
  | "absent"
  | "remote"
  | "vacation"
  | "weekend"
  | "future";

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn?: string;
  breakStart?: string;
  breakEnd?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workedMinutes?: number;
  notes?: string;
}

export interface TodayAttendance {
  id?: string;
  status: "idle" | "working" | "break" | "done";
  checkIn?: string;
  breakStart?: string;
  breakEnd?: string;
  checkOut?: string;
}
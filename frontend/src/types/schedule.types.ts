export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface Schedule {
  id: string;
  userId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isWorkDay: boolean;
}

export interface ShiftEvent {
  id: string;
  day: number;
  start: string;
  end: string;
  title: string;
  type: "work" | "meeting" | "break" | "remote";
  location?: string;
}